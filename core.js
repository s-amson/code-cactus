/* =========================================================
   core.js - shared helpers + effects. Loaded FIRST.
   Everything the other files share hangs off window.CC.
   ========================================================= */
(function () {
  'use strict';

  // ---------- Helpers ----------
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const REDUCE = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const wait = (ms) => new Promise((r) => setTimeout(r, REDUCE ? ms * 0.35 : ms));
  const rand = (a, b) => Math.random() * (b - a) + a;
  const pickRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = (a) => {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  function store(k, v) {
    try {
      if (v === undefined) {
        const x = localStorage.getItem(k);
        return x ? JSON.parse(x) : null;
      }
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) {
      return null;
    }
  }

  const COLORS = ['#ff5fa2', '#ffd400', '#33b5ff', '#2fc46b', '#ff8a00', '#7c4dff'];

  // ---------- Split big titles into bouncy coloured letters ----------
  function splitTitles() {
  $$('.page').forEach((page) => {
    let index = 0;
    $$('[data-split]', page).forEach((el) => {
      const text = el.dataset.split;
      const colors = (el.dataset.colors || '#2fc46b').split(',');
      let c = 0;
      el.textContent = '';
      el.classList.remove('outlined');
      text.split(' ').forEach((word, w, all) => {
        const wordEl = document.createElement('span');
        wordEl.style.cssText = 'display:inline-block;white-space:nowrap';
        Array.from(word).forEach((ch) => {
          const letter = document.createElement('span');
          letter.className = 'letter';
          letter.style.setProperty('--i', index++);
          const glyph = document.createElement('span');
          glyph.className = 'glyph outlined';
          glyph.textContent = ch;
          glyph.style.color = colors[c++ % colors.length];
          letter.appendChild(glyph);
          wordEl.appendChild(letter);
        });
        el.appendChild(wordEl);
        if (w < all.length - 1) el.appendChild(document.createTextNode(' '));
      });
    });
  });
  }

  // ---------- Sparkles, speech pops & cursor-anchored toast ----------
  function restart(el, cls) {
    if (!el) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
    const done = (e) => {
      if (e.animationName === 'jelly' || e.animationName === 'wiggle') return;
      el.classList.remove(cls);
      el.removeEventListener('animationend', done);
    };
    el.addEventListener('animationend', done);
  }

  function burst(x, y, n = 10) {
    for (let i = 0; i < n; i++) {
      const s = document.createElement('i');
      const a = Math.random() * Math.PI * 2;
      const d = rand(50, 140);
      s.className = 'spark';
      s.style.cssText =
        'left:' + x + 'px;top:' + y + 'px;' +
        '--tx:' + (Math.cos(a) * d) + 'px;--ty:' + (Math.sin(a) * d) + 'px;' +
        '--r:' + rand(-360, 360) + 'deg;--s:' + rand(0.8, 1.5) + ';background:' + pickRand(COLORS);
      document.body.appendChild(s);
      s.addEventListener('animationend', () => s.remove());
      setTimeout(() => s.remove(), 1500);
    }
  }

  function say(el, text) {
    const r = el.getBoundingClientRect();
    const b = document.createElement('div');
    b.className = 'say';
    b.textContent = text;
    b.style.left = Math.min(Math.max(r.left + r.width / 2, 70), innerWidth - 70) + 'px';
    b.style.top = Math.max(r.top, 90) + 'px';
    document.body.appendChild(b);
    b.addEventListener('animationend', () => b.remove());
    setTimeout(() => b.remove(), 2000);
  }

  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return [r.left + r.width / 2, r.top + r.height / 2];
  };

  const toast = $('#toast');
  let toastTimer;
  const KID_SKETCH_MSGS = [
    '🎨 We are still sketching it with our crayons, come back soon!',
    '🖍️ Hold on friend! We are still coloring this page, come back soon!',
    '🚧 We are still sketching it, come back soon!'
  ];
  function showToastNear(e, el, msg) {
    const r = el ? el.getBoundingClientRect() : { left: innerWidth / 2, top: innerHeight / 2, width: 0, height: 0, bottom: innerHeight / 2 };
    const rawX = (e && e.clientX) ? e.clientX : (r.left + r.width / 2);
    const rawY = (e && e.clientY) ? e.clientY : (r.top + r.height / 2);

    const offsetY = rawY < 130 ? (r.bottom + 36) : (rawY - 48);
    const clampedX = Math.min(Math.max(rawX, 165), innerWidth - 165);
    const clampedY = Math.min(Math.max(offsetY, 60), innerHeight - 60);

    toast.textContent = msg;
    toast.style.left = clampedX + 'px';
    toast.style.top = clampedY + 'px';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2000);
  }

  window.CC = {
    // helpers
    $, $$, esc, REDUCE, wait, rand, pickRand, shuffle, store, COLORS,
    // effects
    restart, burst, say, centerOf, showToastNear, KID_SKETCH_MSGS, splitTitles,
    // shared state (read by pages + router)
    state: { current: 'welcome', busy: false },
    // page registry (see js/router.js + js/pages/*.js)
    pageList: [],
    registerPage(page) { this.pageList.push(page); },
    // topic card title -> page id. Add a line here when a topic gets its own page.
    topicPages: {}
  };
})();
