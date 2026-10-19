/* =========================================================
   shell.js - things that live on EVERY page: the nav bar, sound
   button, day/night switch, sun & moon, and the click sparkles.
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, pickRand, Sound, restart, burst, say, centerOf, showToastNear, KID_SKETCH_MSGS, state } = CC;

  // ---------- Sun & Moon ----------
  const sun = $('#sun');
  const moon = $('#moon');

  sun.addEventListener('click', () => {
    restart(sun, 'wink');
    Sound.hi();
    say(sun, pickRand(['Hi there!', 'Shine shine!', 'Good day!']));
    burst(...centerOf(sun), 12);
  });

  moon.addEventListener('click', () => {
    restart(moon, 'wink');
    Sound.hi();
    say(moon, pickRand(['Twinkle twinkle!', 'Nighty night!', 'Hello starlight!']));
    burst(...centerOf(moon), 12);
  });

  // ---------- Nav buttons that are not built yet ----------
  $$('[data-soon]').forEach((el) => {
    el.addEventListener('click', (e) => {
      Sound.boing();
      showToastNear(e, el, pickRand(KID_SKETCH_MSGS));
    });
  });

  // ---------- Click sparkles on empty space ----------
  addEventListener('pointerdown', (e) => {
    if (state.busy) return;
    if (e.target.closest('button, .nav, .card, .full-page-view, input, details')) return;
    burst(e.clientX, e.clientY, 7);
  });

  // ---------- Sound toggle ----------
  const soundBtn = $('#soundBtn');
  soundBtn.addEventListener('click', () => {
    Sound.on = !Sound.on;
    soundBtn.textContent = Sound.on ? '🔊' : '🔇';
    soundBtn.setAttribute('aria-pressed', String(Sound.on));
    if (Sound.on) Sound.pop();
  });

  // ---------- Day Mode <-> Night Mode Switcher ----------
  const dayModeBtn = $('#dayModeBtn');
  const nightModeBtn = $('#nightModeBtn');

  function setTimeOfDay(mode) {
    const isNight = mode === 'night';
    const currentlyNight = document.body.classList.contains('night-mode');
    if (isNight === currentlyNight) return;

    document.body.classList.add('twilight-flash');
    setTimeout(() => document.body.classList.remove('twilight-flash'), 850);

    if (isNight) {
      document.body.classList.add('night-mode');
      nightModeBtn.classList.add('active-mode');
      nightModeBtn.setAttribute('aria-pressed', 'true');
      dayModeBtn.classList.remove('active-mode');
      dayModeBtn.setAttribute('aria-pressed', 'false');
      Sound.nightChime();
      burst(...centerOf(nightModeBtn), 10);
    } else {
      document.body.classList.remove('night-mode');
      dayModeBtn.classList.add('active-mode');
      dayModeBtn.setAttribute('aria-pressed', 'true');
      nightModeBtn.classList.remove('active-mode');
      nightModeBtn.setAttribute('aria-pressed', 'false');
      Sound.dayChime();
      burst(...centerOf(dayModeBtn), 10);
    }

    // Pages that show a bubble next to the sun/moon listen for this and re-position it.
    setTimeout(() => document.dispatchEvent(new CustomEvent('cc:timechange')), 150);
  }

  dayModeBtn.addEventListener('click', () => setTimeOfDay('day'));
  nightModeBtn.addEventListener('click', () => setTimeOfDay('night'));

  // ---------- Navigation ----------
  const backHomeBtn = $('#backHomeBtn');
  const gamesNavBtn = $('#gamesNavBtn');
  const logoBtn = $('#logo');

  backHomeBtn.addEventListener('click', () => CC.go('welcome', backHomeBtn));
  gamesNavBtn.addEventListener('click', () => CC.go('games', gamesNavBtn));
  logoBtn.addEventListener('click', () => {
    restart(logoBtn, 'hop');
    Sound.boing();
    if (state.current !== 'welcome') CC.go('welcome', logoBtn);
  });
})(window.CC);
