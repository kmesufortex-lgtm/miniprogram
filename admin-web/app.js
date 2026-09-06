const ASSET_ROOT = "../miniprogram/assets/fabrics/FA227";
const STORAGE_KEY = "hengyi-admin-prototype-v1";
const API_BASE = "/api";
const TAG_LIBRARY_VERSION = 3;
const SEASON_TAGS = [
  { id: "season-spring", name: "春" },
  { id: "season-summer", name: "夏" },
  { id: "season-autumn", name: "秋" },
  { id: "season-winter", name: "冬" }
];
const LEGACY_SEASON_TAGS = {
  "season-spring-summer": ["season-spring", "season-summer"],
  "season-spring-autumn": ["season-spring", "season-autumn"],
  "season-autumn-winter": ["season-autumn", "season-winter"],
  "season-all": ["season-spring", "season-summer", "season-autumn", "season-winter"]
};
const DEFAULT_FEATURE_TAGS = ["原麻风", "天丝亚麻", "天丝羊毛"];
const DEFAULT_CATEGORIES = [
  { id: "composition", name: "按成分", selectionMode: "multiple", tags: [["acetate", "醋酸"], ["tencel", "天丝"], ["cotton", "棉"], ["rayon-cotton", "人棉"], ["rayon-silk", "人丝"], ["linen", "亚麻"], ["cotton-linen", "棉麻"], ["silk", "桑蚕丝"], ["wool", "羊毛"], ["nylon", "锦纶"], ["polyester", "涤纶"], ["tr", "TR"], ["cvc", "CVC"], ["tencel-cotton", "天丝棉"], ["blend", "混纺"], ["other", "其他"]] },
  { id: "usage", name: "按用途", selectionMode: "multiple", tags: [["dress", "连衣裙"], ["skirt", "半身裙"], ["shirt", "衬衫"], ["trousers", "女裤"], ["suit", "西装套装"], ["outerwear", "外套"], ["trench", "风衣"], ["jacket", "夹克"], ["vest", "马甲"], ["coat", "大衣"], ["gown", "礼服"], ["hanfu", "汉服"], ["workwear", "职业装"], ["homewear", "家居服"]] },
  { id: "handfeel", name: "按手感", selectionMode: "multiple", tags: [["drape", "垂感"], ["soft", "柔软"], ["flowy", "飘逸"], ["crisp", "挺括"], ["smooth", "顺滑"], ["skin", "亲肤"], ["light", "轻盈"], ["thick", "厚实"], ["fluffy", "蓬松"], ["fine", "细腻"], ["waxy", "糯感"], ["bodied", "有筋骨"]] },
  { id: "craft", name: "按工艺", selectionMode: "multiple", tags: [["jacquard", "提花"], ["print", "印花"], ["yarn-dyed", "色织"], ["embroidery", "刺绣"], ["crinkle", "压皱"], ["sandwash", "砂洗"], ["brushed", "磨毛"], ["raised", "起绒"], ["foil", "烫金"], ["texture", "肌理组织"]] },
  { id: "feature", name: "按特性", selectionMode: "multiple", tags: [["wrinkle", "抗皱"], ["stretch", "弹力"], ["fourway", "四面弹"], ["microstretch", "微弹"], ["cooling", "凉感"], ["breathable", "透气"], ["wicking", "吸湿排汗"], ["sunproof", "防晒"], ["waterproof", "防水"], ["opaque", "不透"], ["lustrous", "有光泽"], ["matte", "哑光"], ["textured", "肌理感"]] },
  { id: "season", name: "按季节", selectionMode: "multiple", tags: [["spring", "春"], ["summer", "夏"], ["autumn", "秋"], ["winter", "冬"]] },
  { id: "trend", name: "热门趋势", selectionMode: "multiple", tags: [["oldmoney", "老钱风"], ["quietluxury", "静奢风"], ["hanfu", "国风汉服"], ["newchinese", "新中式"]] }
].map(group => ({ ...group, tags: group.tags.map(([suffix, name]) => ({ id: `${group.id}-${suffix}`, name })) }));

const seedState = {
  tagLibraryVersion: TAG_LIBRARY_VERSION,
  products: [
    {
      id: "FA227",
      code: "FA227",
      name: "TR 羊毛混纺系列",
      series: "",
      description: "融合不同纤维的质感优势，在挺括轮廓、舒适垂感与日常耐穿之间取得平衡。",
      quoteLabel: "咨询报价",
      featureTags: [],
      composition: "62% POLYESTER · 26% RAYON · 9% WOOL · 3% SP",
      weight: "240GSM",
      width: "150CM",
      colorCount: 22,
      colorRange: "NO.01 — NO.22",
      status: "live",
      updatedAt: "今天 09:42",
      image: `${ASSET_ROOT}/swatch.jpg`,
      gallery: [`${ASSET_ROOT}/swatch.jpg`, `${ASSET_ROOT}/texture.jpg`, `${ASSET_ROOT}/look-olive.jpg`, `${ASSET_ROOT}/look-black.jpg`],
      detailImages: [`${ASSET_ROOT}/card.jpg`, `${ASSET_ROOT}/look-olive.jpg`, `${ASSET_ROOT}/look-black.jpg`],
      colorCardImages: [`${ASSET_ROOT}/colors.jpg`],
      uses: [
        { title: "都市西装", description: "挺括但不僵硬，适合成套西装及外套。" },
        { title: "通勤单品", description: "耐穿且易搭配，可用于裤装、半裙与马甲。" }
      ],
      customSpecs: []
    },
    {
      id: "FA231",
      code: "FA231",
      name: "轻量精纺通勤料",
      series: "",
      description: "轻量、顺滑并保留清晰线条，适合春夏通勤套装。",
      quoteLabel: "咨询报价",
      featureTags: [],
      composition: "68% POLYESTER · 29% RAYON · 3% SP",
      weight: "185GSM",
      width: "148CM",
      colorCount: 16,
      colorRange: "NO.01 — NO.16",
      status: "draft",
      updatedAt: "昨天 16:20",
      image: `${ASSET_ROOT}/texture.jpg`,
      gallery: [`${ASSET_ROOT}/texture.jpg`, `${ASSET_ROOT}/swatch.jpg`, `${ASSET_ROOT}/look-olive.jpg`, `${ASSET_ROOT}/look-black.jpg`],
      detailImages: [`${ASSET_ROOT}/look-olive.jpg`],
      colorCardImages: [`${ASSET_ROOT}/colors.jpg`],
      uses: [{ title: "轻商务套装", description: "适合轻结构西装、阔腿裤与通勤连衣裙。" }],
      customSpecs: []
    },
    {
      id: "FA218",
      code: "FA218",
      name: "耐磨弹力斜纹",
      series: "",
      description: "细密斜纹兼顾耐磨与弹力，适合日常城市户外单品。",
      quoteLabel: "咨询报价",
      featureTags: [],
      composition: "94% POLYESTER · 6% SP",
      weight: "210GSM",
      width: "150CM",
      colorCount: 12,
      colorRange: "NO.01 — NO.12",
      status: "live",
      updatedAt: "07-14 11:08",
      image: `${ASSET_ROOT}/look-olive.jpg`,
      gallery: [`${ASSET_ROOT}/look-olive.jpg`, `${ASSET_ROOT}/texture.jpg`, `${ASSET_ROOT}/swatch.jpg`, `${ASSET_ROOT}/look-black.jpg`],
      detailImages: [`${ASSET_ROOT}/look-olive.jpg`, `${ASSET_ROOT}/look-black.jpg`],
      colorCardImages: [`${ASSET_ROOT}/colors.jpg`],
      uses: [{ title: "城市户外", description: "适合夹克、工装裤与功能半裙。" }],
      customSpecs: [{ label: "后整理", value: "防泼水" }]
    }
  ],
  requests: [
    { id: "SR260716-004", customer: "陈小姐", company: "迭代服饰工作室", phone: "138****7621", items: "FA227 × 1、FA218 × 1", status: "待确认", createdAt: "今天 10:18", city: "上海" },
    { id: "SR260716-003", customer: "周先生", company: "山屿服装", phone: "186****3402", items: "FA227 × 2", status: "待确认", createdAt: "今天 09:36", city: "杭州" },
    { id: "SR260715-011", customer: "Lin", company: "MORI Studio", phone: "159****1830", items: "FA218 × 1", status: "待寄送", createdAt: "昨天 17:44", city: "深圳" },
    { id: "SR260715-008", customer: "王女士", company: "简序制衣", phone: "137****5512", items: "FA227 × 1", status: "已发货", createdAt: "昨天 14:20", city: "苏州" }
  ],
  categories: DEFAULT_CATEGORIES,
  tagLibrary: DEFAULT_FEATURE_TAGS,
  cases: [
    { id: "case-olive-suit", title: "橄榄灰通勤西装", category: "都市西装", product: "FA227", status: "已发布", image: `${ASSET_ROOT}/look-olive.jpg` },
    { id: "case-black-suit", title: "黑色轻结构套装", category: "成衣案例", product: "FA227", status: "草稿", image: `${ASSET_ROOT}/look-black.jpg` }
  ],
  homepage: {
    posters: [{
      url: `${ASSET_ROOT}/swatch.jpg`,
      title: "把克制的色彩，织进日常廓形",
      copy: "混纺纤维兼顾挺括、垂感与耐穿性，适合西装及都市通勤成衣。",
      productId: "FA227"
    }],
    hotProductIds: ["FA227", "FA218"],
    cases: []
  }
};

const stored = localStorage.getItem(STORAGE_KEY);
let state;
let storedState = null;
try {
  storedState = stored ? JSON.parse(stored) : null;
  state = storedState ? { ...seedState, ...storedState } : structuredClone(seedState);
} catch {
  state = JSON.parse(JSON.stringify(seedState));
}

state.categories = Array.isArray(state.categories) && state.categories.length ? state.categories : structuredClone(DEFAULT_CATEGORIES);
state.categories = state.categories.map(group => group.id === "season"
  ? { ...group, selectionMode: "multiple", tags: structuredClone(SEASON_TAGS) }
  : group);
const needsTagLibraryCleanup = storedState?.tagLibraryVersion !== TAG_LIBRARY_VERSION;
state.tagLibraryVersion = TAG_LIBRARY_VERSION;
state.tagLibrary = needsTagLibraryCleanup
  ? [...DEFAULT_FEATURE_TAGS]
  : [...new Set([...DEFAULT_FEATURE_TAGS, ...(state.tagLibrary || [])])];
state.products = state.products.map(product => {
  const legacyTags = (product.featureTags || product.tags || []).filter(tag => !/^\d+\s*色/.test(tag));
  const gallery = product.gallery?.length ? product.gallery : [product.image || `${ASSET_ROOT}/swatch.jpg`];
  const seasonCategoryIds = (product.categoryIds || []).flatMap(id => LEGACY_SEASON_TAGS[id] || [id]);
  return {
    ...product,
    series: "",
    seriesEn: undefined,
    categoryIds: [...new Set(seasonCategoryIds)],
    featureTags: needsTagLibraryCleanup ? legacyTags.filter(tag => DEFAULT_FEATURE_TAGS.includes(tag)) : legacyTags,
    gallery,
    detailImages: product.detailImages || [],
    colorCardImages: product.colorCardImages || [],
    image: gallery[0]
  };
});
state.cases = (state.cases || []).map((item, index) => {
  const images = item.images?.length ? item.images : [item.image, item.image].filter(Boolean);
  return { ...item, id: item.id || `case-${index + 1}`, productId: item.productId || item.product || "", images, image: images[0] || "" };
});
if (!Array.isArray(state.homepage?.posters)) {
  state.homepage = {
    posters: [{
      url: state.products.find(item => item.id === state.homepage?.featuredProduct)?.image || `${ASSET_ROOT}/swatch.jpg`,
      title: state.homepage?.heroTitle || "",
      copy: state.homepage?.heroCopy || "",
      productId: state.homepage?.featuredProduct || ""
    }],
    hotProductIds: [state.homepage?.featuredProduct].filter(Boolean),
    cases: []
  };
}
state.homepage.hotProductIds = state.homepage.hotProductIds || [];
state.homepage.cases = state.homepage.cases || [];

let currentView = "dashboard";
let productFilter = "all";
let requestFilter = "all";
let editingId = null;
let toastTimer = null;
let editorImages = { gallery: [], detailImages: [], colorCardImages: [] };
let selectedFeatureTags = [];
let selectedCategoryIds = [];
let categoryDrawerSelectedIds = [];
let categorySelectorOriginalIds = [];
let activeCategoryGroupId = null;
let pendingSaveStatus = null;
let categoryManageContext = null;
let drawerSelectedTags = [];
let drawerPendingTags = [];
let tagSelectorOriginalTags = [];
let draggedMedia = null;
let apiReadyPromise = null;
let editorMediaFiles = new Map();
let homePickerType = null;
let caseEditorDraft = null;
let requestDetailId = null;
let customerDetailId = null;
let pendingProductImportToken = new URLSearchParams(window.location.search).get("newProductImport") || "";
let bootInFlight = null;

const viewMeta = {
  dashboard: ["工作台", "今天先处理这些"],
  products: ["面料", "面料档案"],
  series: ["分类", "分类与筛选标签"],
  cases: ["案例", "从面料到成衣"],
  requests: ["样卡申请", "申请处理队列"],
  customers: ["客户", "客户与申请记录"],
  homepage: ["首页配置", "小程序首页编排"]
};

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function setCloudStatus(message, connected = false) {
  const status = $("#cloudStatus");
  if (status) status.textContent = message;
  const dot = document.querySelector(".env-dot");
  if (dot) dot.classList.toggle("is-connected", connected);
}

function toMiniProgramAssetPath(path = "") {
  return path.startsWith("../miniprogram/") ? path.replace("../miniprogram", "") : path;
}

function toAdminAssetPath(path = "") {
  return path.startsWith("/assets/") ? `../miniprogram${path}` : path;
}

function normalizeCloudProduct(product) {
  const gallery = (product.gallery || []).map(toAdminAssetPath);
  return {
    ...product,
    id: product.id || product._id || product.code,
    featureTags: product.featureTags || [],
    categoryIds: product.categoryIds || [],
    gallery,
    detailImages: (product.detailImages || []).map(toAdminAssetPath),
    colorCardImages: (product.colorCardImages || []).map(toAdminAssetPath),
    uses: product.uses || [],
    customSpecs: product.customSpecs || [],
    image: gallery[0] || product.image || `${ASSET_ROOT}/swatch.jpg`
  };
}

async function loadCategories(shouldRender = true) {
  try {
    await initCloud();
    const result = await apiRequest("/categories");
    if (Array.isArray(result.data) && result.data.length) {
      state.categories = result.data;
      persist();
      if (shouldRender) renderView();
    }
  } catch (error) {
    console.warn("Categories unavailable:", error);
  }
}

async function writeCategories() {
  await apiRequest("/categories", { method: "PUT", body: JSON.stringify(state.categories) });
  persist();
  updateCounts();
}

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: "same-origin",
    ...options,
    headers: options.body instanceof FormData
      ? { ...(options.headers || {}) }
      : { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || `服务器请求失败（${response.status}）`);
  return data;
}

