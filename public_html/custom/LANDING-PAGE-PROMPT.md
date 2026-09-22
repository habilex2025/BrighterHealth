# Brighter Health — custom landing page generation prompt

You are generating a self-contained landing page package for Brighter Health. It must work two ways:

1. **Standalone preview** at `/custom/{handle}/`
2. **Seamless Craft CMS embed** — only the `<main>` content is injected into the live site frame (global header / nav / footer already exist)

Do **not** use an iframe. Isolation is done with CSS/JS scoping.

---

## Deliverables

Create this folder:

```text
public_html/custom/{handle}/
  index.html
  styles.css
  script.js
  assets/          # images, video, posters, logos
```

`{handle}` must be kebab-case only, e.g. `private-hospitals`, `gp-campaign`.

Reference implementation: `public_html/custom/private-hospitals/`

---

## How Craft embeds the page

Craft Custom Page entries set **Handle** = `{handle}`. The CMS:

1. Extracts `<main>…</main>` from `index.html`
2. Wraps it as:

```html
<div
  class="custom-page custom-page--{handle}"
  data-custom-page="{handle}"
  style="--embed-vh: calc(100svh - var(--header-height, 100px));"
>
  …main contents…
</div>
```

3. Loads `/custom/{handle}/styles.css` and `/custom/{handle}/script.js`
4. Rewrites relative asset URLs inside `<main>` to `/custom/{handle}/…`

Preview-only header/footer in `index.html` are **not** embedded. Mark them clearly with comments.

---

## HTML requirements

1. Put **all production content** inside `<main>…</main>` — that is the only HTML Craft embeds.
2. Asset paths inside `<main>` must be **package-relative**:
   - ✅ `assets/hero.jpg`
   - ✅ `assets/clip.mp4` on `src`, `poster`, or `data-src`
   - ❌ `/assets/hero.jpg`
   - ❌ absolute site URLs for local package files
3. Standalone `<body>` must be:

```html
<body class="custom-page custom-page--{handle}" data-custom-page="{handle}">
```

4. Comment preview chrome:

```html
<!-- Preview-only header: removed when embedded in Craft. -->
…
<!-- End preview-only header. -->
```

5. Use real `src` (and optional native `loading="lazy"`). Do **not** use the site’s `data-src` lazyload pattern for package images — put the real URL in `src`.
6. Prefer page-specific class names (`hero`, `page-shell`, `insights-grid`, …). Assume one custom page per URL for in-page IDs (`#contact`, etc.).

---

## CSS requirements

1. **Every selector** must be scoped under `.custom-page--{handle}` (resets, type, components, preview chrome).
2. Put design tokens on `.custom-page--{handle}`, **not** `:root`.
3. Do **not** style bare `html` / `body`. Apply those rules to `.custom-page--{handle}` instead.
4. Prefix `@keyframes` uniquely, e.g. `cp-ph-hero-up`, `cp-{short}-fade`, and reference only those names.
5. Full-viewport sections (heroes) **must** use the embed viewport token:

```css
.custom-page--{handle} .hero,
.custom-page--{handle} .hero-content {
  min-height: max(760px, var(--embed-vh, 100svh));
}
```

Never use raw `100vh` / `100svh` alone for hero height — when embedded, `--embed-vh` is `100svh − site header height`.

6. Use `overflow-x: hidden` (not `clip`) on the scoped root — `clip` can break lazy-loaded images.
7. Scroll offsets:

```css
.custom-page--{handle} [id] {
  scroll-margin-top: var(--header-height, 100px);
}
```

8. If using scroll-reveal, match this specificity pattern so visible state wins:

```css
html.js .custom-page--{handle} .reveal,
html.has-js .custom-page--{handle} .reveal,
.custom-page--{handle}.js .reveal {
  opacity: 0;
  transform: translateY(32px);
  transition: opacity .75s var(--ease), transform .75s var(--ease);
}

html.js .custom-page--{handle} .reveal.is-visible,
html.has-js .custom-page--{handle} .reveal.is-visible,
.custom-page--{handle}.js .reveal.is-visible,
.custom-page--{handle} .reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

(`html` on the live site uses `has-js`, standalone preview may use `js`.)

9. Covered media frames must beat the site-wide `img { height: auto }` reset:

```css
.custom-page--{handle} .hero-media img,
.custom-page--{handle} .work-media img,
.custom-page--{handle} .insight-media img {
  width: 100%;
  height: 100%;
  max-height: none;
  object-fit: cover;
}
```

10. Preview-only `.site-header` / `.site-footer` rules are allowed **only** when scoped under `.custom-page--{handle}` so they cannot affect the live header/footer.

---

## JS requirements

Wrap the entire file:

```js
(() => {
  const root = document.querySelector('[data-custom-page="{handle}"]')
    || document.querySelector('[data-custom-page]');
  if (!root) return;

  const $ = (sel) => root.querySelector(sel);
  const $$ = (sel) => [...root.querySelectorAll(sel)];

  // All page DOM queries go through $ / $$ / root.
  // Do not document.querySelector for page UI.
  // Do not toggle classes on document.body — use root.
})();
```

Also:

- Load with `defer` in `index.html`.
- Use `IntersectionObserver` against the real viewport (no iframe / parent-scroll hacks).
- For `.reveal` items: add `is-visible` when intersecting; if `prefers-reduced-motion: reduce`, add `is-visible` immediately.
- Preview menu behaviour is fine if it only touches elements inside `root`.
- Respect `prefers-reduced-motion` for parallax, carousels, and autoplay video.

---

## Do not

- Use an iframe or Shadow DOM
- Ship unscoped `html` / `body` / global `*` rules that escape the package
- Query or mutate the live site header, menu, footer, or Alpine state
- Depend on Craft, Alpine, GSAP, or site `app.js` helpers for page behaviour
- Use `100vh`/`100svh` alone for embedded full-screen heroes
- Use `overflow-x: clip` on the page root
- Put production content outside `<main>`

---

## Acceptance checks

- [ ] Standalone `/custom/{handle}/` looks complete (preview chrome OK)
- [ ] Craft embed shows only `<main>` content inside the live header/footer
- [ ] No live-site styles broken; no package styles leaking out
- [ ] Hero fills the viewport **below** the live header (`--embed-vh`)
- [ ] Images/video load (relative `assets/…` paths; real `src` values)
- [ ] Scroll reveals become visible (`.is-visible` specificity is correct)
- [ ] Reduced-motion path does not hide content
- [ ] In-page anchors clear the sticky header

---

## Brand / design notes (unless brief says otherwise)

- Fonts already on the site via Adobe Fonts kit `lvd5fkq` (`owners-wide`, `proxima-nova`) — link Typekit in standalone `index.html` head; Craft already loads it when embedded
- Core palette often used: yellow `hsl(45 100% 51%)`, aqua `hsl(173 52% 59%)`, green `hsl(177 95% 16%)`, green-dark `hsl(178 100% 10%)`
- Follow the brief for layout, copy, and sections; keep one job per section; mobile-friendly
