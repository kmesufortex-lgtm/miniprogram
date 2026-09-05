import io
import json
import os
import sys
import tempfile
import unittest
from pathlib import Path

from PIL import Image


TEST_DATA_DIR = tempfile.TemporaryDirectory()
os.environ["HENGYITEX_DATA_DIR"] = TEST_DATA_DIR.name
os.environ["HENGYITEX_UPLOAD_DIR"] = str(Path(TEST_DATA_DIR.name) / "uploads")
os.environ["HENGYITEX_DB_PATH"] = str(Path(TEST_DATA_DIR.name) / "test.sqlite3")
os.environ["HENGYITEX_MEDIA_WAREHOUSE_TOKEN"] = "integration-test-token"
os.environ["HENGYITEX_PUBLIC_ORIGIN"] = "https://example.test"
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app import app  # noqa: E402


def jpeg_bytes(color):
    output = io.BytesIO()
    Image.new("RGB", (80, 100), color).save(output, "JPEG")
    return output.getvalue()


class ProductImportTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()

    def create_import(self, uses=None):
        metadata = {
            "product": {
                "code": "FA309",
                "name": "天丝棉竹节仿麻",
                "description": "面料简介",
                "composition": "50% TENCEL 50% COTTON",
                "weight": "155GSM",
                "width": "158CM",
            },
            "assignments": [
                {"groups": ["gallery", "detailImages"]},
                {"groups": ["colorCardImages"]},
            ],
        }
        if uses is not None:
            metadata["product"]["uses"] = uses
        return self.client.post(
            "/api/integrations/media-warehouse/imports",
            headers={"Authorization": "Bearer integration-test-token"},
            data={
                "metadata": json.dumps(metadata, ensure_ascii=False),
                "images": [
                    (io.BytesIO(jpeg_bytes("red")), "one.jpg"),
                    (io.BytesIO(jpeg_bytes("blue")), "two.jpg"),
                ],
            },
            content_type="multipart/form-data",
        )

    def test_import_requires_integration_token(self):
        response = self.client.post("/api/integrations/media-warehouse/imports")
        self.assertEqual(response.status_code, 401)

    def test_recommended_uses_preserved_and_validated(self):
        uses = [{"title": "宽松衬衫", "description": "以自然褶皱表现松弛轮廓。"}, {"title": "直筒长裤", "description": "展现简洁线条。"}, {"title": "衬衫裙", "description": "连贯织面适合整体造型。"}]
        created = self.create_import(uses)
        self.assertEqual(created.status_code, 201)
        token = created.get_json()["data"]["adminUrl"].split("newProductImport=", 1)[1]
        with self.client.session_transaction() as session_data:
            session_data["admin_authenticated"] = True
        payload = self.client.get(f"/api/product-imports/{token}").get_json()["data"]
        self.assertEqual(payload["uses"], uses)
        self.assertEqual(self.create_import([{"title": "缺少描述"}]).status_code, 400)
        self.assertEqual(self.create_import("错误类型").status_code, 400)

    def test_import_opens_new_product_payload_once(self):
        created = self.create_import()
        self.assertEqual(created.status_code, 201)
        admin_url = created.get_json()["data"]["adminUrl"]
        token = admin_url.split("newProductImport=", 1)[1]

        self.assertEqual(self.client.get(f"/api/product-imports/{token}").status_code, 401)
        with self.client.session_transaction() as session_data:
            session_data["admin_authenticated"] = True

        consumed = self.client.get(f"/api/product-imports/{token}")
        self.assertEqual(consumed.status_code, 200)
        payload = consumed.get_json()["data"]
        self.assertEqual(payload["code"], "FA309")
        self.assertEqual(len(payload["gallery"]), 1)
        self.assertEqual(payload["gallery"], payload["detailImages"])
        self.assertEqual(len(payload["colorCardImages"]), 1)
        self.assertEqual(self.client.get(f"/api/product-imports/{token}").status_code, 410)


if __name__ == "__main__":
    unittest.main()
