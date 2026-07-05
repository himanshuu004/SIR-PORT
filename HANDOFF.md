# Purushottam Next.js Site — Developer Handoff Doc

**Date:** 2026-04-26  
**Developer:** Deepak (deepakicex)  
**Client:** Dr. B.V.R.C. Purushottam (IAS Officer)  
**Repo:** https://github.com/deepakicex/purushottam-nextjs-site (upstream: basava-code)

---

## What Was Done Today

### 1. Cloned the repo
- Repo cloned to `C:\Users\deepa\purushottam-nextjs-site`
- Repo contained **only JSX mockup files** — no actual Next.js project

### 2. Analyzed the mockup files
The repo had these files (design mockups, NOT a working app):

| File | Purpose |
|------|---------|
| `00-shared-components.jsx` | Design system: Nav, Footer, Newsletter, Fade, SectionHeader |
| `01-homepage.jsx` | Homepage — Hero, Pillars, Featured Insights, Testimonials |
| `02-about.jsx` | About — Bio, Three Faces, Credentials, Beliefs, Current Work |
| `03-mind-and-machine.jsx` | Essays hub — Algorithmic Mind + Examined Life sections |
| `04-policy-lab.jsx` | Policy articles — Stories Through Data + Policy Research |
| `05-proving-ground.jsx` | Projects — Personal/Official tabs, Accountability Board |
| `07-contact.jsx` | Contact — Form, Direct Channels, FAQ |
| `08-article-detail.jsx` | Article template — Reading progress, TOC, Share, Related |
| `09-the-late-compiler.jsx` | Learning hub — 5 tracks, Syllabus, Who Is This For |
| `Developer_Handoff_Tasks.xlsx` | Client task list (NOT yet reviewed) |
| `most_important_excel.xlsx` | Additional specs (NOT yet reviewed) |
| `updated_content.zip` | Content assets (NOT yet extracted) |

### 3. Scaffolded a Next.js project
- Created Next.js app inside `site/` folder using `create-next-app`
- **Node.js:** v22.13.1, **npm:** 11.11.0, **Next.js:** 16.2.4
- Set up Google Fonts: Playfair Display + Source Sans 3

### 4. Wired up all pages as routes
Each mockup JSX was copied into its Next.js route with `"use client"` directive:

```
site/
├── app/
│   ├── layout.js              ← Root layout (fonts, metadata)
│   ├── globals.css             ← Minimal reset
│   ├── page.js                 ← Homepage (from 01-homepage.jsx)
│   ├── about/page.js           ← About (from 02-about.jsx)
│   ├── mind-and-machine/page.js ← Essays hub (from 03-mind-and-machine.jsx)
│   ├── policy-lab/page.js      ← Policy (from 04-policy-lab.jsx)
│   ├── proving-ground/page.js  ← Projects (from 05-proving-ground.jsx)
│   ├── contact/page.js         ← Contact (from 07-contact.jsx)
│   ├── the-late-compiler/page.js ← Learning hub (from 09-the-late-compiler.jsx)
│   └── insights/[slug]/page.js  ← Article detail (from 08-article-detail.jsx)
├── package.json
└── next.config.js
```

### 5. Verified it runs
- `npm run dev` → runs on **http://localhost:3000**
- All 8 routes return HTTP 200

---

## How to Run

```bash
cd C:\Users\deepa\purushottam-nextjs-site\site
npm run dev
```
Then open **http://localhost:3000** in browser.

---

## Design System (used across all pages)

### Color Tokens
| Token | Value | Usage |
|-------|-------|-------|
| Navy | `#0F1A2E` | Primary dark background |
| Navy Light | `#1B2A4A` | Gradient partner |
| Gold | `#D4A843` | Accent, CTA buttons, highlights |
| Gold Light | `#E8C87A` | Gradient partner |
| Warm White | `#FAFAF8` | Page background |
| Cream | `#F5F2ED` | Section backgrounds |
| Charcoal | `#1C1917` | Headings |
| Text Body | `#44403C` | Body text |
| Text Muted | `#57534E` | Secondary text |

### Fonts
- **Headings:** Playfair Display (serif, bold)
- **Body:** Source Sans 3 (sans-serif)

### Shared Components (duplicated in every page)
- `Nav` — Fixed navbar with mobile hamburger menu
- `Footer` — Navy background with columns
- `NewsletterCTA` — 3 variants: `mind`, `policy`, `general`
- `Fade` — IntersectionObserver scroll animation
- `SectionHeader` — Eyebrow + heading combo
- `SocialIcon` — Social media icon buttons
- `Breadcrumb` — Navigation breadcrumbs (some pages)
- `ExploreMore` — Cross-promotion cards (some pages)

