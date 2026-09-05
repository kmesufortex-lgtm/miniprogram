const products = {
  FA227: {
    id: "FA227",
    code: "FA227",
    name: "TR 羊毛混纺系列",
    description: "融合聚酯、人造丝与羊毛优势，兼顾挺括、垂感与日常耐穿。",
    quoteLabel: "咨询报价",
    categoryIds: [
      "composition-tr", "composition-wool", "composition-polyester", "composition-blend",
      "usage-suit", "usage-trousers", "handfeel-drape", "handfeel-crisp",
      "feature-wrinkle", "season-all"
    ],
    composition: "62% POLYESTER · 26% RAYON · 9% WOOL · 3% SP",
    weight: "240GSM",
    width: "150CM",
    colorCount: 22,
    colorRange: "NO.01 — NO.22",
    featureTags: [],
    gallery: [
      "/assets/fabrics/FA227/swatch.jpg",
      "/assets/fabrics/FA227/texture.jpg",
      "/assets/fabrics/FA227/look-olive.jpg",
      "/assets/fabrics/FA227/look-black.jpg"
    ],
    detailImages: [
      "/assets/fabrics/FA227/card.jpg",
      "/assets/fabrics/FA227/look-olive.jpg",
      "/assets/fabrics/FA227/look-black.jpg"
    ],
    colorCardImages: ["/assets/fabrics/FA227/colors.jpg"],
    uses: [
      { title: "都市西装", description: "适合成套西装及外套。" },
      { title: "通勤单品", description: "可用于裤装、半裙与马甲。" }
    ],
    sampleImage: "/assets/fabrics/FA227/swatch.jpg"
  },
  FA218: {
    id: "FA218",
    code: "FA218",
    name: "耐磨弹力斜纹",
    description: "细密斜纹兼顾耐磨与弹力，适合日常城市户外单品。",
    quoteLabel: "咨询报价",
    categoryIds: [
      "composition-polyester", "composition-blend", "usage-jacket", "usage-trousers",
      "handfeel-crisp", "feature-stretch", "feature-waterproof", "season-spring-autumn"
    ],
    composition: "94% POLYESTER · 6% SP",
    weight: "210GSM",
    width: "150CM",
    colorCount: 12,
    colorRange: "NO.01 — NO.12",
    featureTags: [],
    gallery: [
      "/assets/fabrics/FA227/look-olive.jpg",
      "/assets/fabrics/FA227/texture.jpg",
      "/assets/fabrics/FA227/swatch.jpg"
    ],
    detailImages: [
      "/assets/fabrics/FA227/look-olive.jpg",
      "/assets/fabrics/FA227/look-black.jpg"
    ],
    colorCardImages: ["/assets/fabrics/FA227/colors.jpg"],
    uses: [{ title: "城市户外", description: "适合夹克、工装裤与功能半裙。" }],
    sampleImage: "/assets/fabrics/FA227/look-olive.jpg"
  },
  FA294: {
    id: "FA294",
    code: "FA294",
    name: "羊毛亚麻混纺TR",
    description: "混纺美学、自然肌理与舒适垂坠，呈现简约都市穿着风格。",
    quoteLabel: "咨询报价",
    categoryIds: [],
    composition: "60% POLYESTER · 30% RAYON · 5% LINEN · 3% WOOL · 2% SP",
    weight: "230GSM",
    width: "148CM",
    colorCount: 14,
    colorRange: "NO.01 — NO.14",
    featureTags: ["原麻风", "天丝亚麻"],
    gallery: ["/assets/fabrics/FA294/swatch.jpg"],
    detailImages: ["/assets/fabrics/FA294/swatch.jpg"],
    colorCardImages: [],
    uses: [],
    sampleImage: "/assets/fabrics/FA294/swatch.jpg"
  }
};

function getProductById(id) {
  return products[id] || null;
}

function getAllProducts() {
  return Object.values(products);
}

module.exports = {
  getProductById,
  getAllProducts
};
