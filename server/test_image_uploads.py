import io
import sys
import unittest
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parent))
from image_optimizer import optimize_uploaded_image


class ImageUploadTests(unittest.TestCase):
    def test_large_jpeg_is_resized_and_compressed(self):
        source = io.BytesIO()
        Image.effect_noise((3200, 2400), 85).convert("RGB").save(source, "JPEG", quality=96)
        metadata = optimize_uploaded_image(io.BytesIO(source.getvalue()))
        self.assertLessEqual(max(metadata["width"], metadata["height"]), 1200)
        self.assertLess(metadata["compressedBytes"], metadata["originalBytes"])
        self.assertEqual(metadata["format"], "JPEG")

    def test_transparent_png_keeps_transparency(self):
        source = io.BytesIO()
        Image.new("RGBA", (600, 400), (120, 90, 70, 80)).save(source, "PNG")
        optimized = optimize_uploaded_image(io.BytesIO(source.getvalue()))
        self.assertEqual(optimized["format"], "PNG")
        with Image.open(io.BytesIO(optimized["content"])) as result:
            self.assertIn("A", result.getbands())


if __name__ == "__main__":
    unittest.main()
