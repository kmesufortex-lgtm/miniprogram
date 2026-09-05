const { onNav } = require("../../utils/navigation");

Page({
  data: {
  },

  onNav,

  goCatalog() {
    wx.redirectTo({ url: "/pages/catalog/index" });
  },

  goSamples() {
    wx.redirectTo({ url: "/pages/samples/index" });
  }
});