async function initCloud() {
  if (apiReadyPromise) return apiReadyPromise;
  apiReadyPromise = apiRequest("/health")
    .then(result => {
      setCloudStatus("已连接自建服务器", true);
      return result;
    })
    .catch(error => {
      apiReadyPromise = null;
      setCloudStatus("服务器连接未完成，当前仍保留本机数据");
      throw error;
    });
  return apiReadyPromise;
}

async function loadCloudProducts(shouldRender = true) {
  try {
    await initCloud();
    const result = await apiRequest("/products");
    const cloudProducts = (result.data || []).map(normalizeCloudProduct);
    if (!cloudProducts.length) return;
    const cloudIds = new Set(cloudProducts.map(product => product.id));
    state.products = [...cloudProducts, ...state.products.filter(product => !cloudIds.has(product.id))];
    persist();
    if (shouldRender) renderView();
  } catch (error) {
    console.warn("Cloud products unavailable:", error);
  }
}

async function loadHomepage(shouldRender = true) {
  try {
    await initCloud();
    const result = await apiRequest("/homepage");
    if (result.data && (result.data.posters?.length || result.data.hotProductIds?.length || result.data.cases?.length)) {
      state.homepage = {
        posters: (result.data.posters || []).map(item => ({ ...item, url: toAdminAssetPath(item.url) })),
        hotProductIds: result.data.hotProductIds || [],
        cases: (result.data.cases || []).map(item => ({ ...item, image: toAdminAssetPath(item.image), images: (item.images || [item.image]).filter(Boolean).map(toAdminAssetPath) }))
      };
      persist();
      if (shouldRender && currentView === "homepage") renderView();
    }
  } catch (error) {
    console.warn("Homepage configuration unavailable:", error);
  }
}

const requestStatusFromApi = { pending: "待确认", confirmed: "待寄送", preparing: "待寄送", shipped: "已发货", completed: "已完成", cancelled: "已取消" };
async function loadOperationalData(shouldRender = true) {
  try {
    await initCloud();
    const [requestResult, customerResult] = await Promise.all([apiRequest("/requests"), apiRequest("/customers")]);
    state.requests = (requestResult.data || []).map(item => ({
      ...item,
      requestItems: Array.isArray(item.items) ? item.items : [],
      customer: item.contact?.name || item.address?.name || "未填写",
      company: item.company || "",
      phone: item.contact?.phone || item.address?.phone || "",
      city: item.address?.city || "",
      items: (item.items || []).map(sample => `${sample.code || sample.id} × ${sample.quantity || 1}`).join("、"),
      status: requestStatusFromApi[item.status] || item.status,
      createdAt: item.createdAt ? new Date(item.createdAt).toLocaleString("zh-CN") : ""
    }));
    state.customers = customerResult.data || [];
    persist();
    if (shouldRender) renderView();
    updateCounts();
  } catch (error) {
    console.warn("Operational data unavailable:", error);
  }
}

function normalizeCase(item) {
  const images = (item.images || [item.image]).filter(Boolean).map(toAdminAssetPath);
  return { ...item, productId: item.productId || item.product || "", product: item.productId || item.product || "", images, image: images[0] || "" };
}

async function loadCases(shouldRender = true) {
  try {
    await initCloud();
    const result = await apiRequest("/cases");
    if (Array.isArray(result.data) && result.data.length) {
      state.cases = result.data.map(normalizeCase);
      persist();
      if (shouldRender && (currentView === "cases" || currentView === "homepage")) renderView();
    }
  } catch (error) {
    console.warn("Cases unavailable:", error);
  }
}

async function writeCases() {
  const payload = state.cases.map(item => ({
    id: item.id,
    title: item.title,
    category: item.category,
    productId: item.productId || item.product,
    status: item.status,
    images: (item.images || []).map(toMiniProgramAssetPath)
  }));
  const result = await apiRequest("/cases", { method: "PUT", body: JSON.stringify(payload) });
  state.cases = (result.data || []).map(normalizeCase);
  persist();
}

async function writeHomepage() {
  const payload = {
    posters: state.homepage.posters.map(item => ({ ...item, url: toMiniProgramAssetPath(item.url) })),
    hotProductIds: state.homepage.hotProductIds.slice(0, 6),
    cases: state.homepage.cases.slice(0, 5).map(item => ({ ...item, image: toMiniProgramAssetPath(item.image), images: (item.images || [item.image]).filter(Boolean).map(toMiniProgramAssetPath) }))
  };
  const result = await apiRequest("/homepage", { method: "PUT", body: JSON.stringify(payload) });
  state.homepage = {
    ...result.data,
    posters: (result.data.posters || []).map(item => ({ ...item, url: toAdminAssetPath(item.url) })),
    cases: (result.data.cases || []).map(item => ({ ...item, image: toAdminAssetPath(item.image), images: (item.images || [item.image]).filter(Boolean).map(toAdminAssetPath) }))
  };
  persist();
}

async function uploadProductMedia(values) {
  const groups = [
    ["gallery", "顶部轮播图"],
    ["detailImages", "详情页图片"],
    ["colorCardImages", "电子色卡图"]
  ];
  for (const [group, groupLabel] of groups) {
    const uploaded = [];
    for (let index = 0; index < values[group].length; index += 1) {
      const source = values[group][index];
      const file = editorMediaFiles.get(source);
      if (!file) {
        if (source.startsWith("blob:")) {
          throw new Error("旧的本地临时图片已失效，请删除后重新选择图片");
        }
        uploaded.push(toMiniProgramAssetPath(source));
        continue;
      }
      $("#saveState").textContent = `正在上传图片 ${index + 1} / ${values[group].length}`;
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      try {
        const formData = new FormData();
        formData.append("file", file, safeName);
        formData.append("productCode", values.code);
        formData.append("group", group);
        const result = await apiRequest("/uploads", { method: "POST", body: formData });
        uploaded.push(result.url);
      } catch (error) {
        throw new Error(`${groupLabel}第 ${index + 1} 张上传失败：${cloudErrorMessage(error)}`);
      }
    }
    values[group] = uploaded;
  }
  values.image = values.gallery[0] || "";
  return values;
}

function cloudProductPayload(product) {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    series: "",
    description: product.description,
    quoteLabel: product.quoteLabel,
    featureTags: product.featureTags || [],
    categoryIds: product.categoryIds || [],
    composition: product.composition,
    weight: product.weight,
    width: product.width,
    colorCount: product.colorCount,
    colorRange: product.colorRange,
    status: product.status,
    gallery: product.gallery || [],
    detailImages: product.detailImages || [],
    colorCardImages: product.colorCardImages || [],
    uses: product.uses || [],
    customSpecs: product.customSpecs || [],
    image: product.image || "",
    updatedAt: new Date().toISOString()
  };
}

