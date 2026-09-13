const storage = require('../../utils/storage');

const TARGETS = [108, 216, 540, 1080];

Page({
  data: {
    session: 0,
    today: 0,
    target: 108,
    percent: 0,
    targets: TARGETS,
    phrase: '南无阿弥陀佛'
  },

  onShow() {
    this.setData({
      session: 0,
      today: storage.todayCount(),
      target: storage.getTarget()
    });
    this.calc();
  },

  calc() {
    const percent = Math.min(100, Math.round(this.data.today / this.data.target * 100));
    this.setData({ percent });
  },

  tapCount() {
    storage.addCount(1);
    const session = this.data.session + 1;
    this.setData({ session, today: this.data.today + 1 });
    if (session > 0 && session % 108 === 0) {
      wx.showToast({ title: '一串圆满 🪷', icon: 'none', duration: 1500 });
    }
    wx.vibrateShort({ type: 'light' });
    this.calc();
  },

  resetSession() { this.setData({ session: 0 }); },

  pickTarget(e) {
    const t = Number(e.currentTarget.dataset.t);
    storage.setTarget(t);
    this.setData({ target: t });
    this.calc();
  }
});