### Breakpoints
- **Mobile:** ≤768px (single column, hamburger nav)
- **Tablet:** 769px–1024px (2 columns)
- **Desktop:** >1024px (full layout, up to 4 columns)

### Accessibility
- Skip-to-content link
- `aria-labels` on interactive elements
- `focus-visible` outlines (gold)
- `prefers-reduced-motion` respected
- Semantic HTML (`nav`, `footer`, `main`, `role` attributes)

---

## What's NOT Done Yet (TODO for customization)

### Critical — Must Do
1. **Extract shared components** — Nav, Footer, Newsletter, Fade, etc. are copy-pasted in EVERY page file (~170 lines each). Extract into `components/` folder and import.
2. **Review Excel files** — `Developer_Handoff_Tasks.xlsx` and `most_important_excel.xlsx` likely contain client requirements not yet addressed.
3. **Extract `updated_content.zip`** — May contain images, articles, or other assets.
4. **Add real images** — Portrait placeholder shows "BP" initials. Need actual photo.
5. **Newsletter integration** — Currently just sets state. Need to connect to Mailchimp/ConvertKit/etc.
6. **Contact form backend** — Currently just shows "Message sent". Need actual email/API.
7. **Article detail page** — Only shows one hardcoded article ("The Markov Brain"). Need CMS or markdown-based content.

### Nice to Have
8. **SEO metadata** — Add per-page titles, descriptions, Open Graph tags
9. **Google Sheets integration** — Proving Ground's Accountability Board expects live data
10. **Reading progress tracking** — localStorage for read articles (TODO comments in code)
11. **Search functionality** — Currently uses `prompt()` and `alert()`
12. **Active nav link highlighting** — Nav links don't show which page is active
13. **RSS Feed** — Footer links to `/feed.xml` which doesn't exist
14. **CV download** — About page links to `/about/cv.pdf` which doesn't exist

### Content Sections Per Page

| Page | Sections |
|------|----------|
| **Home** | Hero, Pillars (4 cards), Featured Insights (3 articles), Learn With Me, Media Spotlight, Testimonials (7 quotes, auto-rotate), Newsletter |
| **About** | The Hook (hero), The Unlikely Path (bio narrative), Three Faces (3 identity cards), Proof Points (credentials), What I Believe (4 principles), Building Now (4 focus areas), The Human File (personal), Explore My Work, Get In Touch CTA, Newsletter |
| **Mind & Machine** | Hero, Breadcrumb, Next Essay Teaser, Start Here (reading paths), Algorithmic Mind (5 foundation + 2 frontier articles), Examined Life (4 western + 1 indic articles), Late Compiler promo, Explore More, Newsletter |
| **Policy Lab** | Hero, Breadcrumb, Next Essay Teaser, Stories Through Data (1 article), Policy Research (1 article), Explore More, Newsletter |
| **Proving Ground** | Hero, Breadcrumb, Tab Selector (Personal/Official), Personal Essays (2), Accountability Board (placeholder), Official Achievements (5 cards with metrics), Explore More, Newsletter |
| **Contact** | Hero + Form (dynamic fields per inquiry type), Direct Channels (4), FAQ (3), Community Card, Explore More, Newsletter |
| **Article Detail** | Reading Progress bar, Hero (pillar-colored), Takeaways Card, Table of Contents, Article Body (epigraph, headings, paragraphs, callouts), Inline Newsletter, Tags, Share Row, Author Card, Related Articles (3), Explore More, Newsletter |
| **Late Compiler** | Hero, Breadcrumb, Philosophy quote, Track Selector (5 expandable tracks with articles + videos), Syllabus (tabbed), Who Is This For (3 personas), How It Works (4 steps), Upcoming Schedule, Closing Note, Community Card, Explore More, Newsletter |

---

## Client Info

- **Client:** Dr. B.V.R.C. Purushottam, IAS
- **Location:** Dehradun, Uttarakhand, India
- **Email:** basava.ias@gmail.com
- **LinkedIn:** linkedin.com/in/basava-purushottam-b862247
- **Background:** IAS Officer (2004 batch), UC Berkeley MPA, 23+ years in service
- **Site purpose:** Personal website/blog on AI, governance, Indic philosophy, neuroscience

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.4 (App Router) |
| Language | JavaScript (JSX) |
| Styling | Inline styles + CSS string injection (no Tailwind/CSS modules) |
| Fonts | Google Fonts via next/font (Playfair Display, Source Sans 3) |
| Hosting | TBD (likely Vercel) |
| CMS | TBD (code suggests Sanity was planned) |
| Node | v22.13.1 |
| npm | 11.11.0 |
