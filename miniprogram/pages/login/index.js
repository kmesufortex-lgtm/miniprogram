const { isLoggedIn, markLoggedIn } = require("../../utils/auth");
const { getCapsuleSafeRight } = require("../../utils/navigation");

Page({
  data: {
    redirect: "/pages/profile/index",
    topbarSafeRight: null,
    loggingIn: false
  },

  onLoad(options) {
    const redirect = options.redirect ? decodeURIComponent(options.redirect) : "/pages/profile/index";
    this.setData({ redirect, topbarSafeRight: getCapsuleSafeRight() });
    if (isLoggedIn()) this.continueToTarget(redirect);
  },

  login() {
    if (this.data.loggingIn) return;
    this.setData({ loggingIn: true });

    // getUserProfile 必须由用户点击直接触发，因此放在 wx.login 之前。
    // 用户拒绝时不阻断登录，仍可先进入小程序，之后在“我的”中再次完善资料。
    const continueLogin = userInfo => {
      const session = userInfo && (userInfo.nickName || userInfo.avatarUrl)
        ? { nickName: userInfo.nickName || "微信用户", avatarUrl: userInfo.avatarUrl || "" }
        : {};

      wx.login({
        timeout: 10000,
        success: result => {
          if (!result.code) {
            this.setData({ loggingIn: false });
            wx.showToast({ title: "未获取到登录凭证", icon: "none" });
            return;
          }
          markLoggedIn(session);
          wx.showToast({ title: Object.keys(session).length ? "登录成功，资料已同步" : "登录成功", icon: "success" });
          setTimeout(() => this.continueToTarget(), 450);
        },
        fail: () => {
          this.setData({ loggingIn: false });
          wx.showToast({ title: "登录未完成，请重试", icon: "none" });
        }
      });
    };

    const requestProfile = () => {
      if (typeof wx.getUserProfile !== "function") {
        wx.showModal({
          title: "当前版本未启用资料授权",
          content: "当前体验版没有可用的头像昵称授权接口，请确认已重新编译并上传最新版本。你仍可登录，之后在“我的”中完善资料。",
          showCancel: false,
          complete: () => continueLogin({})
        });
        return;
      }
      wx.getUserProfile({
        desc: "用于显示申请人头像和昵称",
        lang: "zh_CN",
        success: result => continueLogin(result.userInfo || {}),
        fail: error => {
          const message = String(error && error.errMsg || "");
          console.error("[login] getUserProfile failed", error);
          if (message.includes("cancel")) {
            continueLogin({});
            return;
          }
          wx.showModal({
            title: "头像昵称授权未完成",
            content: "微信没有返回头像和昵称。请确认隐私指引已生效，并重新上传最新体验版；也可以登录后在“我的”中点击“完善资料”。",
            showCancel: false,
            complete: () => continueLogin({})
          });
        }
      });
    };

    // 必须由本次按钮点击直接调用 getUserProfile，不能放进其他异步回调，
    // 否则微信会判定为非用户主动操作并直接跳过头像昵称授权。
    requestProfile();
  },

  continueToTarget(target = this.data.redirect) {
    wx.redirectTo({
      url: target || "/pages/profile/index",
      fail: () => wx.redirectTo({ url: "/pages/index/index" })
    });
  },

  goBack() {
    const pages = getCurrentPages();
    if (pages.length > 1) wx.navigateBack();
    else wx.redirectTo({ url: "/pages/index/index" });
  }
});
