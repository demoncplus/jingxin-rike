const Lunar = require('../../utils/lunar');
const { QUOTES } = require('../../config/content');
const storage = require('../../utils/storage');

Page({
  data: {
    dateText: '',
    weekText: '',
    lunarText: '',
    gzText: '',
    quote: '',
    monthCount: 0,
    wallCount: 0
  },

  onShow() {
    const t = new Date();
    const info = Lunar.getTodayInfo(t);
    const doy = Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 86400000);
    this.setData({
      dateText: info.solarText,
      weekText: info.weekText,
      lunarText: info.lunarText,
      gzText: info.gzText,
      quote: QUOTES[doy % QUOTES.length],
      monthCount: storage.monthCount(),
      wallCount: storage.getWall().length
    });
  },

  goCount() { wx.switchTab({ url: '/pages/count/count' }); },
  goSutra() { wx.switchTab({ url: '/pages/sutra/sutra' }); },
  goWall() { wx.switchTab({ url: '/pages/wall/wall' }); },
  openDonation() { this.selectComponent('#donationSheet').open(); }
});
