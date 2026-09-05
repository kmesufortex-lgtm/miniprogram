# 素材仓库导入新增面料

素材仓库通过服务端接口创建一次性导入包。导入只负责打开并填充运营后台的“新增面料”窗口，不会提前创建、覆盖或上架产品。

## 小程序服务器配置

在 `/etc/hengyitex.env` 中配置：

```text
HENGYITEX_MEDIA_WAREHOUSE_TOKEN=与素材仓库 MINIPROGRAM_SYNC_TOKEN 相同的随机长密钥
HENGYITEX_PUBLIC_ORIGIN=https://hengyitex.top
```

该文件应只允许服务运行账号或管理员读取，不进入 Git。修改后执行：

```bash
sudo systemctl daemon-reload
sudo systemctl restart hengyitex
```

部署时同时应用 `server/nginx-hengyitex.conf` 中针对该导入接口的独立 Nginx 配置并重载 Nginx。只有这个接口允许总计最多 150MB 的请求，普通后台上传仍保持单次 16MB 限制。

## 接口

- `POST /api/integrations/media-warehouse/imports`：仅接受 `Bearer` 共享密钥和 multipart 图片导入包。
- `GET /api/product-imports/<token>`：仅已登录后台管理员可读；凭证30分钟过期且只能读取一次。

导入图片保存到产品货号目录。用户仍需在新增面料窗口补充分类、色数、特色标签，并主动选择保存草稿或同步上架。

2026-09-05：导入产品可携带 `uses: [{ title, description }]` 预填推荐用途。最多 10 项，标题最多 40 字、描述最多 200 字，每项均需完整填写。缺省时保留原有空白用途输入行。接收端校验在保存图片前执行；导入仍只创建一次性预填包，不自动保存或上架商品。素材仓库同步使用已保存的组合用途；运营人员应在新增面料页复核。
