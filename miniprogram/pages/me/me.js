const storage = require('../../utils/storage');

const ABOUT_TEXT = '「静心日课」是一个线上佛学自修小工具：念佛计数、诵读经文、记录回向。' +
  '本小程序为个人开发的学习工具，定位为传统文化学习与个人修行辅助，不代收任何款项，' +
  '随喜渠道均为官方公益平台。';

Page({
  data: {
    version: '1.0.0',
    todayCount: 0
  },

  onShow() {
    this.setData({ todayCount: storage.todayCount() });
  },

  openDonation() { this.selectComponent('#donationSheet').open(); },

  showAbout() {
    wx.showModal({ title: '关于静心日课', content: ABOUT_TEXT, showCancel: false });
  },

  showPrivacy() {
    wx.showModal({
      title: '数据与隐私',
      content: '你的念佛计数、回向内容与阅读设置全部保存在手机本地，不收集、不上传任何个人信息。',
      showCancel: false
    });
  },

  clearData() {
    wx.showModal({
      title: '清除本地数据',
      content: '将删除念佛计数、回向墙与阅读设置，且无法恢复。确定继续吗？',
      confirmText: '清除',
      confirmColor: '#9e3d33',
      success: (r) => {
        if (r.confirm) {
          storage.clearAll();
          this.setData({ todayCount: 0 });
          wx.showToast({ title: '已清除', icon: 'success' });
        }
      }
    });
  }
});
