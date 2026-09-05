import warnings
from io import BytesIO

from PIL import Image, ImageOps, UnidentifiedImageError


ALLOWED_IMAGE_FORMATS = {"JPEG", "PNG", "WEBP"}
MAX_IMAGE_DIMENSION = 1200
MAX_IMAGE_PIXELS = 50_000_000
MAX_OUTPUT_BYTES = 500 * 1024
JPEG_QUALITY = 80
WEBP_QUALITY = 80
MIN_QUALITY = 60

Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS


def image_has_alpha(image):
    return "A" in image.getbands() or (image.mode == "P" and "transparency" in image.info)


def encode_lossy(image, output_format, extension, quality):
    """Encode a photographic image, lowering quality when it exceeds the upload budget."""
    best = b""
    current_quality = quality
    while current_quality >= MIN_QUALITY:
        output = BytesIO()
        save_options = {"quality": current_quality, "optimize": True}
        if output_format == "WEBP":
            save_options["method"] = 6
        else:
            save_options["progressive"] = True
            save_options["subsampling"] = "4:2:0"
        image.convert("RGB").save(output, output_format, **save_options)
        best = output.getvalue()
        if len(best) <= MAX_OUTPUT_BYTES:
            break
        current_quality -= 5
    return best, extension, output_format


def optimize_uploaded_image(file):
    source = file.read()
    if not source:
        raise ValueError("图片文件为空")

    try:
        with warnings.catch_warnings():
            warnings.simplefilter("error", Image.DecompressionBombWarning)
            with Image.open(BytesIO(source)) as opened:
                source_format = (opened.format or "").upper()
                if source_format not in ALLOWED_IMAGE_FORMATS:
                    raise ValueError("仅支持 JPG、PNG 和 WebP 图片")
                opened.load()
                image = ImageOps.exif_transpose(opened)
                original_size = image.size
                image.thumbnail((MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION), Image.Resampling.LANCZOS)
                resized = image.size != original_size
                output = BytesIO()

                if image_has_alpha(image):
                    extension = ".png"
                    output_format = "PNG"
                    image.convert("RGBA").save(output, "PNG", optimize=True, compress_level=9)
                elif source_format == "WEBP":
                    optimized, extension, output_format = encode_lossy(image, "WEBP", ".webp", WEBP_QUALITY)
                    output.write(optimized)
                else:
                    optimized, extension, output_format = encode_lossy(image, "JPEG", ".jpg", JPEG_QUALITY)
                    output.write(optimized)

                optimized = output.getvalue()
                source_extension = {"JPEG": ".jpg", "PNG": ".png", "WEBP": ".webp"}[source_format]
                if not resized and len(source) <= MAX_OUTPUT_BYTES and len(optimized) >= len(source):
                    optimized = source
                    extension = source_extension
                    output_format = source_format

                return {
                    "content": optimized,
                    "extension": extension,
                    "format": output_format,
                    "width": image.width,
                    "height": image.height,
                    "originalBytes": len(source),
                    "compressedBytes": len(optimized),
                }
    except (Image.DecompressionBombError, Image.DecompressionBombWarning):
        raise ValueError("图片像素过大，请缩小后重新上传") from None
    except UnidentifiedImageError:
        raise ValueError("图片文件已损坏或格式不受支持") from None
    except OSError:
        raise ValueError("图片解码失败，请重新导出后上传") from None
