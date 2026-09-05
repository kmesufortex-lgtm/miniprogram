import os
import sys
import tempfile
import unittest
from pathlib import Path


TEST_DATA_DIR = tempfile.TemporaryDirectory()
os.environ["HENGYITEX_DATA_DIR"] = TEST_DATA_DIR.name
os.environ["HENGYITEX_UPLOAD_DIR"] = str(Path(TEST_DATA_DIR.name) / "uploads")
os.environ["HENGYITEX_DB_PATH"] = str(Path(TEST_DATA_DIR.name) / "test.sqlite3")
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app import app  # noqa: E402


class HomepageApiTests(unittest.TestCase):
    def setUp(self):
        self.client = app.test_client()
        with self.client.session_transaction() as admin_session:
            admin_session["admin_authenticated"] = True

    def test_homepage_configuration_round_trip(self):
        payload = {
            "posters": [{"url": "/uploads/homepage/posters/a.webp", "title": "夏季提案", "copy": "轻盈面料", "productId": "FA227"}],
            "hotProductIds": ["FA227", "FA218"],
            "cases": [{"id": "case-1", "title": "通勤西装", "category": "都市西装", "productId": "FA227", "image": "/assets/fabrics/FA227/look-olive.jpg", "images": ["/assets/fabrics/FA227/look-olive.jpg", "/assets/fabrics/FA227/look-black.jpg"]}],
        }
        saved = self.client.put("/api/homepage", json=payload)
        self.assertEqual(saved.status_code, 200)
        loaded = self.client.get("/api/homepage")
        self.assertEqual(loaded.status_code, 200)
        self.assertEqual(loaded.get_json()["data"], payload)

    def test_homepage_rejects_more_than_five_cases(self):
        payload = {
            "posters": [],
            "hotProductIds": [],
            "cases": [{"id": str(index), "image": "/image.jpg"} for index in range(6)],
        }
        response = self.client.put("/api/homepage", json=payload)
        self.assertEqual(response.status_code, 400)

    def test_cases_require_two_images(self):
        invalid = [{"id": "case-1", "title": "通勤西装", "productId": "FA227", "images": ["/one.jpg"]}]
        self.assertEqual(self.client.put("/api/cases", json=invalid).status_code, 400)
        valid = [{"id": "case-1", "title": "通勤西装", "category": "都市西装", "productId": "FA227", "status": "已发布", "images": ["/one.jpg", "/two.jpg"]}]
        response = self.client.put("/api/cases", json=valid)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.get_json()["data"][0]["images"], ["/one.jpg", "/two.jpg"])


if __name__ == "__main__":
    unittest.main()
