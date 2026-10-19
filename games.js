/* =========================================================
   GAMES PAGE - LinkedList Express (Theory trivia + Practical train).
   Styles: css/games.css (+ css/frame.css for the panel/header)
   ========================================================= */
(function (CC) {
  'use strict';
  const { $, $$, esc, REDUCE, wait, rand, pickRand, shuffle, store, COLORS, Sound, restart, burst, say, centerOf } = CC;

  const html = `
    <section id="games" class="page" aria-label="LinkedList Express Game Page">
      <div class="full-page-view pop" style="--d:.12s">
        <div class="game-header">
          <button class="game-brand" data-lle-go="lle-home" aria-label="LinkedList Express Home">
            <svg width="46" height="26" viewBox="0 0 46 26" aria-hidden="true">
              <rect x="1.5" y="3" width="17" height="14" rx="3" fill="#ff8a00" stroke="#1b1b1b" stroke-width="2.5"/>
              <rect x="27.5" y="3" width="17" height="14" rx="3" fill="#33b5ff" stroke="#1b1b1b" stroke-width="2.5"/>
              <path d="M19 10h7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
              <path d="M24 6l4 4-4 4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle cx="8" cy="21" r="3" fill="#1b1b1b"/><circle cx="14" cy="21" r="3" fill="#1b1b1b"/>
              <circle cx="34" cy="21" r="3" fill="#1b1b1b"/><circle cx="40" cy="21" r="3" fill="#1b1b1b"/>
            </svg>
            <span>LinkedList Express</span>
          </button>

          <div class="game-subnav" role="navigation" aria-label="Game Sections">
            <button class="g-nav-btn on" id="gameOverviewOrBackBtn" data-lle-go="lle-home">🚂 Overview</button>
            <button class="g-nav-btn topics-back" id="backToTopicsBtn" aria-label="Back to Home">🏡 Home</button>
          </div>
        </div>

        <div class="game-scroll-area" id="gameScrollArea">
          <!-- GAME SCREEN 1: HOME OVERVIEW -->
          <div id="lle-home" class="lle-screen">
            <div class="lle-hero">
              <h1>Learn linked lists by running a train!</h1>
              <p>Every cart is a node. Answer trivia on the theory from your lecture slides, then write the C++ code yourself and watch each line couple the carts together.</p>
              <div class="chain" aria-hidden="true">
                <div class="mini" style="--c:#33b5ff;--d:.1s"><span>MSP</span><i></i></div><div class="arr" style="--d:.35s"></div>
                <div class="mini" style="--c:#2fc46b;--d:.45s"><span>ATL</span><i></i></div><div class="arr" style="--d:.7s"></div>
                <div class="mini" style="--c:#ff8a00;--d:.8s"><span>BOS</span><i></i></div><div class="arr" style="--d:1.05s"></div>
                <div class="nul" style="--d:1.1s">∅</div>
              </div>
            </div>

            <div class="choices">
              <button class="choice theory" data-lle-go="lle-theory">
                <svg class="choice-mascot" viewBox="0 0 100 200" aria-hidden="true"><use href="#cactus"/></svg>
                <h2>Theory</h2>
                <p>18 trivia rounds from the lecture slides. Beat the 20 second clock and collect all six category wedges!</p>
              </button>
              <button class="choice prac" data-lle-go="lle-practical">
                <svg viewBox="0 0 100 100" aria-hidden="true">
                  <rect x="8" y="30" width="38" height="30" rx="6" fill="#ff8a00" stroke="#1b1b1b" stroke-width="4"/>
                  <rect x="58" y="30" width="34" height="30" rx="6" fill="#ffd400" stroke="#1b1b1b" stroke-width="4"/>
                  <path d="M46 45h10" stroke="#1b1b1b" stroke-width="5" stroke-linecap="round"/>
                  <circle cx="22" cy="70" r="6" fill="#1b1b1b"/><circle cx="36" cy="70" r="6" fill="#1b1b1b"/>
                  <circle cx="70" cy="70" r="6" fill="#1b1b1b"/><circle cx="82" cy="70" r="6" fill="#1b1b1b"/>
                </svg>
                <h2>Practical</h2>
                <p>Type the C++ for insert at the head, insert at the tail, and remove at the head. The train only leaves when the code is right!</p>
              </button>
            </div>
          </div>

          <!-- GAME SCREEN 2: THEORY TRIVIA -->
          <div id="lle-theory" class="lle-screen" hidden>
            <div class="cab" id="t-start">
              <div class="start">
                <svg class="theory-mascot" viewBox="0 0 100 200" aria-hidden="true"><use href="#cactus"/></svg>
                <h2>Test your linked lists Knowledge</h2>
                <p>Questions come straight from the lecture slides: arrays, singly linked lists, inserting, removing, stacks, queues, and doubly linked lists.</p>
                <button class="btn green" id="t-go">Start the quiz</button>
                <p id="t-best" style="margin-top:14px;font-size:.95rem"></p>
              </div>
            </div>

            <div class="cab" id="t-play" hidden>
              <div class="t-top">
                <h2 id="t-round"></h2>
                <div class="player">
                  <div class="avatar" aria-hidden="true">🌵</div>
                  <div><b>Witsie</b><small>Points: <span id="t-pts">0</span></small></div>
                  <svg class="wedges" id="t-wedges" viewBox="0 0 100 100" aria-label="Wedges won"></svg>
                </div>
              </div>
              <div class="t-main">
                <div class="qcard">
                  <div class="qhead" id="t-cat">
                    <span id="t-catname"></span>
                    <div class="timer" id="t-timer" role="timer"><span id="t-time">20</span></div>
                  </div>
                  <div class="qbody">
                    <p id="t-q"></p>
                    <div class="after" id="t-after" hidden></div>
                  </div>
                </div>
                <div class="answers" id="t-ans"></div>
              </div>
              <div class="t-foot" id="t-foot"></div>
            </div>

            <div class="cab" id="t-end" hidden>
              <div class="start">
                <h2 id="e-title">Final whistle!</h2>
                <div class="big" id="e-score">0</div>
                <p id="e-sub"></p>
                <div class="res-grid" id="e-cats"></div>
                <div class="wbtns">
                  <button class="btn green" id="e-again">Play again 🔄</button>
                  <button class="btn ghost" data-lle-go="lle-practical">Go to Practical 💻</button>
                </div>
              </div>
            </div>
          </div>

          <!-- GAME SCREEN 3: PRACTICAL CODE THE TRAIN -->
          <div id="lle-practical" class="lle-screen" hidden>
            <div class="levels" id="p-levels"></div>

            <!-- Live Practical Workspace -->
            <div class="p-grid" id="p-workspace">
              <div class="p-left">
                <div class="editor">
                  <details id="p-setup-d">
                    <summary>📄 Setup code (already written for you)</summary>
                    <pre class="setup" id="p-setup"></pre>
                  </details>
                  <div class="code" id="p-code"></div>
                  <div class="ed-bar">
                    <button class="btn green" id="p-run">▶️ Run line</button>
                    <button class="btn ghost" id="p-assist">🪄 Assist</button>
                    <button class="btn ghost" id="p-hint">💡 Hint</button>
                    <button class="btn ghost" id="p-reset">🔄 Start over</button>
                  </div>
                </div>
                <div class="fb info" id="p-fb" role="status" aria-live="polite"></div>
                <details class="slidebox">
                  <summary>📘 Pseudocode from the lecture slides</summary>
                  <pre id="p-slide"></pre>
                </details>
              </div>

              <div class="p-right">
                <div class="stagewrap" id="p-wrap">
                  <div class="stage" id="p-stage">
                    <div class="stage-ground">
                      <div class="rail"></div>
                      <div class="sleepers"></div>
                    </div>
                    <div class="parcel" id="p-parcel"></div>
                    <div class="sizebox" id="p-size">size = <b>0</b></div>
                    <div class="train" id="p-train">
                      <svg class="loco" viewBox="0 0 150 92" aria-hidden="true">
                        <path d="M0 80 L30 52 L30 80Z" fill="#ffd400" stroke="#1b1b1b" stroke-width="3.5" stroke-linejoin="round"/>
                        <rect x="30" y="30" width="72" height="40" rx="6" fill="#ff5fa2" stroke="#1b1b1b" stroke-width="3.5"/>
                        <rect x="40" y="8" width="14" height="24" fill="#1b1b1b"/>
                        <rect x="35" y="4" width="24" height="8" rx="3" fill="#1b1b1b"/>
                        <circle cx="74" cy="30" r="9" fill="#ffd400" stroke="#1b1b1b" stroke-width="3.5"/>
                        <rect x="98" y="10" width="38" height="60" rx="4" fill="#2fc46b" stroke="#1b1b1b" stroke-width="3.5"/>
                        <rect x="106" y="20" width="22" height="18" rx="3" fill="#bfe6ff" stroke="#1b1b1b" stroke-width="2.5"/>
                        <rect x="26" y="62" width="112" height="9" fill="#1b1b1b"/>
                        <rect x="136" y="60" width="14" height="7" fill="#1b1b1b"/>
                        <g fill="#263238" stroke="#ffd400" stroke-width="4">
                          <circle cx="48" cy="76" r="12"/>
                          <circle cx="82" cy="76" r="12"/>
                          <circle cx="118" cy="76" r="12"/>
                        </g>
                      </svg>
                      <div class="carts" id="p-carts"></div>
                    </div>
                    <div class="tags" id="p-tags"></div>
                    <svg class="links" id="p-links" viewBox="0 0 900 330" aria-hidden="true">
                      <defs>
                        <marker id="ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                          <path d="M0 0L10 5L0 10z" fill="context-stroke"/>
                        </marker>
                        <marker id="ahn" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto">
                          <path d="M0 0L10 5L0 10z" fill="context-stroke"/>
                        </marker>
                      </defs>
                      <g id="p-lg"></g>
                    </svg>
                    <div class="stage-welldone" id="p-stage-welldone">
                      <span class="outlined">WELL DONE!</span>
                    </div>
                  </div>
                </div>
                <div class="legend">
                  <span><i style="background:var(--stage-link)"></i>link that was already there</span>
                  <span><i style="background:var(--stage-link-new)"></i>link you made</span>
                  <span><i style="background:transparent;border:2px dashed currentColor"></i>next not set yet</span>
                </div>
                <!-- Step-by-step window placed directly under the interactive train and carts window -->
                <div class="lle-card task" id="p-task"></div>
              </div>
            </div>

            <!-- In-Page Full-View "WELL DONE" Completion View -->
            <div id="win" hidden>
              <div class="wincard" role="region" aria-labelledby="w-title">
                <div class="confetti" id="confetti" aria-hidden="true"></div>
                <h2 id="w-title" class="outlined">WELL DONE</h2>
                <div class="stars" id="w-stars" aria-label="Stars earned"></div>
                <p id="w-sub" style="margin:0;font-weight:900;"></p>
                <div class="recap" id="w-code"></div>
                <div class="wbtns">
                  <button class="btn green" id="w-next">Next level 🚂</button>
                  <button class="btn ghost" id="w-again">Replay level 🔄</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
`;

  // The game engine is wrapped in a function so it only starts once the
  // page markup exists. It hands back the few hooks the router needs.
  let engineApi = null;

  function startEngine() {
    // =========================================================
    //   6. LINKEDLIST EXPRESS GAME ENGINE (THEORY & PRACTICAL)
    // =========================================================
    let lleCurrent = 'lle-home';
    const overviewOrBackBtn = $('#gameOverviewOrBackBtn');

    function updateGameSubnav() {
      if (!overviewOrBackBtn) return;
      if (lleCurrent === 'lle-theory' || lleCurrent === 'lle-practical') {
        overviewOrBackBtn.innerHTML = '⬅️ Go Back';
        overviewOrBackBtn.classList.remove('on');
        overviewOrBackBtn.setAttribute('aria-label', 'Go Back to Overview');
      } else {
        overviewOrBackBtn.innerHTML = '🚂 Overview';
        overviewOrBackBtn.classList.add('on');
        overviewOrBackBtn.setAttribute('aria-label', 'Overview');
      }
    }

    function showLleScreen(id) {
      if (lleCurrent === 'lle-theory' && id !== 'lle-theory') stopTimer();
      lleCurrent = id;
      $$('.lle-screen').forEach((s) => (s.hidden = s.id !== id));
      updateGameSubnav();

      if (id === 'lle-theory') theoryHome();
      if (id === 'lle-practical') {
        if (!G) loadLevel(0);
        else {
          $('#win').hidden = true;
          $('#p-workspace').hidden = false;
        }
        fit();
        startLoop();
        setTimeout(() => {
          fit();
          const inp = $('#p-in');
          if (inp && !inp.disabled) inp.focus({ preventScroll: true });
        }, 60);
      } else {
        loopOn = false;
      }
      const scrollArea = $('#gameScrollArea');
      if (scrollArea) scrollArea.scrollTop = 0;
    }

    document.addEventListener('click', (e) => {
      const b = e.target.closest('[data-lle-go]');
      if (b) {
        Sound.pop();
        $('#win').hidden = true;
        $('#p-workspace').hidden = false;
        showLleScreen(b.dataset.lleGo);
      }
    });

    /* ---------- PART A: THEORY TRIVIA (18 ROUNDS) ---------- */
    const CATS = {
      arrays: { n: 'Arrays', c: '#ff8a00', t: '#1b1b1b' },
      basics: { n: 'Singly linked lists', c: '#33b5ff', t: '#fff' },
      terms:  { n: 'Head, tail and traversal', c: '#2fc46b', t: '#fff' },
      insert: { n: 'Inserting', c: '#ff5fa2', t: '#fff' },
      remove: { n: 'Removing', c: '#16b4b4', t: '#fff' },
      stack:  { n: 'Stacks, queues, doubly linked', c: '#ffd400', t: '#1b1b1b' }
    };
    const CAT_KEYS = Object.keys(CATS);

    const QS = [
      { c: 'arrays', q: 'Where are the elements of an array stored in memory?', o: ['In adjacent (contiguous) memory locations', 'Scattered anywhere, joined by pointers', 'Only on the stack', 'In sorted order on disk'], w: 'Arrays use contiguous memory, which is why an index can jump straight to an element.' },
      { c: 'arrays', q: 'How long does it take to read array element number i?', o: ['O(1), constant time', 'O(n)', 'O(log n)', 'O(n²)'], w: 'Random access: the index tells the computer exactly where to look, so the cost does not grow with the array.' },
      { c: 'arrays', q: 'According to the recap, when should you avoid an array?', o: ['Frequent insertions and deletions', 'When you need fast access by index', 'When working with matrices', 'When storing a fixed number of elements'], w: 'Inserting or deleting needs shifting elements, which is O(n). Linked lists are the suggested alternative.' },
      { c: 'basics', q: 'In its simplest form, a linked list is a collection of ____ that together form a linear sequence.', o: ['nodes', 'indexes', 'matrices', 'memory blocks'], w: 'Each node holds an element and a link, and the links string the nodes into a sequence.' },
      { c: 'basics', q: 'What does each node of a singly linked list store?', o: ['An element and a link to the next node', 'An element and links to both neighbours', 'Only the element', 'Only a pointer to the head'], w: 'A singly linked node has elem and next. Storing a link to the previous node as well makes it a doubly linked list.' },
      { c: 'basics', q: 'Which of these is NOT a type of linked list named in the slides?', o: ['Singly linked list', 'Doubly linked list', 'Circular linked list', 'Binary linked list'], a: 3, w: 'The slides list singly, doubly and circular linked lists.' },
      { c: 'terms', q: 'What is the head of a linked list?', o: ['The pointer to the first node', 'The last node', 'The number of nodes', 'The element stored in the first node'], w: 'The head points to the first node. Everything else is reached by following next pointers from it.' },
      { c: 'terms', q: 'Starting at the head and following each next pointer is called…', o: ['Traversing (link hopping or pointer hopping)', 'Shifting', 'Allocating', 'Linking out'], w: 'Traversing means hopping from node to node along the next pointers.' },
      { c: 'terms', q: 'The last node of a singly linked list is the tail. What does its next pointer hold?', o: ['null (nullptr)', 'A pointer back to the head', 'A pointer to the previous node', 'The size of the list'], w: 'The tail has nothing after it, so next is null. The diagrams draw this as ∅.' },
      { c: 'insert', q: 'In push_front(e), after creating the new node, what comes next?', o: ['Set the new node\'s next to the old head', 'Set head to the new node', 'Delete the old head', 'Increment tail'], w: 'Order: create the node, store e, point it at the old head, and only then move head to the new node.' },
      { c: 'insert', q: 'What goes wrong if head is pointed at the new node before the new node is linked to the old head?', o: ['The rest of the list is lost because nothing points to it', 'Nothing, the order does not matter', 'The list becomes circular', 'The new node is deleted automatically'], w: 'Once head moves, no variable refers to the old first node, so MSP, ATL and BOS become unreachable.' },
      { c: 'insert', q: 'In push_back(e), why do we set the old tail\'s next before assigning tail = newest?', o: ['Otherwise we lose track of the old last node', 'Because tail must always be null', 'To free memory', 'Because size has to be updated first'], w: 'The slide notes this order. It also says the code needs adjusting for an empty list, since there is no existing tail node.' },
      { c: 'remove', q: 'Which steps remove the node at the head of a singly linked list?', o: ['Move head to the next node, then free the old first node', 'Free the old first node, then move head', 'Move tail to the previous node, then free it', 'Set every next pointer to null'], w: 'pop_front: old = head, head = head->next, delete old, size = size - 1.' },
      { c: 'remove', q: 'Why is removing at the tail of a singly linked list not efficient?', o: ['There is no constant-time way to move tail to the previous node', 'Tail has no next pointer', 'The last node cannot be deleted', 'The list has to be sorted first'], w: 'You can only reach the previous node by walking from the head, which takes O(n).' },
      { c: 'remove', q: 'In pop_front, why do we save old = head before moving head?', o: ['So we can still delete the former first node', 'To make a copy of the whole list', 'So that size stays the same', 'To keep the list circular'], w: 'After head moves on, nothing else points at the old first node. Saving it lets us delete it.' },
      { c: 'stack', q: 'A stack built on a singly linked list keeps its top element where?', o: ['At the first node (the head)', 'At the last node', 'At the middle node', 'In a separate array'], w: 'Pushing and popping at the head are O(1), so every Stack operation takes O(1) time.' },
      { c: 'stack', q: 'In a queue built on a singly linked list, where do the front and rear live?', o: ['Front at the first node, rear at the last node', 'Front at the last node, rear at the first node', 'Both at the head', 'Both at the tail'], w: 'Dequeue removes at the head and enqueue inserts at the tail. Both are O(1).' },
      { c: 'stack', q: 'What extra pointer lets a doubly linked list delete a node at any position in constant time?', o: ['prev, a pointer to the node before it', 'A second head pointer', 'A size counter', 'A circular link'], w: 'Each node keeps prev and next. The slide\'s drawing also adds a header and a trailer node at the ends.' }
    ];

    const T = { i: 0, pts: 0, streak: 0, order: [], won: {}, tot: {}, locked: true, deadline: 0, iv: null, right: 0 };
    const TIME = 20;

    function pieSvg(el, earned) {
      let h = '';
      CAT_KEYS.forEach((k, i) => {
        const a0 = (-90 + i * 60) * Math.PI / 180;
        const a1 = (-90 + (i + 1) * 60) * Math.PI / 180;
        const r = 42;
        const p = (a) => [(50 + r * Math.cos(a)).toFixed(1), (50 + r * Math.sin(a)).toFixed(1)];
        const [x0, y0] = p(a0), [x1, y1] = p(a1);
        h += `<path d="M50 50 L${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}Z" fill="${earned[k] ? CATS[k].c : 'rgba(150,150,150,.22)'}" stroke="#1b1b1b" stroke-width="3.5" stroke-linejoin="round"/>`;
      });
      el.innerHTML = h;
    }

    function theoryHome() {
      $('#t-start').hidden = false;
      $('#t-play').hidden = true;
      $('#t-end').hidden = true;
      const b = store('lle-best');
      $('#t-best').textContent = b ? `🏆 Best score so far: ${b}` : '';
    }

    function startQuiz() {
      Sound.pop();
      T.order = shuffle(QS).map((q) => {
        const idx = shuffle(q.o.map((_, i) => i));
        const a = q.a === undefined ? 0 : q.a;
        return { ...q, opts: idx.map((i) => q.o[i]), ai: idx.indexOf(a) };
      });
      T.i = 0; T.pts = 0; T.streak = 0; T.right = 0; T.won = {}; T.tot = {};
      CAT_KEYS.forEach((k) => (T.tot[k] = 0));
      $('#t-start').hidden = true;
      $('#t-end').hidden = true;
      $('#t-play').hidden = false;
      nextQ();
    }

    function nextQ() {
      const q = T.order[T.i], cat = CATS[q.c];
      $('#t-round').innerHTML = `Round ${T.i + 1} <small>of ${T.order.length}</small>`;
      $('#t-pts').textContent = T.pts;
      pieSvg($('#t-wedges'), T.won);
      const head = $('#t-cat');
      head.style.setProperty('--cc', cat.c);
      head.style.setProperty('--ct', cat.t);
      $('#t-catname').textContent = cat.n;
      $('#t-q').textContent = q.q;
      $('#t-after').hidden = true;
      $('#t-foot').textContent = T.streak >= 2 ? `🔥 Streak of ${T.streak}! Keep it rolling!` : '';
      const box = $('#t-ans');
      box.innerHTML = '';
      q.opts.forEach((t, i) => {
        const b = document.createElement('button');
        b.className = 'ans';
        b.textContent = t;
        b.setAttribute('aria-label', `Answer ${i + 1}: ${t}`);
        b.addEventListener('click', () => pickAnswer(i));
        box.appendChild(b);
      });
      T.locked = false;
      T.deadline = performance.now() + TIME * 1000;
      stopTimer();
      T.iv = setInterval(tick, 100);
      tick();
    }

    function stopTimer() {
      if (T.iv) {
        clearInterval(T.iv);
        T.iv = null;
      }
    }
    function remaining() {
      return Math.max(0, (T.deadline - performance.now()) / 1000);
    }
    function tick() {
      const r = remaining();
      $('#t-time').textContent = Math.ceil(r);
      const tm = $('#t-timer');
      tm.style.setProperty('--a', (r / TIME * 360) + 'deg');
      tm.classList.toggle('low', r <= 5);
      if (r <= 0 && !T.locked) pickAnswer(-1);
    }

    function pickAnswer(i) {
      if (T.locked) return;
      T.locked = true;
      const left = remaining();
      stopTimer();
      const q = T.order[T.i];
      const ok = i === q.ai;
      $$('#t-ans .ans').forEach((b, j) => {
        b.disabled = true;
        if (j === q.ai) b.classList.add('right');
        else if (j === i) b.classList.add('wrong');
        else b.classList.add('dim');
      });
      let msg, cls, gain = 0;
      if (ok) {
        Sound.clank();
        T.streak++; T.right++; T.tot[q.c]++;
        gain = 10 + Math.ceil(left / 2) + (T.streak >= 3 ? 5 : 0);
        T.pts += gain;
        if (T.tot[q.c] >= 2 && !T.won[q.c]) {
          T.won[q.c] = true;
          pieSvg($('#t-wedges'), T.won);
          Sound.fanfare();
          msg = `Correct! +${gain} pts — You won the ${CATS[q.c].n} wedge! 🏅`;
        } else {
          msg = `Correct! +${gain} pts`;
        }
        cls = 'good';
      } else {
        Sound.crash();
        T.streak = 0;
        cls = 'nope';
        msg = i === -1 ? '⏰ Time is up!' : '❌ Not quite!';
      }
      $('#t-pts').textContent = T.pts;
      const last = T.i === T.order.length - 1;
      const a = $('#t-after');
      a.className = 'after ' + cls;
      a.hidden = false;
      a.innerHTML = `<b>${esc(msg)}</b>${esc(q.w)}<br><button class="btn green" id="t-next">${last ? 'See results 🏆' : 'Next question ➔'}</button>`;
      const nb = $('#t-next');
      nb.addEventListener('click', () => {
        Sound.pop();
        if (last) endQuiz();
        else { T.i++; nextQ(); }
      });
      nb.focus();
    }

    function endQuiz() {
      stopTimer();
      Sound.fanfare();
      $('#t-play').hidden = true;
      $('#t-end').hidden = false;
      $('#e-score').textContent = T.pts;
      const n = T.order.length, pct = Math.round(T.right / n * 100);
      $('#e-title').textContent = pct >= 85 ? '🚂 Express Service!' : pct >= 60 ? '🛤️ Right on Schedule!' : '🌵 Still Rolling!';
      $('#e-sub').textContent = `${T.right} of ${n} correct (${pct}%). Wedges won: ${Object.keys(T.won).length} of ${CAT_KEYS.length}.`;
      $('#e-cats').innerHTML = CAT_KEYS.map((k) => {
        const total = QS.filter((q) => q.c === k).length;
        let pips = '';
        for (let j = 0; j < total; j++) pips += `<b class="${j < T.tot[k] ? 'on' : ''}"></b>`;
        return `<div class="res-row" style="--cc:${CATS[k].c}"><i></i><span>${CATS[k].n}</span><div class="pips">${pips}</div></div>`;
      }).join('');
      const best = store('lle-best') || 0;
      if (T.pts > best) store('lle-best', T.pts);
    }

    $('#t-go').addEventListener('click', startQuiz);
    $('#e-again').addEventListener('click', startQuiz);
    document.addEventListener('keydown', (e) => {
      if (CC.state.current !== 'games' || lleCurrent !== 'lle-theory' || $('#t-play').hidden || T.locked) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 4 && e.target.tagName !== 'INPUT') pickAnswer(n - 1);
    });

    /* ---------- PART B: PRACTICAL CODE THE TRAIN ---------- */
    const SLOT0 = 175, SLOT_W = 150, TRACK_Y = 168, RAISED_Y = 40;
    const slotX = (s) => SLOT0 + s * SLOT_W;
    const PAL = ['#33b5ff', '#2fc46b', '#ff8a00', '#7c4dff', '#16b4b4', '#ff5fa2'];
    const RES = ['head', 'tail', 'size', 'e', 'next', 'elem', 'Node', 'new', 'delete'];
    const bad = (msg, fx) => ({ ok: false, msg, fx });
    const good = (set) => ({ ok: true, set });
    const SETUP = `#include <string>
  using namespace std;

  struct Node
  {
      string elem;
      Node* next;
  };

  class LinkedList
  {
  public:
      Node* head;
      Node* tail;
      int size;

      // ...the function you write goes here
  };`;

    function createCheck(s, raw) {
      const m = s.match(/^Node\*(\w+)=newNode(\(\))?;$/);
      if (m) {
        if (!/new\s+Node/.test(raw)) return bad('Put a space between new and Node.');
        if (RES.includes(m[1])) return bad(`"${m[1]}" is already used by the list. Pick another name, such as newest.`);
        return good({ v: m[1] });
      }
      if (/^Node\*\w+=newNode\(\w+\);$/.test(s)) return bad('Close! Make the node empty first (`Node* newest = new Node;`). Storing `e` is the next step.');
      if (/^Node\w+=/.test(s)) return bad('A node made with `new` lives on the heap, so hold it with a pointer: put a `*` after `Node`.');
      if (/^\w+=Node\(\w*\);?$/.test(s)) return bad('That is the slides\' pseudocode! In C++ we allocate with `new` and keep the address in a `Node*` pointer: `Node* newest = new Node;`');
      return bad('Not yet. Declare a Node pointer and point it at a freshly allocated Node: `Node* newest = new Node;`');
    }

    function elemCheck(s, c) {
      const v = c.v;
      if (new RegExp(`^${v}->elem=e;$`).test(s) || new RegExp(`^\\(\\*${v}\\)\\.elem=e;$`).test(s)) return good();
      if (new RegExp(`^${v}\\.(elem|next)`).test(s)) return bad(`${v} is a pointer, so reach its fields with \`->\` (the slides' pseudocode shows a dot).`);
      if (new RegExp(`^${v}->elem=["'].*["']`).test(s)) return bad('`e` is a parameter variable that already holds the element. Use `e` without quotes!');
      return bad(`Not quite. Store \`e\` into \`${v}->elem\`: \`${v}->elem = e;\``);
    }

    const sizeUp = (s) => /^(size\+\+|\+\+size|size=size\+1|size\+=1);$/.test(s);
    const sizeDown = (s) => /^(size--|--size|size=size-1|size-=1);$/.test(s);

    const LEVELS = [
      {
        id: 'front', name: 'Insert at the head', sig: 'void push_front(string e)', param: 'LAX',
        slide: `Algorithm push_front(e)
    newest = Node(e)       // create new node instance storing element e
    newest.next = head     // set new node's next pointer to the old head node
    head = newest          // set variable head to point to the new node
    size = size + 1        // increment the count of elements`,
        setup() {
          const names = ['MSP', 'ATL', 'BOS'];
          const cs = names.map((n, i) => addCart(n, i + 1));
          cs.forEach((c, i) => (c.next = cs[i + 1] || null));
          G.head = cs[0]; G.tail = cs[2]; G.tags.head = G.head; G.tags.tail = G.tail; G.size = 3;
        },
        steps: [
          {
            title: 'Step 1: Create a new node',
            task: 'Allocate a new, empty Node (a fresh train cart) and keep its address in a pointer called newest.',
            slide: ['newest = Node(e)', 'create new node instance storing element e'],
            cmt: 'create new node',
            hint: 'A node lives on the heap, so request one with new and hold it with a pointer: Node* newest = new Node;',
            answer: () => 'Node* newest = new Node;',
            check: (s, c, raw) => createCheck(s, raw),
            async run(c) {
              const n = addCart('', 0, { raised: true, drop: true, color: '#ffd400' });
              c.cart = n; G.tags.newest = n; renderTags();
              await wait(900);
            }
          },
          {
            title: 'Step 2: Store the element',
            task: 'Put the parameter e (which holds "LAX") into the new cart\'s elem field.',
            slide: ['newest = Node(e)', '... storing element e'],
            cmt: 'store element e',
            hint: 'The node is a pointer, so use the arrow operator to reach its field: newest->elem = e;',
            answer: (c) => `${c.v}->elem = e;`,
            check: (s, c) => elemCheck(s, c),
            async run(c) {
              await fly(L.param, c.cart);
              setElem(c.cart, L.param);
              await wait(300);
            }
          },
          {
            title: 'Step 3: Point the new node at the old head',
            task: 'Make the new cart\'s next pointer refer to the node that head currently points at.',
            slide: ['newest.next = head', 'set new node\'s next pointer to the old head node'],
            cmt: 'link new node to old head',
            hint: 'Set the new node\'s next field to head BEFORE moving head, or the rest of the train is lost!',
            answer: (c) => `${c.v}->next = head;`,
            check(s, c) {
              const v = c.v;
              if (new RegExp(`^${v}->next=head;$`).test(s)) return good();
              if (new RegExp(`^head=${v};$`).test(s)) return bad('Stop! Head moved first, so nothing points at MSP, ATL or BOS any more! Watch what happens. Link the new cart first, then move head.', orphanDemo);
              if (new RegExp(`^head->next=${v};$`).test(s)) return bad('That makes the old head point at the new cart, which is backwards. The new cart must point at the old head.');
              if (new RegExp(`^${v}\\.next`).test(s)) return bad(`${v} is a pointer, so use -> to reach next.`);
              return bad(`Not quite. Point ${v}->next at head: ${v}->next = head;`);
            },
            async run(c) {
              c.cart.next = G.head; c.cart.linkNew = true; c.cart.linkT0 = performance.now();
              await wait(800);
            }
          },
          {
            title: 'Step 4: Update head',
            task: 'Now move head so it points at the newly created cart.',
            slide: ['head = newest', 'set variable head to point to the new node'],
            cmt: 'head now points at the new node',
            hint: 'Assign the new node\'s pointer to head: head = newest;',
            answer: (c) => `head = ${c.v};`,
            check(s, c) {
              const v = c.v;
              if (new RegExp(`^head=${v};$`).test(s)) return good();
              if (new RegExp(`^${v}=head;$`).test(s)) return bad('That moves newest back onto the old head. We want head to move onto newest.');
              return bad(`Not quite. Point head at ${v}: head = ${v};`);
            },
            async run(c) {
              G.head = c.cart; G.tags.head = c.cart; c.cart.raised = false; place(c.cart); renderTags();
              await wait(1000);
              delete G.tags.newest; renderTags();
            }
          },
          {
            title: 'Step 5: Update size',
            task: 'The list has one more node. Increment the size counter so the train can depart!',
            slide: ['size = size + 1', 'increment the count of elements'],
            cmt: 'one more element',
            hint: 'Write size = size + 1; or size++;',
            answer: () => 'size = size + 1;',
            check: (s) => sizeUp(s) ? good() : bad('Not quite. Add one to size (`size = size + 1;` or `size++;`).'),
            async run() {
              setSize(G.size + 1);
              await wait(500);
            }
          }
        ]
      },
      {
        id: 'back', name: 'Insert at the tail', sig: 'void push_back(string e)', param: 'MIA',
        slide: `Algorithm push_back(e)
    newest = Node(e)          // create new node instance storing element e
    newest.next = nullptr     // set new node's next pointer to nullptr
    tail.next = newest        // make old tail node point to the new node
    tail = newest             // set variable tail to point to the new node
    size = size + 1           // increment the count of elements`,
        setup() {
          const cs = ['MSP', 'ATL', 'BOS'].map((n, i) => addCart(n, i));
          cs.forEach((c, i) => (c.next = cs[i + 1] || null));
          G.head = cs[0]; G.tail = cs[2]; G.tags.head = G.head; G.tags.tail = G.tail; G.size = 3;
        },
        steps: [
          {
            title: 'Step 1: Create a new node',
            task: 'Allocate a new, empty Node and keep its address in a pointer called newest.',
            slide: ['newest = Node(e)', 'create new node instance storing element e'],
            cmt: 'create new node',
            hint: 'Shape: Node* newest = new Node;',
            answer: () => 'Node* newest = new Node;',
            check: (s, c, raw) => createCheck(s, raw),
            async run(c) {
              const n = addCart('', 3, { raised: true, drop: true, color: '#ffd400' });
              c.cart = n; G.tags.newest = n; renderTags();
              await wait(900);
            }
          },
          {
            title: 'Step 2: Store the element',
            task: 'Put the parameter e (which holds "MIA") into the new cart.',
            slide: ['newest = Node(e)', '... storing element e'],
            cmt: 'store element e',
            hint: 'newest->elem = e;',
            answer: (c) => `${c.v}->elem = e;`,
            check: (s, c) => elemCheck(s, c),
            async run(c) {
              await fly(L.param, c.cart);
              setElem(c.cart, L.param);
              await wait(300);
            }
          },
          {
            title: 'Step 3: Mark the new node as last',
            task: 'The new cart will be the tail, so nothing comes after it. Set its next pointer to nullptr.',
            slide: ['newest.next = nullptr', 'set new node\'s next pointer to nullptr'],
            cmt: 'nothing after it',
            hint: 'In C++ the null pointer is written nullptr: newest->next = nullptr;',
            answer: (c) => `${c.v}->next = nullptr;`,
            check(s, c) {
              const v = c.v;
              if (new RegExp(`^${v}->next=(nullptr|NULL);$`).test(s)) return good();
              if (new RegExp(`^${v}->next=tail;$`).test(s)) return bad('That would make the new cart point at the old last cart. Nothing should come after the new tail.');
              if (new RegExp(`^${v}\\.next`).test(s)) return bad(`${v} is a pointer, so use -> to reach next.`);
              return bad(`Not quite. Set ${v}->next = nullptr;`);
            },
            async run(c) {
              c.cart.next = null; c.cart.linkNew = true; c.cart.linkT0 = performance.now();
              await wait(700);
            }
          },
          {
            title: 'Step 4: Link the old tail to the new node',
            task: 'Make the current last cart (the one tail points at) point at the new cart.',
            slide: ['tail.next = newest', 'make old tail node point to the new node'],
            cmt: 'old tail points to new node',
            hint: 'Reach the old tail\'s next field through the tail pointer BEFORE moving tail: tail->next = newest;',
            answer: (c) => `tail->next = ${c.v};`,
            check(s, c) {
              const v = c.v;
              if (new RegExp(`^tail->next=${v};$`).test(s)) return good();
              if (new RegExp(`^tail=${v};$`).test(s)) return bad('Careful! If tail moves first, we lose the old last cart (BOS) and can never link it. Set tail->next before reassigning tail.');
              if (/^tail\.next/.test(s)) return bad('tail is a pointer, so use -> to reach next.');
              return bad(`Not quite. Write tail->next = ${v};`);
            },
            async run(c) {
              G.tail.next = c.cart; G.tail.linkNew = true; G.tail.linkT0 = performance.now();
              await wait(800);
            }
          },
          {
            title: 'Step 5: Update tail',
            task: 'Now move tail onto the new cart.',
            slide: ['tail = newest', 'set variable tail to point to the new node'],
            cmt: 'tail now points at the new node',
            hint: 'Assign the new node\'s pointer to tail: tail = newest;',
            answer: (c) => `tail = ${c.v};`,
            check: (s, c) => new RegExp(`^tail=${c.v};$`).test(s) ? good() : bad(`Not quite. Point tail at ${c.v}: tail = ${c.v};`),
            async run(c) {
              G.tail = c.cart; G.tags.tail = c.cart; c.cart.raised = false; place(c.cart); renderTags();
              await wait(1000);
              delete G.tags.newest; renderTags();
            }
          },
          {
            title: 'Step 6: Update size',
            task: 'One more node in the list. Increase size.',
            slide: ['size = size + 1', 'increment the count of elements'],
            cmt: 'one more element',
            hint: 'size = size + 1; or size++;',
            answer: () => 'size = size + 1;',
            check: (s) => sizeUp(s) ? good() : bad('Not quite. Add one to size.'),
            async run() {
              setSize(G.size + 1);
              await wait(500);
            }
          }
        ]
      },
      {
        id: 'pop', name: 'Remove at the head', sig: 'void pop_front()', param: null,
        slide: `Algorithm pop_front()
    old = head             // remember the first node
    head = head.next       // make head point to the following node (or nullptr)
    delete old             // free the former first node
    size = size - 1        // decrement the node count`,
        setup() {
          const cs = ['LAX', 'MSP', 'ATL', 'BOS'].map((n, i) => addCart(n, i));
          cs.forEach((c, i) => (c.next = cs[i + 1] || null));
          G.head = cs[0]; G.tail = cs[3]; G.tags.head = G.head; G.tags.tail = G.tail; G.size = 4;
        },
        steps: [
          {
            title: 'Step 1: Remember the first node',
            task: 'Before head moves, save the first node in a pointer called old so we can free it later.',
            slide: ['old = head', 'remember the first node'],
            cmt: 'remember the first node',
            hint: 'Declare a Node pointer and copy head into it: Node* old = head;',
            answer: () => 'Node* old = head;',
            check(s) {
              const m = s.match(/^Node\*(\w+)=head;$/);
              if (m) {
                if (RES.includes(m[1])) return bad(`"${m[1]}" is already used by the list. Pick another name, such as old.`);
                return good({ v: m[1] });
              }
              if (/^\w+=head;$/.test(s) && !/^Node/.test(s)) return bad('Declare it first: the variable needs the type Node* (`Node* old = head;`).');
              return bad('Not quite. Copy the head pointer into a new Node* variable: `Node* old = head;`');
            },
            async run(c) {
              c.cart = G.head; G.tags.old = G.head; renderTags();
              await wait(700);
            }
          },
          {
            title: 'Step 2: Move head forward',
            task: 'Make head point at the next node in the list.',
            slide: ['head = head.next', 'make head point to the following node (or nullptr)'],
            cmt: 'head moves to the next node',
            hint: 'Head becomes whatever head->next holds: head = head->next;',
            answer: () => 'head = head->next;',
            check(s, c) {
              if (/^head=head->next;$/.test(s) || new RegExp(`^head=${c.v}->next;$`).test(s)) return good();
              if (/^head=head\.next/.test(s)) return bad('head is a pointer, so use -> (the slides\' pseudocode shows a dot).');
              if (/^delete/.test(s)) return bad('Not yet! If we delete first we can no longer reach the next cart. Move head forward first.');
              return bad('Not quite. Write `head = head->next;`');
            },
            async run() {
              G.head = G.head.next; G.tags.head = G.head; renderTags();
              await wait(900);
            }
          },
          {
            title: 'Step 3: Free the old node',
            task: 'The old first cart is no longer part of the list. Release it from heap memory.',
            slide: ['delete old', 'free the former first node'],
            cmt: 'free the former first node',
            hint: 'Use delete followed by the pointer you saved earlier: delete old;',
            answer: (c) => `delete ${c.v};`,
            check(s, c, raw) {
              if (new RegExp(`^delete${c.v};$`).test(s) && /delete\s+\w/.test(raw)) return good();
              if (/^deletehead;$/.test(s)) return bad('Head has already moved on, so that would delete the wrong cart! Delete the pointer you saved.');
              return bad(`Not quite. Write \`delete ${c.v};\``);
            },
            async run(c) {
              const old = c.cart;
              old.el.classList.add('poof');
              delete G.tags.old;
              renderTags();
              await wait(600);
              old.gone = true;
              old.el.remove();
              G.carts = G.carts.filter((x) => x !== old);
              G.carts.forEach((x) => { x.slot -= 1; place(x); });
              renderTags();
              await wait(900);
            }
          },
          {
            title: 'Step 4: Update size',
            task: 'One node fewer. Decrease size.',
            slide: ['size = size - 1', 'decrement the node count'],
            cmt: 'one fewer element',
            hint: 'size = size - 1; or size--;',
            answer: () => 'size = size - 1;',
            check: (s) => sizeDown(s) ? good() : bad('Not quite. Subtract one from size (`size = size - 1;` or `size--;`).'),
            async run() {
              setSize(G.size - 1);
              await wait(500);
            }
          }
        ]
      }
    ];

    let L = null, G = null, loopOn = false, scale = 1;
    const stageEl = $('#p-stage');

    function addCart(elem, slot, o = {}) {
      const c = { elem, slot, raised: !!o.raised, next: undefined, color: o.color || PAL[G.carts.length % PAL.length] };
      const el = document.createElement('div');
      el.className = 'cart';
      el.style.setProperty('--c', c.color);
      el.innerHTML = '<div class="cbody"><span class="ce"></span><span class="cn"><i class="dot"></i></span></div><div class="wh"><b></b><b></b></div>';
      c.el = el;
      setElem(c, elem);
      $('#p-carts').appendChild(el);
      if (o.drop) {
        el.style.opacity = 0;
        el.style.transform = `translate(${slotX(slot)}px,${(c.raised ? RAISED_Y : TRACK_Y) - 70}px)`;
        void el.offsetWidth;
        el.style.opacity = 1;
      }
      place(c);
      G.carts.push(c);
      return c;
    }

    function setElem(c, t) {
      c.elem = t;
      const ce = c.el.querySelector('.ce');
      ce.textContent = t || '?';
      ce.classList.toggle('empty', !t);
    }

    function place(c) {
      c.el.style.transform = `translate(${slotX(c.slot)}px,${c.raised ? RAISED_Y : TRACK_Y}px)`;
    }

    function setSize(n) {
      G.size = n;
      const b = $('#p-size b');
      b.textContent = n;
      b.classList.add('bump');
      setTimeout(() => b.classList.remove('bump'), 350);
    }

    const TAGINFO = { head: { pos: 'above' }, tail: { pos: 'above' }, newest: { pos: 'below' }, old: { pos: 'below' } };
    function renderTags() {
      const box = $('#p-tags');
      Object.keys(TAGINFO).forEach((name) => {
        let el = box.querySelector('.tag.' + name);
        const c = G.tags[name];
        if (!c) {
          if (el) {
            el.style.opacity = 0;
            const e = el;
            setTimeout(() => e.remove(), 400);
          }
          return;
        }
        const pos = TAGINFO[name].pos;
        if (!el) {
          el = document.createElement('div');
          el.className = `tag ${pos} ${name}`;
          el.textContent = name;
          box.appendChild(el);
          const x0 = slotX(c.slot) + (pos === 'above' ? 30 : 8);
          const y0 = (c.raised ? RAISED_Y : TRACK_Y) + (pos === 'above' ? -50 : 70);
          el.style.transform = `translate(${x0}px,${y0}px)`;
          el.style.opacity = 0;
          void el.offsetWidth;
          el.style.opacity = 1;
        }
        const x = slotX(c.slot) + (pos === 'above' ? 30 : 8);
        const y = (c.raised ? RAISED_Y : TRACK_Y) + (pos === 'above' ? -36 : 82);
        el.style.transform = `translate(${x}px,${y}px)`;
      });
    }

    function fly(text, toCart) {
      return new Promise((res) => {
        const g = document.createElement('div');
        g.className = 'ghost';
        g.textContent = text;
        stageEl.appendChild(g);
        const sr = stageEl.getBoundingClientRect(), k = sr.width / 900 || 1;
        const a = $('#p-parcel').getBoundingClientRect(), b = toCart.el.querySelector('.ce').getBoundingClientRect();
        const sx = (a.left - sr.left) / k + 6, sy = (a.top - sr.top) / k;
        const tx = (b.left - sr.left) / k + 12, ty = (b.top - sr.top) / k + 14;
        g.style.transform = `translate(${sx}px,${sy}px)`;
        if (!g.animate) { g.remove(); res(); return; }
        const an = g.animate(
          [
            { transform: `translate(${sx}px,${sy}px) scale(1)` },
            { transform: `translate(${(sx + tx) / 2}px,${Math.min(sy, ty) - 20}px) scale(1.25)` },
            { transform: `translate(${tx}px,${ty}px) scale(.9)` }
          ],
          { duration: REDUCE ? 150 : 900, easing: 'ease-in-out' }
        );
        an.onfinish = () => { g.remove(); res(); };
        an.oncancel = () => { g.remove(); res(); };
      });
    }

    async function orphanDemo() {
      const c = G.ctxCart || G.carts.find((x) => x.elem === '' || x.raised);
      const olds = G.carts.filter((x) => !x.raised);
      const prev = G.tags.head;
      G.tags.head = c;
      renderTags();
      await wait(700);
      olds.forEach((x) => x.el.classList.add('lost'));
      const l = document.createElement('div');
      l.className = 'lostlbl';
      l.textContent = '💥 Lost! Nothing points here any more!';
      l.style.left = slotX(olds[0].slot) + 'px';
      l.style.top = (TRACK_Y + 92) + 'px';
      stageEl.appendChild(l);
      await wait(2400);
      l.remove();
      olds.forEach((x) => x.el.classList.remove('lost'));
      G.tags.head = prev;
      renderTags();
      await wait(600);
    }

    function drawLinks() {
      if (!G) return;
      const sr = stageEl.getBoundingClientRect();
      if (!sr.width) return;
      const k = sr.width / 900, now = performance.now();
      let h = '';
      for (const c of G.carts) {
        c.el.classList.toggle('unset', c.next === undefined);
        if (c.next === undefined || c.gone) continue;
        const d = c.el.querySelector('.dot').getBoundingClientRect();
        const sx = (d.left + d.width / 2 - sr.left) / k;
        const sy = (d.top + d.height / 2 - sr.top) / k;
        const op = c.linkT0 ? Math.min(1, (now - c.linkT0) / 450) : 1;
        const cls = c.linkNew ? 'lnk new' : 'lnk';
        if (c.next === null) {
          h += `<path class="${cls}" d="M${sx} ${sy} L${sx + 30} ${sy}" opacity="${op}"/><text class="nulg" x="${sx + 36}" y="${sy + 10}" opacity="${op}">∅</text>`;
        } else {
          const b = c.next.el.querySelector('.cbody').getBoundingClientRect();
          const ex = (b.left - sr.left) / k - 3;
          const ey = (b.top + b.height / 2 - sr.top) / k;
          const p = Math.abs(ey - sy) < 3
            ? `M${sx} ${sy} L${ex} ${ey}`
            : `M${sx} ${sy} C${sx + 55} ${sy} ${ex - 55} ${ey} ${ex} ${ey}`;
          h += `<path class="${cls}" d="${p}" marker-end="url(#${c.linkNew ? 'ahn' : 'ah'})" opacity="${op}"/>`;
        }
      }
      $('#p-lg').innerHTML = h;
    }

    function startLoop() {
      if (loopOn) return;
      loopOn = true;
      (function f() {
        if (!loopOn) return;
        drawLinks();
        requestAnimationFrame(f);
      })();
    }

    function fit() {
      const wrap = $('#p-wrap');
      if (!wrap) return;
      const w = wrap.clientWidth;
      if (!w) return;
      scale = Math.min(1, w / 900);
      stageEl.style.transform = `scale(${scale})`;
      wrap.style.height = (330 * scale) + 'px';
    }
    window.addEventListener('resize', fit);
    if (window.ResizeObserver) {
      const ro = new ResizeObserver(() => fit());
      ro.observe($('#p-wrap'));
    }

    function hl(t) {
      return esc(t)
        .replace(/\b(void|new|delete|string|int|struct|class|public|nullptr|NULL|return)\b/g, '<span class="k">$1</span>')
        .replace(/\bNode\b/g, '<span class="t">Node</span>')
        .replace(/\b(\d+)\b/g, '<span class="n">$1</span>');
    }

    function renderCode() {
      const rows = [];
      let n = 1;
      const row = (html, cls = '') => rows.push(`<div class="ln ${cls}"><span class="no">${n++}</span><span class="tx">${html}</span></div>`);
      row(hl(L.sig), 'dim');
      row('{', 'dim');
      G.typed.forEach((t) => row('    ' + hl(t.text) + (t.cmt ? `  <span class="c">// ${esc(t.cmt)}</span>` : ''), 'ok'));
      if (!G.done) {
        rows.push(
          `<div class="ln cur"><span class="no">${n++}</span><span class="tx">    <input id="p-in" class="cin" spellcheck="false" autocomplete="off" autocapitalize="off" autocorrect="off" aria-label="Type the next line of C++" placeholder="Type C++ line here..."></span></div>`
        );
      }
      row('}', 'dim');
      $('#p-code').innerHTML = rows.join('');
      const inp = $('#p-in');
      if (inp) {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitLine();
          }
        });
        inp.disabled = G.busy;
      }
    }

    function renderTask() {
      const st = L.steps[G.i];
      let pips = '';
      L.steps.forEach((_, i) => (pips += `<i class="${i < G.i ? 'done' : i === G.i ? 'now' : ''}"></i>`));
      if (!st) {
        $('#p-task').innerHTML = `<div class="steps">${pips}</div><h3>🎉 All carts coupled!</h3><p>Watch the train leave the station!</p>`;
        return;
      }
      $('#p-task').innerHTML =
        `<div class="steps" aria-label="Step ${G.i + 1} of ${L.steps.length}">${pips}</div>` +
        `<h3>${esc(st.title)}</h3>` +
        `<p>${esc(st.task)}</p>` +
        `<div class="sl"><em>Lecture Slide:</em> ${esc(st.slide[0])} &nbsp;<em>// ${esc(st.slide[1])}</em></div>`;
    }

    function renderLevels() {
      const prog = store('lle-stars') || {};
      $('#p-levels').innerHTML = LEVELS.map((l, i) => {
        const s = prog[l.id] || 0;
        return `<button class="lv ${i === G.li ? 'on' : ''}" data-lv="${i}"><b>${i + 1}. ${esc(l.name)}</b><small>${'★'.repeat(s)}${'☆'.repeat(3 - s)}</small></button>`;
      }).join('');
      $$('#p-levels .lv').forEach((b) =>
        b.addEventListener('click', () => {
          if (G && G.busy) return;
          Sound.pop();
          loadLevel(+b.dataset.lv);
        })
      );
    }

    function feedback(kind, msg) {
      const f = $('#p-fb');
      f.className = 'fb ' + kind;
      f.textContent = msg;
      if (kind === 'bad') {
        void f.offsetWidth;
        f.classList.add('shake');
      }
    }

    function loadLevel(i) {
      L = LEVELS[i];
      G = { li: i, i: 0, carts: [], tags: {}, size: 0, ctx: {}, typed: [], hints: 0, assists: 0, mistakes: 0, busy: false, done: false, head: null, tail: null };
      $('#win').hidden = true;
      $('#p-workspace').hidden = false;
      $('#p-stage-welldone').classList.remove('show');
      $('#p-carts').innerHTML = '';
      $('#p-tags').innerHTML = '';
      $('#p-lg').innerHTML = ''; $$('.puff,.toot,.lostlbl,.ghost', stageEl).forEach((x) => x.remove());
      const tr = $('#p-train');
      tr.style.transition = 'none';
      tr.style.transform = 'none';
      void tr.offsetWidth;
      tr.style.transition = '';
      stageEl.classList.remove('leaving');
      const pc = $('#p-parcel');
      pc.hidden = !L.param;
      if (L.param) pc.innerHTML = `e = <b>"${L.param}"</b>`;
      L.setup();
      $('#p-size').innerHTML = `size = <b>${G.size}</b>`;
      renderTags();
      renderLevels();
      renderTask();
      renderCode();
      $('#p-setup').textContent = SETUP;
      $('#p-slide').textContent = L.slide;
      $('#p-hint').disabled = false;
      $('#p-assist').disabled = false;
      $('#p-run').disabled = false;
      feedback('info', '⌨️ Type the C++ line in the yellow row and press Enter (or click 🪄 Assist / 💡 Hint).');
      fit();
      const inp = $('#p-in');
      if (inp && CC.state.current === 'games' && lleCurrent === 'lle-practical') inp.focus({ preventScroll: true });
    }

    function evaluate(st, raw) {
      const s = raw.replace(/\s+/g, '');
      if (!s) return bad('Type the C++ line first (or click 🪄 Assist).');
      let r = st.check(s, G.ctx, raw);
      if (!r.ok && !s.endsWith(';')) {
        const r2 = st.check(s + ';', G.ctx, raw + ';');
        if (r2.ok) return bad('Almost! Every C++ statement ends with a semicolon `;`');
      }
      return r;
    }

    async function submitLine() {
      if (!G || G.busy || G.done) return;
      const inp = $('#p-in');
      const raw = inp.value;
      const st = L.steps[G.i];
      const r = evaluate(st, raw);
      if (!r.ok) {
        Sound.crash();
        G.mistakes++;
        feedback('bad', r.msg);
        if (r.fx) {
          G.busy = true;
          inp.disabled = true;
          G.ctxCart = G.ctx.cart;
          await r.fx();
          G.busy = false;
          inp.disabled = false;
          inp.focus();
        }
        return;
      }
      Sound.clank();
      G.busy = true;
      if (r.set) Object.assign(G.ctx, r.set);
      G.typed.push({ text: raw.trim(), cmt: st.cmt });
      G.i++;
      $('#p-hint').disabled = false;
      $('#p-assist').disabled = false;
      feedback('ok', `✅ Line accepted: ${st.cmt}!`);
      const last = G.i >= L.steps.length;
      if (last) G.done = true;
      renderTask();
      renderCode();
      await st.run(G.ctx);
      if (last) {
        await finishLevel();
        return;
      }
      G.busy = false;
      const n = $('#p-in');
      if (n) {
        n.disabled = false;
        n.focus({ preventScroll: true });
      }
    }

    function typeInto(inp, text) {
      return new Promise((res) => {
        let i = 0;
        inp.value = '';
        const t = setInterval(() => {
          inp.value = text.slice(0, ++i);
          if (i >= text.length) {
            clearInterval(t);
            res();
          }
        }, REDUCE ? 1 : 24);
      });
    }

    $('#p-hint').addEventListener('click', () => {
      if (!G || G.busy || G.done) return;
      Sound.pop();
      const st = L.steps[G.i];
      G.hints++;
      feedback('info', '💡 Hint: ' + st.hint);
      const inp = $('#p-in');
      if (inp) inp.focus();
    });

    $('#p-assist').addEventListener('click', async () => {
      if (!G || G.busy || G.done) return;
      Sound.hi();
      const st = L.steps[G.i];
      G.assists++;
      $('#p-assist').disabled = true;
      const inp = $('#p-in');
      if (inp) {
        await typeInto(inp, st.answer(G.ctx));
        feedback('info', '🪄 Line assisted! Read the C++ code, then press ▶️ Run line (or Enter) to see it in action.');
        inp.focus();
      }
    });

    $('#p-run').addEventListener('click', submitLine);
    $('#p-reset').addEventListener('click', () => {
      if (G && G.busy) return;
      Sound.pop();
      loadLevel(G.li);
    });

    async function finishLevel() {
      const stars = Math.max(1, 3 - (G.hints > 0 ? 1 : 0) - (G.assists > 0 ? 1 : 0));
      G.stars = stars;
      const prog = store('lle-stars') || {};
      if ((prog[L.id] || 0) < stars) {
        prog[L.id] = stars;
        store('lle-stars', prog);
      }
      renderLevels();
      feedback('ok', '🚂 Every link is in place. All aboard!');
      if ($('#p-in')) $('#p-in').disabled = true;
      stageEl.classList.add('leaving');
      G.carts.forEach((c) => c.el.classList.add('coupled'));
      await wait(650);

      Sound.whistle();
      const toot = document.createElement('div');
      toot.className = 'toot';
      toot.textContent = 'Toot toot! 🚂';
      stageEl.appendChild(toot);
      await wait(850);
      toot.remove();

      const tr = $('#p-train');
      const dur = REDUCE ? 1.1 : 3.0;
      tr.style.transition = `transform ${dur}s cubic-bezier(.55,0,.8,.5)`;
      tr.style.transform = 'translateX(-1180px)';
      const pv = setInterval(() => {
        const p = document.createElement('div');
        p.className = 'puff';
        p.style.left = '44px';
        p.style.top = (TRACK_Y - 28) + 'px';
        tr.appendChild(p);
        setTimeout(() => p.remove(), 1500);
      }, REDUCE ? 9999 : 220);

      await wait(dur * 1000 * 0.55);
      $('#p-stage-welldone').classList.add('show');
      Sound.fanfare();
      burst(innerWidth / 2, innerHeight / 2, 18);

      await wait(dur * 1000 * 0.45 + 350);
      clearInterval(pv);
      showWin();
    }

    function showWin() {
      const code = [L.sig, '{', ...G.typed.map((t) => '    ' + t.text), '}'].join('\n');
      $('#w-code').textContent = code;
      $('#w-stars').innerHTML = [1, 2, 3].map((i) => `<span class="${i <= G.stars ? '' : 'off'}">★</span>`).join('');
      $('#w-sub').textContent = G.hints + G.assists === 0
        ? '🌟 Clean run! Zero hints or assists needed!'
        : `Hints used: ${G.hints} · Assisted lines: ${G.assists}`;
      const hasNext = G.li < LEVELS.length - 1;
      const nx = $('#w-next');
      nx.textContent = hasNext ? 'Next level 🚂' : 'Back to Overview 🏁';
      nx.onclick = () => {
        Sound.pop();
        $('#win').hidden = true;
        $('#p-workspace').hidden = false;
        if (hasNext) loadLevel(G.li + 1);
        else showLleScreen('lle-home');
      };
      $('#w-again').onclick = () => {
        Sound.pop();
        $('#win').hidden = true;
        $('#p-workspace').hidden = false;
        loadLevel(G.li);
      };
      const cf = $('#confetti');
      cf.innerHTML = '';
      for (let i = 0; i < 42; i++) {
        const p = document.createElement('i');
        p.style.left = Math.random() * 100 + '%';
        p.style.background = COLORS[i % COLORS.length];
        p.style.animationDuration = (1.8 + Math.random() * 1.8) + 's';
        p.style.animationDelay = (Math.random() * 0.8) + 's';
        cf.appendChild(p);
      }
      $('#p-workspace').hidden = true;
      $('#win').hidden = false;
    }

    return {
      onEnter() {
        Sound.whistle();
        updateGameSubnav();
        if (lleCurrent === 'lle-practical') {
          fit();
          startLoop();
        }
      },
      onLeave() {
        stopTimer();
        loopOn = false;
      },
      onShown() {
        if (lleCurrent === 'lle-practical') fit();
      }
    };
  }

  CC.registerPage({
    id: 'games',
    badge: 'All Aboard!',
    html,

    init() {
      engineApi = startEngine();
      const back = $('#backToTopicsBtn');
      back.addEventListener('click', () => CC.go('home', back));
    },

    onEnter: () => engineApi && engineApi.onEnter(),
    onLeave: () => engineApi && engineApi.onLeave(),
    onShown: () => engineApi && engineApi.onShown()
  });
})(window.CC);
