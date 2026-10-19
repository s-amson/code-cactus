/* =========================================================
   WELCOME PAGE - title, cactuses and the SIGN IN button.
   Styles: css/welcome.css
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, pickRand, Sound, restart, burst, say, centerOf, state } = CC;

  const html = `
    <section id="welcome" class="page active enter" aria-label="Welcome">
      <div class="layer mesas"><svg viewBox="0 0 1200 300" preserveAspectRatio="none">
        <path stroke="#1b1b1b" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linejoin="round"
          d="M0 300 V200 L40 190 L70 215 L120 200 L150 205 L165 120 Q170 70 195 65 H330 Q352 68 355 100 L362 150 Q366 175 395 185 L470 205 L560 215 L680 210 L760 190 Q785 180 790 150 L798 90 Q802 62 825 60 H895 Q915 62 918 85 L925 130 L935 112 Q940 100 960 98 H1010 Q1030 100 1034 120 L1040 150 L1090 150 L1130 175 L1160 160 L1200 175 V300 Z"/>
      </svg></div>
      <div class="layer dunes"><svg viewBox="0 0 1200 160" preserveAspectRatio="none">
        <path stroke="#1b1b1b" stroke-width="3" vector-effect="non-scaling-stroke"
          d="M0 160 V70 Q150 30 330 62 T660 55 T1000 50 T1200 40 V160 Z"/>
      </svg></div>
      <div class="layer ground-welcome"></div>

      <!-- Cactuses -->
      <div class="layer fg">
        <button class="grow cactus" id="talkingCactus" style="--right:9%;--bottom:3vh;--w:min(14vw,20vh);--d:.25s" aria-label="Friendly cactus"><svg viewBox="0 0 100 200"><use href="#cactus"/></svg></button>
        <button class="grow cactus" style="--left:5%;--bottom:11vh;--w:min(11vw,17vh);--d:.35s" aria-label="Friendly cactus"><svg viewBox="0 0 100 200"><use href="#cactus"/></svg></button>
        <button class="grow cactus" style="--left:19%;--bottom:21vh;--w:min(7vw,11vh);--d:.45s" aria-label="Friendly cactus"><svg viewBox="0 0 100 200"><use href="#cactus"/></svg></button>
        <button class="grow cactus" style="--right:2.5%;--bottom:23vh;--w:min(6vw,10vh);--d:.55s" aria-label="Friendly cactus"><svg viewBox="0 0 100 200"><use href="#cactus"/></svg></button>
        <button class="grow cactus" style="--right:25%;--bottom:17vh;--w:min(8vw,12vh);--d:.5s" aria-label="Friendly cactus"><svg viewBox="0 0 100 200"><use href="#cactus"/></svg></button>
      </div>

      <div class="layer hero">
        <h1 class="title" aria-label="CODE CACTUS">
          <span class="t-coms outlined" data-split="CODE" data-colors="#2fc46b,#27b862">CODE</span>
          <span class="t-dummies outlined" data-split="CACTUS" data-colors="#ff5fa2,#ffd400,#33b5ff,#ff8a00,#7c4dff,#2fc46b">CACTUS</span>
        </h1>
        <div class="pop" style="--d:.65s"><button class="btn-big" id="ctaBtn">SIGN IN</button></div>
      </div>
    </section>
`;

  // Speech bubble that floats beside the talking cactus
  const overlay = `
<div id="cactusSpeech" class="timed-speech tail-bottom" aria-live="polite">
    Learn Computer Science the super duper fun way! 🌵
  </div>
`;

  const hellos = ['Hi!', 'Boing!', 'Hello Witsie!', 'Wheee!', 'Code Cactus!', 'Yay!'];

  let talkingCactus, cactusSpeech;
  let cactusShowTimer = null;
  let cactusHideTimer = null;

  function positionCactusBubble() {
    if (!talkingCactus) return;
    const r = talkingCactus.getBoundingClientRect();
    const x = Math.min(Math.max(r.left + r.width / 2, 150), innerWidth - 150);
    const y = Math.max(r.top - 10, 95);
    cactusSpeech.style.left = x + 'px';
    cactusSpeech.style.top = y + 'px';
  }

  function stopCactusCycle() {
    clearTimeout(cactusShowTimer);
    clearTimeout(cactusHideTimer);
    cactusSpeech.classList.remove('visible');
  }

  // Speech bubble: 5s on / 10s off
  function runCactusCycle() {
    stopCactusCycle();
    if (state.current !== 'welcome' || state.busy) return;
    positionCactusBubble();
    cactusSpeech.classList.add('visible');
    restart($('svg', talkingCactus), 'boing');

    cactusHideTimer = setTimeout(() => {
      cactusSpeech.classList.remove('visible');
      cactusShowTimer = setTimeout(() => {
        if (state.current === 'welcome' && !state.busy) runCactusCycle();
      }, 10000);
    }, 5000);
  }

  CC.registerPage({
    id: 'welcome',
    badge: 'See you soon!',
    html,
    overlay,

    init() {
      talkingCactus = $('#talkingCactus');
      cactusSpeech = $('#cactusSpeech');

      $$('.cactus').forEach((btn) => {
        btn.addEventListener('click', () => {
          restart($('svg', btn), 'boing');
          Sound.boing();
          say(btn, pickRand(hellos));
          burst(...centerOf(btn), 8);
        });
      });

      const ctaBtn = $('#ctaBtn');
      ctaBtn.addEventListener('click', () => CC.go('home', ctaBtn));

      addEventListener('resize', () => {
        if (cactusSpeech.classList.contains('visible')) positionCactusBubble();
      });

      setTimeout(runCactusCycle, 900);
    },

    onNavStart: stopCactusCycle,
    onShown: runCactusCycle
  });
})(window.CC);
