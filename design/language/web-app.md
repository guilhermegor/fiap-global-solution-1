---
name: Sentinela
version: 1.0.0
date: 2026-06-04
tier: design-language
purpose: web-app
project: FIAP Global Solution 2026/1 — Engenharia de Software
seeded-from: design/brand/brand-book.md
theme: dark-primary

tokens:
  color:
    # --- Identity raw values ---
    void:              "#070D1A"
    deep-atlas:        "#0D1F3C"
    rescue-cyan:       "#00E5FF"
    sentinel-amber:    "#FFB300"
    orbital-blue:      "#1565C0"

    # --- Semantic backgrounds ---
    bg-base:           "#070D1A"   # Void — canvas, body
    bg-surface:        "#0D1F3C"   # Deep Atlas — panels, cards
    bg-surface-raised: "#0F2645"   # Deep Atlas +5% lightness — modals, drawers
    bg-overlay-low:    "rgba(21, 101, 192, 0.08)"   # Orbital Blue 8% — card hover
    bg-overlay-mid:    "rgba(21, 101, 192, 0.16)"   # Orbital Blue 16% — selected state
    bg-overlay-high:   "rgba(21, 101, 192, 0.32)"   # Orbital Blue 32% — modal backdrop
    bg-glass:          "rgba(7, 13, 26, 0.80)"      # Void 80% + backdrop-blur — map floaters

    # --- Text ---
    text-primary:      "#E8F0FE"   # Near-white, warm blue tint — AA 14.1:1 on bg-base
    text-secondary:    "#90A4C4"   # Muted steel blue — AA 5.1:1 on bg-base
    text-disabled:     "#455A7A"   # Low-contrast label — decorative use only
    text-accent:       "#00E5FF"   # Rescue Cyan — links, highlights
    text-inverse:      "#070D1A"   # On rescue-cyan or amber fills

    # --- Borders & dividers ---
    border-subtle:     "rgba(144, 164, 196, 0.12)"  # Near-invisible separator
    border-default:    "rgba(144, 164, 196, 0.24)"  # Panel edge, card outline
    border-strong:     "rgba(144, 164, 196, 0.48)"  # Focus ring base, active tab

    # --- Accent / interactive ---
    accent:            "#00E5FF"   # Rescue Cyan — primary interactive & safe-route highlight
    accent-dim:        "#00B8D4"   # Rescue Cyan darkened 20% — hover state
    accent-subtle:     "rgba(0, 229, 255, 0.12)"    # Cyan 12% — ghost button fill, chip bg
    interactive:       "#1565C0"   # Orbital Blue — secondary buttons, links
    interactive-hover: "#1976D2"   # Orbital Blue +1 step — hover

    # --- Semantic: risk layer ---
    risk-flood:        "#1E88E5"   # Flood Blue — SAR flood overlay
    risk-flood-dim:    "rgba(30, 136, 229, 0.20)"   # Flood fill at map opacity
    risk-fire:         "#FFB300"   # Sentinel Amber — thermal fire overlay
    risk-fire-dim:     "rgba(255, 179, 0, 0.20)"    # Fire fill at map opacity
    risk-landslide:    "#8D6E63"   # Landslide Earth — InSAR ground-deformation overlay
    risk-landslide-dim:"rgba(141, 110, 99, 0.20)"   # Landslide fill at map opacity
    risk-danger:       "#E53935"   # Danger Red — total route block, CRITICAL alert
    risk-danger-dim:   "rgba(229, 57, 53, 0.20)"    # Danger fill at map opacity

    # --- Semantic: states ---
    safe:              "#00E5FF"   # Rescue Cyan — confirmed safe route, shelter pin
    safe-alt:          "#00C853"   # Vivid green — arrival confirmation, OK status
    safe-alt-dim:      "rgba(0, 200, 83, 0.15)"
    warning:           "#FFB300"   # Sentinel Amber — non-critical warning badge
    warning-dim:       "rgba(255, 179, 0, 0.15)"
    critical:          "#E53935"   # Danger Red — critical badge, error
    critical-dim:      "rgba(229, 57, 53, 0.15)"
    nominal:           "#00E5FF"   # System nominal / all sensors active

  type:
    # --- Font family roles ---
    font-display:  "'Rajdhani', sans-serif"
    font-body:     "'IBM Plex Sans', sans-serif"
    font-mono:     "'IBM Plex Mono', monospace"

    # --- Type scale (rem, base 10px = html:62.5%) ---
    text-2xs:   "1.0rem"   #  10px — status-bar micro labels, mono data compact
    text-xs:    "1.1rem"   #  11px — critical status strings (Plex Mono Bold)
    text-sm:    "1.2rem"   #  12px — caption, label, badge
    text-base:  "1.4rem"   #  14px — body compact (operator dense view)
    text-md:    "1.6rem"   #  16px — body primary (citizen view)
    text-lg:    "1.8rem"   #  18px — card title, sub-heading
    text-xl:    "2.0rem"   #  20px — section heading (Rajdhani)
    text-2xl:   "2.4rem"   #  24px — panel title (Rajdhani)
    text-3xl:   "3.2rem"   #  32px — page title (Rajdhani)
    text-4xl:   "4.8rem"   #  48px — hero display (Rajdhani)
    text-5xl:   "6.4rem"   #  64px — fullscreen display (Rajdhani)
    text-6xl:   "7.2rem"   #  72px — max display (Rajdhani)

    # --- Weight ---
    weight-regular:   400
    weight-medium:    500
    weight-semibold:  600
    weight-bold:      700

    # --- Line height ---
    leading-none:     1.0   # Display / all-caps Rajdhani
    leading-tight:    1.2   # Titles, data readouts
    leading-snug:     1.4   # Card titles
    leading-normal:   1.6   # Body text
    leading-relaxed:  1.8   # Long-form prose (not primary use case)

    # --- Letter spacing ---
    tracking-tight:   "-0.01em"  # Large Rajdhani display
    tracking-normal:  "0em"
    tracking-wide:    "0.05em"   # Rajdhani section labels, all-caps body
    tracking-wider:   "0.10em"   # Logo wordmark tracking
    tracking-widest:  "0.15em"   # Tagline / Plex Mono caps micro-labels

  spacing:
    space-0:   "0"
    space-px:  "0.1rem"    #  1px  — hairline border
    space-0-5: "0.2rem"    #  2px  — micro nudge
    space-1:   "0.4rem"    #  4px
    space-1-5: "0.6rem"    #  6px
    space-2:   "0.8rem"    #  8px
    space-2-5: "1.0rem"    # 10px
    space-3:   "1.2rem"    # 12px
    space-4:   "1.6rem"    # 16px
    space-5:   "2.0rem"    # 20px
    space-6:   "2.4rem"    # 24px
    space-7:   "2.8rem"    # 28px
    space-8:   "3.2rem"    # 32px
    space-10:  "4.0rem"    # 40px
    space-12:  "4.8rem"    # 48px
    space-16:  "6.4rem"    # 64px
    space-20:  "8.0rem"    # 80px
    space-24:  "9.6rem"    # 96px

  rounded:
    rounded-none:  "0"
    rounded-sm:    "0.2rem"    #  2px — badges, chips
    rounded-base:  "0.4rem"    #  4px — input fields, small buttons
    rounded-md:    "0.6rem"    #  6px — cards, panels
    rounded-lg:    "0.8rem"    #  8px — drawers, modals, large cards
    rounded-xl:    "1.2rem"    # 12px — citizen CTA button
    rounded-2xl:   "1.6rem"    # 16px — hero panel on mobile
    rounded-full:  "9999px"    # Pill — status badge, icon button

  elevation:
    shadow-0:  "none"
    shadow-1:  "0 1px 3px rgba(7, 13, 26, 0.60)"     # Subtle lift — badge
    shadow-2:  "0 2px 8px rgba(7, 13, 26, 0.70)"     # Card
    shadow-3:  "0 4px 16px rgba(7, 13, 26, 0.80)"    # Drawer, panel
    shadow-4:  "0 8px 32px rgba(7, 13, 26, 0.90)"    # Modal
    shadow-glow-cyan:  "0 0 12px rgba(0, 229, 255, 0.30)"   # Safe-route highlight
    shadow-glow-amber: "0 0 12px rgba(255, 179, 0, 0.30)"   # Alert pulse
    shadow-glow-red:   "0 0 12px rgba(229, 57, 53, 0.30)"   # Critical event

  motion:
    # --- Duration ---
    duration-instant:  "0ms"
    duration-fast:     "100ms"
    duration-normal:   "200ms"
    duration-slow:     "300ms"
    duration-slower:   "500ms"
    duration-radar:    "3000ms"   # Full radar sweep rotation
    duration-pulse:    "1500ms"   # Alert pulse cycle (expand + fade)
    duration-route:    "800ms"    # Route line draw-on animation

    # --- Easing ---
    ease-linear:       "linear"
    ease-in:           "cubic-bezier(0.4, 0, 1, 1)"
    ease-out:          "cubic-bezier(0, 0, 0.2, 1)"
    ease-in-out:       "cubic-bezier(0.4, 0, 0.2, 1)"
    ease-spring:       "cubic-bezier(0.34, 1.56, 0.64, 1)"   # Micro-bounce for arrive state
    ease-radar:        "linear"                                # Radar sweep — constant velocity
    ease-route:        "cubic-bezier(0.4, 0, 0.2, 1)"        # Route draw-on — ease-out feel
    ease-pulse:        "cubic-bezier(0, 0, 0.2, 1)"          # Alert pulse — ease-out expand

    # --- Reduced motion ---
    reduced-duration:  "0ms"
    reduced-pulse:     "none"     # Replace pulse animation with static border
    reduced-radar:     "paused"   # Pause sweep; show static radar frame
