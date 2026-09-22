# Brighter Health private hospitals landing page — developer handoff

**Status:** implementation-ready standalone prototype  
**Prepared:** 22 July 2026  
**Recommended production URL:** `https://brighterhealth.com.au/private-hospitals/`

## Package contents

- `index.html` — complete prototype, metadata, structured data and page content.
- `styles.css` — responsive page styling and motion.
- `script.js` — page interactions and progressive enhancements.
- `assets/` — all local images, video, poster frames and logos used by the page.

The package deliberately excludes the local `output/` test-artifact directory.

## Recommended production integration

1. Create the new `/private-hospitals/` route inside the existing Brighter Health CMS/site template.
2. Use the live site's existing global header, navigation, menu and footer.
3. Insert the prototype's `<main id="main">…</main>` into that template.
4. Retain the page metadata and both JSON-LD blocks from the prototype, updating the final canonical URL if necessary.
5. Add the supplied assets to the site's media/CDN pipeline and update asset URLs if the folder structure changes.
6. Load the page CSS only on this route, after removing or isolating the preview-only global-component styles noted below.
7. Load the page interaction script with `defer`. Remove its preview menu logic if the live header already provides that behaviour.

The standalone header and footer are clearly marked in `index.html` with `Preview-only` comments so they can be removed safely during integration.

## Global component boundaries

### Replace with live components

- The prototype `<header class="site-header">` and mobile navigation.
- The prototype `<footer class="site-footer">`, including the visual-only newsletter form.

The live global footer should retain its existing newsletter submission, validation, consent and reCAPTCHA handling. The prototype form is present only to make the local preview visually complete.

### Keep from the prototype

- Everything inside `<main id="main">`.
- The page title, description, canonical link and social-sharing metadata.
- The `Service` and `FAQPage` JSON-LD blocks.
- The Adobe Typekit stylesheet only if the same font kit is not already loaded globally.

## CSS integration warning

`styles.css` contains preview styles for the standalone header and footer. Do not merge these selectors unmodified into a global stylesheet because their class names may collide with the live theme.

Remove, namespace or leave out rules associated with:

- `.site-header`, `.brand`, `.header-actions`, `.header-talk`, `.menu-toggle`, `.mobile-menu`
- `.site-footer` and all `.site-footer-*` selectors
- `.subscribe-*` and `.recaptcha-note`

All remaining styles should be loaded as route-specific CSS. If the build system supports CSS scoping, scope the landing-page rules beneath a page body class such as `.page-private-hospitals`.

## JavaScript integration

Retain the behaviours for:

- scroll reveal and hero parallax;
- the two typed-word headline animations;
- the rotating hospital-challenge statements;
- click-to-pause/resume video divider;
- result counters;
- continuous outcomes ticker;
- pooled-campaign gallery;
- Burnside case-study hover gallery;
- reduced-motion handling.

If the live header supplies its own menu, omit the initial menu-toggle/mobile-navigation setup in `script.js`. The remaining page features are written defensively and do not require that preview header.

## Asset and performance notes

- All 21 referenced assets are included and resolve locally.
- The divider video is approximately 5.2 MB and is already lazy-loaded with `preload="none"` plus a poster image.
- The Stirling Hospital bus-shelter PNG is approximately 2.1 MB and is lazy-loaded. Run it through the production image pipeline and supply responsive WebP/AVIF variants where available.
- The complete asset folder is approximately 15 MB. Production should serve images and video through the site's CDN with long-lived cache headers.
- Preserve intrinsic dimensions or aspect ratios to avoid layout movement while media loads.

## SEO, generative search and accessibility

- The page contains a descriptive title, meta description, canonical URL and Open Graph/Twitter metadata.
- The visible FAQ contains 24 questions. The FAQ structured data contains the same 24 questions and answers.
- Keep visible FAQ copy and JSON-LD synchronised if the content is edited.
- All in-page links currently point to valid IDs.
- Preserve the supplied image alternative text, semantic headings, focus styles and keyboard-accessible FAQ controls.
- Decorative ticker duplicates are hidden from assistive technology.
- Motion respects `prefers-reduced-motion`; retain that behaviour.
- The AHPRA guidance link intentionally opens the official AHPRA advertising resource in a new tab.

## CMS wiring checklist

- [ ] Use the live global header, navigation and footer.
- [ ] Confirm the final canonical and social-sharing URLs.
- [ ] Map every `assets/…` reference to the production media/CDN URL.
- [ ] Confirm the main and mid-page CTAs open the live contact page.
- [ ] Confirm telephone and email links use the current live business details.
- [ ] Use the live footer newsletter handler rather than the preview form.
- [ ] Confirm external links opened in new tabs retain `rel="noopener noreferrer"`.
- [ ] Ensure only one copy of the Typekit font stylesheet is loaded.
- [ ] Keep FAQ content and FAQ schema identical.

## Staging acceptance checklist

Test at minimum at 1440 px, 1024 px, 768 px, 430 px and 375 px widths:

- [ ] Live header, menu and contact button behave exactly like the existing site.
- [ ] Both yellow typed-word lines stay on a dedicated line without layout jumping.
- [ ] Rotating challenge statements remain readable and do not alter section height.
- [ ] The three problem columns align cleanly and stack correctly on mobile.
- [ ] Clicking the divider video pauses and resumes it; no visible pause button is shown.
- [ ] Outcomes ticker loops smoothly and honours reduced-motion preferences.
- [ ] Result counters end at the correct values and use the word “million”.
- [ ] Both image galleries crossfade smoothly without image distortion.
- [ ] All 24 FAQs open by mouse, touch and keyboard.
- [ ] Contact, phone, AHPRA and case-study links reach the intended destinations.
- [ ] No horizontal scrolling, clipped copy, unexpected font fallback or cumulative layout shift appears.
- [ ] Page metadata and both JSON-LD blocks are present in the rendered production HTML.

## Verification completed for this package

- JavaScript syntax check passed.
- CSS opening and closing braces balance.
- 21 unique referenced assets were found; none are missing.
- 17 document IDs were found; none are duplicated.
- All internal hash links have matching targets.
- Both JSON-LD blocks parse successfully.
- The 24 visible FAQ entries match the 24 FAQ schema entries.
- No local filesystem paths, localhost URLs, placeholder domains or TODO markers are present in the implementation files.

Automated local rendered-browser testing could not be rerun during final packaging because the managed browser policy blocked the localhost preview URL. The page has already undergone iterative visual review in the prototype browser, but the staging acceptance checklist above should be completed after the page is integrated with the live CMS components.
