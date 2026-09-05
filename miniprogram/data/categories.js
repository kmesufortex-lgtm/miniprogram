const groups = [
  ["composition", "按成分", "multiple", [["acetate", "醋酸"], ["tencel", "天丝"], ["cotton", "棉"], ["rayon-cotton", "人棉"], ["rayon-silk", "人丝"], ["linen", "亚麻"], ["cotton-linen", "棉麻"], ["silk", "桑蚕丝"], ["wool", "羊毛"], ["nylon", "锦纶"], ["polyester", "涤纶"], ["tr", "TR"], ["cvc", "CVC"], ["tencel-cotton", "天丝棉"], ["blend", "混纺"], ["other", "其他"]]],
  ["usage", "按用途", "multiple", [["dress", "连衣裙"], ["skirt", "半身裙"], ["shirt", "衬衫"], ["trousers", "女裤"], ["suit", "西装套装"], ["outerwear", "外套"], ["trench", "风衣"], ["jacket", "夹克"], ["vest", "马甲"], ["coat", "大衣"], ["gown", "礼服"], ["hanfu", "汉服"], ["workwear", "职业装"], ["homewear", "家居服"]]],
  ["handfeel", "按手感", "multiple", [["drape", "垂感"], ["soft", "柔软"], ["flowy", "飘逸"], ["crisp", "挺括"], ["smooth", "顺滑"], ["skin", "亲肤"], ["light", "轻盈"], ["thick", "厚实"], ["fluffy", "蓬松"], ["fine", "细腻"], ["waxy", "糯感"], ["bodied", "有筋骨"]]],
  ["craft", "按工艺", "multiple", [["jacquard", "提花"], ["print", "印花"], ["yarn-dyed", "色织"], ["embroidery", "刺绣"], ["crinkle", "压皱"], ["sandwash", "砂洗"], ["brushed", "磨毛"], ["raised", "起绒"], ["foil", "烫金"], ["texture", "肌理组织"]]],
  ["feature", "按特性", "multiple", [["wrinkle", "抗皱"], ["stretch", "弹力"], ["fourway", "四面弹"], ["microstretch", "微弹"], ["cooling", "凉感"], ["breathable", "透气"], ["wicking", "吸湿排汗"], ["sunproof", "防晒"], ["waterproof", "防水"], ["opaque", "不透"], ["lustrous", "有光泽"], ["matte", "哑光"], ["textured", "肌理感"]]],
  ["season", "按季节", "single", [["spring-summer", "春夏"], ["spring-autumn", "春秋"], ["autumn-winter", "秋冬"], ["all", "四季"]]],
  ["trend", "热门趋势", "multiple", [["oldmoney", "老钱风"], ["quietluxury", "静奢风"], ["hanfu", "国风汉服"], ["newchinese", "新中式"]]]
];

const categories = groups.map(([id, name, selectionMode, tags]) => ({
  id,
  name,
  selectionMode,
  tags: tags.map(([suffix, tagName]) => ({ id: `${id}-${suffix}`, name: tagName }))
}));

module.exports = { categories };
