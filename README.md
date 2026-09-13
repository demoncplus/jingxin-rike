# 静心日课 · 线上佛学自修（方案A：零成本起步）

个人佛学自修工具，**微信小程序 + 静态网站** 双端：

> 🌐 **网站已上线：** <https://demoncplus.github.io/jingxin-rike/>
> （源码仓库：<https://github.com/demoncplus/jingxin-rike>，网站更新运行 `tools/deploy-website.sh` 即可）

- 📿 念佛计数（本地存储、每日目标、进度）
- 📖 经文诵读（心经 / 大悲咒 / 往生咒 / 准提咒 / 日课简轨 / 回向文，字号调节、夜间模式）
- 🪷 回向墙（写心愿、本地保存，预留云端同步接口）
- 🧧 功德箱（**收款入口全站唯一配置、双模式切换**，见下）
- 首页农历日历 + 每日一句（1900–2100 万年历数据，离线计算）

## 项目结构

```
miniprogram/          微信小程序（原生框架，无需构建，直接用微信开发者工具打开）
  config/donation.js  ★ 收款入口唯一配置（redirect / self 双模式）
  config/content.js     每日一句
  data/sutras.js        经文数据（扩充在此追加）
  utils/lunar.js        农历换算（网站复用同一份）
  utils/storage.js      本地存储层（未来云端同步的接入点）
  components/donation-sheet/  功德箱弹层（含微信支付完整代码路径）
  pages/                index 日课 / count 念佛 / sutra 经文 / wall 回向 / me 我的
website/              静态网站（免费托管可用：Cloudflare Pages / GitHub Pages）
  index.html / css/style.css / js/{lunar,config,app}.js
docs/
  上线与升级指南.md      小程序注册提审、网站部署、后续收款升级清单
  收款接口契约.md        自收款后端的 API 约定（前后端按此对接）
```

## 快速开始

**小程序**：微信开发者工具 → 导入项目 → 选择 `miniprogram/` 目录（AppID 先用默认测试号，注册个人小程序后换成自己的）。

**网站**：已部署在 GitHub Pages（gh-pages 分支）。本地预览直接双击 `website/index.html`；以后改动 `website/` 后运行 `bash tools/deploy-website.sh` 即可重新发布（约 1 分钟生效）。

## 收款双模式（关键设计）

所有"随喜/功德箱"入口都由 `config/donation.js` 的 `mode` 一个开关驱动，页面代码零改动：

| mode | 行为 | 适用阶段 |
|---|---|---|
| `redirect`（当前） | 展示官方公益渠道，复制链接/跳转，平台不碰钱 | 方案A，零合规风险 |
| `self` | 选金额 → 调后端下单 → 唤起微信支付（代码已写好，填入 `apiBase` 即通） | 取得资质、部署后端后 |

⚠️ 自收款上线前必须完成主体与许可等资质（个人主体小程序**无法**开通微信支付），完整清单见
[docs/上线与升级指南.md](docs/上线与升级指南.md) 与 [docs/收款接口契约.md](docs/收款接口契约.md)。

## 待办（上线前需要你替换）

- [ ] `miniprogram/project.config.json` 换成你的 AppID
- [ ] `config/donation.js` 与 `website/js/config.js` 里的公益项目链接（现为腾讯公益首页占位）
- [ ] 小程序名称：个人主体建议避开宗教类目词，如「静心日课」
- [ ] 网站部署后把小程序「我的」页中的官网链接补上
