# Design System — basavapurushottam.com

The source of truth for visual decisions on the site. Pairs with
[TAGGING.md](./TAGGING.md) (content structure) and [CONTENT.md](./CONTENT.md)
(publishing workflow).

> **One-line summary:** colors, fonts, spacing, and motion are all defined as
> CSS variables in [`site/styles/tokens.css`](./site/styles/tokens.css) and
> [`site/lib/theme.js`](./site/lib/theme.js). Use the tokens — don't hardcode
> hex values, raw pixel sizes, or one-off shadows.

---

## Quick reference — the most-used tokens

```css
/* Colors */
var(--gold)         /* teal #14B8A6 — primary accent (token name is historical) */
var(--accent)       /* alias for --gold — prefer this in new code */
var(--link)         /* darker teal #0F766E — for body-text hyperlinks (WCAG AA, 5.3:1) */
var(--link-hover)   /* #0D9488 — body-link hover state */
var(--navy)         /* #0F1A2E — primary dark surface */
var(--charcoal)     /* #1C1917 — body text */
var(--text-body)    /* #44403C — secondary body text */
var(--text-muted)   /* #78716C — captions, meta */
var(--warm-white)   /* #FAFAF8 — page background */
var(--cream)        /* #F5F2ED — testimonial / quiet surfaces */

/* Spacing — 4px-based scale (Tailwind-style naming) */
var(--space-1)  4px    var(--space-6)  24px    var(--space-16) 64px
var(--space-2)  8px    var(--space-7)  28px    var(--space-20) 80px
var(--space-3)  12px   var(--space-8)  32px
var(--space-4)  16px   var(--space-10) 40px
var(--space-5)  20px   var(--space-12) 48px

/* Type scale */
var(--text-xs)  11px   var(--text-md)  17px   var(--text-2xl) 24px
var(--text-sm)  13px   var(--text-lg)  18px   var(--text-3xl) 30px
var(--text-base) 16px  var(--text-xl)  20px   var(--text-4xl) 36px
var(--text-hero)  clamp(36px, 4.5vw, 58px)

/* Radius */
var(--radius-xs)  4px       var(--radius-card)  14px
var(--radius-sm)  6px       var(--radius-lg)    20px
var(--radius-button) 8px    var(--radius-xl)    28px
var(--radius-input) 10px    var(--radius-pill) 999px
var(--radius-md)  12px

/* Shadows */
var(--shadow-xs/sm/md/lg/xl)        /* generic elevation 1→5 */
var(--shadow-card)                  /* card resting state */
var(--shadow-card-hover)            /* card hover state */
var(--shadow-gold)                  /* accent-tinted, for primary CTAs */

/* Motion */
var(--t-fast)   0.15s     var(--ease-out)  cubic-bezier(0.22, 1, 0.36, 1)
var(--t-base)   0.25s     var(--ease-in)   cubic-bezier(0.4, 0, 1, 1)
var(--t-slow)   0.4s

/* Layout */
var(--container)      1120px       /* page max-width */
var(--container-pad)  clamp(1rem, 4vw, 1.5rem)
var(--section-y)      clamp(72px, 8vw, 120px)   /* section top/bottom rhythm */
```

---

## Palette

### Accent (the editorial accent — one color across the site)

| Token | Value | Use |
|---|---|---|
| `--gold` / `--accent` | `#14B8A6` (teal) | Primary CTA, eyebrow text, hyperlink color, hover-state highlights |
| `--gold-light` / `--accent-light` | `#5EEAD4` | Hover-brighter, gradients |
| `--gold-pale` / `--accent-pale` | `#CCFBF1` | Tinted backgrounds, badge fills |
| `--link` | `#0F766E` (teal-700) | **Body-text hyperlinks** — passes WCAG AA (5.3:1 on white). The lighter `--gold` is fine on buttons/eyebrows but fails AA for small body text |
| `--link-hover` | `#0D9488` (teal-600) | Hover state for body links |

> **The token is named `--gold` because the site previously used a real gold
> color.** The value was swapped to teal in a later refactor; the token name
> stayed for backwards compatibility. New code should prefer `--accent`.

### Palette restraint — when to use which colors

