/* =========================================================
   HOME PAGE - "Hi there, Witsie!" + the 16 topic cards + balloons.
   Styles: css/home.css
   To make a card open its own page: register the card title in that
   page's file, e.g.  CC.topicPages['Introduction'] = 'introduction';
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, pickRand, Sound, burst, centerOf, showToastNear, KID_SKETCH_MSGS, state } = CC;

  const html = `
    <section id="home" class="page" aria-label="Main page">
      <div class="content">
        <h2 class="hello pop outlined" style="--d:.15s" data-split="HI THERE, WITSIE!" data-colors="#ff5fa2,#ffd400,#33b5ff,#2fc46b,#ff8a00,#7c4dff">HI THERE, WITSIE!</h2>
        <p class="hello-sub pop" style="--d:.3s">What do you want to learn today? Pick a card!</p>

        <!-- All 16 Topic Cards -->
        <div class="cards" id="topicsGrid"></div>
      </div>

      <!-- Floating Poppable Balloons -->
      <button class="balloon" style="--x:6vw;--c:#ff5fa2;--dur:16s;--delay:-4s" aria-label="Pop the balloon"><span class="b-body"></span></button>
      <button class="balloon" style="--x:28vw;--c:#33b5ff;--dur:21s;--delay:-12s" aria-label="Pop the balloon"><span class="b-body"></span></button>
      <button class="balloon" style="--x:64vw;--c:#ffd400;--dur:18s;--delay:-1s" aria-label="Pop the balloon"><span class="b-body"></span></button>
      <button class="balloon" style="--x:88vw;--c:#ff8a00;--dur:24s;--delay:-16s" aria-label="Pop the balloon"><span class="b-body"></span></button>
    </section>
`;

  // Speech bubble that floats beside the sun / moon
  const overlay = `
<div id="celestialSpeech" class="timed-speech sun-bubble" aria-live="polite">
    Psst... try popping the balloons! 🎈
  </div>
`;

  // ---------- Topic cards ----------
  const TOPICS = [
    { title: 'Introduction', icon: '🎈', color: '#ff5fa2' },
    { title: 'C++ Re-cap', icon: '🧱', color: '#33b5ff' },
    { title: 'Linked Lists', icon: '🚂', color: '#ffd400' },
    { title: 'Analysis of Algorithms', icon: '⏱️', color: '#2fc46b' },
    { title: 'Stacks', icon: '🥞', color: '#ff8a00' },
    { title: 'Queues', icon: '🎢', color: '#7c4dff' },
    { title: 'Trees', icon: '🌳', color: '#2fc46b' },
    { title: 'Lists', icon: '📜', color: '#ff5fa2' },
    { title: 'Iterators and Sequences', icon: '🧭', color: '#33b5ff' },
    { title: 'Array ADT List', icon: '📦', color: '#ffd400' },
    { title: 'Priority Queues', icon: '👑', color: '#ff8a00' },
    { title: 'Heaps', icon: '⛰️', color: '#7c4dff' },
    { title: 'Maps', icon: '🗺️', color: '#2fc46b' },
    { title: 'Hash Tables', icon: '🎰', color: '#ff5fa2' },
    { title: 'Binary Search Trees', icon: '🔍', color: '#33b5ff' },
    { title: 'Graphs', icon: '🕸️', color: '#ffd400' }
  ];

  // ---------- Sun/Moon speech bubble (5s on / 10s off) ----------
  let balloonPoppedThisVisit = false;
  let celestialSpeech;
  let celestialShowTimer = null;
  let celestialHideTimer = null;

  function positionCelestialBubble() {
    const isNight = document.body.classList.contains('night-mode');
    const target = isNight ? $('#moon') : $('#sun');
    const r = target.getBoundingClientRect();
    const x = Math.min(r.right + 14, innerWidth - 270);
    const y = Math.max(r.top + r.height / 2, 105);
    celestialSpeech.style.left = x + 'px';
    celestialSpeech.style.top = y + 'px';
  }

  function stopCelestialCycle() {
    clearTimeout(celestialShowTimer);
    clearTimeout(celestialHideTimer);
    celestialSpeech.classList.remove('visible');
  }

  function runCelestialCycle() {
    stopCelestialCycle();
    if (state.current !== 'home' || state.busy || balloonPoppedThisVisit) return;
    positionCelestialBubble();
    celestialSpeech.classList.add('visible');

    celestialHideTimer = setTimeout(() => {
      celestialSpeech.classList.remove('visible');
      celestialShowTimer = setTimeout(() => {
        if (state.current === 'home' && !state.busy && !balloonPoppedThisVisit) runCelestialCycle();
      }, 10000);
    }, 5000);
  }

  CC.registerPage({
    id: 'home',
    badge: "Let's go!",
    html,
    overlay,

    init() {
      celestialSpeech = $('#celestialSpeech');

      // Build the cards
      const topicsGrid = $('#topicsGrid');
      TOPICS.forEach((t, i) => {
        const btn = document.createElement('button');
        btn.className = 'card pop';
        btn.style.setProperty('--c', t.color);
        btn.style.setProperty('--d', (0.3 + i * 0.04).toFixed(2) + 's');
        btn.dataset.topic = t.title;
        btn.innerHTML =
          '<span class="card-num">#' + (i + 1) + '</span>' +
          '<span class="card-icon">' + t.icon + '</span>' +
          '<span class="card-title">' + t.title + '</span>';
        topicsGrid.appendChild(btn);
      });

      // Cards with their own page open it; every other card shows the "sketching" toast
      $$('.card').forEach((card) => {
        card.addEventListener('click', (e) => {
          const pageId = CC.topicPages[card.dataset.topic];
          if (pageId) {
            CC.go(pageId, card);
            return;
          }
          Sound.boing();
          showToastNear(e, card, pickRand(KID_SKETCH_MSGS));
        });
      });

      // Balloons
      $$('.balloon').forEach((b) => {
        b.addEventListener('click', () => {
          balloonPoppedThisVisit = true;
          stopCelestialCycle();
          Sound.pop();
          burst(...centerOf(b), 14);
          b.classList.add('popped');
          setTimeout(() => b.classList.remove('popped'), 3200);
        });
      });

      addEventListener('resize', () => {
        if (celestialSpeech.classList.contains('visible')) positionCelestialBubble();
      });
      document.addEventListener('cc:timechange', () => {
        if (celestialSpeech.classList.contains('visible')) positionCelestialBubble();
      });
    },

    onNavStart: () => stopCelestialCycle(),
    onShown() {
      balloonPoppedThisVisit = false;
      runCelestialCycle();
    }
  });
})(window.CC);
