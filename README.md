# Youhan Huang — Personal Homepage

Pure static English homepage (no build step). Edit content in one file; GitHub Pages serves the repo as-is.

## Edit content

All copy lives in [`data/site.json`](data/site.json).

Assets: `assets/me.jpg`, `assets/publications/`. CVs are available on request via email (not hosted on the site).

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

## Credits

Design inspiration and borrowed ideas:

- Cover interaction and WebGL fluid background: [SimonAKing/HomePage](https://github.com/SimonAKing/HomePage) (fluid simulation originally by [Pavel Dobryakov](https://github.com/PavelDoGreat/WebGL-Fluid-Simulation))
- Long-page content section rhythm: [jiangmuran.com](https://jiangmuran.com/)

## Analytics (GA4 + Search Console)

In [`data/site.json`](data/site.json) under `analytics`:

1. Create a GA4 property at [Google Analytics](https://analytics.google.com/) → Admin → Create property → Web stream for `https://johanhuang2005.github.io`. Copy the Measurement ID (`G-XXXXXXXX`).
2. Paste it into `analytics.ga4MeasurementId`, then deploy.
3. Add the same site in [Google Search Console](https://search.google.com/search-console). Prefer **URL prefix** `https://johanhuang2005.github.io`. Verify with the HTML meta tag: paste the token into `analytics.googleSiteVerification` and redeploy, then click Verify.
4. In GA4: Admin → Product links → Search Console links → Link. Pick the GSC property and the GA4 web data stream.

After linking, open **GA4 → Reports → Acquisition → Overview** (and Search Console reports under Acquisition) for full traffic; use Search Console for queries / impressions / CTR. GSC itself does not show GA4 session metrics — the richer combined view lives in Analytics.

## Deploy

Push to the GitHub Pages user site (`*.github.io`). `.nojekyll` disables Jekyll processing.
