const SUTRAS = require('../../data/sutras');
const storage = require('../../utils/storage');

const FONT_STEPS = [26, 30, 34, 38, 42]; // rpx

Page({
  data: {
    sutra: null,
    fontIndex: 1,
    fontSize: 34,
    dark: false
  },

  onLoad(query) {
    const sutra = SUTRAS.find((s) => s.id === query.id) || SUTRAS[0];
    const fontIndex = storage.getFontSizeIndex();
    this.setData({
      sutra,
      fontIndex,
      fontSize: FONT_STEPS[fontIndex],
      dark: storage.getDark()
    });
    wx.setNavigationBarTitle({ title: sutra.alias });
  },

  zoomIn() { this.stepFont(this.data.fontIndex + 1); },
  zoomOut() { this.stepFont(this.data.fontIndex - 1); },

  stepFont(i) {
    if (i < 0 || i >= FONT_STEPS.length) return;
    storage.setFontSizeIndex(i);
    this.setData({ fontIndex: i, fontSize: FONT_STEPS[i] });
  },

  toggleDark() {
    const dark = !this.data.dark;
    storage.setDark(dark);
    this.setData({ dark });
  },

  copyAll() {
    const s = this.data.sutra;
    wx.setClipboardData({
      data: s.title + '\n\n' + s.paragraphs.join('\n\n'),
      success: () => wx.showToast({ title: '全文已复制', icon: 'success' })
    });
  }
});
