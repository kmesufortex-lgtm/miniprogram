const { onNav, getCapsuleSafeRight } = require("../../utils/navigation");
const {
  getSampleCart, removeSample, getDefaultAddress, getProfile,
  createRequest, saveAddress
} = require("../../services/user-service");
const { guardPage, isLoggedIn } = require("../../utils/auth");

Page({
  data: {
    items: [],
    topbarSafeRight: null,
    address: null,
    profile: null,
    showConfirm: false,
    remark: "",
    submitting: false
  },

  onLoad() {
    if (!guardPage("/pages/samples/index")) return;
    this.setData({ topbarSafeRight: getCapsuleSafeRight() });
  },

  onShow() {
    if (!isLoggedIn()) return;
    this.setData({ items: getSampleCart(), address: getDefaultAddress(), profile: getProfile() });
  },

  onNav,

  removeItem(event) {
    const items = removeSample(event.currentTarget.dataset.id);
    this.setData({ items });
  },

  goCatalog() {
    wx.redirectTo({ url: "/pages/catalog/index" });
  },

  submitRequest() {
    if (!this.data.items.length) return;
    if (!this.data.address) {
      wx.showModal({
        title: "请先添加收货地址",
        content: "提交申请前需要联系人、手机号和完整收货地址。",
        confirmText: "添加地址",
        success: result => { if (result.confirm) this.chooseAddress(); }
      });
      return;
    }
    this.setData({ showConfirm: true });
  },

  noop() {},

  closeConfirm() {
    this.setData({ showConfirm: false });
  },

  onRemark(event) {
    this.setData({ remark: event.detail.value });
  },

  chooseAddress() {
    wx.chooseAddress({
      success: result => this.setData({ address: saveAddress(result) }),
      fail: error => {
        if (!String(error.errMsg || "").includes("cancel")) {
          wx.showToast({ title: "无法读取微信地址，请检查授权", icon: "none" });
        }
      }
    });
  },

  async confirmSubmit() {
    if (this.data.submitting) return;
    this.setData({ submitting: true });
    const request = await createRequest({
      items: this.data.items,
      address: this.data.address,
      profile: this.data.profile,
      remark: this.data.remark
    });
    this.setData({ items: [], showConfirm: false, submitting: false, remark: "" });
    wx.showModal({
      title: "申请已提交",
      content: `申请编号 ${request.id}\n每款样卡各 1 份，工作人员确认后将更新寄送状态。`,
      showCancel: false,
      confirmText: "查看申请",
      success: () => wx.navigateTo({ url: "/pages/requests/index" })
    });
  }
});
