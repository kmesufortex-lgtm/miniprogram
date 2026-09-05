const { getProfile, saveProfile } = require("../services/user-service");

const DEFAULT_REDIRECT = "/pages/profile/index";

function isLoggedIn() {
  return Boolean(getProfile().loggedIn);
}

function loginUrl(redirect = DEFAULT_REDIRECT) {
  return `/pages/login/index?redirect=${encodeURIComponent(redirect)}`;
}

function promptLogin(redirect = DEFAULT_REDIRECT, content = "登录后可收藏面料、申请样卡和管理个人资料。") {
  if (isLoggedIn()) return true;

  wx.showModal({
    title: "登录后继续",
    content,
    confirmText: "去登录",
    cancelText: "暂不登录",
    success: result => {
      if (result.confirm) wx.navigateTo({ url: loginUrl(redirect) });
    }
  });
  return false;
}

function guardPage(redirect, fallback = "/pages/index/index") {
  if (isLoggedIn()) return true;

  wx.showModal({
    title: "登录后继续",
    content: "该页面包含你的浏览、申请或收货信息，请先登录后查看。",
    confirmText: "去登录",
    cancelText: "返回首页",
    success: result => {
      if (result.confirm) wx.redirectTo({ url: loginUrl(redirect) });
      else wx.redirectTo({ url: fallback });
    }
  });
  return false;
}

function markLoggedIn(session = {}) {
  return saveProfile({
    loggedIn: true,
    loginAt: new Date().toISOString(),
    ...session
  });
}

module.exports = { isLoggedIn, promptLogin, guardPage, markLoggedIn, loginUrl };
