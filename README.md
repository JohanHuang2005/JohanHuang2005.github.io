# Youhan Huang — Personal Homepage

Pure static English homepage (no build step). Edit content in one file; GitHub Pages serves the repo as-is.

## Edit content

All copy lives in [`data/site.json`](data/site.json).

Assets: `assets/me.jpg`, `assets/cv.pdf`, `assets/publications/`.

## Local preview

```bash
npx --yes serve .
```

Open the printed local URL. A static server is required so `fetch('/data/site.json')` works.

## Structure

```
index.html      Cover + shell
css/main.css    Styles
js/fluid.js     WebGL fluid cover (Pavel Dobryakov / SimonAKing)
js/main.js      Render from site.json, enter transition, nav
data/site.json  Profile, news, pubs, research, projects, …
```

## Deploy

Push to the GitHub Pages user site (`*.github.io`). `.nojekyll` disables Jekyll processing.
