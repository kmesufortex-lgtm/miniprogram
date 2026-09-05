App({
  onLaunch() {
    this.globalData = {
      env: "cloud1-d0grayfmyf0092bfa"
    };

    if (wx.cloud) {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true
      });
    }
  }
});
