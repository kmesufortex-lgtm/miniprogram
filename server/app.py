import json
import base64
import hashlib
import os
import secrets
import sqlite3
import uuid
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

from flask import Flask, jsonify, request, send_from_directory, session
from image_optimizer import optimize_uploaded_image
from werkzeug.security import check_password_hash
from werkzeug.utils import secure_filename


BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent
DATA_DIR = Path(os.environ.get("HENGYITEX_DATA_DIR", BASE_DIR / "data"))
UPLOAD_DIR = Path(os.environ.get("HENGYITEX_UPLOAD_DIR", DATA_DIR / "uploads"))
DB_PATH = Path(os.environ.get("HENGYITEX_DB_PATH", DATA_DIR / "hengyitex.sqlite3"))
SEED_PATH = BASE_DIR / "seed-products.json"
CATEGORY_SEED_PATH = BASE_DIR / "seed-categories.json"
ALLOWED_IMAGE_TYPES = {"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp"}

DATA_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024
app.secret_key = os.environ.get("HENGYITEX_SECRET_KEY", "hengyitex-local-session-key-change-in-production")
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    # Local development runs on http://127.0.0.1; production sets this to 1
    # through the systemd environment so session cookies remain HTTPS-only.
    SESSION_COOKIE_SECURE=os.environ.get("HENGYITEX_COOKIE_SECURE", "0") != "0",
    PERMANENT_SESSION_LIFETIME=timedelta(hours=8),
)
ADMIN_USERNAME = os.environ.get("HENGYITEX_ADMIN_USERNAME", "admin")
ADMIN_PASSWORD_HASH = os.environ.get("HENGYITEX_ADMIN_PASSWORD_HASH", "")
ADMIN_PASSWORD = os.environ.get("HENGYITEX_ADMIN_PASSWORD", "")
WECHAT_APPID = os.environ.get("HENGYITEX_WECHAT_APPID", "")
WECHAT_APPSECRET = os.environ.get("HENGYITEX_WECHAT_APPSECRET", "")
MEDIA_WAREHOUSE_TOKEN = os.environ.get("HENGYITEX_MEDIA_WAREHOUSE_TOKEN", "")
PUBLIC_ORIGIN = os.environ.get("HENGYITEX_PUBLIC_ORIGIN", "https://hengyitex.top").rstrip("/")
PRODUCT_IMPORT_TTL = timedelta(minutes=30)


def admin_password_matches(password):
    if ADMIN_PASSWORD_HASH:
        return check_password_hash(ADMIN_PASSWORD_HASH, password)
    return bool(ADMIN_PASSWORD) and secrets.compare_digest(password, ADMIN_PASSWORD)


@app.get("/")
@app.get("/admin-web/")
def admin_index():
    return send_from_directory(PROJECT_DIR / "admin-web", "index.html")


@app.get("/admin-web/<path:filename>")
def admin_asset(filename):
    return send_from_directory(PROJECT_DIR / "admin-web", filename)


@app.get("/miniprogram/<path:filename>")
def miniprogram_asset(filename):
    return send_from_directory(PROJECT_DIR / "miniprogram", filename)


@app.post("/api/auth/login")
def login():
    body = request.get_json(silent=True) or {}
    username = str(body.get("username") or "").strip()
    password = str(body.get("password") or "")
    if not secrets.compare_digest(username, ADMIN_USERNAME) or not admin_password_matches(password):
        return jsonify({"error": "账号或密码不正确"}), 401
    session.clear()
    session["admin_authenticated"] = True
    session.permanent = True
    return jsonify({"data": {"username": ADMIN_USERNAME}})


@app.get("/api/auth/me")
def auth_me():
    if not session.get("admin_authenticated"):
        return jsonify({"authenticated": False}), 401
    return jsonify({"authenticated": True, "data": {"username": ADMIN_USERNAME}})


