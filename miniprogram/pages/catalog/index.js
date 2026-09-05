const { onNav, getCapsuleSafeRight } = require("../../utils/navigation");
const { getLiveProducts, getCategories, normalizeProduct } = require("../../services/product-service");
const { getAllProducts } = require("../../data/products");
const { categories: localCategories } = require("../../data/categories");
const { getFavorites, toggleFavorite } = require("../../services/user-service");

Page({
  data: {
    query: "",
    topbarSafeRight: null,
    categories: [],
    activeGroupId: null,
    activeTagId: "latest",
    activeLabel: "最新上新",
    products: [],
    visibleProducts: [],
    loading: true
  },

  onLoad() {
    this.setData({ topbarSafeRight: getCapsuleSafeRight() });
    // 先用内置索引绘制首屏，服务器数据在后台刷新，避免首次进入空等网络。
    this.setData({ categories: localCategories });
    this.applyProductData(getAllProducts().map(normalizeProduct));
    this.loadCatalog();
  },

  onShow() {
    if (this.data.products.length) this.syncFavoriteState();
  },

  async loadCatalog() {
    this.setData({ loading: true });
    const [sourceProducts, categories] = await Promise.all([
      getLiveProducts({ onUpdate: products => this.applyProductData(products) }),
      getCategories({ onUpdate: nextCategories => this.setData({ categories: nextCategories }) })
    ]);
    this.setData({ categories });
    this.applyProductData(sourceProducts);
  },

  applyProductData(sourceProducts, finishLoading = true) {
    const favoriteIds = new Set(getFavorites().map(item => item.id));
    const products = sourceProducts.map(product => ({
      ...product,
      coverImage: (product.gallery || [])[0] || product.sampleImage || "",
      compositionSummary: product.composition || (product.specifications && product.specifications[0] && product.specifications[0].value) || "",
      displayTags: (product.featureTags || []).slice(0, 2),
      sortTime: Date.parse(product.publishedAt || product.updatedAt || "") || 0,
      favorite: favoriteIds.has(product.id)
    })).sort((a, b) => b.sortTime - a.sortTime);
    this.setData({ products, ...(finishLoading ? { loading: false } : {}) }, () => this.applyFilters());
  },

  onNav,

  onSearch(event) {
    this.setData({ query: event.detail.value }, () => this.applyFilters());
  },

  chooseLatest() {
    this.setData({ activeTagId: "latest", activeLabel: "最新上新", activeGroupId: null }, () => this.applyFilters());
  },

  toggleGroup(event) {
    const groupId = event.currentTarget.dataset.id;
    this.setData({ activeGroupId: this.data.activeGroupId === groupId ? null : groupId });
  },

  chooseCategory(event) {
    this.setData({
      activeTagId: event.currentTarget.dataset.id,
      activeLabel: event.currentTarget.dataset.name
    }, () => this.applyFilters());
  },

  applyFilters() {
    const query = this.data.query.trim().toLowerCase();
    const activeTagId = this.data.activeTagId;
    const visibleProducts = this.data.products.filter(product => {
      const searchText = `${product.code} ${product.name} ${product.compositionSummary} ${(product.featureTags || []).join(" ")}`.toLowerCase();
      const matchesQuery = !query || searchText.includes(query);
      const matchesCategory = activeTagId === "latest" || (product.categoryIds || []).includes(activeTagId);
      return matchesQuery && matchesCategory;
    });
    this.setData({ visibleProducts });
  },

  syncFavoriteState() {
    const favoriteIds = new Set(getFavorites().map(item => item.id));
    const products = this.data.products.map(product => ({ ...product, favorite: favoriteIds.has(product.id) }));
    this.setData({ products }, () => this.applyFilters());
  },

  toggleFavorite(event) {
    const id = event.currentTarget.dataset.id;
    const product = this.data.products.find(item => item.id === id);
    if (!product) return;
    const favorite = toggleFavorite(product);
    const products = this.data.products.map(item => item.id === id ? { ...item, favorite } : item);
    this.setData({ products }, () => this.applyFilters());
    wx.showToast({ title: favorite ? "已收藏" : "已取消收藏", icon: "none" });
  },

  goDetail(event) {
    const url = `/pages/detail/index?id=${event.currentTarget.dataset.id}`;
    // 产品详情属于公开内容，先让用户完整浏览；需要账号的操作在详情页内再提示登录。
    wx.navigateTo({ url });
  }
});
