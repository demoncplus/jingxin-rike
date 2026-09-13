/**
 * 静心日课 · 网站交互
 * 依赖：js/lunar.js（window.Lunar）、js/config.js（window.SITE_CONFIG）
 */
(function () {
  'use strict';
  const cfg = window.SITE_CONFIG;
  const LS = {
    counts: 'rike_counts_web',
    wall: 'rike_wall_web'
  };

  function todayKey(d) {
    const t = d || new Date();
    const m = t.getMonth() + 1;
    const day = t.getDate();
    return t.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  // —— 首屏：日期 / 农历 / 每日一句 ——
  (function renderHero() {
    const t = new Date();
    const info = window.Lunar.getTodayInfo(t);
    document.getElementById('heroSolar').textContent = info.solarText;
    document.getElementById('heroWeek').textContent = info.weekText;
    document.getElementById('heroLunar').textContent = info.lunarText;
    document.getElementById('heroGz').textContent = info.gzText;
    const doy = Math.floor((t - new Date(t.getFullYear(), 0, 0)) / 86400000);
    document.getElementById('heroQuote').textContent = '“' + cfg.quotes[doy % cfg.quotes.length] + '”';
    document.getElementById('footerYear').textContent = '© ' + t.getFullYear() + ' ' + cfg.name;
  })();

  // —— 念佛计数（本机存储） ——
  (function counter() {
    function getCounts() {
      try { return JSON.parse(localStorage.getItem(LS.counts) || '{}'); } catch (e) { return {}; }
    }
    function saveCounts(o) { localStorage.setItem(LS.counts, JSON.stringify(o)); }

    let session = 0;
    const elSession = document.getElementById('webSession');
    const elSession2 = document.getElementById('webSession2');
    const elToday = document.getElementById('webToday');

    function refresh() {
      elSession.textContent = session;
      elSession2.textContent = session;
      elToday.textContent = getCounts()[todayKey()] || 0;
    }

    document.getElementById('webCounter').addEventListener('click', function () {
      const o = getCounts();
      const k = todayKey();
      o[k] = (o[k] || 0) + 1;
      saveCounts(o);
      session += 1;
      refresh();
    });

    document.getElementById('webReset').addEventListener('click', function () {
      session = 0;
      refresh();
    });

    refresh();
  })();

  // —— 回向墙（本机存储；二期接 cfg.donation.self 接口云同步） ——
  (function wall() {
    const list = document.getElementById('wallList');
    const inTo = document.getElementById('wallTo');
    const inText = document.getElementById('wallText');

    function getItems() {
      try { return JSON.parse(localStorage.getItem(LS.wall) || '[]'); } catch (e) { return []; }
    }
    function saveItems(a) { localStorage.setItem(LS.wall, JSON.stringify(a)); }

    function render() {
      const items = getItems();
      if (!items.length) {
        list.innerHTML = '<div class="wall-empty">还没有回向，写下第一句吧 🪷</div>';
        return;
      }
      list.innerHTML = items.map(function (it) {
        return '<div class="wall-item">' +
          '<div class="to"><span>回向给 · ' + escapeHtml(it.to) + '</span><small>' + it.date + '</small></div>' +
          '<div class="txt">' + escapeHtml(it.text) + '</div>' +
          '<span class="tag">' + escapeHtml(it.tag) + '</span>' +
          '</div>';
      }).join('');
    }

    document.getElementById('wallSubmit').addEventListener('click', function () {
      const text = inText.value.trim();
      if (!text) { alert('写一句回向的话吧'); return; }
      const t = new Date();
      const items = getItems();
      items.unshift({
        id: Date.now(),
        text: text,
        to: inTo.value.trim() || '一切众生',
        tag: '众生',
        date: (t.getMonth() + 1) + '月' + t.getDate() + '日'
      });
      saveItems(items);
      inText.value = '';
      inTo.value = '';
      render();
    });

    render();
  })();

  // —— 功德箱 / 随喜（与小程序同一配置驱动） ——
  (function donation() {
    const box = document.getElementById('donateChannels');
    const d = cfg.donation;
    document.getElementById('donateTip').textContent = d.mode === 'self' ? d.self.tip : d.redirect.tip;

    if (d.mode === 'self') {
      // 自收款模式：金额选择 → 调后端下单 → 唤起微信支付（JSAPI 需要 OpenID，网页端用 H5/Native 支付，契约见 docs/收款接口契约.md）
      box.innerHTML =
        '<div class="card"><div class="donate-name">选择随喜金额</div>' +
        '<div class="donate-actions" id="amounts"></div>' +
        '<div class="donate-actions"><button class="btn" id="selfPay">微信支付 · 随喜</button></div></div>';
      const amounts = document.getElementById('amounts');
      let amount = d.self.presetAmounts[2];
      d.self.presetAmounts.forEach(function (a) {
        const b = document.createElement('button');
        b.className = 'link-btn';
        b.textContent = a + ' 元';
        b.addEventListener('click', function () { amount = a; });
        amounts.appendChild(b);
      });
      document.getElementById('selfPay').addEventListener('click', function () {
        if (!d.self.apiBase) { alert('自收款尚未开通，敬请期待'); return; }
        fetch(d.self.apiBase + d.self.createOrder, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: amount, channel: 'wechat_pay' })
        }).then(function (r) { return r.json(); })
          .then(function (res) {
            if (res && res.payUrl) { window.location.href = res.payUrl; }
            else { alert('下单失败，请稍后再试'); }
          })
          .catch(function () { alert('网络错误'); });
      });
    } else {
      box.innerHTML = d.redirect.channels.map(function (ch) {
        return '<div class="card">' +
          '<div class="donate-name">' + ch.name + '</div>' +
          '<div class="donate-desc">' + ch.desc + '</div>' +
          '<div class="donate-actions"><a class="btn" href="' + ch.link + '" target="_blank" rel="noopener noreferrer">前往随喜</a></div>' +
          '</div>';
      }).join('');
      document.getElementById('donateNote').textContent = '捐赠直接在官方公益平台完成，本站不经手任何款项。';
    }
  })();

  function escapeHtml(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