The site has a **three-color brand triad** and a **wider categorical palette**.
They serve different purposes. Apply them deliberately:

```
PRIMARY TRIAD     →  Magenta (#D946EF) · Teal (#14B8A6) · Amber (#F59E0B)
SECONDARY ACCENTS →  Blue · Green · Purple · Coral · Indigo · Cyan
```

**The triad is the site's identity.** Use it for:

- Any section with **1–3 items** (e.g. About's Three Identities, Reading's
  3 type-tiles, Article's Related Posts grid).
- Any section that needs to feel like *one statement* even with more items
  (e.g. Home's 5-tile Impact strip cycles M/T/A/M/T — five facets of one
  impact story).
- Any **decorative repetition** like timeline dots or alternating cards
  where the color carries no semantic meaning.

**Secondary accents** (blue, green, purple, coral) are reserved for cases
where:

- The section has **4+ items**, AND
- Each item needs a **distinct visual identity** that the reader will
  remember (e.g. /all-posts has 7 section headers — Mind & Machine =
  blue, Philosophy = purple, etc. — the color becomes a memorable
  shortcut for "this is the M&M section").

**Don't reach for blue/green/purple/coral when the items don't need to be
visually distinguished.** A 7-dot timeline doesn't need 7 colors; the year
labels and role text already differentiate the milestones. Use M/T/A
cycling instead — tighter, more cohesive identity.

| Pattern | Use |
|---|---|
| 1 item | Teal (`--gold`) — the editorial accent |
| 2–3 items | M/T/A (pick the most fitting subset) |
| 4 items | M/T/A + one secondary OR cycle M/T/A/M |
| 5+ decorative items | Cycle M/T/A across them |
| 5+ semantically-distinct items | Triad + secondary accents (e.g. /all-posts sections) |

### Pillar / category accents (used for visual identity on tiles)

| Color | Hex | Used for |
|---|---|---|
| Magenta | `#D946EF` | Mind & Machine pillar, Reading tiles (Books), Media tiles (Web articles) |
| Teal | `#14B8A6` (=`--gold`) | Policy Lab pillar, Reading tiles (Videos), Media tiles (Clippings) |
| Amber | `#F59E0B` | Pillars, Reading tiles (Podcasts), `In the Media` accent |
| Blue | `#3B82F6` | Mind & Machine essay accent, Featured insights |
| Purple | `#8B5CF6` | Philosophy section accent |
| Green | `#10B981` | The Late Compiler accent |
| Coral | `#E8593C` | The Proving Ground accent |

These are defined in [`site/lib/theme.js → PILLAR`](./site/lib/theme.js) and
exposed as CSS vars `--blue`, `--purple`, etc.

> **When palette colors are used inside JavaScript arrays/objects** (e.g.
> `RELATED_ACCENTS = [...]`), use the raw hex literal, not `var(--gold)`.
> Reason: those values get string-concatenated with hex alpha
> (`${color}10`) to produce tinted backgrounds, which only works with
> hex strings, not CSS custom-property syntax. CSS modules and direct
> `style={{ color: "var(--gold)" }}` usage are fine.

### Neutrals

| Token | Value | Use |
|---|---|---|
| `--neutral-50` | `#F9FAFB` | Lightest surface |
| `--neutral-100` | `#F3F4F6` | Card hover background |
| `--neutral-200` | `#E5E7EB` | Dividers, light borders |
| `--neutral-300` | `#D1D5DB` | Disabled surface borders |
| `--neutral-400` | `#9CA3AF` | Disabled text, placeholder |
| `--neutral-500` | `#6B7280` | Muted secondary text |
| `--neutral-600` | `#57534E` | (= `--text-muted-strong`) |
| `--neutral-700` | `#44403C` | (= `--text-body`) |
| `--neutral-800` | `#292524` | Strong body text |
| `--neutral-900` | `#1C1917` | (= `--charcoal`) — headings, primary text |

---

## Typography

**Serif** — [Playfair Display](https://fonts.google.com/specimen/Playfair+Display)
via `next/font`. Used for all headings, the navbar logo, and editorial italics.

**Sans** — [Source Sans 3](https://fonts.google.com/specimen/Source+Sans+3)
via `next/font`. Used for body text, UI labels, captions.

### Type scale

```css
--text-xs   0.6875rem  /* 11px */   captions, tiny meta
--text-sm   0.8125rem  /* 13px */   secondary UI
--text-base 1rem       /* 16px */   default body
--text-md   1.0625rem  /* 17px */   article body
--text-lg   1.125rem   /* 18px */   subheadings
--text-xl   1.25rem    /* 20px */   small headings
--text-2xl  1.5rem     /* 24px */   section headings
--text-3xl  1.875rem   /* 30px */   page headings
--text-4xl  2.25rem    /* 36px */   large feature headings
--text-hero clamp(36px, 4.5vw, 58px)   hero h1
```

### Section-page heroes

Most section pages share a common hero template: navy gradient
background + faint grid pattern + serif h1 + small eyebrow. This is
intentional — it keeps the site feeling like one publication, not a
collection of unrelated pages.

**Two pages deliberately break that template** to signal something
specific about their content:

| Page | Hero treatment | Signal |
|---|---|---|
| `/the-late-compiler` | Terminal-window chrome (3 dots), monospace prompt with blinking caret, `<bracket />` syntax around the heading, faint line-number gutter | "This is the technical learning hub — code lives here" |
| (Future) `/the-policy-lab` | Could lean into data-viz / spreadsheet imagery if you want a second differentiator | "This is the data-driven policy work" |

Don't differentiate every page. Two distinctive heroes against six
"standard" ones reads as deliberate; differentiating all eight would
just be visual noise.

### Italic emphasis in headings

The site uses an editorial device — italicizing one word of a heading in
the accent color (e.g. "Bridging *Algorithmic* Intelligence..."). This is
a deliberate signature, but if used everywhere it stops being a signal and
starts being decoration.

**Reserve italic emphasis for narrative-voice pages**:
- ✅ Home (`Algorithmic`) — the site's editorial hook
- ✅ About (`learning`, `shaping`, `conversation`) — personal narrative
- ✅ Philosophy (`Life` in "The Examined Life") — poetic accent

**Section / utility / index pages should keep headings plain**:
- ❌ /mind-and-machine, /policy-lab, /proving-ground, /all-posts,
  /contact, /reading, /media

Plain headings on those pages make the italic on Home + About + Philosophy
carry more weight when it appears.

### Don't

- Don't use raw `fontSize: 12` / `fontSize: 14` in inline JSX styles. Use
  `style={{ fontSize: "var(--text-sm)" }}` or move to a CSS module.
- Don't introduce new font families. We have two — that's enough.
- Don't italicize one word of a section-page heading just because it's
  the convention on Home and About. See the rule above.

---

## Components

### Shared (already in `site/components/`)

| Component | Purpose | Variants / props |
|---|---|---|
| **Nav** | Site navigation bar (sticky, transparent → solid on scroll) | none — singleton |
| **Footer** | Site footer with brand, nav, social, copy | none |
| **Fade** | Scroll-triggered fade-in for any block | `delay`, `y`, `duration`, `once`, `amount`, `style` |
| **SectionHeader** | Eyebrow + heading + accent underline | `eyebrow`, `heading`, `align`, `light` |
| **Icon** | Wrapper around lucide-react with our naming | `name`, `size`, `color`, `strokeWidth` |
| **BrandIcon** | Inline SVG for X / LinkedIn / Facebook / WhatsApp | `name`, `size` |
| **NewsletterCTA** | Newsletter signup card | `variant` (`mind` / `general`) |
| **GhostSignupForm** | The actual form inside NewsletterCTA | — |
| **Counter** | Number that counts up on scroll-into-view | `from`, `to`, `duration` |

### When to use `SectionHeader`

**Use the shared `SectionHeader` component** for the canonical pattern:

```
[small uppercase teal eyebrow]
[Serif heading, left or centred]
[short teal underline]
```

This is the most-common section header pattern across the site (used on
`/about`'s Three Identities, Operating Principles, Currently, In the Media —
and the homepage's Featured Insights, Beyond the Blog, Testimonials).

```jsx
import SectionHeader from "@/components/SectionHeader";

<SectionHeader eyebrow="Three Identities" heading="One person, three lenses" align="center" />
```

**Don't force-fit `SectionHeader`** when the section header includes any of:

- A colored dot or icon next to the heading (e.g. /policy-lab sector headers,
  /mind-and-machine sub-section headers, /philosophy "Sacred Texts" header)
- A custom row layout with stats or counts beside the title
- No eyebrow at all (e.g. /contact "Or reach out directly")
- A non-standard font size or alignment

In those cases, write inline JSX. The shared component exists for the 80%
case; the other 20% legitimately needs bespoke layout. Don't make
`SectionHeader` so complex it accepts every variation as props — that's
worse than letting custom headers stay custom.

### Button system (`globals.css`)

Use these classes instead of inlining new button styles. Mix variant
classes with size modifiers.

| Class | Variant | Use |
|---|---|---|
| `.btn-gold` | Primary | Main CTA — accent gradient fill, dark text. For "Read", "Subscribe", "Submit". |
| `.btn-ghost` | Secondary | Transparent + light border + white text. **Only on dark backgrounds** (e.g. hero CTAs over navy). |
| `.btn-pill` | Chip / filter | Rounded pill with neutral background. Set `--btn-color` to recolor for category-specific pills (e.g. `.btn-pill` on /reading filter chips). Supports `aria-selected="true"` or `.active` for selected state. |
| `.btn-link` | Text link | Looks like text, is a button semantically. Use for accordion toggles, "View all →" links, FAQ question headers. |

**Size modifiers** (combine with any variant):

| Class | Effect |
|---|---|
| `.btn-sm` | Smaller padding + xs font-size — for chips, compact toolbars |
| (default) | Standard CTA size |
| `.btn-lg` | Larger padding + md font-size — for hero CTAs |

**Examples:**

```jsx
<a className="btn-gold" href="/mind-and-machine">Read My Insights</a>
<a className="btn-ghost" href="/about">My Story →</a>

<button className="btn-pill" aria-selected={active}>Books <span>{count}</span></button>
<button className="btn-pill btn-sm" style={{ "--btn-color": "#D946EF" }}>Magenta chip</button>

<button className="btn-link" onClick={...}>View all →</button>
```

### Component-scoped button classes (legitimate exceptions)

A handful of buttons are bespoke because they're not really CTAs — they're
specialized UI controls:

| Class | Where | Why bespoke |
|---|---|---|
| `.ct-faq-btn` | Contact page FAQ accordion | Full-width row toggle, not a CTA. Component-scoped name is fine. |
| `.rc-nav-btn` | Philosophy reader prev/next | Specialized reader pager — has icon + label + disabled state logic. |

If you find yourself writing a 4th component-scoped button class, that's a
signal to add a new variant to the system instead.

### When to use what

| Need | Use |
|---|---|
| Animate a block on scroll | `<Fade delay={0.1}>...</Fade>` |
| Section heading | `<SectionHeader eyebrow="..." heading="..." />` |
| Icon | `<Icon name="..." color="..." size={24} />` |
| Social platform glyph | `<BrandIcon name="x" />` (x / linkedin / facebook / whatsapp) |
| Card with accent border | Pattern: `borderTop: 4px solid <accent>; background: linear-gradient(180deg, ${accent}10, #fff 65%)` |
| Article card list | See `app/all-posts/AllPostsClient.js` |
| Newsletter signup | `<NewsletterCTA variant="general" />` |

---

## Patterns

### Tinted accent backgrounds

To make a colored tile with a soft tinted fade:

```jsx
style={{
  borderTop: `4px solid ${accent}`,                          // 100% accent
  background: `linear-gradient(180deg, ${accent}10 0%, #fff 65%)`, // 10% alpha at top
}}
```

The `10` after `${accent}` is a 2-digit hex alpha (`0x10` = ~6% opacity). Other useful alpha values:
- `08` ≈ 3%   — barely there
- `10` ≈ 6%   — soft tint
- `18` ≈ 9%   — visible tint
- `22` ≈ 13%  — clear tint
- `40` ≈ 25%  — medium

### Filter chips

For category filter rows (see `/reading`, `/media`, `/all-posts`):

```jsx
<button
  style={{
    padding: "10px 18px",
    borderRadius: 999,                          // var(--radius-pill)
    border: active ? `1.5px solid ${color}` : "1px solid var(--border)",
    background: active ? `${color}14` : "#fff", // 8% alpha when active
    color: active ? color : "var(--charcoal)",
    fontSize: 13.5,
    fontWeight: 700,
  }}
>
```

### Card grid responsive sizing

```jsx
<div style={{
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
  gap: 24,
}}>
```

`auto-fill` + `minmax(320, 1fr)` is the canonical pattern for the article archives.

---

## Motion

- All animations use the `Fade` component (scroll-triggered, respects
  `prefers-reduced-motion`). Backed by the `motion/react` library.
- For UI hover transitions, use `transition: all var(--t-fast)` (150ms).
- For card state changes, use `transition: transform 0.2s, box-shadow 0.2s`.
- Easing should be `var(--ease-out)` for natural decel (the site's house ease).

---

## Heading order

Every page route follows the standard hierarchy: **one `<h1>` per page,
then `<h2>` for top-level sections, `<h3>` for cards / items inside a
section**. Don't skip levels.

| Page type | Structure |
|---|---|
| Home, About | h1 (hero) → h2 (section header via `SectionHeader`) → h3 (cards inside section) |
| Archive pages (`/reading`, `/media`) | h1 (hero) → h2 (each card title, since they're top-level content units with no intermediate section) |
| Section pages (`/mind-and-machine`, `/policy-lab`, etc.) | h1 (hero) → h2 (sub-section heading) → h3 (article rows / sub-headings) |
| Article (`/insights/[slug]`) | h1 (post title) → h2 (body sections from Ghost + "Continue reading") → h3 (related-post card titles + body sub-sections) |

**Common mistakes to avoid:**
- A card title styled as a major section header → should be `<h2>` not `<h3>`
- The first heading after `<h1>` being `<h3>` → screen readers report a skipped level
- Multiple `<h1>`s on one page (e.g. hero h1 + sidebar h1) → only one h1 per route

If you need a heading style that visually looks like `<h2>` but semantically
is `<h3>` (or vice versa), use CSS — never pick the tag based on visual
weight alone.

## Accessibility

- All interactive elements have `aria-label` or visible text.
- Carousel and tablist regions use `role="tablist"` / `role="tab"`.
- The site provides a `Skip to content` link on every page.
- Article body honors `prefers-reduced-motion` via `Fade`.
- All `target="_blank"` links carry `rel="noopener noreferrer"`.

When adding new interactive UI:
- Buttons that are icon-only must have `aria-label`.
- Toggle states use `aria-selected` / `aria-pressed`.
- Form errors should be announced via `aria-describedby` pointing at the
  error message.

---

## What NOT to do

| ❌ Don't | ✅ Do |
|---|---|
| `style={{ color: "#14B8A6" }}` | `style={{ color: "var(--gold)" }}` (or use a class) |
| `style={{ fontSize: 14 }}` | `style={{ fontSize: "var(--text-sm)" }}` or use a class |
| `style={{ padding: 16 }}` (in CSS modules) | `padding: var(--space-4);` |
| `style={{ borderRadius: 8 }}` | `border-radius: var(--radius-button);` |
| Copy-paste a local `function Fade()` | `import Fade from "@/components/Fade"` |
| New hardcoded `#E5E7EB` for a border | `var(--neutral-200)` or `var(--border)` |
| Inline anchor classes (`.cat-jump`, `.ct-faq-btn`) | Generalize to `.btn-*` in globals.css |

---

## Future improvements

- **Full inline-style migration to CSS modules.** ~25 files still mix inline
  styles and modules. Long-term hygiene, not urgent.
- **Document each shared component in its own file** (`components/Nav.md`
  etc.) once the API stabilizes.
- **Storybook**, if the site grows to ~30 components. Currently overkill.
- **`@/` path alias** for cleaner imports (`@/components/Fade` instead of
  `../../components/Fade`).

---

*This doc is a living reference — update it when you add a token, ship a new
shared component, or change a convention. If a rule has fewer than 3
examples in the codebase, it's not yet a system — it's a guess.*