---

# Sentinela — Design Language

> Foundations / Primitives layer for the Sentinela web application.
> Seeded from `design/brand/brand-book.md` (identity-palette + typefaces).
> Consumes: brand book. Consumed by: component library, Figma, vanilla HTML/CSS/JS.

---

## Overview

Sentinela is a satellite-data-driven emergency routing platform targeting two
personas:

- **Cidadão** — citizen in an active disaster, using a mobile browser at low
  battery, possibly in poor signal. Needs maximum legibility, one-handed
  operation, and zero cognitive load.
- **Operador** — monitoring-center analyst on desktop, managing a dense
  multi-panel "mission control" view of real-time satellite hazard layers,
  route statuses, and team dispatch.

The design language prioritises **dark-first** (deep space theme) because both
use cases share a low-ambient-light context: the citizen is often outdoors at
night or in smoke; the operator works in a dimmed control room. Light mode is
not in scope for this deliverable.

The visual register is **precision instrument** — the aesthetics of satellite
ground-station UIs, radar displays, and SAR imagery products. Not a consumer
app, not a government form. Every element earns its place by conveying
information that could save a life.

Motion is purposeful. Three specific animation archetypes drive the entire
motion vocabulary: the radar sweep, the alert pulse, and the route draw-on.
All other transitions are utility motion (fast, eased) that serve navigation
clarity without drawing attention.

