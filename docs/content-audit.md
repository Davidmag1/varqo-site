# Website content audit — 2026-10-28

Compared the public `varqo.ai` surface and current site `origin/main` (`99baa19`)
with the product checkout at `32c39ef`. The initial local site branch was older;
this change starts from current `origin/main` and retains its clean routes,
recorded traces, recovery narrative, and personal-agent context.

Product authority: sibling `Varqo/VISION.md`, `README.md`, `docs/ROADMAP.md`.
Public copy summarizes capability and scope, rather than publishing internal
source code, infrastructure identifiers, raw artifacts, or every planning note.
Existing uncommitted product planning changes were not used as implementation
proof and were not modified. Implementation-specific claims were checked against
recorded experiments, console documentation, and the corresponding test cases.

## Coverage

Paths in the source column are relative to the product repository.

| Product area | Evidence source | Website location | Scope |
| --- | --- | --- | --- |
| Execution/outcome integrity | `VISION.md` sections 1–10; `README.md` | Home, problem, how it works | Canonical thesis |
| KNOW → VERIFY → CONTROL → RECOVER → PROVE | `VISION.md` section 3; ADR-0003; roadmap architecture | Home loop, how it works | Status attached to each layer |
| Pre-action claims, memory, handoffs, broader recovery | `VISION.md` sections 7–9, 14; roadmap open hypotheses | How it works, problem, evidence readiness | Direction, not shipped breadth |
| GitHub state divergence and happy path | `docs/experiments/v05-github-live.md` | Evidence | Controlled live proof |
| DigitalOcean lifecycle and composite outcome | `v105-resource-state-live.md`, `v1013-controlled-composite-outcome.md` in `docs/experiments/` | Home playback, evidence | One controlled topology |
| Azure runtime verifier URL | `docs/experiments/v106c-azure-runtime-verifier-live.md` | Evidence | Scoped live proof |
| AWS POST/batch proof | `docs/experiments/v106d-aws-codebuild-post-batch-live.md` | Home playback, evidence | Scoped live proof |
| Real agent shadow and controlled gate | `v108-real-agent-shadow.md`, `v109-controlled-gate.md` in `docs/experiments/` | Home playback, evidence | Local completion boundary; no general external exactly-once claim |
| Structural discovery and proof planning | `README.md` implemented list; roadmap verification milestones | How it works, evidence | Supported routes only |
| Semantic requirement evaluation | `poc/eval/v098_results.md`, `v0910_results.md` | Evidence | Historical small corpora; diagnostic only; no headline accuracy claim |
| Persistent and rebound plans | `v1010-precompiled-agent-plans.md` through `v1012-cross-resource-live-proof.md`; `v1016-local-plan-restart.md` | Evidence | Startup and provider wait are not runtime binding latency |
| Minimized evidence | ADR-0004; `docs/experiments/v1014-safe-persistence-validation.md` | Evidence, lab, how it works | Allowlist projection; not production storage or public attestation |
| Nine adversarial lab scenarios | `docs/experiments/v1015-local-agent-integrity-lab.md` | Evidence, lab | Deterministic agents and synthetic provider |
| Pending-proof recovery | `docs/experiments/v1017-pending-proof-recovery.md` | Home loop, lab, evidence | After trusted write-response capture; capture atomicity is open |
| Authenticated evaluator receipt | `docs/experiments/proof-bound-recovery-v0.md`; `poc/tests/test_verification_work_recovery_v1017.py` | Lab, evidence, how it works | Same-account local HMAC boundary |
| Console and internal wheel/CLI | `README.md`; `docs/product/local-console.md`; `poc/tests/test_local_console.py` | New `/lab/`, home, evidence | Five fixed scenarios, persisted runs, projected export, explicit resume |
| Distributed enforcement and consequence-sensitive depth | Existing site direction; roadmap open distributed-control work | How it works | Explicitly marked product direction |
| Production readiness, demand, cost, generality | `README.md` POC boundary; roadmap hypotheses | Evidence readiness, lab limits | Still unvalidated |

## Presentation decisions

- Preserve Varqo's green identity, static architecture, clean URLs, and email CTA.
- Use an original verification illustration, floating state cards, orbit motion,
  a dark experiment section, stagger-free section reveals, and hover feedback.
- Add mobile navigation, skip links, visible focus, an animation pause control,
  persisted motion preference, and `prefers-reduced-motion` support.
- Label the hero and local scenario explorer as illustrations. Keep recorded live
  playback distinct; timing is illustrative, recorded measurements remain labeled.
- Do not display provider names as customer logos or claim integrations from
  fixture-based semantic evaluation.
- Current local console has five scenarios; the separate adversarial lab has nine.
  The website keeps those two counts distinct.
- The lab page explains the implemented local product. It does not serve the
  Python console or execute verification in the public visitor's browser.

## Human review and next test

David owns the public design and publishing decision. Ask an unfamiliar platform
engineer to explain, using only the site, why an action can complete while a
workflow remains held, which capabilities are local, and what remains unproven.
Failure to distinguish those boundaries means the copy needs another pass.

## Visual follow-up — open compositions

The layout follow-up responds to excessive repeated card containers. It changes
presentation rather than product scope: open, staggered control-loop nodes follow
a shared SVG path; state differences use large integrated typography; recorded
traces share the dark section background; evidence becomes full-width records;
principles become open numbered text; further-reading links become editorial
rows; and the contact section becomes a full-width band. The local scenario
result and how-it-works simulator retain purposeful technical surfaces.

The homepage illustration preserves completed / required active / observed off /
HOLD and the same one-write, zero-effect example. It remains clearly labeled as
an illustration. All existing public evidence and future-capability labels remain.
