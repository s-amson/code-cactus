/* =========================================================
   INTRODUCTION PAGE - choose how to learn.
     Learn the formal way     -> Lecture Slides, Labs
     Learn the fun easy way   -> Theory, Practical
   The four option buttons are layout only for now (no click actions yet).
   Styles: css/introduction.css  (+ css/frame.css for the panel/header)
   ========================================================= */
(function (CC) {
  'use strict';
  const { $ } = CC;

  const html = `
    <section id="introduction" class="page" aria-label="Introduction page">
      <div class="full-page-view pop" style="--d:.12s">
        <div class="game-header">
          <div class="game-brand">
            <span aria-hidden="true">🎈</span>
            <span>Introduction</span>
          </div>
          <div class="game-subnav" role="navigation" aria-label="Topic navigation">
            <button class="g-nav-btn topics-back" id="backFromIntroBtn" aria-label="Back to topics">⬅️ Topics</button>
          </div>
        </div>

        <div class="game-scroll-area">
          <div class="tp-heading">
            <h1>How do you want to learn?</h1>
            <p>Pick a path below. You can always come back and try the other one!</p>
          </div>

          <div class="tp-cols">
            <!-- Column 1: Formal -->
            <div class="tp-col pop" style="--d:.25s">
              <h2 class="tp-col-head" style="--c:var(--blue)"><span aria-hidden="true">🎓</span>Learn the formal way</h2>
              <div class="tp-opts">
                <button type="button" class="tp-opt" style="--c:#33b5ff">
                  <span class="tp-opt-icon" aria-hidden="true">📑</span>
                  <span class="tp-opt-title">Lecture Slides</span>
                </button>
                <button type="button" class="tp-opt" style="--c:#7c4dff">
                  <span class="tp-opt-icon" aria-hidden="true">🧪</span>
                  <span class="tp-opt-title">Labs</span>
                </button>
              </div>
            </div>

            <!-- Column 2: Fun -->
            <div class="tp-col pop" style="--d:.38s">
              <h2 class="tp-col-head" style="--c:var(--pink)"><span aria-hidden="true">🎉</span>Learn the fun easy way</h2>
              <div class="tp-opts">
                <button type="button" class="tp-opt" style="--c:#ffd400">
                  <span class="tp-opt-icon" aria-hidden="true">🎯</span>
                  <span class="tp-opt-title">Theory</span>
                </button>
                <button type="button" class="tp-opt" style="--c:#2fc46b">
                  <span class="tp-opt-icon" aria-hidden="true">🛠️</span>
                  <span class="tp-opt-title">Practical</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
`;

  // Clicking the "Introduction" card on the home page opens this page
  CC.topicPages['Introduction'] = 'introduction';

  CC.registerPage({
    id: 'introduction',
    badge: "Let's learn!",
    html,

    init() {
      const back = $('#backFromIntroBtn');
      back.addEventListener('click', () => CC.go('home', back));
    }
  });
})(window.CC);
