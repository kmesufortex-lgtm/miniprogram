const { getRequests, syncRequests, modifyRequest, cancelRequest, saveAddress } = require("../../services/user-service");
const { guardPage, isLoggedIn } = require("../../utils/auth");

const LABELS = { pending: "待确认", confirmed: "待寄送", preparing: "待寄送", approved: "待寄送", shipped: "已发货", completed: "已完成", cancelled: "已取消" };
const STEP_INDEX = { pending: 0, confirmed: 1, preparing: 1, approved: 1, shipped: 2, completed: 3 };
const STEP_LABELS = ["已提交", "待寄送", "已发货", "已完成"];

function fullAddress(address = {}) {
  return [address.province, address.city, address.district, address.detail].filter(Boolean).join("");
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = number => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = number => String(number).padStart(2, "0");
  return `${formatDate(value)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function decorateRequest(item) {
  const stepIndex = STEP_INDEX[item.status] === undefined ? 0 : STEP_INDEX[item.status];
  return {
    ...item,
    items: Array.isArray(item.items) ? item.items : [],
    address: item.address || {},
    contact: item.contact || {},
    statusLabel: LABELS[item.status] || "处理中",
    dateLabel: item.createdAt ? formatDate(item.createdAt) : "",
    updatedLabel: item.updatedAt ? formatDateTime(item.updatedAt) : "",
    fullAddress: fullAddress(item.address),
    stepIndex,
    steps: STEP_LABELS.map((label, index) => ({ label, done: item.status !== "cancelled" && index <= stepIndex, current: item.status !== "cancelled" && index === stepIndex })),
    canModify: item.status === "pending",
    canCancel: ["pending", "confirmed", "preparing", "approved"].includes(item.status),
    isCancelled: item.status === "cancelled"
  };
}

Page({
  data: {
    active: "all",
    requests: [],
    visible: [],
    detail: null,
    showDetail: false,
    showEdit: false,
    editAddress: null,
    editItems: [],
    editRemark: "",
    loading: false,
    saving: false
  },

  onLoad(options) {
    const status = options.status && ["pending", "approved", "shipped"].includes(options.status) ? options.status : "all";
    const url = status === "all" ? "/pages/requests/index" : `/pages/requests/index?status=${status}`;
    if (!guardPage(url)) return;
    this.setData({ active: status });
  },

  async onShow() {
    if (!isLoggedIn()) return;
    this.setData({ loading: true });
    const requests = (await syncRequests()).map(decorateRequest);
    this.setData({ requests, loading: false }, () => this.filter());
  },

  chooseStatus(event) { this.setData({ active: event.currentTarget.dataset.status }, () => this.filter()); },

  filter() {
    const { requests, active } = this.data;
    this.setData({ visible: active === "all" ? requests : requests.filter(item => item.status === active || (active === "approved" && ["confirmed", "preparing", "approved"].includes(item.status))) });
  },

  openDetail(event) {
    const detail = this.data.requests.find(item => item.id === event.currentTarget.dataset.id);
    if (detail) this.setData({ detail, showDetail: true });
  },

  closeDetail() { this.setData({ showDetail: false }); },
  noop() {},

  openEdit() {
    const detail = this.data.detail;
    if (!detail || !detail.canModify) return;
    this.setData({ showDetail: false, showEdit: true, editAddress: { ...(detail.address || {}) }, editItems: (detail.items || []).map(item => ({ ...item })), editRemark: detail.remark || "" });
  },

  openEditFromCard(event) {
    const detail = this.data.requests.find(item => item.id === event.currentTarget.dataset.id);
    if (!detail || !detail.canModify) return;
    this.setData({ detail }, () => this.openEdit());
  },

  closeEdit() { this.setData({ showEdit: false }); },

  chooseEditAddress() {
    wx.chooseAddress({
      success: result => this.setData({ editAddress: saveAddress(result) }),
      fail: error => {
        if (!String(error.errMsg || "").includes("cancel")) wx.showToast({ title: "无法读取微信地址，请检查授权", icon: "none" });
      }
    });
  },

  onEditRemark(event) { this.setData({ editRemark: event.detail.value }); },

  removeEditItem(event) {
    if (this.data.editItems.length <= 1) {
      wx.showToast({ title: "至少保留一款面料", icon: "none" });
      return;
    }
    const id = event.currentTarget.dataset.id;
    this.setData({ editItems: this.data.editItems.filter(item => item.id !== id) });
  },

  async saveEdit() {
    if (this.data.saving || !this.data.detail || !this.data.editAddress) return;
    if (!this.data.editItems.length) {
      wx.showToast({ title: "至少保留一款面料", icon: "none" });
      return;
    }
    const address = this.data.editAddress;
    this.setData({ saving: true });
    try {
      const saved = await modifyRequest(this.data.detail.id, { items: this.data.editItems, address, contact: { name: address.name, phone: address.phone }, remark: this.data.editRemark });
      const requests = getRequests().map(decorateRequest);
      this.setData({ requests, detail: decorateRequest(saved), showEdit: false, showDetail: true, saving: false }, () => this.filter());
      wx.showToast({ title: "申请信息已更新", icon: "success" });
    } catch (error) {
      this.setData({ saving: false });
      wx.showModal({ title: "暂时无法修改", content: error.message || "请稍后重试", showCancel: false });
    }
  },

  cancelCurrent() {
    const detail = this.data.detail;
    if (!detail || !detail.canCancel) return;
    wx.showModal({
      title: "取消这张申请单？",
      content: "取消后无法恢复。如样卡已经寄出，请联系面料顾问处理。",
      editable: true,
      placeholderText: "取消原因（选填）",
      confirmText: "确认取消",
      confirmColor: "#8b514b",
      success: async result => {
        if (!result.confirm) return;
        this.setData({ saving: true });
        try {
          const saved = await cancelRequest(detail.id, result.content || "客户主动取消");
          const requests = getRequests().map(decorateRequest);
          this.setData({ requests, detail: decorateRequest(saved), saving: false }, () => this.filter());
          wx.showToast({ title: "申请已取消", icon: "success" });
        } catch (error) {
          this.setData({ saving: false });
          wx.showModal({ title: "暂时无法取消", content: error.message || "请稍后重试", showCancel: false });
        }
      }
    });
  },

  copyTracking() {
    const trackingNumber = String((this.data.detail && this.data.detail.trackingNumber) || "").trim();
    if (!trackingNumber) return;
    wx.setClipboardData({
      data: trackingNumber,
      success: () => wx.showToast({ title: "单号已复制", icon: "success" }),
      fail: () => wx.showToast({ title: "复制失败，请长按单号", icon: "none" })
    });
  },

  goBack() { wx.navigateBack(); }
});