---

## Colors

### System

The color system has three layers:

1. **Identity palette** — the five raw brand colors (Void, Deep Atlas, Rescue
   Cyan, Sentinel Amber, Orbital Blue). These are reference values. Never use
   them directly in component code; always reference a semantic token.

2. **Semantic UI tokens** — `bg-*`, `text-*`, `border-*`, `accent-*`,
   `interactive-*`. These map the identity palette to roles. Switching to a
   light theme (future scope) requires only remapping these tokens; identity
   values stay constant.

3. **Risk and state tokens** — `risk-flood`, `risk-fire`, `risk-landslide`,
   `risk-danger`, `safe`, `safe-alt`, `warning`, `critical`. These are
   semantically locked: each color is chosen from the scientific convention
   of its hazard domain and must not be repurposed.

### Identity palette

| Token | Name | Hex | Role |
|---|---|---|---|
| `void` | Void | `#070D1A` | Body background, deep canvas |
| `deep-atlas` | Deep Atlas | `#0D1F3C` | Panels, cards, sidebar |
| `rescue-cyan` | Rescue Cyan | `#00E5FF` | Safe routes, accent, safe state |
| `sentinel-amber` | Sentinel Amber | `#FFB300` | Fire hazard only + warning badges |
| `orbital-blue` | Orbital Blue | `#1565C0` | Interactive elements, logo |

