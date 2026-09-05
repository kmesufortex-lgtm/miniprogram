const {
  getProductById: getLocalProductById,
  getAllProducts: getAllLocalProducts
} = require("../data/products");
const { categories: localCategories } = require("../data/categories");

const API_ORIGIN = "https://hengyitex.top";
const CACHE_KEYS = { products: "catalogProductsCache", categories: "catalogCategoriesCache" };
const CACHE_TTL = 5 * 60 * 1000;
const REMOTE_POSTER_FALLBACKS = [
  "/uploads/homepage/posters/8b54d9fccc794724b3e53c51aa67ba5c.png",
  "/uploads/homepage/posters/3463e8e1388043eab9f262219b7ab374.png",
  "/uploads/homepage/posters/78668866c9f3455ab43c7030c7443356.png"
];

function apiRequest(path) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${API_ORIGIN}${path}`,
      method: "GET",
      timeout: 8000,
      success(response) {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          resolve(response.data);
          return;
        }
        reject(new Error(`服务器请求失败（${response.statusCode}）`));
      },
      fail: reject
    });
  });
}

function readCache(key) {
  const value = wx.getStorageSync(key);
  if (!value || !value.updatedAt || !Array.isArray(value.data)) return null;
  return { fresh: Date.now() - value.updatedAt < CACHE_TTL, data: value.data };
}

function writeCache(key, data) {
  try { wx.setStorageSync(key, { updatedAt: Date.now(), data }); } catch (error) { console.warn("目录缓存写入失败", error); }
}

function compactProduct(product) {
  return {
    ...product,
    gallery: (product.gallery || []).slice(0, 1),
    detailImages: [],
    colorCardImages: [],
    specifications: (product.specifications || []).slice(0, 4)
  };
}

function absoluteMediaUrl(path = "") {
  if (/^https?:\/\//.test(path) || path.startsWith("cloud://")) return path;
  if (path.startsWith("/assets/")) return path;
  if (path.startsWith("assets/")) return `/${path}`;
  return path ? `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}` : "";
}

function normalizeProduct(product) {
  if (!product) return null;

  const featureTags = product.featureTags || [];
  const colorTag = product.colorCount ? `${product.colorCount} 色可选` : "";
  const specifications = product.specifications || [
    { label: "成分", value: product.composition || "—", compact: true },
    { label: "克重", value: product.weight || "—" },
    { label: "门幅", value: product.width || "—" },
    ...(product.customSpecs || []).map(item => ({ label: item.label, value: item.value }))
  ];
  const detailImages = product.detailImages || (product.fabricStyle && product.fabricStyle.image
    ? [product.fabricStyle.image]
    : []);
  const colorCardImages = product.colorCardImages || (product.digitalColorCard && product.digitalColorCard.image
    ? [product.digitalColorCard.image]
    : []);

  return {
    ...product,
    id: product.id || product._id || product.code,
    categoryIds: product.categoryIds || [],
    gallery: (product.gallery || []).map(absoluteMediaUrl),
    tags: product.tags || [colorTag, ...featureTags].filter(Boolean),
    specifications,
    detailImages: detailImages.map(absoluteMediaUrl),
    colorCardImages: colorCardImages.map(absoluteMediaUrl),
    recommendedUses: product.recommendedUses || product.uses || [],
    colorRange: product.colorRange || (product.digitalColorCard && product.digitalColorCard.range) || "",
    sampleImage: absoluteMediaUrl(product.sampleImage || (product.gallery && product.gallery[0]) || "")
  };
}

async function refreshCategories() {
  try {
    const result = await apiRequest("/api/categories");
    const categories = Array.isArray(result.data) && result.data.length ? result.data : localCategories;
    writeCache(CACHE_KEYS.categories, categories);
    return categories;
  } catch (error) {
    console.warn("读取服务器分类失败，暂时使用本地分类", error);
    return localCategories;
  }
}

async function getCategories(options = {}) {
  const cached = readCache(CACHE_KEYS.categories);
  if (cached) {
    if (!cached.fresh) refreshCategories().then(next => options.onUpdate && options.onUpdate(next)).catch(() => {});
    return cached.data;
  }
  return refreshCategories();
}

async function refreshProducts() {
  try {
    const result = await apiRequest("/api/products?status=live");
    const products = (result.data || []).map(normalizeProduct);
    const liveProducts = products.length ? products : getAllLocalProducts().map(normalizeProduct);
    writeCache(CACHE_KEYS.products, liveProducts.map(compactProduct));
    return liveProducts;
  } catch (error) {
    console.warn("读取服务器产品失败，暂时使用本地演示数据", error);
    return getAllLocalProducts().map(normalizeProduct);
  }
}

async function getLiveProducts(options = {}) {
  const cached = readCache(CACHE_KEYS.products);
  if (cached) {
    if (!cached.fresh) refreshProducts().then(next => options.onUpdate && options.onUpdate(next)).catch(() => {});
    return cached.data.map(normalizeProduct);
  }
  return refreshProducts();
}

async function getHomepageConfig() {
  try {
    const result = await apiRequest("/api/homepage");
    const config = result.data || {};
    return {
      posters: (config.posters || []).map(item => ({
        ...item,
        url: absoluteMediaUrl(item.url)
      })),
      hotProductIds: config.hotProductIds || [],
      cases: (config.cases || []).map(item => ({
        ...item,
        image: absoluteMediaUrl(item.image),
        images: (item.images || [item.image]).filter(Boolean).map(absoluteMediaUrl)
      }))
    };
  } catch (error) {
    console.warn("读取首页配置失败，暂时使用自动编排", error);
    return {
      posters: REMOTE_POSTER_FALLBACKS.map(url => ({ url: absoluteMediaUrl(url) })),
      hotProductIds: [],
      cases: []
    };
  }
}

async function getProductDetail(id) {
  try {
    const result = await apiRequest(`/api/products/${encodeURIComponent(id)}`);
    if (result.data && result.data.status === "live") return normalizeProduct(result.data);
    // Do not show a bundled copy when the server explicitly took the product offline.
    if (result.data) return null;
  } catch (error) {
    console.warn(`读取服务器产品 ${id} 失败`, error);
  }
  return normalizeProduct(getLocalProductById(id));
}

module.exports = {
  getLiveProducts,
  getProductDetail,
  getCategories,
  getHomepageConfig,
  normalizeProduct
};