async function writeCloudProduct(product) {
  const payload = cloudProductPayload(product);
  return apiRequest(`/products/${encodeURIComponent(product.id)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    showToast("文字数据已保留在当前页面；本地图片较大，刷新后可能需要重新选择");
  }
  updateCounts();
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function allCategoryTags() {
  return state.categories.flatMap(group => group.tags.map(tag => ({ ...tag, groupId: group.id, groupName: group.name })));
}

function categoryNames(ids = []) {
  const selected = new Set(ids);
  return allCategoryTags().filter(tag => selected.has(tag.id)).map(tag => tag.name);
}

function categoryUsageCount(tagId) {
  return state.products.filter(product => (product.categoryIds || []).includes(tagId)).length;
}

function categorySlug(name = "") {
  const ascii = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return ascii || `item-${Date.now().toString(36)}`;
}

function renderCategoryField() {
  const tagMap = new Map(allCategoryTags().map(tag => [tag.id, tag]));
  $("#selectedCategoryPills").innerHTML = selectedCategoryIds.map(id => {
    const tag = tagMap.get(id);
    if (!tag) return "";
    return `<button type="button" class="selected-tag-pill category-selected-pill" data-remove-category="${tag.id}" aria-label="删除分类 ${escapeHtml(tag.name)}"><span>${escapeHtml(tag.name)}</span><i aria-hidden="true">×</i></button>`;
  }).join("");
  $("#categoryCount").textContent = selectedCategoryIds.length;
  $("#categoryPlaceholder").hidden = selectedCategoryIds.length > 0;
}

function renderCategoryDrawer() {
  const groupList = $("#categoryGroupList");
  const tagPanel = $("#categoryTagList");
  const back = $("#backCategoryGroups");
  $("#categoryDrawerTitle").textContent = "选择产品分类";
  $("#categoryDrawerCopy").textContent = "选择一级分类，再选择属于产品的二级标签。";
  back.hidden = true;
  groupList.hidden = false;
  groupList.innerHTML = state.categories.map(group => {
    const ids = new Set(group.tags.map(tag => tag.id));
    const count = categoryDrawerSelectedIds.filter(id => ids.has(id)).length;
    const active = group.id === activeCategoryGroupId;
    return `<button type="button" class="category-group-button ${active ? "is-active" : ""} ${count ? "has-selection" : ""}" data-category-group="${group.id}"><strong>${escapeHtml(group.name)}</strong><em>${count ? `已选 ${count}` : ""}</em></button>`;
  }).join("");
  if (!activeCategoryGroupId) {
    tagPanel.hidden = true;
    return;
  }
  const group = state.categories.find(item => item.id === activeCategoryGroupId);
  if (!group) { activeCategoryGroupId = null; return renderCategoryDrawer(); }
  tagPanel.hidden = false;
  tagPanel.innerHTML = `<div class="category-tag-context"><strong>${escapeHtml(group.name)}</strong><span>${group.selectionMode === "single" ? "该分类仅可选择一项" : "可多选，再次点击可取消"}</span></div><div class="tag-cloud">${group.tags.map(tag => {
    const selected = categoryDrawerSelectedIds.includes(tag.id);
    return `<button type="button" class="tag-chip ${selected ? "is-selected" : ""}" data-category-tag="${tag.id}" data-parent-id="${group.id}">${escapeHtml(tag.name)}${selected ? " √" : ""}</button>`;
  }).join("")}</div>`;
}

function openCategorySelector() {
  categorySelectorOriginalIds = [...selectedCategoryIds];
  categoryDrawerSelectedIds = [...selectedCategoryIds];
  activeCategoryGroupId = null;
  renderCategoryDrawer();
  const drawer = $("#categoryDrawer");
  const shell = $("#categoryInputShell");
  drawer.style.top = `${shell.offsetTop + shell.offsetHeight + 8}px`;
  drawer.hidden = false;
  drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function closeCategorySelector(restore = true) {
  if (restore) selectedCategoryIds = [...categorySelectorOriginalIds];
  $("#categoryDrawer").hidden = true;
  activeCategoryGroupId = null;
  renderCategoryField();
  updateProductPreview();
}

function openCategoryManage(mode, parentId = "", editId = "") {
  categoryManageContext = { snapshot: structuredClone(state.categories), mode, parentId, editId };
  const form = $("#categoryManageForm");
  form.reset();
  form.elements.mode.value = mode;
  form.elements.editId.value = editId;
  form.elements.parentId.innerHTML = state.categories.map(group => `<option value="${group.id}">${escapeHtml(group.name)}</option>`).join("");
  form.elements.parentId.value = parentId || state.categories[0]?.id || "";
  $("#categoryParentField").hidden = mode === "group";
  $("#categoryModeField").hidden = mode !== "group";
  $("#categoryManageTitle").textContent = `${editId ? "编辑" : "新增"}${mode === "group" ? "一级分类" : "二级分类"}`;
  $("#categoryNameLabel").textContent = mode === "group" ? "一级分类名称" : "二级分类名称";
  if (editId && mode === "group") {
    const group = state.categories.find(item => item.id === editId);
    form.elements.name.value = group?.name || "";
    form.elements.selectionMode.value = group?.selectionMode || "multiple";
  } else if (editId) {
    const group = state.categories.find(item => item.id === parentId);
    form.elements.name.value = group?.tags.find(tag => tag.id === editId)?.name || "";
  }
  $("#categoryManageDialog").showModal();
}

async function deleteCategoryGroup(groupId) {
  const group = state.categories.find(item => item.id === groupId);
  const used = group.tags.reduce((sum, tag) => sum + categoryUsageCount(tag.id), 0);
  if (used) return showToast(`“${group.name}”仍关联 ${used} 次产品分类，不能删除`);
  if (!window.confirm(`确认删除一级分类“${group.name}”及其全部二级分类？`)) return;
  const snapshot = structuredClone(state.categories);
  state.categories = state.categories.filter(item => item.id !== groupId);
  try { await writeCategories(); renderView(); showToast("一级分类已删除"); }
  catch (error) { state.categories = snapshot; showToast(`分类删除失败：${cloudErrorMessage(error)}`); }
}

async function deleteCategoryTag(groupId, tagId) {
  const group = state.categories.find(item => item.id === groupId);
  const tag = group.tags.find(item => item.id === tagId);
  const used = categoryUsageCount(tagId);
  if (used) return showToast(`“${tag.name}”仍被 ${used} 款产品使用，不能删除`);
  if (!window.confirm(`确认删除二级分类“${tag.name}”？`)) return;
  const snapshot = structuredClone(state.categories);
  group.tags = group.tags.filter(item => item.id !== tagId);
  try { await writeCategories(); renderView(); showToast("二级分类已删除"); }
  catch (error) { state.categories = snapshot; showToast(`分类删除失败：${cloudErrorMessage(error)}`); }
}

function cloudErrorMessage(error) {
  if (!error) return "未知服务器错误";
  if (typeof error === "string") return error;
  const message = error.message || error.errMsg || error.error || error.code || "未知服务器错误";
  if (/cors|network|failed to fetch|network_error/i.test(message)) {
    return `${message}（请检查服务器是否在线以及当前网络连接）`;
  }
  if (/permission|denied|unauthorized|forbidden|403/i.test(message)) {
    return `${message}（请重新输入后台管理账号和密码）`;
  }
  return message;
}

function setSaveError(message = "") {
  const errorBox = $("#saveError");
  if (!errorBox) return;
  errorBox.textContent = message;
  errorBox.hidden = !message;
}

function showToast(message) {
  const toast = $("#toast");
  const openDialog = document.querySelector("dialog[open]");
  const host = openDialog || document.body;
  if (toast.parentElement !== host) host.appendChild(toast);
  const isError = /失败|错误|未写入|失效|请先|已存在/.test(message);
  toast.textContent = message;
  toast.classList.toggle("is-error", isError);
  toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("is-visible"), isError ? 6500 : 2800);
}

function statusClass(status) {
  if (["待确认"].includes(status)) return "pending";
  if (["草稿", "draft"].includes(status)) return "draft";
  if (["已下架", "offline"].includes(status)) return "offline";
  if (["上架", "已发布", "live", "已完成"].includes(status)) return "live";
  if (["已发货"].includes(status)) return "shipped";
  return "";
}

function productStatusText(status) {
  return ({ live: "已上架", offline: "已下架", draft: "草稿" })[status] || "草稿";
}

function updateCounts() {
  $("#navProductCount").textContent = state.products.length;
  $("#navCategoryCount").textContent = state.categories.length;
  $("#navRequestCount").textContent = state.requests.filter(item => item.status !== "已完成").length;
  $("#navCaseCount").textContent = state.cases.length;
  const customerCount = $("#navCustomerCount");
  if (customerCount) customerCount.textContent = uniqueCustomers().length;
}

function setView(view) {
  currentView = view;
  const [crumb, title] = viewMeta[view];
  $("#currentCrumb").textContent = crumb;
  $("#viewTitle").textContent = title;
  $$(".nav-item").forEach(button => button.classList.toggle("is-active", button.dataset.view === view));
  renderView();
}

function renderView() {
  const view = $("#appView");
  const renderers = { dashboard: renderDashboard, products: renderProducts, series: renderSeries, cases: renderCases, requests: renderRequests, customers: renderCustomers, homepage: renderHomepage };
  view.innerHTML = renderers[currentView]();
}

function requestCount(status) {
  return state.requests.filter(item => item.status === status).length;
}

function renderDashboard() {
  const waiting = requestCount("待确认");
  const tasks = state.requests.filter(item => item.status !== "已完成").slice(0, 4);
  return `
    <section class="desk-intro">
      <div>
        <p class="eyebrow">THURSDAY · 16 JUL</p>
        <h2>${waiting ? `有 ${waiting} 份新申请，先确认寄送信息。` : "新申请已经处理完，可以整理今日上新。"}</h2>
        <p>申请量不大，按状态依次推进即可；每次变更都会保留时间。</p>
      </div>
      <div class="queue-strip" aria-label="样卡申请状态概览">
        ${["待确认", "待寄送", "已发货", "已完成"].map(status => `<div class="queue-step"><b>${requestCount(status)}</b><span>${status}</span></div>`).join("")}
      </div>
    </section>

    <div class="section-caption"><div><h2>运营概览</h2><p>用于判断今天的处理优先级，不代表经营分析。</p></div></div>
    <section class="stat-row">
      <article class="panel stat-card"><small>已上架面料</small><strong>${state.products.filter(item => item.status === "live").length}</strong><em>${state.products.filter(item => item.status === "draft").length} 份草稿</em></article>
      <article class="panel stat-card"><small>今日新申请</small><strong>${state.requests.filter(item => item.createdAt.startsWith("今天")).length}</strong><em>${waiting} 份待确认</em></article>
      <article class="panel stat-card"><small>客户档案</small><strong>${uniqueCustomers().length}</strong><em>由申请自动归集</em></article>
      <article class="panel stat-card"><small>本月案例</small><strong>${state.cases.length}</strong><em>${state.cases.filter(item => item.status === "草稿").length} 篇待发布</em></article>
    </section>

    <div class="section-caption"><div><h2>需要继续处理</h2><p>按进入队列的时间排列。</p></div><button class="text-button" data-go="requests">查看全部申请 →</button></div>
    <section class="dashboard-grid">
      <div class="panel task-list">
        ${tasks.map(task => `
          <div class="task-row">
            <span class="task-id">${task.id}</span>
            <div class="task-main"><strong>${escapeHtml(task.customer)} · ${escapeHtml(task.company)}</strong><span>${escapeHtml(task.items)}</span></div>
            <time class="task-time">${task.createdAt}</time>
            <span class="status ${statusClass(task.status)}">${task.status}</span>
          </div>`).join("") || `<div class="empty-row">没有待处理申请</div>`}
      </div>
      <aside class="panel quick-panel">
        <h3>快速开始</h3><p>把高频动作留在手边。</p>
        <button class="quick-action" data-action="new-product"><span>录入一款新面料</span><small>＋</small></button>
        <button class="quick-action" data-go="homepage"><span>更换首页主推</span><small>→</small></button>
        <button class="quick-action" data-go="cases"><span>发布一篇成衣案例</span><small>→</small></button>
        <button class="quick-action" data-go="requests"><span>处理样卡申请</span><small>${waiting} 待确认</small></button>
      </aside>
    </section>`;
}

function renderProducts() {
  const query = $("#globalSearch").value.trim().toLowerCase();
  const products = state.products.filter(product => {
    const matchesFilter = productFilter === "all" || product.status === productFilter;
    const matchesQuery = !query || `${product.code} ${product.name}`.toLowerCase().includes(query);
    return matchesFilter && matchesQuery;
  });
  return `
    <div class="view-toolbar">
      <div class="filters">
        <button class="filter-button ${productFilter === "all" ? "is-active" : ""}" data-product-filter="all">全部 ${state.products.length}</button>
        <button class="filter-button ${productFilter === "live" ? "is-active" : ""}" data-product-filter="live">已上架 ${state.products.filter(p => p.status === "live").length}</button>
        <button class="filter-button ${productFilter === "draft" ? "is-active" : ""}" data-product-filter="draft">草稿 ${state.products.filter(p => p.status === "draft").length}</button>
        <button class="filter-button ${productFilter === "offline" ? "is-active" : ""}" data-product-filter="offline">已下架 ${state.products.filter(p => p.status === "offline").length}</button>
      </div>
      <span class="toolbar-note">首页热销：${state.homepage.hotProductIds.length} 款</span>
    </div>
    <div class="panel data-panel">
      <table class="data-table">
        <thead><tr><th style="width:31%">面料</th><th style="width:12%">货号</th><th style="width:16%">分类</th><th style="width:12%">规格</th><th style="width:10%">状态</th><th style="width:12%">更新</th><th>操作</th></tr></thead>
        <tbody>
          ${products.map(product => `
            <tr>
              <td><div class="fabric-cell"><img src="${product.image}" alt="" /><span><strong>${escapeHtml(product.name)}</strong><small>${product.colorCount ? `${product.colorCount} 色可选 · ` : ""}${escapeHtml((product.featureTags || []).join(" · "))}</small></span></div></td>
              <td><span class="code">${escapeHtml(product.code)}</span></td>
              <td><small class="muted">${escapeHtml(categoryNames(product.categoryIds).slice(0, 3).join(" · ") || "暂未分类")}</small></td>
              <td>${escapeHtml(product.weight)}<br><small class="muted">${escapeHtml(product.width)}</small></td>
              <td><span class="status ${statusClass(product.status)}">${productStatusText(product.status)}</span></td>
              <td><small class="muted">${product.updatedAt}</small></td>
              <td><div class="row-actions"><button class="icon-button" data-edit-product="${product.id}">编辑</button><button class="icon-button" data-copy-product="${product.id}" title="复制面料">复制</button><button class="icon-button" data-delete-product="${product.id}">删除</button></div></td>
            </tr>`).join("") || `<tr><td colspan="7" class="empty-row">没有符合条件的面料</td></tr>`}
        </tbody>
      </table>
    </div>`;
}

function renderSeries() {
  return `
    <div class="view-toolbar"><span class="toolbar-note">一级分类组织筛选维度，二级分类才会关联产品。</span><button class="button button-primary button-small" data-add-category-group>＋ 新增一级分类</button></div>
    <section class="category-admin-grid">
      ${state.categories.map((group, groupIndex) => `
        <article class="panel category-admin-card">
          <header><div><span class="category-order">${String(groupIndex + 1).padStart(2, "0")}</span><h3>${escapeHtml(group.name)}</h3><small>${group.selectionMode === "single" ? "单选" : "多选"} · ${group.tags.length} 个标签</small></div><div class="row-actions"><button class="icon-button" data-edit-category-group="${group.id}">编辑</button><button class="icon-button" data-delete-category-group="${group.id}">删除</button></div></header>
          <div class="category-admin-tags">${group.tags.map(tag => `<span class="admin-category-pill">${escapeHtml(tag.name)}<small>${categoryUsageCount(tag.id)}</small><button data-edit-category-tag="${tag.id}" data-parent-id="${group.id}" aria-label="编辑 ${escapeHtml(tag.name)}">✎</button><button data-delete-category-tag="${tag.id}" data-parent-id="${group.id}" aria-label="删除 ${escapeHtml(tag.name)}">×</button></span>`).join("")}</div>
          <button class="category-add-tag" data-add-category-tag="${group.id}">＋ 添加二级分类</button>
        </article>`).join("")}
    </section>`;
}

function renderCases() {
  return `
    <div class="view-toolbar"><span class="toolbar-note">每个案例由两张图片和一张自动读取面料信息的小卡组成。</span><button class="button button-secondary button-small" data-new-case>＋ 新增案例</button></div>
    <section class="case-showcase-grid">
      ${state.cases.map(item => {
        const product = state.products.find(product => product.id === (item.productId || item.product));
        const images = item.images || [item.image, item.image];
        return `<article class="panel case-showcase-card">
          <div class="case-mosaic">
            <img class="case-mosaic-primary" src="${escapeHtml(images[0] || "")}" alt="${escapeHtml(item.title)} 主图">
            <div class="case-info-card"><em>${escapeHtml(product?.code || item.productId || item.product || "LOOK")}</em><p>${escapeHtml(product?.composition || "关联面料后自动显示成分")}</p></div>
            <img class="case-mosaic-secondary" src="${escapeHtml(images[1] || images[0] || "")}" alt="${escapeHtml(item.title)} 第二张图">
          </div>
          <div class="case-showcase-copy"><div><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.category)} · 关联面料 ${escapeHtml(product?.code || item.productId || item.product)}</p></div><footer><span class="status ${statusClass(item.status)}">${item.status}</span><button class="icon-button" data-edit-case="${item.id}">编辑</button></footer></div>
        </article>`;
      }).join("")}
      <button class="panel case-new-card" data-new-case><i>＋</i><strong>新增成衣案例</strong><span>上传两张图片并关联面料</span></button>
    </section>
    ${caseEditorDraft ? renderCaseEditor() : ""}`;
}

function openCaseEditor(caseId = "") {
  const existing = state.cases.find(item => item.id === caseId);
  caseEditorDraft = existing
    ? structuredClone(existing)
    : { id: `case-${Date.now().toString(36)}`, title: "", category: "成衣案例", productId: state.products.find(item => item.status === "live")?.id || "", status: "草稿", images: [] };
  caseEditorDraft.productId = caseEditorDraft.productId || caseEditorDraft.product || "";
  caseEditorDraft.images = [...(caseEditorDraft.images || [caseEditorDraft.image]).filter(Boolean)].slice(0, 2);
  renderView();
}

function renderCaseEditor() {
  const liveProducts = state.products.filter(item => item.status === "live");
  return `<div class="case-editor-backdrop" data-close-case-editor><form id="caseEditorForm" class="case-editor" aria-label="编辑成衣案例">
    <header><div><p class="eyebrow">GARMENT CASE</p><h2>${state.cases.some(item => item.id === caseEditorDraft.id) ? "编辑案例" : "新增案例"}</h2><span>使用两张图片和关联面料信息组成案例卡片。</span></div><div><button class="button button-ghost" type="button" data-close-case-editor>取消</button><button class="button button-primary" type="submit">保存案例</button></div></header>
    <div class="case-editor-layout">
      <div class="case-editor-fields">
        <section><h3>案例信息</h3><label><span>案例标题</span><input required maxlength="40" value="${escapeHtml(caseEditorDraft.title)}" data-case-field="title" placeholder="例如：橄榄灰通勤西装"></label><label><span>案例分类</span><input required maxlength="30" value="${escapeHtml(caseEditorDraft.category)}" data-case-field="category" placeholder="例如：都市西装"></label><label><span>关联面料</span><select required data-case-field="productId">${liveProducts.map(product => `<option value="${product.id}" ${caseEditorDraft.productId === product.id ? "selected" : ""}>${escapeHtml(product.code)} · ${escapeHtml(product.name)}</option>`).join("")}</select></label><label><span>发布状态</span><select data-case-field="status"><option value="草稿" ${caseEditorDraft.status !== "已发布" ? "selected" : ""}>草稿</option><option value="已发布" ${caseEditorDraft.status === "已发布" ? "selected" : ""}>已发布</option></select></label></section>
        <section><div class="case-image-head"><div><h3>案例图片</h3><p>固定上传两张，建议竖版图或成衣版面图。</p></div><b>${caseEditorDraft.images.length} / 2</b></div><input id="caseImageInput" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden><div class="case-image-list">${caseEditorDraft.images.map((url, index) => `<article><img src="${escapeHtml(url)}" alt="案例图片 ${index + 1}"><span>${index === 0 ? "主图" : "第二张图"}</span><button type="button" data-remove-case-image="${index}">×</button></article>`).join("")}${caseEditorDraft.images.length < 2 ? `<button type="button" class="case-image-add" data-add-case-images><i>＋</i><span>选择图片</span></button>` : ""}</div></section>
        ${state.cases.some(item => item.id === caseEditorDraft.id) ? `<button class="button button-danger case-delete-button" type="button" data-delete-case="${caseEditorDraft.id}">删除这个案例</button>` : ""}
      </div>
      <aside class="case-editor-preview"><div><span>案例卡片预览</span><small>随编辑实时更新</small></div><div id="caseEditorPreview">${caseEditorPreviewHtml()}</div></aside>
    </div>
  </form></div>`;
}

function caseEditorPreviewHtml() {
  const product = state.products.find(item => item.id === caseEditorDraft?.productId);
  const images = caseEditorDraft?.images || [];
  return `<div class="case-preview-card"><div class="case-mosaic"><div class="case-preview-placeholder ${images[0] ? "has-image" : ""}" ${images[0] ? `style="background-image:url('${escapeHtml(images[0])}')"` : ""}>${images[0] ? "" : "主图"}</div><div class="case-info-card"><em>${escapeHtml(product?.code || "货号")}</em><p>${escapeHtml(product?.composition || "关联面料后显示成分信息")}</p></div><div class="case-preview-placeholder ${images[1] ? "has-image" : ""}" ${images[1] ? `style="background-image:url('${escapeHtml(images[1])}')"` : ""}>${images[1] ? "" : "第二张图"}</div></div><h3>${escapeHtml(caseEditorDraft?.title || "案例标题")}</h3><p>${escapeHtml(caseEditorDraft?.category || "成衣案例")} · ${escapeHtml(product?.code || "待关联面料")}</p></div>`;
}

function refreshCaseEditorPreview() {
  const preview = $("#caseEditorPreview");
  if (preview && caseEditorDraft) preview.innerHTML = caseEditorPreviewHtml();
}

async function saveCaseEditor() {
  if (!caseEditorDraft?.title.trim()) return showToast("请填写案例标题");
  if (!caseEditorDraft.productId) return showToast("请选择关联面料");
  if (caseEditorDraft.images.length !== 2) return showToast("每个案例必须上传两张图片");
  const snapshot = structuredClone(state.cases);
  const homepageSnapshot = structuredClone(state.homepage.cases);
  const saved = { ...caseEditorDraft, title: caseEditorDraft.title.trim(), category: caseEditorDraft.category.trim() || "成衣案例", product: caseEditorDraft.productId, image: caseEditorDraft.images[0] };
  const exists = state.cases.some(item => item.id === saved.id);
  state.cases = exists ? state.cases.map(item => item.id === saved.id ? saved : item) : [saved, ...state.cases];
  state.homepage.cases = state.homepage.cases.map(item => item.id === saved.id ? { id: saved.id, title: saved.title, category: saved.category, productId: saved.productId, image: saved.image, images: saved.images } : item);
  try {
    await writeCases();
    if (homepageSnapshot.some(item => item.id === saved.id)) await writeHomepage();
    caseEditorDraft = null;
    renderView();
    showToast(exists ? "案例已更新" : "案例已创建");
  } catch (error) {
    state.cases = snapshot;
    state.homepage.cases = homepageSnapshot;
    showToast(`案例保存失败：${cloudErrorMessage(error)}`);
  }
}

async function deleteCase(caseId) {
  const item = state.cases.find(candidate => candidate.id === caseId);
  if (!item || !window.confirm(`确认删除案例“${item.title}”？`)) return;
  const snapshot = structuredClone(state.cases);
  const homepageSnapshot = structuredClone(state.homepage.cases);
  state.cases = state.cases.filter(candidate => candidate.id !== caseId);
  state.homepage.cases = state.homepage.cases.filter(candidate => candidate.id !== caseId);
  try {
    await writeCases();
    if (homepageSnapshot.some(candidate => candidate.id === caseId)) await writeHomepage();
    caseEditorDraft = null;
    renderView();
    showToast("案例已删除");
  } catch (error) {
    state.cases = snapshot;
    state.homepage.cases = homepageSnapshot;
    showToast(`案例删除失败：${cloudErrorMessage(error)}`);
  }
}

async function deleteProduct(productId) {
  const product = state.products.find(item => item.id === productId);
  if (!product || !window.confirm(`确认永久删除面料“${product.code || product.name}”？此操作不可恢复。`)) return;
  try {
    await initCloud();
    await apiRequest(`/products/${encodeURIComponent(productId)}`, { method: "DELETE" });
    state.products = state.products.filter(item => item.id !== productId);
    state.homepage.hotProductIds = state.homepage.hotProductIds.filter(id => id !== productId);
    state.homepage.posters = state.homepage.posters.filter(item => item.productId !== productId);
    await writeHomepage();
    persist();
    updateCounts();
    renderView();
    showToast(`面料 ${product.code || product.name} 已删除`);
  } catch (error) {
    showToast(`产品删除失败：${cloudErrorMessage(error)}`);
  }
}

function nextRequestStatus(status) {
  const flow = ["待确认", "待寄送", "已发货", "已完成"];
  return flow[Math.min(flow.indexOf(status) + 1, flow.length - 1)];
}

function requestAddressText(request) {
  const address = request.address || {};
  return [address.province, address.city, address.district, address.detail].filter(Boolean).join("") || "未填写完整地址";
}

function renderRequestDetail(request) {
  if (!request) return "";
  const requestItems = Array.isArray(request.requestItems) ? request.requestItems : [];
  const statuses = ["待确认", "待寄送", "已发货", "已完成", "已取消"];
  const flow = ["待确认", "待寄送", "已发货", "已完成"];
  const currentStep = flow.indexOf(request.status);
  const updatedAt = request.updatedAt ? new Date(request.updatedAt).toLocaleString("zh-CN") : request.createdAt;
  return `
    <div class="request-detail-backdrop" data-request-detail-backdrop>
      <aside class="request-detail-panel" role="dialog" aria-modal="true" aria-labelledby="requestDetailTitle">
        <header class="request-detail-head">
          <div><p class="eyebrow">SAMPLE REQUEST</p><h2 id="requestDetailTitle">申请单详情</h2><span class="code">${escapeHtml(request.id)}</span></div>
          <button type="button" data-close-request-detail aria-label="关闭">×</button>
        </header>

        <div class="request-detail-scroll">
          <section class="request-status-section">
            <div class="request-section-title"><span>处理进度</span><span class="status ${statusClass(request.status)}">${escapeHtml(request.status)}</span></div>
            <div class="request-timeline">
              ${flow.map((status, index) => `<div class="request-timeline-step ${index <= currentStep ? "is-done" : ""} ${index === currentStep ? "is-current" : ""}"><i></i><span>${status}</span></div>`).join("")}
            </div>
          </section>

          <section class="request-info-grid">
            <div><small>收件人</small><strong>${escapeHtml(request.customer)}</strong></div>
            <div><small>联系电话</small><strong>${escapeHtml(request.phone || "未填写")}</strong></div>
            <div class="request-address"><small>完整收货地址</small><strong>${escapeHtml(requestAddressText(request))}</strong></div>
          </section>

          <section class="request-detail-section">
            <div class="request-section-title"><span>申请面料</span><small>${requestItems.length || 0} 款</small></div>
            <div class="request-item-list">
              ${requestItems.length ? requestItems.map(item => {
                const image = toAdminAssetPath(item.image || "");
                return `<article class="request-item-card">${image ? `<img src="${escapeHtml(image)}" alt="">` : `<span class="request-item-placeholder">FABRIC</span>`}<div><small>${escapeHtml(item.code || item.id || "")}</small><strong>${escapeHtml(item.name || item.code || item.id || "未命名面料")}</strong><em>申请数量：${Number(item.quantity || 1)} 份</em></div></article>`;
              }).join("") : `<p class="request-empty-copy">该申请单没有面料明细。</p>`}
            </div>
          </section>

          <section class="request-detail-section request-meta-grid">
            <div><small>申请时间</small><strong>${escapeHtml(request.createdAt || "—")}</strong></div>
            <div><small>最近更新</small><strong>${escapeHtml(updatedAt || "—")}</strong></div>
            <div><small>邮费说明</small><strong>${escapeHtml(request.shippingFee || "待确认")}</strong></div>
            <div><small>用户备注</small><strong>${escapeHtml(request.remark || "无备注")}</strong></div>
          </section>

          <section class="request-detail-section request-processing">
            <div class="request-section-title"><span>运营处理</span><small>保存后同步到服务器</small></div>
            <label><span>当前状态</span><select id="requestDetailStatus">${statuses.map(status => `<option value="${status}" ${status === request.status ? "selected" : ""}>${status}</option>`).join("")}</select></label>
            <div class="request-field-row">
              <label><span>物流公司</span><input id="requestTrackingCompany" value="${escapeHtml(request.trackingCompany || "")}" placeholder="例如：顺丰速运"></label>
              <label><span>物流单号</span><input id="requestTrackingNumber" value="${escapeHtml(request.trackingNumber || "")}" placeholder="填写后便于查询"></label>
            </div>
            <label><span>内部备注</span><textarea id="requestInternalNote" rows="3" placeholder="仅后台可见，例如客户沟通结果">${escapeHtml(request.internalNote || "")}</textarea></label>
          </section>
        </div>

        <footer class="request-detail-foot">
          <button class="button button-ghost" type="button" data-close-request-detail>关闭</button>
          <button class="button button-primary" type="button" data-save-request-detail="${escapeHtml(request.id)}">保存处理结果</button>
        </footer>
      </aside>
    </div>`;
}

function renderRequests() {
  const activeRequest = state.requests.find(item => item.id === requestDetailId);
  const requestFilters = [
    { value: "all", label: "全部" },
    { value: "待确认", label: "待确认" },
    { value: "待寄送", label: "待寄送" },
    { value: "已发货", label: "已发货" },
    { value: "已完成", label: "已完成" }
  ];
  const visibleRequests = requestFilter === "all"
    ? state.requests
    : state.requests.filter(item => item.status === requestFilter);
  return `
    <div class="view-toolbar"><div class="filters">${requestFilters.map(item => `<button class="filter-button ${requestFilter === item.value ? "is-active" : ""}" data-request-filter="${item.value}">${item.label} ${item.value === "all" ? state.requests.length : requestCount(item.value)}</button>`).join("")}</div><span class="toolbar-note">打开详情可查看地址、面料明细并处理申请</span></div>
    <div class="panel data-panel">
      <table class="data-table"><thead><tr><th style="width:15%">申请单</th><th style="width:21%">客户</th><th style="width:22%">申请内容</th><th style="width:10%">地区</th><th style="width:11%">状态</th><th style="width:11%">申请时间</th><th>操作</th></tr></thead>
      <tbody>${visibleRequests.length ? visibleRequests.map(item => `
        <tr><td><span class="code">${item.id}</span></td><td><strong>${escapeHtml(item.customer)}</strong><br><small class="muted">${escapeHtml(item.company)} · ${escapeHtml(item.phone)}</small></td><td>${escapeHtml(item.items)}</td><td>${escapeHtml(item.city)}</td><td><span class="status ${statusClass(item.status)}">${escapeHtml(item.status)}</span></td><td><small class="muted">${escapeHtml(item.createdAt)}</small></td><td><div class="request-row-actions"><button class="icon-button" data-request-detail="${escapeHtml(item.id)}">详情</button>${!["已完成", "已取消"].includes(item.status) ? `<button class="button button-secondary button-small" data-next-request="${escapeHtml(item.id)}">推进</button>` : ""}</div></td></tr>`).join("") : `<tr><td colspan="7"><div class="table-empty"><strong>暂无${requestFilter === "all" ? "申请记录" : `“${requestFilter}”申请`}</strong><span>切换其他状态可继续查看。</span></div></td></tr>`}</tbody></table>
    </div>
    ${renderRequestDetail(activeRequest)}`;
}

async function saveRequestDetail(requestId) {
  const status = $("#requestDetailStatus")?.value || "待确认";
  const payload = {
    status,
    trackingCompany: $("#requestTrackingCompany")?.value.trim() || "",
    trackingNumber: $("#requestTrackingNumber")?.value.trim() || "",
    internalNote: $("#requestInternalNote")?.value.trim() || ""
  };
  try {
    await apiRequest(`/requests/${encodeURIComponent(requestId)}`, { method: "PATCH", body: JSON.stringify(payload) });
    await loadOperationalData();
    showToast(`${requestId} 已保存`);
  } catch (error) {
    showToast(error.message || "申请单保存失败");
  }
}

function uniqueCustomers() {
  if (Array.isArray(state.customers) && state.customers.length) {
    return state.customers.map(customer => ({
      ...customer,
      name: customer.name || "未命名客户",
      company: customer.company || "",
      phone: customer.phone || "",
      city: customer.city || "",
      address: customer.address || "",
      notes: customer.notes || "",
      count: customer.requestCount || 0,
      latest: customer.updatedAt ? new Date(customer.updatedAt).toLocaleString("zh-CN") : "",
      id: customer.id
    }));
  }
  const map = new Map();
  state.requests.forEach(request => {
    if (!map.has(request.phone)) map.set(request.phone, { name: request.customer, company: request.company, phone: request.phone, city: request.city, count: 0, latest: request.createdAt });
    map.get(request.phone).count += 1;
  });
  return [...map.values()];
}

function customerRequestHistory(customer) {
  return state.requests.filter(request =>
    (customer.id && request.customerId === customer.id) ||
    (customer.phone && request.phone === customer.phone)
  );
}

function renderCustomerDetail(customer) {
  if (!customer) return "";
  const requests = customerRequestHistory(customer);
  const totalItems = requests.reduce((sum, request) => sum + (request.requestItems || []).reduce((itemSum, item) => itemSum + Number(item.quantity || 1), 0), 0);
  const latestRequest = requests[0];
  const createdAt = customer.createdAt ? new Date(customer.createdAt).toLocaleString("zh-CN") : "暂无记录";
  const updatedAt = customer.updatedAt ? new Date(customer.updatedAt).toLocaleString("zh-CN") : "暂无记录";
  const history = requests.length ? requests.map(request => `
    <article class="customer-history-card">
      <div class="customer-history-head"><span class="code">${escapeHtml(request.id)}</span><span class="status ${statusClass(request.status)}">${escapeHtml(request.status)}</span></div>
      <strong>${escapeHtml(request.items || "未记录面料明细")}</strong>
      <div><span>${escapeHtml(request.createdAt || "")}</span><span>${escapeHtml(requestAddressText(request) || request.city || "地址未填写")}</span></div>
    </article>`).join("") : `<div class="customer-empty-history"><b>尚无申请记录</b><span>客户提交第一张样卡申请后，记录会自动归集到这里。</span></div>`;
  return `
    <div class="request-detail-backdrop customer-detail-backdrop" data-customer-detail-backdrop>
      <aside class="request-detail-panel customer-detail-panel" role="dialog" aria-modal="true" aria-label="客户详情">
        <header class="request-detail-head customer-detail-head">
          <div><p class="eyebrow">CUSTOMER DOSSIER</p><h2>客户档案</h2><span class="code">${escapeHtml(customer.id || customer.phone || "")}</span></div>
          <button type="button" data-close-customer-detail aria-label="关闭">×</button>
        </header>
        <div class="request-detail-scroll customer-detail-scroll">
          <section class="customer-identity-card">
            <span class="customer-detail-avatar">${escapeHtml((customer.name || "?").slice(0, 1))}</span>
            <div><small>联系人</small><h3>${escapeHtml(customer.name)}</h3><p>${escapeHtml(customer.company || "公司信息未填写")}</p></div>
            <span class="customer-profile-state">${customer.phone && customer.address ? "资料完整" : "待完善"}</span>
          </section>

          <section class="customer-stat-strip">
            <div><strong>${requests.length}</strong><span>申请次数</span></div>
            <div><strong>${totalItems}</strong><span>累计样卡</span></div>
            <div><strong>${latestRequest ? escapeHtml(latestRequest.status) : "—"}</strong><span>最近状态</span></div>
          </section>

          <section class="request-detail-section customer-edit-section">
            <div class="request-section-title"><span>客户资料</span><small>保存后同步到客户列表</small></div>
            <div class="customer-form-grid">
              <label><span>联系人姓名</span><input id="customerDetailName" value="${escapeHtml(customer.name || "")}" /></label>
              <label><span>联系电话</span><input id="customerDetailPhone" value="${escapeHtml(customer.phone || "")}" /></label>
              <label class="is-wide"><span>公司 / 工作室</span><input id="customerDetailCompany" value="${escapeHtml(customer.company || "")}" placeholder="例如：衡弈服装工作室" /></label>
              <label><span>地区</span><input id="customerDetailCity" value="${escapeHtml(customer.city || "")}" placeholder="例如：广州市" /></label>
              <label class="is-wide customer-address-field"><span>详细地址</span><textarea id="customerDetailAddress" rows="2" placeholder="街道、门牌号及收件信息">${escapeHtml(customer.address || "")}</textarea></label>
              <label class="is-wide"><span>运营备注</span><textarea id="customerDetailNotes" rows="3" placeholder="记录客户偏好、沟通情况或跟进事项">${escapeHtml(customer.notes || "")}</textarea></label>
            </div>
          </section>

          <section class="request-detail-section customer-history-section">
            <div class="request-section-title"><span>申请记录</span><small>${requests.length} 笔</small></div>
            <div class="customer-history-list">${history}</div>
          </section>

          <section class="request-info-grid customer-record-meta">
            <div><small>建档时间</small><strong>${escapeHtml(createdAt)}</strong></div>
            <div><small>最近更新</small><strong>${escapeHtml(updatedAt)}</strong></div>
          </section>
        </div>
        <footer class="request-detail-foot"><button class="button button-ghost" type="button" data-close-customer-detail>关闭</button><button class="button button-primary" type="button" data-save-customer-detail="${escapeHtml(customer.id)}">保存客户资料</button></footer>
      </aside>
    </div>`;
}

async function saveCustomerDetail(customerId) {
  const name = $("#customerDetailName")?.value.trim() || "";
  if (!name) return showToast("请填写联系人姓名");
  const payload = {
    name,
    phone: $("#customerDetailPhone")?.value.trim() || "",
    company: $("#customerDetailCompany")?.value.trim() || "",
    city: $("#customerDetailCity")?.value.trim() || "",
    address: $("#customerDetailAddress")?.value.trim() || "",
    notes: $("#customerDetailNotes")?.value.trim() || ""
  };
  try {
    await apiRequest(`/customers/${encodeURIComponent(customerId)}`, { method: "PATCH", body: JSON.stringify(payload) });
    await loadOperationalData();
    showToast("客户资料已保存");
  } catch (error) {
    showToast(error.message || "客户资料保存失败");
  }
}

async function createCustomerFromAdmin() {
  const name = window.prompt("联系人姓名");
  if (!name) return;
  const phone = window.prompt("手机号", "") || "";
  const company = window.prompt("公司", "") || "";
  try {
    await apiRequest("/customers", { method: "POST", body: JSON.stringify({ name, phone, company }) });
    await loadOperationalData();
    showToast("客户已新增");
  } catch (error) { showToast(error.message || "客户新增失败"); }
}

async function editCustomerFromAdmin(customerId) {
  const customer = (state.customers || []).find(item => item.id === customerId || item.phone === customerId);
  if (!customer) return showToast("客户资料不存在");
  const name = window.prompt("联系人姓名", customer.name || "");
  if (!name) return;
  const company = window.prompt("公司", customer.company || "") || "";
  const notes = window.prompt("客户备注", customer.notes || "") || "";
  try {
    await apiRequest(`/customers/${encodeURIComponent(customer.id)}`, { method: "PATCH", body: JSON.stringify({ name, company, notes }) });
    await loadOperationalData();
    showToast("客户资料已更新");
  } catch (error) { showToast(error.message || "客户更新失败"); }
}

function renderCustomers() {
  const customers = uniqueCustomers();
  const activeCustomer = customers.find(customer => customer.id === customerDetailId || customer.phone === customerDetailId);
  return `
    <div class="view-toolbar"><span class="toolbar-note">客户由样卡申请自动归集，打开详情可查看地址、申请记录并维护资料。</span><button class="button button-secondary button-small" data-demo="customer">＋ 新增客户</button></div>
    <div class="panel data-panel"><table class="data-table"><thead><tr><th style="width:25%">客户</th><th style="width:22%">公司</th><th style="width:16%">联系方式</th><th style="width:10%">地区</th><th style="width:12%">申请次数</th><th style="width:10%">最近申请</th><th>操作</th></tr></thead><tbody>
      ${customers.map(customer => `<tr><td><div class="fabric-cell"><span class="customer-avatar">${escapeHtml(customer.name.slice(0, 1))}</span><strong>${escapeHtml(customer.name)}</strong></div></td><td>${escapeHtml(customer.company || "—")}</td><td>${escapeHtml(customer.phone || "—")}</td><td>${escapeHtml(customer.city || "—")}</td><td>${customer.count} 次</td><td><small class="muted">${escapeHtml(customer.latest || "—")}</small></td><td><button class="icon-button" data-customer-detail="${escapeHtml(customer.id || customer.phone)}">详情</button></td></tr>`).join("")}
    </tbody></table></div>${activeCustomer ? renderCustomerDetail(activeCustomer) : ""}`;
}

function renderHomepage() {
  const liveProducts = state.products.filter(item => item.status === "live");
  const newest = [...liveProducts].sort((a, b) => (Date.parse(b.publishedAt || b.updatedAt || "") || 0) - (Date.parse(a.publishedAt || a.updatedAt || "") || 0)).slice(0, 6);
  const byId = new Map(liveProducts.map(item => [item.id, item]));
  const hotProducts = (state.homepage.hotProductIds || []).map(id => byId.get(id)).filter(Boolean);
  const selectedCases = state.homepage.cases || [];
  const mediaTile = (image, title, meta, removeAttribute = "") => `<article class="home-media-tile"><img src="${escapeHtml(image)}" alt=""><div><strong>${escapeHtml(title)}</strong><small>${escapeHtml(meta)}</small></div>${removeAttribute ? `<button type="button" ${removeAttribute} aria-label="移除 ${escapeHtml(title)}">×</button>` : ""}</article>`;
  return `
    <form id="homepagePageForm" class="homepage-composer">
      <div class="homepage-compose-main panel">
        <header class="homepage-compose-head"><div><p class="eyebrow">HOMEPAGE COMPOSER</p><h2>首页内容编排</h2><span>按首页出现顺序配置，右侧同步预览。</span></div><button class="button button-primary" type="submit">保存并同步</button></header>
        <input id="homePosterInput" type="file" accept="image/jpeg,image/png,image/webp" multiple hidden />

        <section class="home-compose-section">
          <div class="home-compose-copy"><h3>海报上传</h3><p>首页最上方的轮播视觉，建议使用 3:4 竖图，最多 8 张。</p></div>
          <div class="home-media-strip">
            ${state.homepage.posters.map((poster, index) => mediaTile(poster.url, `海报 ${index + 1}`, poster.title || "顶部轮播", `data-remove-home-poster="${index}"`)).join("")}
            <button class="home-add-tile" type="button" data-add-home-poster ${state.homepage.posters.length >= 8 ? "disabled" : ""}><i>＋</i><span>上传海报</span><small>${state.homepage.posters.length} / 8</small></button>
          </div>
        </section>

        <section class="home-compose-section">
          <div class="home-compose-copy"><h3>当季热销</h3><p>从已上架产品中选择，最多关联 6 款。</p></div>
          <div class="home-media-strip">
            ${hotProducts.map(product => mediaTile(product.image, product.name, `${product.code} · ${product.colorCount} 色`, `data-quick-remove-hot="${product.id}"`)).join("")}
            <button class="home-add-tile" type="button" data-open-home-picker="hot"><i>＋</i><span>选择产品</span><small>${hotProducts.length} / 6</small></button>
          </div>
        </section>

        <section class="home-compose-section home-auto-section">
          <div class="home-compose-copy"><h3>本期上新 <em>自动</em></h3><p>按产品上架时间自动筛选最近 6 款，无需手动维护。</p></div>
          <div class="home-auto-ribbon">${newest.map((product, index) => `<article><span>${String(index + 1).padStart(2, "0")}</span><img src="${escapeHtml(product.image)}" alt=""><div><strong>${escapeHtml(product.name)}</strong><small>${escapeHtml(product.code)}</small></div></article>`).join("") || `<div class="home-empty">产品上架后自动展示</div>`}</div>
        </section>

        <section class="home-compose-section">
          <div class="home-compose-copy"><h3>成衣案例选择</h3><p>从案例库中选择，最多展示 5 个案例。</p></div>
          <div class="home-media-strip">
            ${selectedCases.map(item => mediaTile(item.image, item.title, `${item.category} · ${item.productId}`, `data-quick-remove-case="${item.id}"`)).join("")}
            <button class="home-add-tile" type="button" data-open-home-picker="case"><i>＋</i><span>选择案例</span><small>${selectedCases.length} / 5</small></button>
          </div>
        </section>

        <footer class="home-compose-foot"><span><i></i> 底部“联系面料顾问”卡片保持现有设置</span><button class="button button-primary" type="submit">保存并同步小程序</button></footer>
      </div>
      <aside class="homepage-preview-column"><div class="homepage-live-sticky"><div class="homepage-preview-head"><div><p class="eyebrow">LIVE PREVIEW</p><h2>主页预览</h2></div><span><i></i> 实时更新</span></div><div id="homepageLivePreview">${homepagePreviewHtml()}</div></div></aside>
      ${homePickerType ? renderHomePicker(homePickerType) : ""}
    </form>`;
}

function renderHomePicker(type) {
  const isHot = type === "hot";
  const selectedIds = new Set(isHot ? state.homepage.hotProductIds : state.homepage.cases.map(item => item.id));
  const items = isHot ? state.products.filter(item => item.status === "live") : state.cases.filter(item => item.status === "已发布");
  const limit = isHot ? 6 : 5;
  return `<div class="home-picker-backdrop" data-close-home-picker><section class="home-picker" role="dialog" aria-modal="true" aria-label="${isHot ? "选择当季热销产品" : "选择成衣案例"}">
    <header><div><p class="eyebrow">${isHot ? "SEASON'S FAVORITES" : "GARMENT CASES"}</p><h2>${isHot ? "选择当季热销产品" : "选择成衣案例"}</h2><span>已选 ${selectedIds.size} / ${limit}，选择会立即反映在主页预览中。</span></div><button type="button" data-close-home-picker aria-label="关闭">×</button></header>
    <div class="home-picker-grid">${items.map(item => {
      const id = item.id;
      const checked = selectedIds.has(id);
      const image = item.image;
      const title = item.name || item.title;
      const meta = isHot ? `${item.code} · ${item.colorCount} 色` : `${item.category} · ${item.product}`;
      const attribute = isHot ? `data-home-hot="${id}"` : `data-home-case="${id}"`;
      return `<label class="home-picker-card ${checked ? "is-selected" : ""}"><input type="checkbox" ${attribute} ${checked ? "checked" : ""}><img src="${escapeHtml(image)}" alt=""><span><strong>${escapeHtml(title)}</strong><small>${escapeHtml(meta)}</small></span><i>${checked ? "✓" : "+"}</i></label>`;
    }).join("") || `<div class="home-empty">${isHot ? "暂无已上架产品" : "案例库为空"}</div>`}</div>
    <footer><span>最多选择 ${limit} 个</span><button class="button button-primary" type="button" data-close-home-picker>完成选择</button></footer>
  </section></div>`;
}

function homepagePreviewHtml() {
  const liveProducts = state.products.filter(item => item.status === "live");
  const byId = new Map(liveProducts.map(item => [item.id, item]));
  const newest = [...liveProducts].sort((a, b) => (Date.parse(b.publishedAt || b.updatedAt || "") || 0) - (Date.parse(a.publishedAt || a.updatedAt || "") || 0)).slice(0, 6);
  const hot = (state.homepage.hotProductIds || []).map(id => byId.get(id)).filter(Boolean);
  const poster = state.homepage.posters[0];
  const cases = state.homepage.cases || [];
  const previewCase = cases[0];
  const caseProduct = byId.get(previewCase?.productId);
  const productCard = (title, items) => {
    const isHot = title === "当季热销";
    if (!items.length) return `<section class="mini-home-section"><small>${isHot ? "SEASON'S FAVORITES" : "JUST ARRIVED"}</small><h4>${title}</h4><div class="mini-empty">等待选择产品</div></section>`;
    const item = items[0];
    const card = isHot
      ? `<div class="mini-hot-card" style="background-image:linear-gradient(180deg,transparent 26%,rgba(18,18,15,.86)),url('${escapeHtml(item.image)}')"><div><span>FABRIC · ${escapeHtml(item.code)}</span><strong>${escapeHtml(item.name)}</strong><p>${escapeHtml(item.description || "")}</p><em>查看面料详情 →</em></div></div>`
      : `<div class="mini-product-card"><img src="${escapeHtml(item.image)}" alt=""><div><span>NEW · ${escapeHtml(item.code)}</span><strong>${escapeHtml(item.name)}</strong><em>${item.colorCount} 色可选 · ${escapeHtml(item.weight)} · 门幅 ${escapeHtml(item.width)}</em></div></div>`;
    return `<section class="mini-home-section"><small>${isHot ? "SEASON'S FAVORITES" : "JUST ARRIVED"}</small><h4>${title}</h4>${card}<div class="mini-dots">${items.map((_, index) => `<i class="${index === 0 ? "is-active" : ""}"></i>`).join("")}</div></section>`;
  };
  return `<div class="homepage-phone"><div class="homepage-phone-bar"><span>9:41</span><i></i><span>•••</span></div><div class="homepage-phone-scroll">
    <div class="mini-brand"><b>衡弈纺织</b><span>选料</span></div>
    ${poster ? `<section class="mini-poster" style="background-image:linear-gradient(180deg,transparent,rgba(20,20,17,.8)),url('${escapeHtml(poster.url)}')"><div><small>SEASONAL EDIT</small><h3>${escapeHtml(poster.title || "当季面料提案")}</h3><p>${escapeHtml(poster.copy || "")}</p></div></section><div class="mini-dots poster-mini-dots">${state.homepage.posters.map((_, index) => `<i class="${index === 0 ? "is-active" : ""}"></i>`).join("")}</div>` : `<div class="mini-poster mini-empty">等待上传顶部海报</div>`}
    ${productCard("当季热销", hot)}${productCard("本期上新", newest)}
    <section class="mini-home-section"><small>FROM FABRIC TO FORM</small><h4>从布面到成衣</h4>${cases.length ? `<div class="mini-case"><img class="mini-case-main" src="${escapeHtml(previewCase.images?.[0] || previewCase.image)}" alt=""><div class="mini-case-info"><b>${escapeHtml(caseProduct?.code || previewCase.productId || "LOOK")}</b><span>${escapeHtml(caseProduct?.composition || previewCase.title)}</span></div><img class="mini-case-second" src="${escapeHtml(previewCase.images?.[1] || previewCase.image)}" alt=""></div><div class="mini-dots">${cases.map((_, index) => `<i class="${index === 0 ? "is-active" : ""}"></i>`).join("")}</div>` : `<div class="mini-empty">等待选择案例</div>`}</section>
    <section class="mini-contact"><small>FABRIC SUPPORT</small><b>需要色卡或开发建议？</b><span>联系面料顾问</span></section>
  </div></div>`;
}

function refreshHomepagePreview() {
  const preview = $("#homepageLivePreview");
  if (preview) preview.innerHTML = homepagePreviewHtml();
}

function addRepeatRow(container, type, data = {}) {
  const row = document.createElement("div");
  row.className = `repeat-row ${type === "use" ? "uses" : ""}`;
  if (type === "use") {
    row.innerHTML = `<input data-field="title" placeholder="用途标题（例如：都市西装）" value="${escapeHtml(data.title || "")}"><input data-field="description" placeholder="说明适合的廓形与单品（例如：挺括但不僵硬，适合成套西装及外套）" value="${escapeHtml(data.description || "")}"><button class="remove-row" type="button" aria-label="删除">×</button>`;
  } else {
    row.innerHTML = `<input data-field="label" placeholder="规格名称" value="${escapeHtml(data.label || "")}"><input data-field="value" placeholder="规格内容" value="${escapeHtml(data.value || "")}"><button class="remove-row" type="button" aria-label="删除">×</button>`;
  }
  container.appendChild(row);
}

function formatColorRange(count) {
  const value = Number(count) || 0;
  return value ? `NO.01 — NO.${String(value).padStart(2, "0")}` : "";
}

function canonicalTag(label) {
  const clean = String(label || "").trim().replace(/^[,，]+|[,，]+$/g, "");
  return state.tagLibrary.find(tag => tag.toLowerCase() === clean.toLowerCase()) || clean;
}

function findSimilarTags(label) {
  const query = String(label || "").trim().toLowerCase();
  if (!query) return [];
  return state.tagLibrary.filter(tag => {
    const value = tag.toLowerCase();
    return value !== query && (value.includes(query) || query.includes(value));
  }).slice(0, 5);
}

function addSelectedTag(label, target = selectedFeatureTags) {
  const tag = canonicalTag(label);
  if (!tag || target.some(item => item.toLowerCase() === tag.toLowerCase())) return false;
  if (target.length >= 5) {
    showToast("每款面料最多选择5个特色标签");
    return false;
  }
  target.push(tag);
  return true;
}

function renderTagField() {
  $("#selectedTagPills").innerHTML = selectedFeatureTags.map(tag => {
    const isNew = !state.tagLibrary.some(item => item.toLowerCase() === tag.toLowerCase());
    return `<button type="button" class="selected-tag-pill ${isNew ? "is-new" : ""}" data-remove-main-tag="${escapeHtml(tag)}" aria-label="删除标签 ${escapeHtml(tag)}"><span>${escapeHtml(tag)}</span><i aria-hidden="true">×</i></button>`;
  }).join("");
  $("#tagCount").textContent = selectedFeatureTags.length;
  $("#tagInlineInput").placeholder = selectedFeatureTags.length ? "" : "输入标签后按逗号，或从标签库选择";
}

function renderTagDrawer(query = "") {
  const normalizedQuery = query.trim().toLowerCase();
  const library = state.tagLibrary.filter(tag => !normalizedQuery || tag.toLowerCase().includes(normalizedQuery));
  $("#tagLibraryCloud").innerHTML = library.length
    ? library.map(tag => {
      const selected = drawerSelectedTags.some(item => item.toLowerCase() === tag.toLowerCase());
      return `<button type="button" class="tag-chip ${selected ? "is-selected" : ""}" data-library-tag="${escapeHtml(tag)}">${escapeHtml(tag)}${selected ? " √" : ""}</button>`;
    }).join("")
    : `<span class="muted">没有匹配标签，按回车或逗号可创建“${escapeHtml(query.trim())}”</span>`;
}

function openTagSelector() {
  const drawer = $("#tagDrawer");
  if (drawer.hidden) {
    tagSelectorOriginalTags = [...selectedFeatureTags];
    drawerSelectedTags = [...selectedFeatureTags];
    drawerPendingTags = drawerSelectedTags.filter(tag => !state.tagLibrary.some(item => item.toLowerCase() === tag.toLowerCase()));
  }
  renderTagDrawer($("#tagInlineInput").value);
  const shell = $("#tagInputShell");
  drawer.style.top = `${shell.offsetTop + shell.offsetHeight + 8}px`;
  drawer.hidden = false;
  drawer.scrollIntoView({ behavior: "smooth", block: "nearest" });
  $("#tagInlineInput").focus();
}

function closeTagSelector(restore = true) {
  if (restore) {
    selectedFeatureTags = [...tagSelectorOriginalTags];
    renderTagField();
    updateProductPreview();
  }
  $("#tagInlineInput").value = "";
  $("#tagDrawer").hidden = true;
}

function mediaMeta(type) {
  return {
    gallery: { container: "#galleryUpload", label: "轮播图", max: 6 },
    detailImages: { container: "#detailUpload", label: "详情图", max: Infinity },
    colorCardImages: { container: "#colorCardUpload", label: "电子色卡", max: Infinity }
  }[type];
}

function renderMediaGroup(type) {
  const meta = mediaMeta(type);
  const images = editorImages[type];
  const cards = images.map((src, index) => {
    const isStale = src.startsWith("blob:") && !editorMediaFiles.has(src);
    return `
    <figure class="media-card ${type === "gallery" && index === 0 ? "is-cover" : ""} ${isStale ? "is-stale" : ""}" draggable="true" data-media-type="${type}" data-media-index="${index}">
      ${isStale ? `<div class="media-stale"><strong>图片已失效</strong><span>删除后重新上传</span></div>` : `<img src="${escapeHtml(src)}" alt="${meta.label} ${index + 1}" />`}
      <button class="media-remove" type="button" data-remove-media="${type}" data-media-index="${index}" aria-label="删除图片">×</button>
      <div class="media-order"><button type="button" data-move-media="${type}" data-media-index="${index}" data-direction="-1" ${index === 0 ? "disabled" : ""} aria-label="图片前移">←</button><button type="button" data-move-media="${type}" data-media-index="${index}" data-direction="1" ${index === images.length - 1 ? "disabled" : ""} aria-label="图片后移">→</button></div>
      <figcaption><span>${type === "gallery" && index === 0 ? "封面" : `${index + 1}`}</span><i class="media-grip">拖动排序</i></figcaption>
    </figure>`;
  }).join("");
  const canAdd = images.length < meta.max;
  $(meta.container).dataset.mediaDropType = type;
  $(meta.container).innerHTML = `${cards}${canAdd ? `<button class="upload-button" type="button" data-add-media="${type}"><span>＋</span><strong>添加${meta.label}</strong><small>JPG / PNG / WebP · 自动压缩</small></button>` : ""}`;
  $("#galleryCount").textContent = `${editorImages.gallery.length} / 6`;
  $("#detailCount").textContent = `${editorImages.detailImages.length} 张`;
  $("#colorCardCount").textContent = `${editorImages.colorCardImages.length} 张`;
}

function renderAllMedia() {
  renderMediaGroup("gallery");
  renderMediaGroup("detailImages");
  renderMediaGroup("colorCardImages");
}

function openMediaPicker(type) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/png,image/jpeg,image/webp";
  input.multiple = true;
  input.addEventListener("change", () => {
    const meta = mediaMeta(type);
    const available = Number.isFinite(meta.max) ? Math.max(0, meta.max - editorImages[type].length) : input.files.length;
    const files = [...input.files].slice(0, available);
    files.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      editorMediaFiles.set(previewUrl, file);
      editorImages[type].push(previewUrl);
    });
    if (type === "gallery" && input.files.length > available) showToast("顶部轮播图最多上传6张");
    renderAllMedia();
    updateProductPreview();
    showToast(`已添加 ${files.length} 张${meta.label}；拖动图片可以调整顺序`);
  });
  input.click();
}

function openProductEditor(id = null, copy = false, importedProduct = null) {
  const source = id ? state.products.find(item => item.id === id) : null;
  editingId = copy ? null : id;
  editorMediaFiles = new Map();
  const form = $("#productForm");
  form.reset();
  $("#customSpecs").innerHTML = "";
  $("#usesList").innerHTML = "";
  $("#editorTitle").textContent = copy ? "复制面料" : source ? `编辑 ${source.code}` : "新增面料";
  $("#saveState").textContent = "尚未保存";
  setSaveError();
  $$("#productForm .invalid").forEach(field => field.classList.remove("invalid"));

  const emptyProduct = {
    code: "", name: "", description: "", quoteLabel: "咨询报价", featureTags: [], categoryIds: [], composition: "", weight: "", width: "", colorCount: "", colorRange: "", uses: [{ title: "", description: "" }], customSpecs: [], gallery: [], detailImages: [], colorCardImages: []
  };
  const product = source
    ? JSON.parse(JSON.stringify(source))
    : { ...emptyProduct, ...(importedProduct ? JSON.parse(JSON.stringify(importedProduct)) : {}) };
  if (copy) {
    product.code = "";
    product.name = `${product.name}（副本）`;
  }
  Object.entries(product).forEach(([key, value]) => {
    const field = form.elements.namedItem(key);
    if (!field) return;
    field.value = Array.isArray(value) ? value.join(", ") : value;
  });
  selectedFeatureTags = [...(product.featureTags || [])];
  selectedCategoryIds = [...(product.categoryIds || [])];
  editorImages = {
    gallery: [...(product.gallery || [])],
    detailImages: [...(product.detailImages || [])],
    colorCardImages: [...(product.colorCardImages || [])]
  };
  (product.customSpecs || []).forEach(item => addRepeatRow($("#customSpecs"), "spec", item));
  (product.uses?.length ? product.uses : [{ title: "", description: "" }]).forEach(item => addRepeatRow($("#usesList"), "use", item));
  renderTagField();
  renderCategoryField();
  renderAllMedia();
  updateProductPreview();
  $("#productDialog").showModal();
}

async function consumePendingProductImport() {
  if (!pendingProductImportToken) return;
  const token = pendingProductImportToken;
  try {
    const result = await apiRequest(`/product-imports/${encodeURIComponent(token)}`);
    pendingProductImportToken = "";
    const url = new URL(window.location.href);
    url.searchParams.delete("newProductImport");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
    setView("products");
    openProductEditor(null, false, result.data || {});
    showToast("已从素材仓库填充新增面料，请检查后保存或上架");
  } catch (error) {
    showToast(`素材仓库导入失败：${cloudErrorMessage(error)}`);
  }
}

function formValues() {
  const form = $("#productForm");
  const values = Object.fromEntries(new FormData(form).entries());
  values.featureTags = [...selectedFeatureTags];
  values.categoryIds = [...selectedCategoryIds];
  values.colorCount = Number(values.colorCount) || 0;
  values.colorRange = formatColorRange(values.colorCount);
  values.customSpecs = $$("#customSpecs .repeat-row").map(row => ({ label: row.querySelector('[data-field="label"]').value.trim(), value: row.querySelector('[data-field="value"]').value.trim() })).filter(item => item.label || item.value);
  values.uses = $$("#usesList .repeat-row").map(row => ({ title: row.querySelector('[data-field="title"]').value.trim(), description: row.querySelector('[data-field="description"]').value.trim() })).filter(item => item.title || item.description);
  values.gallery = [...editorImages.gallery];
  values.detailImages = [...editorImages.detailImages];
  values.colorCardImages = [...editorImages.colorCardImages];
  values.image = values.gallery[0] || `${ASSET_ROOT}/swatch.jpg`;
  return values;
}

function updateProductPreview() {
  const values = formValues();
  $("#productForm [name=colorRange]").value = values.colorRange;
  $("#previewSeries").textContent = values.code ? `FABRIC · ${values.code}` : "FABRIC · NEW";
  $("#previewName").textContent = values.name || "未命名面料";
  $("#previewDescription").textContent = values.description || "填写面料简介后，将在这里看到顾客实际阅读到的内容。";
  $("#previewComposition").textContent = values.composition || "—";
  $("#previewWeight").textContent = values.weight || "—";
  $("#previewWidth").textContent = values.width || "—";
  const displayTags = [values.colorCount ? `${values.colorCount} 色可选` : "", ...values.featureTags].filter(Boolean);
  $("#previewTags").innerHTML = (displayTags.length ? displayTags : ["特色标签"]).map((tag, index) => `<span class="${index === 0 && values.colorCount ? "phone-color-count" : ""}">${escapeHtml(tag)}</span>`).join("");
  $("#previewGallery").innerHTML = values.gallery.length
    ? `<img src="${escapeHtml(values.gallery[0])}" alt="产品轮播首图"><div class="phone-gallery-dots">${values.gallery.map(() => "<i></i>").join("")}</div>`
    : `<div class="phone-image-placeholder">轮播图预览</div>`;
  $("#previewUses").innerHTML = values.uses.map(item => `<div class="phone-use"><b>${escapeHtml(item.title || "推荐用途")}</b><span>${escapeHtml(item.description || "填写适合的廓形与单品")}</span></div>`).join("");
  $("#previewUsesSection").hidden = values.uses.length === 0;
  $("#previewDetailImages").innerHTML = values.detailImages.map(src => `<img src="${escapeHtml(src)}" alt="面料详情图">`).join("");
  $("#previewDetailsSection").hidden = values.detailImages.length === 0;
  $("#previewColorCardImages").innerHTML = values.colorCardImages.map(src => `<img src="${escapeHtml(src)}" alt="电子色卡图">`).join("");
  $("#previewColorCardsSection").hidden = values.colorCardImages.length === 0;
  $("#descriptionCount").textContent = `${values.description.length} / 160`;
  const required = [values.code, values.name, values.description, values.composition, values.weight, values.width, values.colorCount];
  const score = Math.min(100, Math.round((required.filter(Boolean).length / required.length) * 80 + (values.featureTags.length ? 5 : 0) + (values.uses.length ? 5 : 0) + (values.gallery.length >= 4 ? 10 : 0)));
  $("#completionValue").textContent = `${score}%`;
  $("#completionBar").style.width = `${score}%`;
  $("#saveState").textContent = "有未保存修改";
}

function validateProduct(status) {
  const required = $$("#productForm [required]");
  required.forEach(field => field.classList.toggle("invalid", !field.value.trim()));
  const firstInvalid = required.find(field => !field.value.trim());
  if (firstInvalid) {
    firstInvalid.focus();
    showToast("请先补全标有 * 的必填内容");
    return false;
  }
  const code = $("#productForm [name=code]").value.trim();
  const duplicate = state.products.find(item => item.code.toLowerCase() === code.toLowerCase() && item.id !== editingId);
  if (duplicate) {
    $("#productForm [name=code]").classList.add("invalid");
    showToast(`货号 ${code} 已存在`);
    return false;
  }
  if (status === "live" && editorImages.gallery.length < 4) {
    showToast("上架前需要上传至少4张顶部轮播图；可以先保存草稿");
    $("#galleryUpload").scrollIntoView({ behavior: "smooth", block: "center" });
    return false;
  }
  return true;
}

async function saveProduct(status, skipCategoryWarning = false) {
  if (!validateProduct(status)) return;
  const missingGroups = state.categories.filter(group => !group.tags.some(tag => selectedCategoryIds.includes(tag.id)));
  if (!skipCategoryWarning && missingGroups.length) {
    pendingSaveStatus = status;
    $("#categoryWarningCopy").textContent = `尚未选择：${missingGroups.map(group => group.name).join("、")}。`;
    $("#categoryWarningDialog").showModal();
    return;
  }
  setSaveError();
  const publishButton = $("#publishProduct");
  const draftButton = $("#saveDraft");
  const offlineButton = $("#takeOfflineProduct");
  publishButton.disabled = true;
  draftButton.disabled = true;
  offlineButton.disabled = true;
  let values = formValues();
  try {
    await initCloud();
    values = await uploadProductMedia(values);
  } catch (error) {
    console.error("Cloud media save failed:", error);
    publishButton.disabled = false;
    draftButton.disabled = false;
    offlineButton.disabled = false;
    $("#saveState").textContent = "服务器保存失败";
    const message = `未写入服务器：${cloudErrorMessage(error)}`;
    setSaveError(message);
    showToast(message);
    return;
  }
  state.tagLibrary = [...new Set([...state.tagLibrary, ...values.featureTags])];
  const existing = editingId ? state.products.find(item => item.id === editingId) : null;
  const product = { ...existing, ...values, id: existing?.id || values.code, status, updatedAt: "刚刚" };
  try {
    $("#saveState").textContent = "正在写入服务器数据库";
    const result = await writeCloudProduct(product);
    const localProduct = normalizeCloudProduct(result.data || product);
    if (existing) state.products = state.products.map(item => item.id === editingId ? localProduct : item);
    else state.products.unshift(localProduct);
    editingId = product.id;
    persist();
    $("#saveState").textContent = status === "live" ? "已同步并上架" : status === "offline" ? "已同步并下架" : "草稿已同步";
    $("#productDialog").close();
    setView("products");
    showToast(status === "live" ? `${product.code} 已同步到小程序` : status === "offline" ? `${product.code} 已下架，小程序端将不再展示` : `${product.code} 草稿已保存到服务器`);
  } catch (error) {
    console.error("Cloud database write failed:", error);
    $("#saveState").textContent = "服务器写入失败";
    const message = `服务器数据库写入失败：${cloudErrorMessage(error)}`;
    setSaveError(message);
    showToast(message);
  } finally {
    publishButton.disabled = false;
    draftButton.disabled = false;
    offlineButton.disabled = false;
  }
}

function openHomeEditor() {
  const select = $("#featuredProductSelect");
  select.innerHTML = state.products.filter(item => item.status === "live").map(item => `<option value="${item.id}">${escapeHtml(item.code)} · ${escapeHtml(item.name)}</option>`).join("");
  const form = $("#homeForm");
  form.elements.featuredProduct.value = state.homepage.featuredProduct;
  form.elements.heroTitle.value = state.homepage.heroTitle;
  form.elements.heroCopy.value = state.homepage.heroCopy;
  $("#homeDialog").showModal();
}

function commitInlineTags() {
  const input = $("#tagInlineInput");
  const raw = input.value.trim();
  if (!raw) return;
  const labels = raw.split(/[,，]/).map(item => item.trim()).filter(Boolean);
  let hasNewTag = false;
  labels.forEach(label => {
    const tag = canonicalTag(label);
    if (allCategoryTags().some(item => item.name.toLowerCase() === tag.toLowerCase())) {
      showToast(`“${tag}”已经是标准分类，请在分类选择器中选择`);
      return;
    }
    if (addSelectedTag(tag)) {
      const isNew = !state.tagLibrary.some(item => item.toLowerCase() === tag.toLowerCase());
      if (isNew) hasNewTag = true;
      if (!$("#tagDrawer").hidden) {
        addSelectedTag(tag, drawerSelectedTags);
        if (isNew && !drawerPendingTags.includes(tag)) drawerPendingTags.push(tag);
      }
    }
  });
  input.value = "";
  renderTagField();
  updateProductPreview();
  if (!$("#tagDrawer").hidden) renderTagDrawer();
  if (hasNewTag) {
    showToast("自由输入会创建公共特色标签，请确认没有含义相近的标签");
    if ($("#tagDrawer").hidden) openTagSelector();
  }
}

document.addEventListener("click", event => {
  if (!$("#tagDrawer").hidden && !event.target.closest("#tagDrawer") && !event.target.closest("#tagInputShell")) {
    closeTagSelector(true);
  }
  if (!$("#categoryDrawer").hidden && !event.target.closest("#categoryDrawer") && !event.target.closest("#categoryInputShell")) {
    closeCategorySelector(true);
  }
  const nav = event.target.closest("[data-view]");
  if (nav) return setView(nav.dataset.view);
  const go = event.target.closest("[data-go]");
  if (go) return setView(go.dataset.go);
  if (event.target.closest("[data-action='new-product']")) return openProductEditor();
  const edit = event.target.closest("[data-edit-product]");
  if (edit) return openProductEditor(edit.dataset.editProduct);
  const copy = event.target.closest("[data-copy-product]");
  if (copy) return openProductEditor(copy.dataset.copyProduct, true);
  const deleteProductButton = event.target.closest("[data-delete-product]");
  if (deleteProductButton) return deleteProduct(deleteProductButton.dataset.deleteProduct);
  if (event.target.closest("[data-new-case]")) return openCaseEditor();
  const editCase = event.target.closest("[data-edit-case]");
  if (editCase) return openCaseEditor(editCase.dataset.editCase);
  const closeCaseEditor = event.target.closest("[data-close-case-editor]");
  if (closeCaseEditor && (closeCaseEditor.tagName === "BUTTON" || event.target === closeCaseEditor)) { caseEditorDraft = null; renderView(); return; }
  if (event.target.closest("[data-add-case-images]")) { $("#caseImageInput")?.click(); return; }
  const removeCaseImage = event.target.closest("[data-remove-case-image]");
  if (removeCaseImage && caseEditorDraft) { caseEditorDraft.images.splice(Number(removeCaseImage.dataset.removeCaseImage), 1); renderView(); return; }
  const deleteCaseButton = event.target.closest("[data-delete-case]");
  if (deleteCaseButton) return deleteCase(deleteCaseButton.dataset.deleteCase);
  const filter = event.target.closest("[data-product-filter]");
  if (filter) { productFilter = filter.dataset.productFilter; return renderView(); }
  const requestFilterButton = event.target.closest("[data-request-filter]");
  if (requestFilterButton) {
    requestFilter = requestFilterButton.dataset.requestFilter;
    return renderView();
  }
  if (event.target.closest("[data-add-category-group]")) return openCategoryManage("group");
  const editCategoryGroup = event.target.closest("[data-edit-category-group]");
  if (editCategoryGroup) return openCategoryManage("group", "", editCategoryGroup.dataset.editCategoryGroup);
  const deleteCategoryGroupButton = event.target.closest("[data-delete-category-group]");
  if (deleteCategoryGroupButton) return deleteCategoryGroup(deleteCategoryGroupButton.dataset.deleteCategoryGroup);
  const addCategoryTag = event.target.closest("[data-add-category-tag]");
  if (addCategoryTag) return openCategoryManage("tag", addCategoryTag.dataset.addCategoryTag);
  const editCategoryTag = event.target.closest("[data-edit-category-tag]");
  if (editCategoryTag) return openCategoryManage("tag", editCategoryTag.dataset.parentId, editCategoryTag.dataset.editCategoryTag);
  const deleteCategoryTagButton = event.target.closest("[data-delete-category-tag]");
  if (deleteCategoryTagButton) return deleteCategoryTag(deleteCategoryTagButton.dataset.parentId, deleteCategoryTagButton.dataset.deleteCategoryTag);
  const requestDetail = event.target.closest("[data-request-detail]");
  if (requestDetail) {
    requestDetailId = requestDetail.dataset.requestDetail;
    renderView();
    return;
  }
  if (event.target.matches("[data-request-detail-backdrop]") || event.target.closest("[data-close-request-detail]")) {
    requestDetailId = null;
    renderView();
    return;
  }
  const saveRequestButton = event.target.closest("[data-save-request-detail]");
  if (saveRequestButton) return saveRequestDetail(saveRequestButton.dataset.saveRequestDetail);
  const next = event.target.closest("[data-next-request]");
  if (next) {
    const request = state.requests.find(item => item.id === next.dataset.nextRequest);
    setTimeout(() => apiRequest(`/requests/${encodeURIComponent(request.id)}`, { method: "PATCH", body: JSON.stringify({ status: request.status }) }).catch(error => console.warn("Request status sync failed:", error)), 0);
    request.status = nextRequestStatus(request.status);
    persist(); renderView(); showToast(`${request.id} 已更新为“${request.status}”`); return;
  }
  if (event.target.closest("[data-edit-home]")) return openHomeEditor();
  const openHomePicker = event.target.closest("[data-open-home-picker]");
  if (openHomePicker) {
    homePickerType = openHomePicker.dataset.openHomePicker;
    renderView();
    return;
  }
  const closeHomePicker = event.target.closest("[data-close-home-picker]");
  if (closeHomePicker && (closeHomePicker.tagName === "BUTTON" || event.target === closeHomePicker)) {
    homePickerType = null;
    renderView();
    return;
  }
  const quickRemoveHot = event.target.closest("[data-quick-remove-hot]");
  if (quickRemoveHot) {
    state.homepage.hotProductIds = state.homepage.hotProductIds.filter(id => id !== quickRemoveHot.dataset.quickRemoveHot);
    renderView();
    return;
  }
  const quickRemoveCase = event.target.closest("[data-quick-remove-case]");
  if (quickRemoveCase) {
    state.homepage.cases = state.homepage.cases.filter(item => item.id !== quickRemoveCase.dataset.quickRemoveCase);
    renderView();
    return;
  }
  if (event.target.closest("[data-add-home-poster]")) {
    const input = $("#homePosterInput");
    if (input) input.click();
    return;
  }
  const removeHomePoster = event.target.closest("[data-remove-home-poster]");
  if (removeHomePoster) {
    state.homepage.posters.splice(Number(removeHomePoster.dataset.removeHomePoster), 1);
    renderView();
    return;
  }
  const removeMainTag = event.target.closest("[data-remove-main-tag]");
  if (removeMainTag) {
    selectedFeatureTags = selectedFeatureTags.filter(tag => tag !== removeMainTag.dataset.removeMainTag);
    if (!$("#tagDrawer").hidden) {
      drawerSelectedTags = [...selectedFeatureTags];
      drawerPendingTags = drawerPendingTags.filter(tag => selectedFeatureTags.includes(tag));
      renderTagDrawer($("#tagInlineInput").value);
    }
    renderTagField(); updateProductPreview(); return;
  }
  const removeCategory = event.target.closest("[data-remove-category]");
  if (removeCategory) {
    selectedCategoryIds = selectedCategoryIds.filter(id => id !== removeCategory.dataset.removeCategory);
    if (!$("#categoryDrawer").hidden) categoryDrawerSelectedIds = [...selectedCategoryIds];
    renderCategoryField(); updateProductPreview(); return;
  }
  const categoryGroupButton = event.target.closest("[data-category-group]");
  if (categoryGroupButton) {
    activeCategoryGroupId = categoryGroupButton.dataset.categoryGroup;
    renderCategoryDrawer(); return;
  }
  const categoryTagButton = event.target.closest("[data-category-tag]");
  if (categoryTagButton) {
    const group = state.categories.find(item => item.id === categoryTagButton.dataset.parentId);
    const tagId = categoryTagButton.dataset.categoryTag;
    const selected = categoryDrawerSelectedIds.includes(tagId);
    if (selected) categoryDrawerSelectedIds = categoryDrawerSelectedIds.filter(id => id !== tagId);
    else {
      if (group.selectionMode === "single") {
        const groupTagIds = new Set(group.tags.map(tag => tag.id));
        categoryDrawerSelectedIds = categoryDrawerSelectedIds.filter(id => !groupTagIds.has(id));
      }
      categoryDrawerSelectedIds.push(tagId);
    }
    renderCategoryDrawer(); return;
  }
  if (event.target.closest("#categoryInputShell")) return openCategorySelector();
  const libraryTag = event.target.closest("[data-library-tag]");
  if (libraryTag) {
    const tag = libraryTag.dataset.libraryTag;
    const exists = drawerSelectedTags.includes(tag);
    drawerSelectedTags = exists ? drawerSelectedTags.filter(item => item !== tag) : drawerSelectedTags;
    if (!exists) addSelectedTag(tag, drawerSelectedTags);
    selectedFeatureTags = [...drawerSelectedTags];
    renderTagField();
    updateProductPreview();
    renderTagDrawer($("#tagInlineInput").value); return;
  }
  const addMedia = event.target.closest("[data-add-media]");
  if (addMedia) return openMediaPicker(addMedia.dataset.addMedia);
  const removeMedia = event.target.closest("[data-remove-media]");
  if (removeMedia) {
    const type = removeMedia.dataset.removeMedia;
    editorImages[type].splice(Number(removeMedia.dataset.mediaIndex), 1);
    renderAllMedia(); updateProductPreview(); return;
  }
  const moveMedia = event.target.closest("[data-move-media]");
  if (moveMedia && !moveMedia.disabled) {
    const type = moveMedia.dataset.moveMedia;
    const index = Number(moveMedia.dataset.mediaIndex);
    const targetIndex = index + Number(moveMedia.dataset.direction);
    const [moved] = editorImages[type].splice(index, 1);
    editorImages[type].splice(targetIndex, 0, moved);
    renderAllMedia(); updateProductPreview(); return;
  }
  if (event.target.closest("[data-new-customer]")) return createCustomerFromAdmin();
  if (event.target.matches("[data-customer-detail-backdrop]") || event.target.closest("[data-close-customer-detail]")) {
    customerDetailId = null;
    renderView();
    return;
  }
  const customerDetail = event.target.closest("[data-customer-detail]");
  if (customerDetail) {
    customerDetailId = customerDetail.dataset.customerDetail;
    renderView();
    return;
  }
  const saveCustomerButton = event.target.closest("[data-save-customer-detail]");
  if (saveCustomerButton) return saveCustomerDetail(saveCustomerButton.dataset.saveCustomerDetail);
  const demoButton = event.target.closest("[data-demo]");
  if (demoButton?.dataset.demo === "customer") return createCustomerFromAdmin();
  if (demoButton) return showToast("该入口已纳入雏形，下一阶段补充完整编辑表单");
  if (event.target.closest(".remove-row")) { event.target.closest(".repeat-row").remove(); updateProductPreview(); }
});

document.addEventListener("dragstart", event => {
  const card = event.target.closest(".media-card");
  if (!card) return;
  draggedMedia = { type: card.dataset.mediaType, index: Number(card.dataset.mediaIndex) };
  event.dataTransfer.effectAllowed = "move";
  card.classList.add("is-dragging");
});
document.addEventListener("dragover", event => {
  const strip = event.target.closest(".upload-strip");
  if (!strip || !draggedMedia) return;
  const targetType = strip.dataset.mediaDropType;
  if (!targetType || (targetType === "gallery" && draggedMedia.type !== "gallery" && editorImages.gallery.length >= 6)) return;
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  strip.classList.add("is-drop-target");
});
document.addEventListener("drop", event => {
  const strip = event.target.closest(".upload-strip");
  if (!strip || !draggedMedia) return;
  const targetType = strip.dataset.mediaDropType;
  if (!targetType || (targetType === "gallery" && draggedMedia.type !== "gallery" && editorImages.gallery.length >= 6)) return;
  event.preventDefault();
  const target = event.target.closest(".media-card");
  const sourceType = draggedMedia.type;
  const sourceIndex = draggedMedia.index;
  const [moved] = editorImages[sourceType].splice(sourceIndex, 1);
  let targetIndex = target ? Number(target.dataset.mediaIndex) : editorImages[targetType].length;
  if (sourceType === targetType && sourceIndex < targetIndex) targetIndex -= 1;
  editorImages[targetType].splice(Math.max(0, targetIndex), 0, moved);
  draggedMedia = null;
  $$(".upload-strip.is-drop-target").forEach(item => item.classList.remove("is-drop-target"));
  renderAllMedia(); updateProductPreview();
});
document.addEventListener("dragend", () => {
  draggedMedia = null;
  $$(".media-card.is-dragging").forEach(card => card.classList.remove("is-dragging"));
  $$(".upload-strip.is-drop-target").forEach(strip => strip.classList.remove("is-drop-target"));
});

document.addEventListener("input", event => {
  const caseField = event.target.dataset.caseField;
  if (caseField && caseEditorDraft) {
    caseEditorDraft[caseField] = event.target.value;
    refreshCaseEditorPreview();
    return;
  }
  const field = event.target.dataset.posterField;
  if (!field) return;
  const poster = state.homepage.posters[Number(event.target.dataset.posterIndex)];
  if (!poster) return;
  poster[field] = event.target.value;
  refreshHomepagePreview();
});

document.addEventListener("change", async event => {
  if (event.target.id === "caseImageInput" && caseEditorDraft) {
    const selectedFiles = [...(event.target.files || [])];
    const remaining = Math.max(0, 2 - caseEditorDraft.images.length);
    const files = selectedFiles.slice(0, remaining);
    const failures = [];
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        showToast(`正在上传案例图片 ${index + 1} / ${files.length}`);
        const formData = new FormData();
        formData.append("file", file, file.name.replace(/[^a-zA-Z0-9._-]/g, "-"));
        formData.append("productCode", caseEditorDraft.id);
        formData.append("group", "cases");
        const result = await apiRequest("/uploads", { method: "POST", body: formData });
        caseEditorDraft.images.push(result.url);
      } catch (error) {
        failures.push(`${file.name}：${cloudErrorMessage(error)}`);
      }
    }
    event.target.value = "";
    renderView();
    if (failures.length) showToast(`部分案例图片上传失败：${failures.join("；")}`);
    else if (selectedFiles.length > files.length) showToast("案例固定使用两张图片，超出部分未上传");
    else showToast(`已上传 ${files.length} 张案例图片`);
    return;
  }

  const caseField = event.target.dataset.caseField;
  if (caseField && caseEditorDraft) {
    caseEditorDraft[caseField] = event.target.value;
    refreshCaseEditorPreview();
    return;
  }

  if (event.target.id === "homePosterInput") {
    const selectedFiles = [...(event.target.files || [])];
    if (!selectedFiles.length) return;
    const remaining = Math.max(0, 8 - state.homepage.posters.length);
    if (!remaining) { event.target.value = ""; return showToast("顶部海报最多上传 8 张"); }
    const files = selectedFiles.slice(0, remaining);
    const failures = [];
    let uploadedCount = 0;
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];
      try {
        showToast(`正在上传海报 ${index + 1} / ${files.length}`);
        const formData = new FormData();
        formData.append("file", file, file.name.replace(/[^a-zA-Z0-9._-]/g, "-"));
        formData.append("productCode", "homepage");
        formData.append("group", "posters");
        const result = await apiRequest("/uploads", { method: "POST", body: formData });
        state.homepage.posters.push({ url: result.url, title: "", copy: "", productId: "" });
        uploadedCount += 1;
      } catch (error) {
        failures.push(`${file.name}：${cloudErrorMessage(error)}`);
      }
    }
    event.target.value = "";
    if (uploadedCount) renderView();
    const omitted = selectedFiles.length - files.length;
    if (failures.length) showToast(`成功上传 ${uploadedCount} 张；${failures.length} 张失败：${failures.join("；")}`);
    else if (omitted) showToast(`已上传 ${uploadedCount} 张，另有 ${omitted} 张超过 8 张上限未上传`);
    else showToast(`已上传 ${uploadedCount} 张海报，保存后同步到小程序`);
    return;
  }

  const posterField = event.target.dataset.posterField;
  if (posterField) {
    const poster = state.homepage.posters[Number(event.target.dataset.posterIndex)];
    if (poster) poster[posterField] = event.target.value;
    refreshHomepagePreview();
    return;
  }

  const hotId = event.target.dataset.homeHot;
  if (hotId) {
    if (event.target.checked && state.homepage.hotProductIds.length >= 6) {
      event.target.checked = false;
      showToast("当季热销最多选择 6 款");
      return;
    }
    state.homepage.hotProductIds = event.target.checked
      ? [...state.homepage.hotProductIds, hotId]
      : state.homepage.hotProductIds.filter(id => id !== hotId);
    renderView();
    return;
  }

  const caseId = event.target.dataset.homeCase;
  if (caseId) {
    if (event.target.checked && state.homepage.cases.length >= 5) {
      event.target.checked = false;
      showToast("成衣案例最多选择 5 个");
      return;
    }
    if (event.target.checked) {
      const item = state.cases.find(candidate => candidate.id === caseId);
      if (item) state.homepage.cases.push({ id: item.id, title: item.title, category: item.category, productId: item.productId || item.product, image: item.image, images: item.images || [item.image] });
    } else {
      state.homepage.cases = state.homepage.cases.filter(item => item.id !== caseId);
    }
    renderView();
  }
});

document.addEventListener("submit", async event => {
  if (event.target.id === "caseEditorForm") {
    event.preventDefault();
    await saveCaseEditor();
    return;
  }
  if (event.target.id !== "homepagePageForm") return;
  event.preventDefault();
  const saveButton = event.submitter;
  if (saveButton) { saveButton.disabled = true; saveButton.textContent = "正在同步…"; }
  try {
    await writeHomepage();
    renderView();
    showToast("首页配置已同步到小程序");
  } catch (error) {
    if (saveButton) { saveButton.disabled = false; saveButton.textContent = "保存并同步小程序"; }
    showToast(`首页配置保存失败：${cloudErrorMessage(error)}`);
  }
});

$("#createProduct").addEventListener("click", () => openProductEditor());

async function loadPreviewMiniQr() {
  const stateBox = $("#previewMiniState");
  const qrBox = $("#previewMiniQr");
  const page = $("#previewMiniPage").value || "pages/index/index";
  stateBox.hidden = false;
  stateBox.className = "preview-mini-state";
  stateBox.textContent = "正在生成预览二维码…";
  qrBox.hidden = true;
  qrBox.innerHTML = "";
  try {
    const result = await apiRequest(`/wechat/preview-code?page=${encodeURIComponent(page)}`);
    const image = document.createElement("img");
    image.src = result.data.image;
    image.alt = "小程序预览二维码";
    qrBox.append(image);
    qrBox.hidden = false;
    stateBox.hidden = true;
  } catch (error) {
    stateBox.className = "preview-mini-state is-error";
    stateBox.textContent = cloudErrorMessage(error);
  }
}

async function openPreviewMini() {
  const dialog = $("#previewMiniDialog");
  $("#previewMiniPage").value = "pages/index/index";
  dialog.showModal();
  await loadPreviewMiniQr();
}

$("#previewMini").addEventListener("click", openPreviewMini);
$("#previewMiniPage").addEventListener("change", loadPreviewMiniQr);
$("#refreshPreviewMini").addEventListener("click", loadPreviewMiniQr);
$("#closePreviewMini").addEventListener("click", () => $("#previewMiniDialog").close());
$("#donePreviewMini").addEventListener("click", () => $("#previewMiniDialog").close());
$("#globalSearch").addEventListener("input", () => { if (currentView === "products") renderView(); });
$("#globalSearch").addEventListener("keydown", event => { if (event.key === "Enter" && currentView !== "products") setView("products"); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && caseEditorDraft) { caseEditorDraft = null; renderView(); return; }
  if (event.key === "Escape" && homePickerType) { homePickerType = null; renderView(); return; }
  if (event.key === "Escape" && !$("#tagDrawer").hidden) { closeTagSelector(true); return; }
  if (event.key === "Escape" && !$("#categoryDrawer").hidden) { closeCategorySelector(true); return; }
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); $("#globalSearch").focus(); }
});

$("#productForm").addEventListener("input", updateProductPreview);
$("#productForm").addEventListener("submit", event => { event.preventDefault(); saveProduct("live"); });
$("#closeProduct").addEventListener("click", () => $("#productDialog").close());
$("#saveDraft").addEventListener("click", () => saveProduct("draft"));
$("#takeOfflineProduct").addEventListener("click", () => saveProduct("offline"));
$("#addSpec").addEventListener("click", () => addRepeatRow($("#customSpecs"), "spec"));
$("#addUse").addEventListener("click", () => addRepeatRow($("#usesList"), "use"));
$("#openTagDrawer").addEventListener("click", openTagSelector);
$("#tagInlineInput").addEventListener("focus", openTagSelector);
$("#tagInlineInput").addEventListener("keydown", event => {
  if (["Enter", ",", "，"].includes(event.key)) { event.preventDefault(); commitInlineTags(); }
});
$("#tagInlineInput").addEventListener("input", event => {
  if (!$("#tagDrawer").hidden) renderTagDrawer(event.currentTarget.value);
});
$("#tagInlineInput").addEventListener("blur", () => { if ($("#tagInlineInput").value.trim()) commitInlineTags(); });
$("#confirmTags").addEventListener("click", () => {
  if ($("#tagInlineInput").value.trim()) commitInlineTags();
  state.tagLibrary = [...new Set([...state.tagLibrary, ...drawerPendingTags])];
  selectedFeatureTags = [...drawerSelectedTags];
  renderTagField(); updateProductPreview(); persist();
  $("#tagInlineInput").value = "";
  $("#tagDrawer").hidden = true;
  showToast("特色标签已确认");
});
$("#closeTagDrawer").addEventListener("click", () => closeTagSelector(true));
$("#cancelTagDrawer").addEventListener("click", () => closeTagSelector(true));

$("#openCategoryDrawer").addEventListener("click", event => { event.stopPropagation(); openCategorySelector(); });
$("#backCategoryGroups").addEventListener("click", () => { activeCategoryGroupId = null; renderCategoryDrawer(); });
$("#confirmCategories").addEventListener("click", () => {
  selectedCategoryIds = [...categoryDrawerSelectedIds];
  $("#categoryDrawer").hidden = true;
  activeCategoryGroupId = null;
  renderCategoryField(); updateProductPreview();
  showToast("产品分类已确认");
});
$("#closeCategoryDrawer").addEventListener("click", () => closeCategorySelector(true));
$("#cancelCategoryDrawer").addEventListener("click", () => closeCategorySelector(true));

$("#categoryManageForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const values = Object.fromEntries(new FormData(form).entries());
  const name = values.name.trim();
  const snapshot = categoryManageContext.snapshot;
  try {
    if (values.mode === "group") {
      if (state.categories.some(group => group.name === name && group.id !== values.editId)) throw new Error("已经存在同名一级分类");
      if (values.editId) {
        const group = state.categories.find(item => item.id === values.editId);
        group.name = name;
        group.selectionMode = values.selectionMode;
      } else {
        let id = categorySlug(name);
        if (state.categories.some(group => group.id === id)) id = `${id}-${Date.now().toString(36)}`;
        state.categories.push({ id, name, selectionMode: values.selectionMode, tags: [] });
      }
    } else {
      const targetGroup = state.categories.find(item => item.id === values.parentId);
      if (targetGroup.tags.some(tag => tag.name === name && tag.id !== values.editId)) throw new Error("该一级分类中已经存在同名标签");
      if (values.editId) {
        const sourceGroup = state.categories.find(group => group.tags.some(tag => tag.id === values.editId));
        const tag = sourceGroup.tags.find(item => item.id === values.editId);
        sourceGroup.tags = sourceGroup.tags.filter(item => item.id !== values.editId);
        targetGroup.tags.push({ ...tag, name });
      } else {
        let id = `${targetGroup.id}-${categorySlug(name)}`;
        if (allCategoryTags().some(tag => tag.id === id)) id = `${id}-${Date.now().toString(36)}`;
        targetGroup.tags.push({ id, name });
      }
    }
    await writeCategories();
    $("#categoryManageDialog").close();
    renderView();
    showToast("分类库已更新");
  } catch (error) {
    state.categories = snapshot;
    showToast(`分类保存失败：${cloudErrorMessage(error)}`);
  }
});
$("#closeCategoryManage").addEventListener("click", () => $("#categoryManageDialog").close());
$("#cancelCategoryManage").addEventListener("click", () => $("#categoryManageDialog").close());
$("#returnToCategories").addEventListener("click", () => { pendingSaveStatus = null; $("#categoryWarningDialog").close(); openCategorySelector(); });
$("#continueSaveProduct").addEventListener("click", () => {
  const status = pendingSaveStatus;
  pendingSaveStatus = null;
  $("#categoryWarningDialog").close();
  saveProduct(status, true);
});

$("#homeForm").addEventListener("submit", event => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(event.currentTarget).entries());
  state.homepage = values;
  persist();
  $("#homeDialog").close();
  renderView();
  showToast("首页主推配置已保存");
});
$("#closeHome").addEventListener("click", () => $("#homeDialog").close());
$("#cancelHome").addEventListener("click", () => $("#homeDialog").close());

async function bootAdmin() {
  if (bootInFlight) return bootInFlight;
  bootInFlight = bootAdminOnce();
  try {
    return await bootInFlight;
  } finally {
    bootInFlight = null;
  }
}

async function bootAdminOnce() {
  const loginScreen = $("#loginScreen");
  const adminShell = $("#adminShell");
  try {
    await apiRequest("/auth/me");
    loginScreen.hidden = true;
    // Keep the shell hidden while startup data is loading. Showing the shell
    // first and replacing it with the final view looks like repeated refreshes.
    adminShell.hidden = true;
  } catch {
    loginScreen.hidden = false;
    adminShell.hidden = true;
    return;
  }
  if (needsTagLibraryCleanup) persist();
  else updateCounts();
  $("#appView").innerHTML = '<div class="view-loading" role="status">正在加载后台数据…</div>';
  Promise.allSettled([
    loadCategories(false),
    loadCloudProducts(false),
    loadCases(false),
    loadHomepage(false),
    loadOperationalData(false)
  ])
    .then(() => consumePendingProductImport())
    .then(() => {
      updateCounts();
      renderView();
      adminShell.hidden = false;
    });
}

$("#loginForm").addEventListener("submit", async event => {
  event.preventDefault();
  const form = event.currentTarget;
  const button = form.querySelector("button[type=submit]");
  const errorBox = $("#loginError");
  const values = Object.fromEntries(new FormData(form).entries());
  errorBox.hidden = true;
  button.disabled = true;
  button.querySelector("span").textContent = "正在验证…";
  try {
    await apiRequest("/auth/login", { method: "POST", body: JSON.stringify(values) });
    await bootAdmin();
    form.reset();
  } catch (error) {
    errorBox.textContent = /401|账号|密码/i.test(error.message) ? "账号或密码不正确，请重新输入。" : "暂时无法连接后台，请稍后重试。";
    errorBox.hidden = false;
  } finally {
    button.disabled = false;
    button.querySelector("span").textContent = "进入后台";
  }
});

bootAdmin();
