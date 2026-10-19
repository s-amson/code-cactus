/* =========================================================
   router.js - moves between pages with the sweeping curtain.
   A page registers itself with CC.registerPage({ id, badge, html, init,
   onNavStart, onEnter, onLeave, onShown }) - see js/pages/*.js.
   Use CC.go('<page id>', triggerElement) to navigate.
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, wait, rand, Sound, burst, centerOf, state } = CC;

  const curtain = $('#curtain');
  const badge = $('#badge');
  const badgeText = $('#badgeText');
  const backHomeBtn = $('#backHomeBtn');

  const pageById = (id) => CC.pageList.find((p) => p.id === id);

  function scatterPage(page) {
    $$('.letter', page).forEach((l) => { l.style.setProperty('--dx', rand(-45, 45) + 'vw'); l.style.setProperty('--rot', rand(-540, 540) + 'deg'); });
    $$('.grow', page).forEach((g, i) => {
      g.style.setProperty('--k', i);
      g.style.setProperty('--rot', rand(-25, 25) + 'deg');
    });
  }

  function activate(fromId, toId) {
    const from = document.getElementById(fromId);
    const to = document.getElementById(toId);
    const fromPage = pageById(fromId);
    const toPage = pageById(toId);

    if (fromPage && fromPage.onLeave) fromPage.onLeave(toId);
    from.classList.remove('active', 'leaving', 'enter');
    to.classList.add('active');
    state.current = toId;
    backHomeBtn.classList.toggle('visible', state.current !== 'welcome');
    const content = $('.content, .game-scroll-area', to);
    if (content) content.scrollTop = 0;
    if (toPage && toPage.onEnter) toPage.onEnter(fromId);
  }

  async function go(target, triggerEl) {
    if (state.busy || target === state.current || !pageById(target)) return;
    state.busy = true;
    CC.pageList.forEach((p) => { if (p.onNavStart) p.onNavStart(); });

    const fromId = state.current;
    const from = document.getElementById(fromId);
    const to = document.getElementById(target);
    const ctaBtn = $('#ctaBtn');

    try {
      Sound.ensure();
      Sound.whoosh();
      if (triggerEl) burst(...centerOf(triggerEl), 16);

      curtain.style.pointerEvents = 'auto';

      // 1. Old page plays its "leaving" scatter animation
      scatterPage(from);
      if (triggerEl && triggerEl === ctaBtn) ctaBtn.classList.add('squish');
      from.classList.add('leaving');
      await wait(550);

      // 2. Sweep bands in to cover screen
      badgeText.textContent = pageById(target).badge || "Let's go!";
      curtain.classList.remove('uncover');
      curtain.classList.add('cover');
      await wait(650);

      badge.classList.remove('hide');
      badge.classList.add('show');
      Sound.fanfare();

      // 3. Swap active full-screen page behind the curtain
      activate(fromId, target);
      if (ctaBtn) ctaBtn.classList.remove('squish');
      await wait(850);

      // 4. Sweep bands out & pop in new full-view page
      badge.classList.remove('show');
      badge.classList.add('hide');
      await wait(220);

      curtain.classList.remove('cover');
      curtain.classList.add('uncover');
      to.classList.add('enter');
      await wait(850);

      // Reset bands silently to left side for next transition
      $$('.band', curtain).forEach((b) => (b.style.transition = 'none')); curtain.classList.remove('uncover'); void curtain.offsetWidth;
      $$('.band', curtain).forEach((b) => (b.style.transition = ''));
    } finally {
      curtain.style.pointerEvents = 'none';
      state.busy = false;
      const now = pageById(state.current);
      if (now && now.onShown) now.onShown();
    }
  }

  CC.go = go;
})(window.CC);