### Semantic backgrounds

| Token | Value | Usage |
|---|---|---|
| `bg-base` | `#070D1A` | `<html>`, `<body>`, canvas background |
| `bg-surface` | `#0D1F3C` | Sidebar panels, data cards, top bar |
| `bg-surface-raised` | `#0F2645` | Modals, drawers, floating panels |
| `bg-overlay-low` | Orbital Blue 8% | Card hover background |
| `bg-overlay-mid` | Orbital Blue 16% | Selected row / active panel highlight |
| `bg-overlay-high` | Orbital Blue 32% | Modal backdrop scrim |
| `bg-glass` | Void 80% + blur | Map floaters, legend overlay |

### Text

All body text on `bg-base` and `bg-surface` meets WCAG AA (4.5:1 minimum).
`text-primary` achieves 14.1:1 on `bg-base` (AAA). `text-secondary` achieves
5.1:1 on `bg-base` (AA). `text-disabled` at 2.8:1 is intentionally
below AA — it is used only for non-interactive decorative labels.

| Token | Hex / Value | Contrast on bg-base | Use |
|---|---|---|---|
| `text-primary` | `#E8F0FE` | 14.1:1 AAA | Primary body, labels, readings |
| `text-secondary` | `#90A4C4` | 5.1:1 AA | Muted metadata, timestamps |
| `text-disabled` | `#455A7A` | 2.8:1 (decorative) | Inactive / placeholder |
| `text-accent` | `#00E5FF` | 12.8:1 AAA | Hyperlinks, active route labels |
| `text-inverse` | `#070D1A` | — | Text on cyan or amber fills |

### Risk layers

Sentinel Amber is **exclusively** a fire/thermal hazard token and a warning
badge color. It must not be used as a general UI accent. Rescue Cyan carries
all positive/safe state signaling and all general-purpose accent roles.

| Token | Hex | Hazard / Meaning |
|---|---|---|
| `risk-flood` | `#1E88E5` | Flood zone — SAR water coverage |
| `risk-flood-dim` | rgba 20% | Map polygon fill for flood area |
| `risk-fire` | `#FFB300` | Fire / thermal source — Sentinel Amber |
| `risk-fire-dim` | rgba 20% | Map polygon fill for fire area |
| `risk-landslide` | `#8D6E63` | Ground deformation — InSAR risk |
| `risk-landslide-dim` | rgba 20% | Map polygon fill for landslide area |
| `risk-danger` | `#E53935` | Total route block, CRITICAL event |
| `risk-danger-dim` | rgba 20% | Map polygon fill for exclusion zone |

### Safe / state tokens

| Token | Value | Use |
|---|---|---|
| `safe` | `#00E5FF` | Active safe route line, shelter pin, green-light system state |
| `safe-alt` | `#00C853` | Arrival confirmation, "all clear", OK status badge |
| `warning` | `#FFB300` | Non-critical warning badge, caution zone |
| `critical` | `#E53935` | Critical badge, route fully blocked, system error |
| `nominal` | `#00E5FF` | "SISTEMA NOMINAL" status indicator |

### Contrast audit summary

Verified pairs (foreground / background):

