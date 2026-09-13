/**
 * 功德箱 / 随喜 弹层组件
 * 行为完全由 config/donation.js 的 mode 驱动：
 *  - redirect：展示官方公益渠道，复制链接或跳转小程序（平台不碰钱）
 *  - self：金额选择 + wx.requestPayment 完整支付链路（后端就绪后自动可用）
 */
const cfg = require('../../config/donation');

Component({
  data: {
    visible: false,
    mode: cfg.mode,
    tip: '',
    amounts: cfg.self.presetAmounts,
    amount: cfg.self.presetAmounts[2],
    channels: cfg.redirect.channels
  },

  methods: {
    open() {
      this.setData({ visible: true, tip: cfg.mode === 'self' ? cfg.self.tip : cfg.redirect.tip });
    },
    close() { this.setData({ visible: false }); },
    noop() {},

    pickAmount(e) { this.setData({ amount: e.currentTarget.dataset.item }); },

    goChannel(e) {
      const ch = cfg.redirect.channels[e.currentTarget.dataset.index];
      if (ch.miniProgramAppId) {
        wx.navigateToMiniProgram({
          appId: ch.miniProgramAppId,
          path: ch.miniProgramPath || '',
          fail: () => this.copyLink(ch.link)
        });
      } else {
        this.copyLink(ch.link);
      }
    },

    copyLink(link) {
      wx.setClipboardData({
        data: link,
        success: () => wx.showToast({ title: '链接已复制，请在微信中打开', icon: 'none', duration: 2500 })
      });
    },

    paySelf() {
      if (!cfg.self.apiBase) {
        wx.showToast({ title: '自收款尚未开通', icon: 'none' });
        return;
      }
      wx.request({
        url: cfg.self.apiBase + cfg.self.endpoints.createOrder,
        method: 'POST',
        data: { amount: this.data.amount, channel: 'wechat_pay' },
        success: (res) => {
          const pay = res.data && res.data.payParams;
          if (!pay) {
            wx.showToast({ title: '下单失败，请稍后再试', icon: 'none' });
            return;
          }
          wx.requestPayment({
            timeStamp: pay.timeStamp,
            nonceStr: pay.nonceStr,
            package: pay.package,
            signType: pay.signType,
            paySign: pay.paySign,
            success: () => {
              wx.showToast({ title: '随喜成功，功德无量', icon: 'success', duration: 2500 });
              this.close();
            },
            fail: () => {} // 用户取消支付，静默处理
          });
        },
        fail: () => wx.showToast({ title: '网络错误', icon: 'none' })
      });
    }
  }
});
