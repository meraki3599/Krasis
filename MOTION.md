# Krasis motion spec

Every easing, duration and ScrollTrigger in the site, with the file that owns it.

## Eases

| Name | Curve | Use |
| --- | --- | --- |
| `kOut` | `cubic-bezier(0.16, 1, 0.3, 1)` | default for every reveal (`gsap.defaults`) |
| `kInOut` | `cubic-bezier(0.76, 0, 0.24, 1)` | page transition, menu, preloader wipe, nav hide |
| `none` | linear | every scrubbed timeline |
| `power3.out` | — | cursor follow, magnetic pull, Work preview follow |
| `elastic.out(1, 0.4)` | — | magnetic button spring-back |

Registered in `js/utils.js` with CustomEase. CSS mirrors them as `--ease-out` and `--ease-inout` in `tokens.css`.

## Global timings

| Thing | Duration | File |
| --- | --- | --- |
| Line reveals (`data-anim="lines"`) | 1.2s, yPercent 110 → 0, +0.08s per line | `reveal.js` |
| Fades (`fade`, `stagger`) | 1.1–1.2s, y 24 → 0, stagger 0.08s | `reveal.js` |
| Hairlines (`rule-y`, `rule-x`) | 1.2s, scale 0 → 1 | `reveal.js` |
| Price counters (`count`) | 1.6s | `reveal.js` |
| Page transition | 0.35s cover + 0.35s reveal = 0.7s, `kInOut` | `router.js` |
| Menu open | clip-path circle 1.0s, links 1.1s stagger 0.06s from 0.35s | `nav.js` |
| Menu close | 0.8s | `nav.js` |
| Nav hide/show | 0.6s | `nav.js` |
| Cursor follow | 0.35s quickTo | `cursor.js` |
| Magnetic buttons | 0.5s pull (max 8px), 0.9s elastic release | `cursor.js` |
| Button fill / underline draw | 0.6s CSS | `components.css` |
| Toast | 0.4–0.6s CSS, visible 1.8s | `utils.js` |

## Preloader (`preloader.js`)

| Time | Event |
| --- | --- |
| 0 → 1.1s | Counter 000 → 100 (power2.inOut); line draws left half 0.55s, right half 0.55s |
| 1.1 → 1.65s | Line halves retreat to outer edges, logo clip-path opens from the centre |
| 1.65 → 1.95s | 300ms hold |
| 1.95 → 2.65s | Screen wipes up (clip-path), then the hero intro plays |

Skip: click, Esc, Enter or Space jumps to 1.1s and plays at 2.5×.

## ScrollTriggers

| Section | Trigger | Start → End | Scrub / Pin | What moves |
| --- | --- | --- | --- | --- |
| Hero (`hero.js`) | `.hero` (300vh) | top top → bottom top | scrub 0.5 | stage rotateX 15→0, rotateZ 20→0, y −700→500, opacity 0.2→1 over first 20%; rows x ±1000 over 100% (×0.55 on mobile) |
| Hero bands | `.hero` | top top → bottom top | scrub true | yPercent 0→10; velocity skew ±3° (ticker, lerp 0.08) |
| Problem headline | element | top 80% → bottom 45% | scrub 0.6 | word opacity 0.2 → 1 |
| Intro "Krasis" | `em` | top 85% | once, delay 0.8s | scale 1 → 1.06 + soft glow, 1.4s |
| Vision / Mission (`vision.js`) | `.vm` | top top → +=200% | **pin**, scrub 0.6 | vision in → hold → mission clip-path wipe up → mission title out → pull-quote in |
| Logo wall | `.lwall` | top 85% | once | items fade up, 1.4s stagger 0.12s |
| Project scroller (`work.js`) | `.hscroll` | top top → +=track overflow | **pin**, scrub 0.6 | track x 0 → −overflow |
| Process (`sections/process.js`) | each step | top 55% → bottom 55% | toggle | active step opacity 1, others 0.25; left column is CSS sticky |
| Process progress | list | top 55% → bottom 55% | scrub true | fill scaleY 0 → 1 |
| Included items | each item | top 88% | once | hairline 1.2s + star/text rise |
| Plans | each panel | top 85% | once | fade up 1.3s, 0.12s apart |
| Why contrasts | pivot line | top 90% → top 45% | scrub true | contrast columns opacity 1 → 0.28 |
| CTA grid (`cta.js`) | `.cta` | top 90% → center center | scrub 0.6 | grid lines diverge 0.05 → 1 |
| Footer mark | mark | top 95% | once | yPercent 30 → 0, fade, 1.4s |
| Process page (`pages/process.js`) | each step | top 50% → bottom 50% | toggle + scrub | numeral swap, ring stroke fills |

Pinned and scrubbed sequences only run at ≥768px without reduced motion (`K.MQ_MOTION`). Below that, sections stack with once-only reveals. The hero parallax runs at every size (as in the original) and opts out only for reduced motion.

## Scroll velocity

Hero bands and the squares cluster read `K.scroll.velocity()` each frame, clamp to ±3° of skew and lerp at 0.08, so they spring back when scrolling stops.

## Smooth scroll

Lenis `duration 1.15`, expo-out easing, on fine pointers only, driven by `gsap.ticker` with `lagSmoothing(0)`.

## Reduced motion

`prefers-reduced-motion: reduce` turns off Lenis, the preloader, pins, scrubs, parallax and canvas animation (squares draw one static frame). Reveals become 0.6s opacity fades.

## Lifecycle

Each view runs inside a `gsap.context` and a `gsap.matchMedia` (`K.createViewScope`). On a route change both are reverted, every ScrollTrigger is killed and registered cleanups (listeners, canvases, ticker callbacks) run before the next view mounts.