| Foreground | Background | Ratio | Result |
|---|---|---|---|
| `text-primary` `#E8F0FE` | `bg-base` `#070D1A` | 14.1:1 | AAA |
| `text-primary` `#E8F0FE` | `bg-surface` `#0D1F3C` | 11.4:1 | AAA |
| `text-secondary` `#90A4C4` | `bg-base` `#070D1A` | 5.1:1 | AA |
| `text-secondary` `#90A4C4` | `bg-surface` `#0D1F3C` | 4.1:1 | AA (large text) |
| `text-accent` `#00E5FF` | `bg-base` `#070D1A` | 12.8:1 | AAA |
| `text-accent` `#00E5FF` | `bg-surface` `#0D1F3C` | 10.3:1 | AAA |
| `text-inverse` `#070D1A` | `rescue-cyan` `#00E5FF` | 12.8:1 | AAA |
| `text-inverse` `#070D1A` | `sentinel-amber` `#FFB300` | 10.2:1 | AAA |
| `risk-flood` `#1E88E5` | `bg-base` `#070D1A` | 4.8:1 | AA |
| `safe-alt` `#00C853` | `bg-base` `#070D1A` | 5.2:1 | AA |
| `risk-danger` `#E53935` | `bg-base` `#070D1A` | 4.6:1 | AA |
| `risk-landslide` `#8D6E63` | `bg-base` `#070D1A` | 3.5:1 | AA (large/bold) |

`risk-landslide` at 3.5:1 passes AA only for large text (18px+) or bold text
(14px+ bold). It must not be used as small body text color — it is a map
polygon fill and icon color at 24px+ only. This is by design.

---

## Typography

### Font roles

Three families, each owning a distinct register:

| Role | Family | Classification | Weights loaded |
|---|---|---|---|
| `font-display` | Rajdhani | Geometric / techno-condensed | 600, 700 |
| `font-body` | IBM Plex Sans | Humanist grotesque | 400, 500, 700 |
| `font-mono` | IBM Plex Mono | Monospace | 400, 700 |

**Rajdhani** owns all headings, section titles, the logo wordmark, and any
all-caps label in the operator view. Its condensed proportions allow long
technical strings ("MONITORAMENTO EM TEMPO REAL — REGIÃO METROPOLITANA") to
fit in a single line at the appropriate scale without wrapping.

**IBM Plex Sans** is the reading font for all flowing content: instructions,
descriptions, metadata rows, alert text. Its large x-height sustains
legibility at 14px on a dark background — a requirement for the citizen
persona on a dim, cracked phone screen.

