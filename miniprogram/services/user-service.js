const API_ORIGIN = "https://hengyitex.top";
const KEYS = {
  cart: "sampleCart",
  profile: "userProfile",
  addresses: "shippingAddresses",
  requests: "sampleRequests",
  favorites: "favoriteProducts",
  history: "browsingHistory"
};

function read(key, fallback) {
  const value = wx.getStorageSync(key);
  return value === "" || value === undefined || value === null ? fallback : value;
}
function write(key, value) { wx.setStorageSync(key, value); return value; }
function normalizeSample(item) {
  return { id: item.id, code: item.code || item.id, name: item.name, image: item.image || item.sampleImage || "", quantity: item.quantity || 1 };
}
function getSampleCart() {
  const seen = {};
  return read(KEYS.cart, []).filter(item => item && item.id && !seen[item.id] && (seen[item.id] = true)).map(normalizeSample);
}
function addSample(product) {
  const cart = getSampleCart();
  if (cart.some(item => item.id === product.id)) return { added: false, cart };
  cart.push(normalizeSample({ ...product, image: product.sampleImage || (product.gallery || [])[0] }));
  write(KEYS.cart, cart); return { added: true, cart };
}
function removeSample(id) { return write(KEYS.cart, getSampleCart().filter(item => item.id !== id)); }
function getProfile() { return read(KEYS.profile, { nickName: "微信用户", avatarUrl: "", name: "", phone: "" }); }
function saveProfile(profile) { return write(KEYS.profile, { ...getProfile(), ...profile }); }
function getAddresses() { return read(KEYS.addresses, []); }
function saveAddress(address) {
  const normalized = { id: address.id || `ADDR-${Date.now()}`, name: address.name || address.userName || "", phone: address.phone || address.telNumber || "", province: address.province || address.provinceName || "", city: address.city || address.cityName || "", district: address.district || address.countyName || "", detail: address.detail || address.detailInfo || "", isDefault: address.isDefault !== false };
  let addresses = getAddresses().filter(item => item.id !== normalized.id);
  if (normalized.isDefault) addresses = addresses.map(item => ({ ...item, isDefault: false }));
  addresses.unshift(normalized); write(KEYS.addresses, addresses); return normalized;
}
function getDefaultAddress() { const addresses = getAddresses(); return addresses.find(item => item.isDefault) || addresses[0] || null; }
function setDefaultAddress(id) {
  const addresses = getAddresses();
  if (!addresses.some(item => item.id === id)) return null;
  const updated = addresses.map(item => ({ ...item, isDefault: item.id === id }));
  write(KEYS.addresses, updated);
  return updated.find(item => item.id === id) || null;
}
function getRequests() { return read(KEYS.requests, []); }

function requestServer({ path = "", method = "GET", data }) {
  return new Promise((resolve, reject) => wx.request({
    url: `${API_ORIGIN}/api/requests${path}`,
    method,
    data,
    success: response => {
      if (response.statusCode >= 200 && response.statusCode < 300) return resolve(response.data.data);
      reject(new Error(response.data && response.data.error ? response.data.error : "申请服务暂时不可用"));
    },
    fail: reject
  }));
}

async function syncRequests() {
  const local = getRequests();
  const ids = local.map(item => item.id).filter(Boolean);
  if (!ids.length) return [];
  try {
    const remote = await requestServer({ path: `?ids=${encodeURIComponent(ids.join(","))}` });
    const remoteMap = new Map((remote || []).map(item => [item.id, item]));
    const merged = local.map(item => remoteMap.has(item.id) ? { ...item, ...remoteMap.get(item.id) } : item);
    write(KEYS.requests, merged);
    return merged;
  } catch (error) {
    console.warn("申请进度同步失败，继续显示本机记录", error);
    return local;
  }
}

async function updateRequest(requestId, changes) {
  const current = getRequests().find(item => item.id === requestId);
  if (!current) throw new Error("申请记录不存在");
  const clientPhone = (current.contact && current.contact.phone) || (current.address && current.address.phone) || "";
  const saved = await requestServer({ path: `/${encodeURIComponent(requestId)}`, method: "PATCH", data: { ...changes, clientPhone } });
  write(KEYS.requests, getRequests().map(item => item.id === requestId ? { ...item, ...saved } : item));
  return saved;
}

function modifyRequest(requestId, { items, address, contact, remark }) {
  return updateRequest(requestId, { userAction: "update", items, address, contact, remark });
}

function cancelRequest(requestId, cancelReason) {
  return updateRequest(requestId, { userAction: "cancel", cancelReason });
}

function submitRequestToServer(request) {
  return new Promise((resolve, reject) => wx.request({
    url: `${API_ORIGIN}/api/requests`, method: "POST", data: request,
    success: response => response.statusCode >= 200 && response.statusCode < 300 ? resolve(response.data.data) : reject(new Error("申请提交失败")),
    fail: reject
  }));
}

async function createRequest({ items, address, profile, remark }) {
  const request = { id: `SR${Date.now()}`, status: "pending", createdAt: new Date().toISOString(), items: items.map(normalizeSample), address: { ...address }, contact: { name: profile.name || address.name, phone: profile.phone || address.phone }, remark: remark || "", shippingFee: "待确认" };
  try {
    const saved = await submitRequestToServer(request);
    write(KEYS.requests, [saved, ...getRequests()]); write(KEYS.cart, []); return saved;
  } catch (error) {
    console.warn("服务器申请提交失败，暂存本机", error);
    write(KEYS.requests, [request, ...getRequests()]); write(KEYS.cart, []); return request;
  }
}
function getRequestCounts() {
  return getRequests().reduce((counts, item) => { if (item.status === "pending") counts.pending += 1; if (item.status === "confirmed" || item.status === "preparing") counts.approved += 1; if (item.status === "shipped") counts.shipped += 1; return counts; }, { pending: 0, approved: 0, shipped: 0 });
}
function toProductSummary(product) { return { id: product.id, code: product.code || product.id, name: product.name, image: product.sampleImage || product.coverImage || (product.gallery || [])[0] || "", composition: product.composition || "" }; }
function getFavorites() { return read(KEYS.favorites, []); }
function isFavorite(id) { return getFavorites().some(item => item.id === id); }
function toggleFavorite(product) { const favorites = getFavorites(); const index = favorites.findIndex(item => item.id === product.id); if (index >= 0) { favorites.splice(index, 1); write(KEYS.favorites, favorites); return false; } favorites.unshift(toProductSummary(product)); write(KEYS.favorites, favorites); return true; }
function recordHistory(product) { const history = getHistory().filter(item => item.id !== product.id); history.unshift({ ...toProductSummary(product), viewedAt: new Date().toISOString() }); write(KEYS.history, history.slice(0, 50)); }
function getHistory() { return read(KEYS.history, []); }
function clearHistory() { write(KEYS.history, []); }

module.exports = { KEYS, getSampleCart, addSample, removeSample, getProfile, saveProfile, getAddresses, saveAddress, getDefaultAddress, setDefaultAddress, getRequests, syncRequests, modifyRequest, cancelRequest, createRequest, getRequestCounts, getFavorites, isFavorite, toggleFavorite, recordHistory, getHistory, clearHistory };
