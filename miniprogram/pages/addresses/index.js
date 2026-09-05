const {
  getAddresses,
  getDefaultAddress,
  saveAddress,
  setDefaultAddress
} = require("../../services/user-service");
const { guardPage, isLoggedIn } = require("../../utils/auth");

function presentAddress(address, defaultId) {
  return {
    ...address,
    isDefault: address.id === defaultId,
    fullAddress: [address.province, address.city, address.district, address.detail].filter(Boolean).join("")
  };
}

Page({
  data: {
    addresses: []
  },

  onLoad() {
    guardPage("/pages/addresses/index");
  },

  onShow() {
    if (!isLoggedIn()) return;
    this.refreshAddresses();
  },

  refreshAddresses() {
    const addresses = getAddresses();
    const defaultAddress = getDefaultAddress();
    const defaultId = defaultAddress ? defaultAddress.id : "";
    this.setData({ addresses: addresses.map(item => presentAddress(item, defaultId)) });
  },

  goBack() {
    wx.navigateBack({
      fail: () => wx.redirectTo({ url: "/pages/profile/index" })
    });
  },

  addAddress() {
    wx.chooseAddress({
      success: result => {
        saveAddress({ ...result, isDefault: true });
        this.refreshAddresses();
        wx.showToast({ title: "已设为默认地址", icon: "success" });
      },
      fail: error => {
        if (!String(error.errMsg || "").includes("cancel")) {
          wx.showToast({ title: "无法读取微信地址", icon: "none" });
        }
      }
    });
  },

  makeDefault(event) {
    const id = event.currentTarget.dataset.id;
    if (!setDefaultAddress(id)) {
      wx.showToast({ title: "地址不存在", icon: "none" });
      return;
    }
    this.refreshAddresses();
    wx.showToast({ title: "默认地址已更新", icon: "success" });
  }
});