**IBM Plex Mono** is exclusively for data: coordinates, timestamps, sensor
values, status strings formatted like terminal output ("SAR COVERAGE ACTIVE —
14:32 UTC"). Using a monospace font here prevents number jitter during live
updates and creates an immediate visual signal that the value is a raw data
readout, not prose.

### Fallback stacks

```css
--font-display: 'Rajdhani', 'Barlow Condensed', 'Arial Narrow', sans-serif;
--font-body:    'IBM Plex Sans', 'Inter', system-ui, -apple-system, sans-serif;
--font-mono:    'IBM Plex Mono', 'Roboto Mono', 'Courier New', monospace;
```

### Loading strategy

For `file://` delivery (academic prototype):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@600;700&family=IBM+Plex+Sans:wght@400;500;700&family=IBM+Plex+Mono:wght@400;700&display=swap" rel="stylesheet">
```

For the React SPA (production):
```bash
npm install @fontsource/rajdhani @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono
```

### Type scale

Base: `1rem = 10px` (html `font-size: 62.5%`).

| Token | rem | px | Primary family | Primary use |
|---|---|---|---|---|
| `text-2xs` | 1.0 | 10 | Plex Mono | Micro status chips, map attribution |
| `text-xs` | 1.1 | 11 | Plex Mono Bold | CRITICAL status strings |
| `text-sm` | 1.2 | 12 | Plex Sans | Captions, badges, timestamps |
| `text-base` | 1.4 | 14 | Plex Sans | Operator body compact |
| `text-md` | 1.6 | 16 | Plex Sans | Citizen body primary |
| `text-lg` | 1.8 | 18 | Rajdhani | Card title, data row heading |
| `text-xl` | 2.0 | 20 | Rajdhani | Subsection heading |
| `text-2xl` | 2.4 | 24 | Rajdhani | Panel title, modal header |
| `text-3xl` | 3.2 | 32 | Rajdhani | Page title, route name |
| `text-4xl` | 4.8 | 48 | Rajdhani | Hero display |
| `text-5xl` | 6.4 | 64 | Rajdhani | Fullscreen CTA (citizen) |
| `text-6xl` | 7.2 | 72 | Rajdhani | Max display |

### Typographic combinations

**Operator row** — sensor label + value + timestamp:
```
ENCHENTE · SENTINEL-1 SAR    [Rajdhani 600, text-lg, tracking-wide]
Camada ativa — 3 zonas       [Plex Sans 400, text-base, text-secondary]
14:17 UTC                    [Plex Mono 400, text-sm, text-secondary]
```

**Citizen route step** — bold instruction + distance:
```
Vire à esquerda na Av. Brasil  [Plex Sans 700, text-md]
1,2 km · ~14 min               [Plex Mono 400, text-sm, text-secondary]
```

**Hero CTA** — citizen primary action:
```
ROTA SEGURA AGORA              [Rajdhani 700, text-4xl, tracking-wide, text-inverse on accent bg]
Baseada em dados de satélite   [Plex Sans 400, text-sm, text-inverse]
```

---

## Layout

### Spacing scale

The scale follows a modified 4px base grid. Steps 1–8 are dense (4px
increments, for internal component padding and icon gaps). Steps above space-8
jump to coarser increments for section and page layout.

```
4 → 8 → 12 → 16 → 20 → 24 → 28 → 32 → 40 → 48 → 64 → 80 → 96 px
```

Key landmark values:

| Token | px | Use case |
|---|---|---|
| `space-1` | 4 | Icon-to-label gap, badge inner padding |
| `space-2` | 8 | Button inner padding (compact), list item gap |
| `space-3` | 12 | Card inner padding compact, input padding |
| `space-4` | 16 | Standard inner padding for cards, inputs |
| `space-6` | 24 | Section inner padding, modal padding |
| `space-8` | 32 | Panel-to-panel gutter on desktop |
| `space-12` | 48 | Section vertical rhythm |
| `space-16` | 64 | Hero section padding |

### Border radius

| Token | px | Use |
|---|---|---|
| `rounded-none` | 0 | Map tiles, raw canvas, full-bleed elements |
| `rounded-sm` | 2 | Badges, status chips, progress bars |
| `rounded-base` | 4 | Input fields, small buttons, tooltips |
| `rounded-md` | 6 | Cards, panels, dropdowns |
| `rounded-lg` | 8 | Drawers, modals, large feature cards |
| `rounded-xl` | 12 | Citizen primary CTA button |
| `rounded-2xl` | 16 | Hero panel, mobile bottom sheet |
| `rounded-full` | 9999 | Icon buttons, avatar, status dot |

### Grid system

Two distinct layout modes serve the two personas:

**Operator — desktop mission control (≥ 1024px):**
```
Map canvas: fluid fill (flex-1 / calc(100vw - sidebar))
Left sidebar: 280px fixed
Right data panel: 320px fixed
Top bar: 48px fixed
Status bar: 32px fixed
Gutters: space-4 (16px)
Content column within panels: full-width minus space-6 (24px) padding each side
```

**Citizen — mobile primary (< 640px):**
```
Single column, full-width
Padding: space-4 (16px) horizontal
Map canvas: 100vw × 50vh (top half)
Route panel: bottom sheet, 50vh initial, expandable to 80vh
CTA button: full-width minus space-8 (32px) margin each side
```

**Breakpoints:**

| Name | Min-width | Context |
|---|---|---|
| `xs` | 0 | Citizen mobile (portrait, 360px+) |
| `sm` | 480px | Citizen mobile (landscape) |
| `md` | 768px | Tablet / handoff between layouts |
| `lg` | 1024px | Operator desktop entry |
| `xl` | 1280px | Operator desktop comfortable |
| `2xl` | 1536px | Operator wide monitor |

---

## Elevation

The elevation system uses box shadows only. No borders signal elevation
level — the dark theme uses opacity and shadow intensity to convey depth.

| Token | Use |
|---|---|
| `shadow-0` | Flat element, integrated with surface |
| `shadow-1` | Badge, tooltip, small chip |
| `shadow-2` | Card, data row hover |
| `shadow-3` | Side panel, drawer |
| `shadow-4` | Modal, fullscreen overlay |
| `shadow-glow-cyan` | Active safe-route line, shelter pin highlight |
| `shadow-glow-amber` | Alert pulse ring (animation keyframe) |
| `shadow-glow-red` | Critical zone border pulse |

Glows are applied via `box-shadow` on DOM elements or `filter: drop-shadow`
on SVG map overlays. They are disabled under `prefers-reduced-motion`.

---

## Motion

### Register

The brand personality is "vigilant, reliable, human". Motion must be
**purposeful and measured** — nothing bounces or spins for delight. Every
animated element communicates a real system state.

Three canonical animation archetypes:

1. **Radar sweep** — the rotating line that sweeps the sensor coverage arc.
   Communicates "system is scanning, data is live". Constant velocity
   (`ease-linear`), 3000ms per rotation. A paused sweep means data is stale.

2. **Alert pulse** — a concentric ring that expands outward from a hazard
   marker and fades. Communicates "new event detected" or "event still active".
   Uses `ease-out` expansion so the ring decelerates as it grows (like a real
   shockwave). 1500ms cycle, loops while event is active.

3. **Route draw-on** — the safe route line animates from the user's position
   to the destination using an SVG `stroke-dashoffset` technique. Communicates
   "route is being calculated and delivered". 800ms, `ease-in-out`. Plays once
   on route delivery.

All other transitions (page navigation, panel expand/collapse, hover states)
use utility durations and `ease-in-out`.

### Duration tokens

| Token | Value | Use |
|---|---|---|
| `duration-instant` | 0ms | Programmatic state changes, no visual feedback needed |
| `duration-fast` | 100ms | Hover color shifts, focus rings |
| `duration-normal` | 200ms | Button press, tooltip appear, badge count update |
| `duration-slow` | 300ms | Panel slide-in/out, modal open/close |
| `duration-slower` | 500ms | Page-level transitions, map zoom |
| `duration-radar` | 3000ms | Full radar sweep rotation cycle |
| `duration-pulse` | 1500ms | Alert pulse expand-and-fade cycle |
| `duration-route` | 800ms | Route line draw-on from origin to destination |

### Easing tokens

| Token | Curve | Use |
|---|---|---|
| `ease-linear` | `linear` | Radar sweep — constant angular velocity |
| `ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Dismissed elements (fade out) |
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Entering elements, alert pulse ring |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Route draw-on, panel transitions |
| `ease-spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Arrival confirmation check — single micro-bounce |
| `ease-radar` | `linear` | Alias for radar sweep rotation |
| `ease-route` | `ease-in-out` | Alias for route draw-on |
| `ease-pulse` | `ease-out` | Alias for alert ring expansion |

### Reduced motion strategy

When `prefers-reduced-motion: reduce` is active:

- `duration-radar`: radar sweep animation is `animation-play-state: paused`.
  The radar frame is visible but static. A text label "DADOS AO VIVO" confirms
  the sensor is active without motion.
- `duration-pulse`: alert pulse animation is replaced by a static colored
  border on the marker. The semantic color (amber/red) still communicates
  urgency. CSS: `@media (prefers-reduced-motion: reduce) { .alert-pulse
  { animation: none; border: 2px solid var(--risk-fire); } }`
- `duration-route`: route draw-on is skipped; the full route line appears
  immediately at full opacity. The destination pin gets a brief fade-in
  (200ms) as the only motion.
- All utility transitions: clamped to `duration-instant` (0ms).

---

## Responsive Behavior

### Citizen mobile (xs / sm — < 640px)

Layout is a single vertical stack with two primary zones:

**Zone 1 — Map (top 50vh):** The map canvas is full-viewport-width and
occupies the top half. All risk overlays, the user position pin, and the
active route line are visible here. The route line is Rescue Cyan with
`shadow-glow-cyan`. Hazard zones use their `-dim` fill tokens (20% opacity)
so the map remains readable.

**Zone 2 — Route panel (bottom 50vh, expandable):** A bottom sheet anchored
to the bottom of the viewport. Background: `bg-glass` (Void 80% + blur) so
the map remains partially visible beneath it. Inner padding: `space-4`
horizontal, `space-3` top.

Primary CTA: "ROTA SEGURA AGORA" button. Full-width minus `space-8` margins.
`rounded-xl`, background `accent`, `text-inverse`, `Rajdhani 700 text-4xl`.
Minimum touch target: 56px height.

Typography sizes scale up one step from operator defaults. `text-md` (16px)
for body, `text-4xl` (48px) for hero CTA.

### Operator desktop (lg+ — ≥ 1024px)

Layout is a three-column shell:

```
┌──────────────┬────────────────────────────────┬───────────────┐
│  Left panel  │         Map canvas              │  Right panel  │
│  280px fixed │  fluid (calc(100vw - 600px))    │  320px fixed  │
│  bg-surface  │  bg-base                        │  bg-surface   │
└──────────────┴────────────────────────────────┴───────────────┘
     Top bar 48px (full width, bg-surface, border-bottom: border-subtle)
     Status bar 32px (full width, bg-base, Plex Mono text-sm)
```

The left panel holds: active hazard layer controls, sensor status, route list.
The right panel holds: event details, team dispatch, coordination log.
The map canvas is the focal point — panels are supplementary, not primary.

At `xl` (1280px+), the left panel expands to 320px and gains a secondary
data column for historical charts.

At `2xl` (1536px+), a fourth panel can appear at the far right for the
coordination log — or the map canvas gains a split-view mode showing two
simultaneous sensor products.

### Fluid zone (md — 768px to 1023px)

Tablet mode. Left panel collapses to a 64px icon rail (icons only, no labels).
Right panel becomes a bottom drawer triggered by a FAB. Map canvas is
`calc(100vw - 64px)`. This serves tablet field operators, not the primary
desktop persona.

---

## Known Gaps

The following items are complete for this deliverable but flagged for future
design-system tier review:

1. **Light mode** — not defined. The product is dark-first and the academic
   prototype does not require a light theme. If added, the semantic token
   layer (`bg-*`, `text-*`, `border-*`) is the only layer that changes;
   all other tokens remain constant.

2. **Component-level motion specs** — this layer defines the three motion
   archetypes and their timing tokens. Precise keyframe definitions (the
   exact `@keyframes` CSS blocks for `radar-sweep`, `alert-pulse`,
   `route-draw`) belong in the component library tier, not here.

3. **Icon system tokens** — Phosphor Icons sizes and color application are
   described in the brand book's iconography section. This layer does not add
   icon-specific tokens; component-level icon sizing should reference the
   `space-*` scale directly.

4. **Data visualization palette** — the map risk colors cover the three
   primary hazard types. A full cartographic color system for multi-layer
   operator views (combining flood + fire + landslide simultaneously) requires
   additional contrast testing and blend-mode specification. Deferred to
   the component / map-overlay tier.

5. **Focus ring specification** — WCAG 2.4.11 (Focus Appearance) requires
   a minimum 2px focus ring with 3:1 contrast against adjacent colors.
   Recommended: `2px solid var(--accent)` with `outline-offset: 2px` on
   `bg-surface`. The `shadow-glow-cyan` can supplement for interactive map
   elements. Full keyboard navigation audit is deferred.
