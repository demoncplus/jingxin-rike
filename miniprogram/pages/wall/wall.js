const storage = require('../../utils/storage');

const TAGS = ['亲人', '朋友', '病患', '自己', '众生'];

Page({
  data: {
    text: '',
    to: '',
    tag: TAGS[4],
    tags: TAGS,
    items: []
  },

  onShow() {
    this.setData({ items: storage.getWall() });
  },

  inputText(e) { this.setData({ text: e.detail.value }); },
  inputTo(e) { this.setData({ to: e.detail.value }); },
  pickTag(e) { this.setData({ tag: e.currentTarget.dataset.t }); },

  submit() {
    const text = (this.data.text || '').trim();
    if (!text) {
      wx.showToast({ title: '写一句回向的话吧', icon: 'none' });
      return;
    }
    const t = new Date();
    const date = (t.getMonth() + 1) + '月' + t.getDate() + '日';
    storage.addWall({
      id: Date.now(),
      text,
      to: (this.data.to || '').trim() || '一切众生',
      tag: this.data.tag,
      date
    });
    this.setData({ items: storage.getWall(), text: '', to: '' });
    wx.showToast({ title: '已上墙，功不唐捐 🙏', icon: 'none', duration: 2000 });
  },

  removeItem(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '删除这条回向？',
      success: (r) => {
        if (r.confirm) {
          storage.removeWall(id);
          this.setData({ items: storage.getWall() });
        }
      }
    });
  },

  openDonation() { this.selectComponent('#donationSheet').open(); }
});
