const { onNav, getCapsuleSafeRight } = require("../../utils/navigation");
const { getLiveProducts, getHomepageConfig } = require("../../services/product-service");

Page({
  data: {
    topbarSafeRight: null,
    posters: [],
    hotProducts: [],
    newProducts: [],
    cases: [],
    posterCurrent: 0,
    hotCurrent: 0,
    newCurrent: 0,
    caseCurrent: 0
  },

  onLoad() {
    this.setData({ topbarSafeRight: getCapsuleSafeRight() });
    this.loadHomepage();
  },

  async loadHomepage() {
    const [products, config] = await Promise.all([getLiveProducts(), getHomepageConfig()]);
    const byId = new Map(products.map(product => [product.id, product]));
    const newest = [...products]
      .sort((a, b) => (Date.parse(b.publishedAt || b.updatedAt || "") || 0) - (Date.parse(a.publishedAt || a.updatedAt || "") || 0))
      .slice(0, 6);
    const hotProducts = (config.hotProductIds || []).map(id => byId.get(id)).filter(Boolean).slice(0, 6);
    const fallbackHot = hotProducts.length ? hotProducts : newest;
    const posters = (config.posters || []).length
      ? config.posters
      : fallbackHot.slice(0, 3).map(product => ({
        url: product.gallery[0] || "",
        title: product.name,
        copy: product.description,
        productId: product.id
      }));
    const fallbackCases = fallbackHot.slice(0, 5).map((product, index) => ({
      id: `auto-${product.id}-${index}`,
      title: product.name,
      category: "成衣案例",
      productId: product.id,
      image: product.detailImages[index % Math.max(product.detailImages.length, 1)] || product.gallery[2] || product.gallery[0] || ""
    }));
    this.setData({
      posters,
      hotProducts: fallbackHot,
      newProducts: newest,
      cases: (config.cases || []).length ? config.cases.slice(0, 5) : fallbackCases
    });
  },

  onNav,

  goDetail(event) {
    const id = event.currentTarget.dataset.id;
    if (!id) return;
    const url = `/pages/detail/index?id=${id}`;
    // 首页内容公开可浏览，登录只在详情页的申请/收藏等操作触发。
    wx.navigateTo({ url });
  },

  onPosterChange(event) { this.setData({ posterCurrent: event.detail.current }); },
  onHotChange(event) { this.setData({ hotCurrent: event.detail.current }); },
  onNewChange(event) { this.setData({ newCurrent: event.detail.current }); },
  onCaseChange(event) { this.setData({ caseCurrent: event.detail.current }); },

  goCatalog() {
    wx.redirectTo({ url: "/pages/catalog/index" });
  },

});
