const { getProductDetail } = require("../../services/product-service");
const { getCapsuleSafeRight } = require("../../utils/navigation");
const { addSample, isFavorite, toggleFavorite, recordHistory } = require("../../services/user-service");
const { promptLogin } = require("../../utils/auth");

function splitComposition(value = "") {
  return String(value)
    .trim()
    .split(/\s*[|,;]+\s*|\s+(?=\d+(?:\.\d+)?\s*%)/)
    .map(item => item.trim())
    .filter(Boolean);
}

Page({
  data: {
    product: null,
    current: 0,
    loadFailed: false,
    shareButtonRight: null,
    favorite: false
  },

  async onLoad(options) {
    const productId = options.id || "FA227";

    this.setNavigationLayout();
    let product = null;

    try {
      product = await getProductDetail(productId);
    } catch (error) {
      this.setData({ loadFailed: true });
      wx.showToast({ title: "产品加载失败，请稍后重试", icon: "none" });
      return;
    }

    if (!product) {
      this.setData({ loadFailed: true });
      wx.showToast({ title: "未找到该产品", icon: "none" });
      return;
    }

    const viewProduct = {
      ...product,
      compositionParts: splitComposition(product.composition || "—"),
      gallery: product.gallery || [],
      tags: product.tags || [],
      specifications: [
        { label: "成分", value: product.composition || "—", compact: true },
        { label: "门幅", value: product.width || "—" },
        { label: "克重", value: product.weight || "—" },
        ...(product.specifications || []).filter(item => !["成分", "门幅", "幅宽", "克重"].includes(item.label))
      ],
      detailImages: product.detailImages || [],
      colorCardImages: product.colorCardImages || [],
      colorRange: product.colorRange || "",
      recommendedUses: (product.recommendedUses || []).map((item, index) => ({
        ...item,
        order: `${index < 9 ? "0" : ""}${index + 1}`
      }))
    };

    this.setData({ product: viewProduct, favorite: isFavorite(viewProduct.id) });
    recordHistory(viewProduct);
    wx.setNavigationBarTitle({ title: viewProduct.code });
  },

  setNavigationLayout() {
    this.setData({ shareButtonRight: getCapsuleSafeRight(24) });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.redirectTo({ url: "/pages/index/index" });
  },

  onSlide(event) {
    this.setData({ current: event.detail.current });
  },

  preview(event) {
    const images = this.data.product.gallery;
    const current = images[event.currentTarget.dataset.index];
    wx.previewImage({ current, urls: images });
  },

  previewAsset(event) {
    const image = event.currentTarget.dataset.src;
    wx.previewImage({ current: image, urls: [image] });
  },

  addSample() {
    const product = this.data.product;
    if (!product) return;
    if (!promptLogin(`/pages/detail/index?id=${product.id}`, "登录后才能申请样卡，请先登录后继续。")) return;

    const result = addSample(product);
    wx.showToast({ title: result.added ? "已加入样卡" : "该款已在申请单", icon: result.added ? "success" : "none" });
  },

  toggleFavorite() {
    const product = this.data.product;
    if (!product) return;
    if (!promptLogin(`/pages/detail/index?id=${product.id}`, "登录后才能保存收藏，请先登录后继续。")) return;

    const favorite = toggleFavorite(this.data.product);
    this.setData({ favorite });
    wx.showToast({ title: favorite ? "已收藏" : "已取消收藏", icon: "none" });
  },

  goSamples() {
    if (!promptLogin("/pages/samples/index", "登录后才能查看和提交样卡申请。")) return;
    wx.redirectTo({ url: "/pages/samples/index" });
  },

  onShareAppMessage() {
    const product = this.data.product;
    return {
      title: product ? `${product.name} · ${product.code}` : "产品详情",
      path: product ? `/pages/detail/index?id=${product.id}` : "/pages/catalog/index",
      imageUrl: product ? product.sampleImage || product.gallery[0] || "" : ""
    };
  }
});
