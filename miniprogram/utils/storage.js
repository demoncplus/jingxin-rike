/**
 * 本地存储层（封装 wx.storage）
 * 设计说明：所有读写都收敛在这一层，未来接入云端同步 / 自收款后端时，
 * 只需在方法内加"先读云端、本地兜底"的逻辑，页面代码不用动。
 */
const KEYS = {
  counts: 'rike_counts',     // { 'YYYY-MM-DD': n } 每日念佛数
  target: 'rike_target',     // 每日目标
  wall: 'rike_wall',         // 回向墙（本地）
  fontSize: 'rike_font_size',
  dark: 'rike_dark'
};

function todayKey(d) {
  const t = d || new Date();
  const m = t.getMonth() + 1;
  const day = t.getDate();
  return t.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
}

function getObj(key, fallback) {
  try {
    const v = wx.getStorageSync(key);
    return v ? v : (fallback || {});
  } catch (e) { return fallback || {}; }
}

// —— 念佛计数 ——
function addCount(n) {
  const obj = getObj(KEYS.counts, {});
  const k = todayKey();
  obj[k] = (obj[k] || 0) + n;
  wx.setStorageSync(KEYS.counts, obj);
  return obj[k];
}
function todayCount() { return getObj(KEYS.counts, {})[todayKey()] || 0; }
function monthCount() {
  const obj = getObj(KEYS.counts, {});
  const prefix = todayKey().slice(0, 7);
  let sum = 0;
  Object.keys(obj).forEach((k) => { if (k.indexOf(prefix) === 0) sum += obj[k]; });
  return sum;
}
function getTarget() { const t = wx.getStorageSync(KEYS.target); return t || 108; }
function setTarget(n) { wx.setStorageSync(KEYS.target, n); }

// —— 回向墙（本地版；二期接入 cfg.self.endpoints.wall 云同步） ——
function getWall() { return getObj(KEYS.wall, { items: [] }).items || []; }
function addWall(item) {
  const obj = getObj(KEYS.wall, { items: [] });
  obj.items.unshift(item);
  wx.setStorageSync(KEYS.wall, obj);
}
function removeWall(id) {
  const obj = getObj(KEYS.wall, { items: [] });
  obj.items = obj.items.filter((it) => it.id !== id);
  wx.setStorageSync(KEYS.wall, obj);
}

// —— 阅读器设置 ——
function getFontSizeIndex(max) {
  const i = wx.getStorageSync(KEYS.fontSize);
  return (i === 0 || i) ? i : 1;
}
function setFontSizeIndex(i) { wx.setStorageSync(KEYS.fontSize, i); }
function getDark() { return !!wx.getStorageSync(KEYS.dark); }
function setDark(v) { wx.setStorageSync(KEYS.dark, !!v); }

function clearAll() {
  Object.keys(KEYS).forEach((k) => { try { wx.removeStorageSync(KEYS[k]); } catch (e) {} });
}

module.exports = {
  todayKey, addCount, todayCount, monthCount,
  getTarget, setTarget,
  getWall, addWall, removeWall,
  getFontSizeIndex, setFontSizeIndex, getDark, setDark,
  clearAll
};
