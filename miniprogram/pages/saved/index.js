const { getFavorites, getHistory, clearHistory } = require("../../services/user-service");
const { guardPage, isLoggedIn } = require("../../utils/auth");

Page({
  data: { mode: "favorites", title: "收藏面料", items: [] },

  onLoad(options) {
    const mode = options.mode === "history" ? "history" : "favorites";
    if (!guardPage(`/pages/saved/index?mode=${mode}`)) return;
    const title = mode === "history" ? "浏览记录" : "收藏面料";
    this.setData({ mode, title });
    wx.setNavigationBarTitle({ title });
  },

  onShow() {
    if (!isLoggedIn()) return;
    this.loadItems();
  },

  loadItems() {
    this.setData({ items: this.data.mode === "history" ? getHistory() : getFavorites() });
  },

  goBack() {
    wx.navigateBack();
  },

  goDetail(event) {
    wx.navigateTo({ url: `/pages/detail/index?id=${event.currentTarget.dataset.id}` });
  },

  clear() {
    if (this.data.mode !== "history") return;
    wx.showModal({
      title: "清空浏览记录？",
      content: "清空后无法恢复。",
      success: result => {
        if (!result.confirm) return;
        clearHistory();
        this.setData({ items: [] });
      }
    });
  }
});
