# 产品上传字段约定

详情页已经按下面的数据结构渲染。当前 `miniprogram/data/products.js` 是本地示例数据，`miniprogram/services/product-service.js` 是数据访问层；制作后台管理后，将同样结构保存到云数据库的 `products` 集合，并只替换服务层的查询实现即可。

## 基本信息

| 字段 | 类型 | 后台录入方式 | 用途 |
| --- | --- | --- | --- |
| `id` | string | 自动生成或填写货号 | 产品唯一标识、详情页 URL 参数 |
| `code` | string | 单行文本 | 页面右侧货号、导航栏标题 |
| `seriesEn` | string | 单行文本 | 产品标题上方英文系列名 |
| `name` | string | 单行文本 | 产品名称 |
| `description` | string | 多行文本 | 产品简介 |
| `quoteLabel` | string | 单行文本，默认“咨询报价” | 报价提示文案 |
| `gallery` | string[] | 图片上传并排序，建议 4 张 | 顶部轮播图 |
| `tags` | string[] | 标签输入，可增删排序 | 产品名称下方标签 |

## 规格与内容模块

| 字段 | 类型 | 后台录入方式 | 用途 |
| --- | --- | --- | --- |
| `specifications` | `{ label, value, compact? }[]` | 规格名称和值，可增删排序 | 产品规格卡片；长成分可勾选紧凑字号 |
| `fabricStyle.title` | string | 默认 `Fabric Style` | 形象色卡模块标题 |
| `fabricStyle.image` | string | 单图上传 | Fabric Style 图片 |
| `recommendedUses` | `{ title, description }[]` | 用途标题和说明，可增删排序 | 推荐用途，序号由前端自动生成 |
| `digitalColorCard.title` | string | 默认“电子色卡” | 电子色卡模块标题 |
| `digitalColorCard.range` | string | 单行文本，例如 `NO.01 — NO.22` | 色号范围 |
| `digitalColorCard.image` | string | 单图上传 | 电子色卡图片 |
| `sampleImage` | string | 单图上传；默认取轮播首图 | 申请单缩略图 |

## 后台保存规则

1. 图片先上传到云存储，数据库仅保存返回的文件 ID 或可访问地址。
2. `gallery`、`tags`、`specifications`、`recommendedUses` 都保留后台拖动后的顺序。
3. 发布前校验 `id`、`code`、`name`、至少一张轮播图和至少一项产品规格。
4. 建议额外保存 `status`、`sortOrder`、`createdAt`、`updatedAt`，用于草稿、上下架、排序和审计。
5. 小程序详情页继续使用 `/pages/detail/index?id=产品ID`；后续只需把本地 `getProductById` 替换为云数据库查询，页面模板无需重写。
