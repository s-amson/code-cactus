# CODE CACTUS

Open `index.html` in a browser. Keep all the folders next to it.

```
index.html            shell only: sky, nav bar, curtain, toast
css/
  base.css            colours, sky, nav bar, speech bubbles
  welcome.css         Welcome page
  home.css            Home page (topic cards, balloons)
  frame.css           panel + yellow header shared by Games and Introduction
  games.css           Games page
  introduction.css    Introduction page
  effects.css         page enter/leave animations, curtain, sparkles, toast
js/
  core.js             shared helpers + effects (window.CC)
  sound.js            sounds
  router.js           page-to-page navigation, CC.go('page-id')
  shell.js            nav bar, day/night, sun & moon
  pages/
    welcome.js        Welcome page markup + behaviour
    home.js           Home page markup + the 16 topic cards
    introduction.js   Introduction page markup + behaviour
    games.js          Games page markup + LinkedList Express engine
  app.js              starts everything (loaded last)
```

## Adding a new page
1. Copy `js/pages/introduction.js`, change the `id`, markup and title.
2. Register its card: `CC.topicPages['Card Title'] = 'page-id';`
3. Add `<script src="js/pages/your-page.js"></script>` to `index.html` (before `app.js`).
4. Optional: its own `css/your-page.css` + a `<link>` in `index.html`.
