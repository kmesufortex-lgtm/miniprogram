const { onNav, getCapsuleSafeRight } = require("../../utils/navigation");
const {
  getProfile, saveProfile, getRequestCounts, syncRequests,
  getDefaultAddress, clearHistory
} = require("../../services/user-service");
const { guardPage, isLoggedIn } = require("../../utils/auth");

Page({
  data: {
    topbarSafeRight: null,
    profile: {},
    editingProfile: false,
    draftProfile: { nickName: "", avatarUrl: "" },
    counts: { pending: 0, approved: 0, shipped: 0 },
    address: null
  },

  onLoad() {
    if (!guardPage("/pages/profile/index")) return;
    this.setData({ topbarSafeRight: getCapsuleSafeRight() });
  },

  async onShow() {
    if (!isLoggedIn()) return;
    await syncRequests();
    this.setData({ profile: getProfile(), counts: getRequestCounts(), address: getDefaultAddress() });
  },

  onNav,

  settings() {
    wx.showActionSheet({
      itemList: ["清空浏览记录", "关于衡弈纺织"],
      success: result => {
        if (result.tapIndex === 0) {
          clearHistory();
          wx.showToast({ title: "浏览记录已清空", icon: "none" });
        } else {
          wx.showModal({ title: "衡弈纺织", content: "面料选款、样卡申请与进度管理。", showCancel: false });
        }
      }
    });
  },

  completeProfile() {
    const profile = getProfile();
    this.setData({
      editingProfile: true,
      draftProfile: {
        nickName: profile.nickName && profile.nickName !== "微信用户" ? profile.nickName : "",
        avatarUrl: profile.avatarUrl || ""
      }
    });
  },

  onChooseAvatar(event) {
    const avatarUrl = event.detail && event.detail.avatarUrl;
    if (avatarUrl) this.setData({ "draftProfile.avatarUrl": avatarUrl });
  },

  onNicknameInput(event) {
    this.setData({ "draftProfile.nickName": String(event.detail && event.detail.value || "").trim() });
  },

  saveProfileEdit() {
    const draft = this.data.draftProfile || {};
    if (!draft.avatarUrl && !draft.nickName) {
      wx.showToast({ title: "请先选择头像或填写昵称", icon: "none" });
      return;
    }
    const profile = saveProfile({
      avatarUrl: draft.avatarUrl || "",
      nickName: draft.nickName || "微信用户"
    });
    this.setData({ profile, editingProfile: false });
    wx.showToast({ title: "资料已更新", icon: "success" });
  },

  cancelProfileEdit() {
    this.setData({ editingProfile: false });
  },

  goAddresses() {
    wx.navigateTo({ url: "/pages/addresses/index" });
  },

  goSaved(event) {
    wx.navigateTo({ url: `/pages/saved/index?mode=${event.currentTarget.dataset.mode}` });
  },

  goSamples() {
    wx.redirectTo({ url: "/pages/samples/index" });
  },

  goRequests(event) {
    const status = event.currentTarget.dataset.status || "all";
    wx.navigateTo({ url: `/pages/requests/index?status=${status}` });
  }
});
