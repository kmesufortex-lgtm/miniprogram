"""Compress existing uploaded media without losing product/homepage references.

Run on the server with --dry-run first, then --apply. Originals are copied to a
timestamped backup directory before replacement.
"""

import argparse
import io
import json
import os
import shutil
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from image_optimizer import optimize_uploaded_image


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = Path(os.environ.get("HENGYITEX_DATA_DIR", BASE_DIR / "data"))
UPLOAD_DIR = Path(os.environ.get("HENGYITEX_UPLOAD_DIR", DATA_DIR / "uploads"))
DB_PATH = Path(os.environ.get("HENGYITEX_DB_PATH", DATA_DIR / "hengyitex.sqlite3"))
BACKUP_ROOT = DATA_DIR / "image-migration-backups"


def replace_urls(value, replacements):
    if isinstance(value, str):
        for old, new in replacements.items():
            value = value.replace(old, new)
        return value
    if isinstance(value, list):
        return [replace_urls(item, replacements) for item in value]
    if isinstance(value, dict):
        return {key: replace_urls(item, replacements) for key, item in value.items()}
    return value


def collect_images():
    return sorted(
        path for path in UPLOAD_DIR.rglob("*")
        if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    )


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--apply", action="store_true", help="write compressed files and update database")
    args = parser.parse_args()
    files = collect_images()
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    backup_dir = BACKUP_ROOT / timestamp
    replacements = {}
    changes = []

    for path in files:
        source = path.read_bytes()
        try:
            result = optimize_uploaded_image(io.BytesIO(source))
        except ValueError as error:
            print(f"SKIP {path}: {error}")
            continue
        new_path = path.with_suffix(result["extension"])
        relative = path.relative_to(UPLOAD_DIR).as_posix()
        new_relative = new_path.relative_to(UPLOAD_DIR).as_posix()
        if len(result["content"]) >= len(source) and new_path == path:
            continue
        changes.append((path, new_path, source, result))
        replacements[f"/uploads/{relative}"] = f"/uploads/{new_relative}"
        replacements[f"uploads/{relative}"] = f"uploads/{new_relative}"

    print(f"发现 {len(files)} 张图片，预计压缩 {len(changes)} 张")
    for path, new_path, source, result in changes:
        print(f"{path.name}: {len(source) / 1024:.1f}KB -> {len(result['content']) / 1024:.1f}KB, {result['width']}x{result['height']}")
    if not args.apply or not changes:
        print("预览完成。需要执行写入时，请追加 --apply。")
        return

    backup_dir.mkdir(parents=True, exist_ok=True)
    shutil.copy2(DB_PATH, backup_dir / DB_PATH.name)
    for path, new_path, source, result in changes:
        backup_path = backup_dir / path.relative_to(UPLOAD_DIR)
        backup_path.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(path, backup_path)
        new_path.parent.mkdir(parents=True, exist_ok=True)
        temp_path = new_path.with_suffix(new_path.suffix + ".tmp")
        temp_path.write_bytes(result["content"])
        os.replace(temp_path, new_path)
        if new_path != path and path.exists():
            path.unlink()

    with sqlite3.connect(DB_PATH) as db:
        db.row_factory = sqlite3.Row
        rows = db.execute("SELECT key, payload FROM settings").fetchall()
        for row in rows:
            payload = json.loads(row["payload"])
            db.execute("UPDATE settings SET payload = ? WHERE key = ?", (json.dumps(replace_urls(payload, replacements), ensure_ascii=False), row["key"]))
        rows = db.execute("SELECT id, payload FROM products").fetchall()
        for row in rows:
            payload = replace_urls(json.loads(row["payload"]), replacements)
            db.execute("UPDATE products SET payload = ? WHERE id = ?", (json.dumps(payload, ensure_ascii=False), row["id"]))
        db.commit()
    print(f"已完成，原文件和数据库备份位于：{backup_dir}")


if __name__ == "__main__":
    main()
