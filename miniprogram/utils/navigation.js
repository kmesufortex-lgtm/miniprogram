const routes = {
  home: "/pages/index/index",
  catalog: "/pages/catalog/index",
  brand: "/pages/brand/index",
  samples: "/pages/samples/index",
  profile: "/pages/profile/index"
};

const protectedPages = new Set(["samples", "profile"]);

function onNav(event) {
  const page = event.currentTarget.dataset.page;
  const target = routes[page];
  const current = `/${getCurrentPages().slice(-1)[0].route}`;

  if (target && protectedPages.has(page)) {
    const { promptLogin } = require("./auth");
    if (!promptLogin(target)) return;
  }

  if (target && target !== current) {
    wx.redirectTo({ url: target });
  }
}

function getCapsuleSafeRight(edgeInsetRpx = 28, gap = 8) {
  const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
  const fallback = windowInfo.windowWidth * 176 / 750;

  if (!wx.getMenuButtonBoundingClientRect) return Math.ceil(fallback);

  const menuButton = wx.getMenuButtonBoundingClientRect();
  if (!menuButton.left || !windowInfo.windowWidth) return Math.ceil(fallback);

  const edgeInset = windowInfo.windowWidth * edgeInsetRpx / 750;
  return Math.ceil(windowInfo.windowWidth - menuButton.left - edgeInset + gap);
}

module.exports = { onNav, getCapsuleSafeRight };
