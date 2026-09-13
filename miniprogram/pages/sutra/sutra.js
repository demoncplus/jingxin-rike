const SUTRAS = require('../../data/sutras');

Page({
  data: { groups: [] },

  onLoad() {
    const groups = [];
    SUTRAS.forEach((s) => {
      let g = groups.find((x) => x.category === s.category);
      if (!g) { g = { category: s.category, items: [] }; groups.push(g); }
      g.items.push(s);
    });
    this.setData({ groups });
  },

  openDetail(e) {
    wx.navigateTo({ url: '/pages/sutra/sutra-detail?id=' + e.currentTarget.dataset.id });
  }
});
