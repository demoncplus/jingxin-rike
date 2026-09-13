/**
 * 功德箱 / 随喜 —— 全站唯一的收款入口配置文件
 *
 * 【现在（方案A）】 mode = 'redirect'
 *   平台不代收任何款项：用户点击后复制链接或跳转官方公益平台（腾讯公益等），
 *   善款直接进入项目方对公账户，本项目零合规风险。
 *
 * 【未来上线自收款】 只需三步，前端页面代码一行不用改：
 *   1. 取得《互联网宗教信息服务许可证》等资质（见 docs/上线与升级指南.md）；
 *   2. 按 docs/收款接口契约.md 部署后端，把 apiBase 填上；
 *   3. 把 mode 改为 'self'。
 *   支付面板会自动切换为"选金额 → 微信支付"的完整流程。
 */
const DONATION_CONFIG = {
  mode: 'redirect', // 'redirect' = 跳转公益平台 | 'self' = 自有微信支付

  // —— 方案A：跳转 / 复制链接模式 ——
  redirect: {
    tip: '本小程序不代收善款。随喜请前往官方公益平台，善款直达项目方对公账户。',
    channels: [
      {
        id: 'gongyi',
        name: '腾讯公益',
        desc: '民政部首批指定互联网募捐平台，可开捐赠证书与票据',
        // TODO: 上线时替换为你想支持的具体项目页链接
        link: 'https://gongyi.qq.com/',
        // 如需在小程序内直接跳到腾讯公益小程序：填入其 AppID 与路径即可启用
        miniProgramAppId: '',
        miniProgramPath: ''
      }
    ]
  },

  // —— 未来：自收款模式（升级时启用） ——
  self: {
    tip: '随喜将用于经书印制、场地维护与线上服务的持续运行。',
    apiBase: '', // TODO: 部署后端后填入，如 https://api.example.com
    presetAmounts: [1, 6, 10, 66, 88, 366],
    endpoints: {
      createOrder: '/api/donation/orders',  // POST 下单 → 返回微信支付参数
      orderStatus: '/api/donation/orders/', // GET + orderId 查询支付结果
      wall: '/api/wall'                     // 回向墙云同步（可选，二期）
    }
  }
};

module.exports = DONATION_CONFIG;