@app.get("/api/wechat/preview-code")
def wechat_preview_code():
    """Create a temporary mini-program preview QR code for the admin desk."""
    if not session.get("admin_authenticated"):
        return jsonify({"error": "请先登录后台"}), 401
    if not WECHAT_APPID or not WECHAT_APPSECRET:
        return jsonify({"error": "尚未配置小程序 AppSecret，暂时无法生成预览二维码"}), 503

    page = str(request.args.get("page") or "pages/index/index").strip().lstrip("/")
    if not page or len(page) > 200 or any(char not in "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_./-" for char in page):
        return jsonify({"error": "预览页面路径格式不正确"}), 400
    scene = str(request.args.get("scene") or "admin-preview")[:32]
    try:
        token_query = urllib.parse.urlencode({
            "grant_type": "client_credential",
            "appid": WECHAT_APPID,
            "secret": WECHAT_APPSECRET,
        })
        with urllib.request.urlopen(
            f"https://api.weixin.qq.com/cgi-bin/token?{token_query}", timeout=12
        ) as response:
            token_data = json.loads(response.read().decode("utf-8"))
        access_token = token_data.get("access_token")
        if not access_token:
            return jsonify({"error": token_data.get("errmsg") or "微信接口未返回 access_token"}), 502

        payload = json.dumps({
            "page": page,
            "scene": scene,
            "check_path": False,
            "env_version": os.environ.get("HENGYITEX_WECHAT_ENV_VERSION", "trial"),
            "width": 430,
        }).encode("utf-8")
        request_obj = urllib.request.Request(
            f"https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token={urllib.parse.quote(access_token)}",
            data=payload,
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        with urllib.request.urlopen(request_obj, timeout=20) as response:
            qr_bytes = response.read()
            content_type = response.headers.get_content_type()
        if not (content_type.startswith("image/") or qr_bytes.startswith(b"\x89PNG") or qr_bytes.startswith(b"\xff\xd8")):
            error_data = json.loads(qr_bytes.decode("utf-8"))
            return jsonify({"error": error_data.get("errmsg") or "微信未能生成预览二维码"}), 502
        return jsonify({
            "data": {
                "page": page,
                "envVersion": os.environ.get("HENGYITEX_WECHAT_ENV_VERSION", "trial"),
                "image": f"data:image/png;base64,{base64.b64encode(qr_bytes).decode('ascii')}",
            }
        })
    except Exception as error:
        app.logger.warning("Wechat preview QR failed: %s", error)
        return jsonify({"error": "微信预览二维码生成失败，请检查 AppSecret 和网络配置"}), 502


@app.post("/api/auth/logout")
def logout():
    session.clear()
    return jsonify({"ok": True})


@app.before_request
def protect_admin_writes():
    if request.path == "/api/integrations/media-warehouse/imports" and request.method == "POST":
        request.max_content_length = 150 * 1024 * 1024
    if not request.path.startswith("/api/"):
        return None
    if request.path in {"/api/auth/login", "/api/auth/me", "/api/auth/logout", "/api/health", "/api/requests"}:
        return None
    if request.path == "/api/integrations/media-warehouse/imports" and request.method == "POST":
        return None
    if request.path.startswith("/api/requests/") and request.method == "PATCH":
        return None
    if request.method in {"POST", "PUT", "PATCH", "DELETE"} and not session.get("admin_authenticated"):
        return jsonify({"error": "请先登录后台"}), 401
    return None


def get_db():
    connection = sqlite3.connect(DB_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def init_db():
    with get_db() as db:
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS products (
                id TEXT PRIMARY KEY,
                code TEXT NOT NULL UNIQUE,
                status TEXT NOT NULL DEFAULT 'draft',
                payload TEXT NOT NULL,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        db.execute("CREATE INDEX IF NOT EXISTS idx_products_status ON products(status)")
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS product_imports (
                id TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                expires_at TEXT NOT NULL,
                consumed_at TEXT,
                created_at TEXT NOT NULL
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                payload TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                company TEXT NOT NULL DEFAULT '',
                phone TEXT NOT NULL DEFAULT '',
                city TEXT NOT NULL DEFAULT '',
                address TEXT NOT NULL DEFAULT '',
                notes TEXT NOT NULL DEFAULT '',
                status TEXT NOT NULL DEFAULT 'active',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        db.execute(
            """
            CREATE TABLE IF NOT EXISTS sample_requests (
                id TEXT PRIMARY KEY,
                customer_id TEXT,
                payload TEXT NOT NULL,
                status TEXT NOT NULL DEFAULT 'pending',
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )
            """
        )
        db.execute("CREATE INDEX IF NOT EXISTS idx_sample_requests_status ON sample_requests(status)")
        db.execute("CREATE INDEX IF NOT EXISTS idx_sample_requests_customer ON sample_requests(customer_id)")
        category_count = db.execute("SELECT COUNT(*) AS total FROM settings WHERE key = 'categories'").fetchone()["total"]
        if category_count == 0 and CATEGORY_SEED_PATH.exists():
            db.execute(
                "INSERT INTO settings (key, payload, updated_at) VALUES ('categories', ?, ?)",
                (CATEGORY_SEED_PATH.read_text(encoding="utf-8"), utc_now()),
            )
        count = db.execute("SELECT COUNT(*) AS total FROM products").fetchone()["total"]
        if count == 0 and SEED_PATH.exists():
            for product in json.loads(SEED_PATH.read_text(encoding="utf-8")):
                save_product(db, product, commit=False)
        db.commit()


def parse_product(row):
    product = json.loads(row["payload"])
    product["id"] = row["id"]
    product["code"] = row["code"]
    product["status"] = row["status"]
    product["updatedAt"] = row["updated_at"]
    return product


def save_product(db, product, commit=True):
    product_id = str(product.get("id") or product.get("code") or "").strip()
    code = str(product.get("code") or product_id).strip()
    if not product_id or not code:
        raise ValueError("产品必须包含 id 和 code")
    product["id"] = product_id
    product["code"] = code
    product["status"] = product.get("status") or "draft"
    now = utc_now()
    existing = db.execute("SELECT payload FROM products WHERE id = ?", (product_id,)).fetchone()
    if existing:
        existing_product = json.loads(existing["payload"])
        if existing_product.get("publishedAt") and not product.get("publishedAt"):
            product["publishedAt"] = existing_product["publishedAt"]
    if product["status"] == "live" and not product.get("publishedAt"):
        product["publishedAt"] = now
    db.execute(
        """
        INSERT INTO products (id, code, status, payload, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
            code = excluded.code,
            status = excluded.status,
            payload = excluded.payload,
            updated_at = excluded.updated_at
        """,
        (product_id, code, product["status"], json.dumps(product, ensure_ascii=False), now, now),
    )
    if commit:
        db.commit()
    return product


def product_import_id(token):
    return hashlib.sha256(str(token or "").encode("utf-8")).hexdigest()


def media_warehouse_authorized():
    header = str(request.headers.get("Authorization") or "")
    supplied = header[7:] if header.startswith("Bearer ") else ""
    return bool(MEDIA_WAREHOUSE_TOKEN) and secrets.compare_digest(supplied, MEDIA_WAREHOUSE_TOKEN)


def clean_product_imports(db):
    db.execute("DELETE FROM product_imports WHERE expires_at <= ? OR consumed_at IS NOT NULL", (utc_now(),))


def uploaded_file_size(file):
    current = file.stream.tell()
    file.stream.seek(0, os.SEEK_END)
    size = file.stream.tell()
    file.stream.seek(current)
    return size


@app.get("/api/health")
def health():
    return jsonify({"ok": True, "service": "hengyitex-api", "time": utc_now()})


@app.post("/api/integrations/media-warehouse/imports")
def create_media_warehouse_import():
    if not MEDIA_WAREHOUSE_TOKEN:
        return jsonify({"error": "服务器尚未配置素材仓库同步密钥"}), 503
    if not media_warehouse_authorized():
        return jsonify({"error": "素材仓库同步凭证无效"}), 401
    try:
        metadata = json.loads(request.form.get("metadata") or "{}")
    except json.JSONDecodeError:
        return jsonify({"error": "导入资料格式不正确"}), 400
    product = metadata.get("product") if isinstance(metadata, dict) else None
    assignments = metadata.get("assignments") if isinstance(metadata, dict) else None
    files = request.files.getlist("images")
    if not isinstance(product, dict) or not isinstance(assignments, list):
        return jsonify({"error": "导入资料缺少产品信息或图片分类"}), 400
    if not files or len(files) != len(assignments) or len(files) > 30:
        return jsonify({"error": "导入图片数量或分类信息不正确"}), 400

    code = str(product.get("code") or "").strip()[:80]
    if not code:
        return jsonify({"error": "导入产品必须包含货号"}), 400
    name = str(product.get("name") or "").strip()[:120]
    if not name:
        return jsonify({"error": "导入产品必须包含面料名称"}), 400
    allowed_groups = {"gallery", "detailImages", "colorCardImages"}
    normalized_assignments = []
    for assignment in assignments:
        groups = assignment.get("groups") if isinstance(assignment, dict) else None
        groups = list(dict.fromkeys(str(group) for group in (groups or []) if str(group) in allowed_groups))
        if not groups:
            return jsonify({"error": "每张导入图片必须至少选择一个用途"}), 400
        normalized_assignments.append(groups)

    # 素材仓库同步备注：uses 为 AI 文案生成的推荐用途，作为可编辑预填项导入；
    # 小程序后台仍可在发布前复核、修改或删除，不影响旧版导入数据。
    uses = product.get("uses", [])
    if not isinstance(uses, list) or len(uses) > 10:
        return jsonify({"error": "推荐用途应为最多10项的列表"}), 400
    normalized_uses = []
    for use in uses:
        if not isinstance(use, dict):
            return jsonify({"error": "推荐用途格式不正确"}), 400
        title = str(use.get("title") or "").strip()
        description = str(use.get("description") or "").strip()
        if not title or not description or len(title) > 40 or len(description) > 200:
            return jsonify({"error": "推荐用途需填写标题和描述，标题最多40字、描述最多200字"}), 400
        normalized_uses.append({"title": title, "description": description})

    stored_urls = []
    target_dir = UPLOAD_DIR / (secure_filename(code) or "imported") / "imports"
    target_dir.mkdir(parents=True, exist_ok=True)
    for index, file in enumerate(files):
        if not file.filename or file.mimetype not in ALLOWED_IMAGE_TYPES:
            return jsonify({"error": f"第 {index + 1} 张图片格式不受支持"}), 400
        if uploaded_file_size(file) > 16 * 1024 * 1024:
            return jsonify({"error": f"第 {index + 1} 张图片不能超过16MB"}), 413
        try:
            optimized = optimize_uploaded_image(file)
        except ValueError as error:
            return jsonify({"error": f"第 {index + 1} 张图片处理失败：{error}"}), 400
        filename = f"{uuid.uuid4().hex}{optimized['extension']}"
        (target_dir / filename).write_bytes(optimized["content"])
        stored_urls.append(f"/uploads/{secure_filename(code) or 'imported'}/imports/{filename}")

    image_groups = {"gallery": [], "detailImages": [], "colorCardImages": []}
    for url, groups in zip(stored_urls, normalized_assignments):
        for group in groups:
            image_groups[group].append(url)

    import_payload = {
        "code": code,
        "name": name,
        "description": str(product.get("description") or "").strip()[:160],
        "quoteLabel": "咨询报价",
        "composition": str(product.get("composition") or "").strip()[:1000],
        "weight": str(product.get("weight") or "").strip()[:120],
        "width": str(product.get("width") or "").strip()[:120],
        "gallery": image_groups["gallery"],
        "detailImages": image_groups["detailImages"],
        "colorCardImages": image_groups["colorCardImages"],
        "featureTags": [],
        "categoryIds": [],
        "uses": normalized_uses or [{"title": "", "description": ""}],
        "customSpecs": [],
    }
    token = secrets.token_urlsafe(32)
    created_at = utc_now()
    expires_at = (datetime.now(timezone.utc) + PRODUCT_IMPORT_TTL).isoformat()
    with get_db() as db:
        clean_product_imports(db)
        db.execute(
            "INSERT INTO product_imports (id, payload, expires_at, consumed_at, created_at) VALUES (?, ?, ?, NULL, ?)",
            (product_import_id(token), json.dumps(import_payload, ensure_ascii=False), expires_at, created_at),
        )
        db.commit()
    query = urllib.parse.urlencode({"newProductImport": token})
    return jsonify({
        "data": {
            "adminUrl": f"{PUBLIC_ORIGIN}/admin-web/?{query}",
            "expiresAt": expires_at,
        }
    }), 201


@app.get("/api/product-imports/<token>")
def consume_product_import(token):
    if not session.get("admin_authenticated"):
        return jsonify({"error": "请先登录后台"}), 401
    now = utc_now()
    with get_db() as db:
        row = db.execute(
            "SELECT payload, expires_at, consumed_at FROM product_imports WHERE id = ?",
            (product_import_id(token),),
        ).fetchone()
        if not row or row["consumed_at"] is not None or row["expires_at"] <= now:
            return jsonify({"error": "导入信息不存在、已使用或已过期"}), 410
        consumed = db.execute(
            "UPDATE product_imports SET consumed_at = ? WHERE id = ? AND consumed_at IS NULL AND expires_at > ?",
            (now, product_import_id(token), now),
        )
        if consumed.rowcount != 1:
            db.rollback()
            return jsonify({"error": "导入信息不存在、已使用或已过期"}), 410
        db.commit()
    return jsonify({"data": json.loads(row["payload"])})


REQUEST_STATUSES = {"pending", "confirmed", "preparing", "shipped", "completed", "cancelled"}


def parse_customer(row):
    return {**dict(row), "createdAt": row["created_at"], "updatedAt": row["updated_at"]}


def parse_request(row):
    payload = json.loads(row["payload"])
    payload.update({"id": row["id"], "customerId": row["customer_id"], "status": row["status"], "createdAt": row["created_at"], "updatedAt": row["updated_at"]})
    return payload


@app.get("/api/customers")
def list_customers():
    with get_db() as db:
        rows = db.execute("SELECT * FROM customers WHERE status != 'archived' ORDER BY updated_at DESC").fetchall()
        counts = {row["customer_id"]: row["total"] for row in db.execute("SELECT customer_id, COUNT(*) AS total FROM sample_requests GROUP BY customer_id").fetchall()}
    data = []
    for row in rows:
        item = parse_customer(row)
        item["requestCount"] = counts.get(row["id"], 0)
        data.append(item)
    return jsonify({"data": data})


@app.post("/api/customers")
def create_customer():
    body = request.get_json(silent=True) or {}
    name = str(body.get("name") or "").strip()
    if not name:
        return jsonify({"error": "联系人姓名不能为空"}), 400
    now = utc_now()
    customer_id = str(body.get("id") or f"CUS-{uuid.uuid4().hex[:10].upper()}")
    with get_db() as db:
        db.execute("INSERT INTO customers (id,name,company,phone,city,address,notes,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)", (customer_id, name, str(body.get("company") or "").strip(), str(body.get("phone") or "").strip(), str(body.get("city") or "").strip(), str(body.get("address") or "").strip(), str(body.get("notes") or "").strip(), "active", now, now))
        db.commit()
        row = db.execute("SELECT * FROM customers WHERE id = ?", (customer_id,)).fetchone()
    return jsonify({"data": parse_customer(row)}), 201


@app.patch("/api/customers/<customer_id>")
def update_customer(customer_id):
    body = request.get_json(silent=True) or {}
    fields = {key: str(body[key]).strip() for key in ("name", "company", "phone", "city", "address", "notes", "status") if key in body}
    if "name" in fields and not fields["name"]:
        return jsonify({"error": "联系人姓名不能为空"}), 400
    if not fields:
        return jsonify({"error": "没有可更新字段"}), 400
    fields["updated_at"] = utc_now()
    with get_db() as db:
        if not db.execute("SELECT 1 FROM customers WHERE id = ?", (customer_id,)).fetchone():
            return jsonify({"error": "客户不存在"}), 404
        db.execute(f"UPDATE customers SET {', '.join(f'{key} = ?' for key in fields)} WHERE id = ?", (*fields.values(), customer_id))
        db.commit()
        row = db.execute("SELECT * FROM customers WHERE id = ?", (customer_id,)).fetchone()
    return jsonify({"data": parse_customer(row)})


@app.delete("/api/customers/<customer_id>")
def archive_customer(customer_id):
    now = utc_now()
    with get_db() as db:
        if not db.execute("SELECT 1 FROM customers WHERE id = ?", (customer_id,)).fetchone():
            return jsonify({"error": "客户不存在"}), 404
        db.execute("UPDATE customers SET status='archived', updated_at=? WHERE id=?", (now, customer_id))
        db.commit()
    return jsonify({"ok": True, "id": customer_id, "status": "archived"})


@app.get("/api/requests")
def list_requests():
    status = request.args.get("status", "").strip()
    ids = [value.strip() for value in request.args.get("ids", "").split(",") if value.strip()][:50]
    if not ids and not session.get("admin_authenticated"):
        return jsonify({"error": "请提供需要查询的申请编号"}), 400
    conditions = []
    params = []
    if status:
        conditions.append("status = ?")
        params.append(status)
    if ids:
        conditions.append(f"id IN ({','.join('?' for _ in ids)})")
        params.extend(ids)
    query = "SELECT * FROM sample_requests" + (f" WHERE {' AND '.join(conditions)}" if conditions else "") + " ORDER BY created_at DESC"
    with get_db() as db:
        rows = db.execute(query, params).fetchall()
    return jsonify({"data": [parse_request(row) for row in rows]})


@app.post("/api/requests")
def create_request():
    body = request.get_json(silent=True) or {}
    contact = body.get("contact") or {}
    address = body.get("address") or {}
    name = str(contact.get("name") or address.get("name") or "").strip()
    phone = str(contact.get("phone") or address.get("phone") or "").strip()
    if not name or not phone or not body.get("items"):
        return jsonify({"error": "联系人、手机号和申请面料不能为空"}), 400
    now = utc_now()
    with get_db() as db:
        customer = db.execute("SELECT * FROM customers WHERE phone = ? AND phone != ''", (phone,)).fetchone()
        if customer:
            customer_id = customer["id"]
            db.execute("UPDATE customers SET name=?, company=?, city=?, address=?, updated_at=? WHERE id=?", (name, str(body.get("company") or "").strip(), str(address.get("city") or "").strip(), str(address.get("detail") or "").strip(), now, customer_id))
        else:
            customer_id = f"CUS-{uuid.uuid4().hex[:10].upper()}"
            db.execute("INSERT INTO customers (id,name,company,phone,city,address,notes,status,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)", (customer_id, name, str(body.get("company") or "").strip(), phone, str(address.get("city") or "").strip(), str(address.get("detail") or "").strip(), "", "active", now, now))
        request_id = str(body.get("id") or f"SR{datetime.now().strftime('%y%m%d')}-{uuid.uuid4().hex[:6].upper()}")
        db.execute("INSERT INTO sample_requests (id,customer_id,payload,status,created_at,updated_at) VALUES (?,?,?,?,?,?)", (request_id, customer_id, json.dumps(body, ensure_ascii=False), "pending", now, now))
        db.commit()
        row = db.execute("SELECT * FROM sample_requests WHERE id = ?", (request_id,)).fetchone()
    return jsonify({"data": parse_request(row)}), 201


@app.patch("/api/requests/<request_id>")
def update_request(request_id):
    body = request.get_json(silent=True) or {}
    now = utc_now()
    with get_db() as db:
        row = db.execute("SELECT * FROM sample_requests WHERE id = ?", (request_id,)).fetchone()
        if not row:
            return jsonify({"error": "申请不存在"}), 404
        payload = json.loads(row["payload"])
        current_status = row["status"]

        if session.get("admin_authenticated"):
            status = str(body.get("status") or "").strip()
            status = {"待确认": "pending", "待寄送": "confirmed", "已发货": "shipped", "已完成": "completed", "已取消": "cancelled"}.get(status, status)
            if status not in REQUEST_STATUSES:
                return jsonify({"error": "无效的申请状态"}), 400
            for key in ("trackingCompany", "trackingNumber", "internalNote", "cancelReason"):
                if key in body:
                    payload[key] = body[key]
        else:
            contact = payload.get("contact") or {}
            address = payload.get("address") or {}
            expected_phone = str(contact.get("phone") or address.get("phone") or "").strip()
            client_phone = str(body.get("clientPhone") or "").strip()
            if not expected_phone or client_phone != expected_phone:
                return jsonify({"error": "申请信息验证失败"}), 403
            action = str(body.get("userAction") or "").strip()
            if action == "cancel":
                if current_status not in {"pending", "confirmed", "preparing"}:
                    return jsonify({"error": "当前进度已无法取消，请联系面料顾问"}), 409
                status = "cancelled"
                payload["cancelReason"] = str(body.get("cancelReason") or "客户主动取消").strip()
            elif action == "update":
                if current_status != "pending":
                    return jsonify({"error": "申请确认后无法直接修改，请联系面料顾问"}), 409
                status = current_status
                if isinstance(body.get("items"), list):
                    requested_items = body["items"]
                    existing_items = payload.get("items") if isinstance(payload.get("items"), list) else []
                    if not requested_items:
                        return jsonify({"error": "申请单至少需要保留一款面料"}), 400
                    existing_by_id = {str(item.get("id") or ""): item for item in existing_items if isinstance(item, dict) and item.get("id")}
                    kept_items = []
                    seen_ids = set()
                    for requested_item in requested_items:
                        item_id = str((requested_item or {}).get("id") or "") if isinstance(requested_item, dict) else ""
                        if not item_id or item_id in seen_ids or item_id not in existing_by_id:
                            return jsonify({"error": "面料清单包含无效项目，请刷新后重试"}), 400
                        seen_ids.add(item_id)
                        kept_items.append(existing_by_id[item_id])
                    payload["items"] = kept_items
                if isinstance(body.get("contact"), dict):
                    updated_contact = body["contact"]
                    updated_phone = str(updated_contact.get("phone") or expected_phone).strip()
                    payload["contact"] = {
                        "name": str(updated_contact.get("name") or contact.get("name") or "").strip(),
                        "phone": updated_phone,
                    }
                if isinstance(body.get("address"), dict):
                    updated_address = body["address"]
                    updated_phone = str((payload.get("contact") or {}).get("phone") or updated_address.get("phone") or expected_phone).strip()
                    payload["address"] = {
                        "name": str(updated_address.get("name") or address.get("name") or "").strip(),
                        "phone": updated_phone,
                        "province": str(updated_address.get("province") or "").strip(),
                        "city": str(updated_address.get("city") or "").strip(),
                        "district": str(updated_address.get("district") or "").strip(),
                        "detail": str(updated_address.get("detail") or "").strip(),
                    }
                if "remark" in body:
                    payload["remark"] = str(body.get("remark") or "").strip()[:120]

            else:
                return jsonify({"error": "不支持的申请操作"}), 400
        db.execute("UPDATE sample_requests SET status=?, payload=?, updated_at=? WHERE id=?", (status, json.dumps(payload, ensure_ascii=False), now, request_id))
        db.commit()
        row = db.execute("SELECT * FROM sample_requests WHERE id = ?", (request_id,)).fetchone()
    return jsonify({"data": parse_request(row)})


@app.get("/api/products")
def list_products():
    status = request.args.get("status", "").strip()
    with get_db() as db:
        if status:
            rows = db.execute(
                "SELECT * FROM products WHERE status = ? ORDER BY updated_at DESC", (status,)
            ).fetchall()
        else:
            rows = db.execute("SELECT * FROM products ORDER BY updated_at DESC").fetchall()
    return jsonify({"data": [parse_product(row) for row in rows]})


@app.get("/api/categories")
def get_categories():
    with get_db() as db:
        row = db.execute("SELECT payload, updated_at FROM settings WHERE key = 'categories'").fetchone()
    categories = json.loads(row["payload"]) if row else []
    return jsonify({"data": categories, "updatedAt": row["updated_at"] if row else None})


@app.put("/api/categories")
def put_categories():
    categories = request.get_json(silent=True)
    if not isinstance(categories, list):
        return jsonify({"error": "分类数据必须是数组"}), 400
    group_ids = set()
    tag_ids = set()
    for group in categories:
        group_id = str(group.get("id") or "").strip()
        name = str(group.get("name") or "").strip()
        if not group_id or not name or group_id in group_ids:
            return jsonify({"error": "一级分类名称或 ID 无效"}), 400
        group_ids.add(group_id)
        group["selectionMode"] = "single" if group.get("selectionMode") == "single" else "multiple"
        for tag in group.get("tags", []):
            tag_id = str(tag.get("id") or "").strip()
            tag_name = str(tag.get("name") or "").strip()
            if not tag_id or not tag_name or tag_id in tag_ids:
                return jsonify({"error": "二级分类名称或 ID 无效"}), 400
            tag_ids.add(tag_id)
    now = utc_now()
    payload = json.dumps(categories, ensure_ascii=False)
    with get_db() as db:
        db.execute(
            """
            INSERT INTO settings (key, payload, updated_at) VALUES ('categories', ?, ?)
            ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
            """,
            (payload, now),
        )
        db.commit()
    return jsonify({"data": categories, "updatedAt": now})


@app.get("/api/cases")
def get_cases():
    with get_db() as db:
        row = db.execute("SELECT payload, updated_at FROM settings WHERE key = 'cases'").fetchone()
    cases = json.loads(row["payload"]) if row else []
    return jsonify({"data": cases, "updatedAt": row["updated_at"] if row else None})


@app.put("/api/cases")
def put_cases():
    cases = request.get_json(silent=True)
    if not isinstance(cases, list):
        return jsonify({"error": "案例数据必须是数组"}), 400
    if len(cases) > 100:
        return jsonify({"error": "案例数量不能超过 100 个"}), 400
    normalized = []
    case_ids = set()
    for item in cases:
        if not isinstance(item, dict):
            return jsonify({"error": "案例格式无效"}), 400
        case_id = str(item.get("id") or "").strip()
        title = str(item.get("title") or "").strip()
        product_id = str(item.get("productId") or item.get("product") or "").strip()
        images = [str(url).strip() for url in item.get("images", []) if str(url).strip()]
        if not case_id or case_id in case_ids or not title or not product_id:
            return jsonify({"error": "案例 ID、标题或关联面料无效"}), 400
        if len(images) != 2:
            return jsonify({"error": f"案例“{title}”必须包含两张图片"}), 400
        case_ids.add(case_id)
        normalized.append({
            "id": case_id,
            "title": title[:40],
            "category": str(item.get("category") or "成衣案例").strip()[:30],
            "productId": product_id,
            "status": "已发布" if item.get("status") == "已发布" else "草稿",
            "images": images,
            "image": images[0],
        })
    now = utc_now()
    with get_db() as db:
        db.execute(
            """
            INSERT INTO settings (key, payload, updated_at) VALUES ('cases', ?, ?)
            ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
            """,
            (json.dumps(normalized, ensure_ascii=False), now),
        )
        db.commit()
    return jsonify({"data": normalized, "updatedAt": now})


@app.get("/api/homepage")
def get_homepage():
    with get_db() as db:
        row = db.execute("SELECT payload, updated_at FROM settings WHERE key = 'homepage'").fetchone()
    homepage = json.loads(row["payload"]) if row else {
        "posters": [],
        "hotProductIds": [],
        "cases": [],
    }
    return jsonify({"data": homepage, "updatedAt": row["updated_at"] if row else None})


@app.put("/api/homepage")
def put_homepage():
    homepage = request.get_json(silent=True)
    if not isinstance(homepage, dict):
        return jsonify({"error": "首页配置必须是对象"}), 400

    posters = homepage.get("posters", [])
    hot_product_ids = homepage.get("hotProductIds", [])
    cases = homepage.get("cases", [])
    if not isinstance(posters, list) or len(posters) > 8:
        return jsonify({"error": "顶部海报最多上传 8 张"}), 400
    if not isinstance(hot_product_ids, list) or len(hot_product_ids) > 6:
        return jsonify({"error": "当季热销最多关联 6 款面料"}), 400
    if not isinstance(cases, list) or len(cases) > 5:
        return jsonify({"error": "成衣案例最多选择 5 个"}), 400

    homepage = {
        "posters": [
            {
                "url": str(item.get("url") or "").strip(),
                "title": str(item.get("title") or "").strip()[:36],
                "copy": str(item.get("copy") or "").strip()[:100],
                "productId": str(item.get("productId") or "").strip(),
            }
            for item in posters
            if isinstance(item, dict) and str(item.get("url") or "").strip()
        ],
        "hotProductIds": list(dict.fromkeys(str(item).strip() for item in hot_product_ids if str(item).strip()))[:6],
        "cases": [
            {
                "id": str(item.get("id") or "").strip(),
                "title": str(item.get("title") or "").strip()[:40],
                "category": str(item.get("category") or "").strip()[:30],
                "productId": str(item.get("productId") or item.get("product") or "").strip(),
                "image": str(item.get("image") or ((item.get("images") or [""])[0])).strip(),
                "images": [str(url).strip() for url in item.get("images", []) if str(url).strip()][:2],
            }
            for item in cases
            if isinstance(item, dict) and (str(item.get("image") or "").strip() or item.get("images"))
        ][:5],
    }
    now = utc_now()
    with get_db() as db:
        db.execute(
            """
            INSERT INTO settings (key, payload, updated_at) VALUES ('homepage', ?, ?)
            ON CONFLICT(key) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at
            """,
            (json.dumps(homepage, ensure_ascii=False), now),
        )
        db.commit()
    return jsonify({"data": homepage, "updatedAt": now})


@app.get("/api/products/<product_id>")
def get_product(product_id):
    with get_db() as db:
        row = db.execute("SELECT * FROM products WHERE id = ?", (product_id,)).fetchone()
    if not row:
        return jsonify({"error": "产品不存在"}), 404
    return jsonify({"data": parse_product(row)})


@app.put("/api/products/<product_id>")
def put_product(product_id):
    product = request.get_json(silent=True) or {}
    product["id"] = product_id
    try:
        with get_db() as db:
            saved = save_product(db, product)
    except (ValueError, sqlite3.IntegrityError) as error:
        return jsonify({"error": str(error)}), 400
    return jsonify({"data": saved})


@app.delete("/api/products/<product_id>")
def delete_product(product_id):
    """Permanently remove a product from the admin catalogue."""
    with get_db() as db:
        row = db.execute("SELECT id FROM products WHERE id = ?", (product_id,)).fetchone()
        if not row:
            return jsonify({"error": "产品不存在"}), 404
        db.execute("DELETE FROM products WHERE id = ?", (product_id,))
        db.commit()
    return jsonify({"ok": True, "id": product_id})


@app.post("/api/uploads")
def upload_image():
    file = request.files.get("file")
    if not file or not file.filename:
        return jsonify({"error": "没有收到图片文件"}), 400
    if file.mimetype not in ALLOWED_IMAGE_TYPES:
        return jsonify({"error": "仅支持 JPG、PNG 和 WebP 图片"}), 400
    if uploaded_file_size(file) > 16 * 1024 * 1024:
        return jsonify({"error": "单张图片不能超过16MB"}), 413
    try:
        optimized = optimize_uploaded_image(file)
    except ValueError as error:
        return jsonify({"error": str(error)}), 400
    product_code = secure_filename(request.form.get("productCode", "unassigned")) or "unassigned"
    group = secure_filename(request.form.get("group", "gallery")) or "gallery"
    target_dir = UPLOAD_DIR / product_code / group
    target_dir.mkdir(parents=True, exist_ok=True)
    filename = f"{uuid.uuid4().hex}{optimized['extension']}"
    (target_dir / filename).write_bytes(optimized["content"])
    relative_path = f"{product_code}/{group}/{filename}"
    original_bytes = optimized["originalBytes"]
    compressed_bytes = optimized["compressedBytes"]
    saved_percent = round((1 - compressed_bytes / original_bytes) * 100, 1) if original_bytes else 0
    return jsonify({
        "url": f"/uploads/{relative_path}",
        "image": {
            "format": optimized["format"],
            "width": optimized["width"],
            "height": optimized["height"],
            "originalBytes": original_bytes,
            "compressedBytes": compressed_bytes,
            "savedPercent": max(0, saved_percent),
        },
    }), 201


@app.get("/uploads/<path:filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_DIR, filename)


@app.errorhandler(413)
def upload_too_large(_error):
    return jsonify({"error": "单张图片不能超过16MB"}), 413


init_db()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", "4188"))
    app.run(host="127.0.0.1", port=port, debug=False)
