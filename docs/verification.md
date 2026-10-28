# Website verification — 2026-10-28

Local site served over loopback HTTP with Python. Browser QA used the Codex
in-app browser. This checks the marketing site, not the Python product kernel.

## Passed

- Static checker: all six HTML pages have one H1, unique IDs, required social and
  description metadata (404 deliberately excluded), valid local links/assets and
  anchors, and sitemap targets that exist.
- JavaScript syntax: `experience.js`, `site.js`, and `action.js` via `node --check`.
- `git diff --check`.
- Six pages at widths 320, 390, 768, and 1440: no document horizontal overflow or
  broken image. Viewport scrollbar width was accounted for using `clientWidth`.
- Desktop and mobile visual inspection of the homepage, lab, and evidence;
  inspection of existing layouts through the responsive route pass.
- All five lab illustrations: RELEASED/1, HELD/0, BLOCKED/0, HELD/0, HOLDING/0.
- Existing recorded playback: mismatch → HOLD; AWS → VERIFIED; agent → RELEASE.
- Existing simulator: verified → RELEASE; false success → HOLD; timeout → UNRESOLVED.
- Both regular animated playback and the immediate reduced-motion path via the
  site preference. Pause sets computed animation play state to paused; resume
  restores running. Preference survives navigation. Both controls stay in sync.
- Mobile menu opened with Enter, next Tab reached the first navigation link with
  a visible outline, Escape closed the menu and restored trigger focus.
- Skip link moved keyboard focus to the main landmark. Lab choices work with Enter.
- No browser warning/error logs were observed during the route and interaction checks.
- Checked representative color pairs: body copy 5.80:1, scene captions on mint
  4.97:1, primary button 5.05:1, dark-section copy 9.01:1, small labels 5.59:1.
  The large muted heading is 3.70:1, above the large-text threshold.
- Inspected loaded reduced-motion media rules: animations/transitions and smooth
  scrolling are disabled; reveal content remains visible.

## Verification limits

The host OS reduced-motion setting was not changed. The equivalent site toggle
was exercised in the browser and the native media-query rules were inspected.
This is not a complete WCAG audit or cross-browser certification.

No production deployment, remote CI run, live provider call, or Python product
regression rerun is claimed. Product source was read but not changed. Public copy
is based on the recorded product evidence, not newly executed product experiments.

Live reference pages and the currently published site were inspected before
implementation. Existing external product-context links were also opened; the
static checker itself validates local destinations only, not third-party uptime.

## Open-composition follow-up — 2026-10-28

The follow-up replaces repeated framed marketing grids with an open control-loop
path, typographic outcome illustration, integrated dark trace, editorial links,
full-width contact band, unframed principles, and full-width evidence records.
Product claims, routes, scenario data, and evidence boundaries are retained.

- All six routes checked at 320, 390, 768, 1024, and 1440 px (30 combinations):
  no document horizontal overflow and no broken images.
- Desktop/mobile screenshots inspected for the home loop, trace, outcome graphic,
  evidence records, supporting essays, and local recovery steps.
- The narrow hero layout separates the observed-state label from the circular
  verification core. Its text no longer relies on a floating card background.
- All five lab selections, three recorded playbacks, and three existing simulator
  paths retain their expected outcomes. Regular-speed playback also passed.
- Menu Enter/Tab/Escape, visible focus, and the skip link were rechecked.
- Pause stops the new SVG path animation; native reduced-motion rules disable it.
  The paused preference also disables smooth scrolling on the root element.
- Static checker and diff whitespace checks passed; no warning/error logs were
  observed during the responsive and interaction checks.

The native OS reduced-motion setting and external product kernel were not changed.
