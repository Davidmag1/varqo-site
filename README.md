# Varqo website

Static marketing website for https://varqo.ai, deployed with GitHub Pages.
No framework, package install, build step, or external animation dependency.

## Pages

- `/` — product narrative, animated illustration, recorded experiment playback
- `/problem/` — the execution integrity gap
- `/how-it-works/` — control loop, architecture direction, illustrative simulator
- `/evidence/` — scoped live results, local evidence, and open hypotheses
- `/lab/` — local console capabilities and five illustrative scenario explanations
- `/404.html` — missing-page fallback

## Preview and checks

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Visit http://127.0.0.1:4173/. Root-relative assets require an HTTP server.

```sh
python3 scripts/check_site.py
node --check experience.js
node --check site.js
node --check action.js
```

Before publishing, check desktop/mobile layouts, keyboard focus and navigation,
reduced motion, interactive results, console errors, and horizontal overflow.

## Shared assets

- `styles.css` — base layouts and existing components
- `experience.css` — visual refresh, new sections, responsive navigation, motion
- `experience.js` — menu, motion preferences, hero animation, illustrated lab
- `site.js` — reveals and how-it-works simulator
- `action.css` / `action.js` — curated recorded experiment playback
- `varqo-logo.png` / `favicon.png` — existing brand assets

The hero and lab explorer are explicitly illustrative. The homepage experiment
player uses condensed, sanitized records with illustrative playback timing.
The actual local Python console is a separate product; this site does not run it.

## Product truth

Varqo independently verifies consequential states before dependent execution
continues. The current evidence supports a scoped verification kernel, local
control boundary, local recovery path, and local evaluation console.
Broader claims, memory integrity, distributed enforcement, generic recovery,
production readiness, enterprise demand, and willingness to pay remain direction
or hypotheses. See [content audit](docs/content-audit.md) for source mapping and
[verification notes](docs/verification.md) for the checks on this change.

The product repository is the source of truth. Do not convert narrow experiments
or synthetic local scenarios into general deployment or integration claims.
