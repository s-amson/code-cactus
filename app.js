/* =========================================================
   app.js - starts the site. Loaded LAST.
   1. inserts every registered page into <main id="pages">
   2. splits the big titles into bouncy letters
   3. runs each page's init()
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, restart, Sound } = CC;

  const main = $('#pages');
  const overlays = $('#overlays');

  CC.pageList.forEach((page) => {
    main.insertAdjacentHTML('beforeend', page.html);
    if (page.overlay) overlays.insertAdjacentHTML('beforeend', page.overlay);
  });

  CC.splitTitles();

  $$('.letter').forEach((l) => {
    l.addEventListener('click', () => { restart(l, 'hop'); Sound.boing(); });
  });

  CC.pageList.forEach((page) => { if (page.init) page.init(); });
})(window.CC);
