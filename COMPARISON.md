# Comparison: Our Clone vs Live Site (basavapurushottam.com)

**Date:** 2026-04-26

---

## Summary

The live site at basavapurushottam.com has **evolved beyond** the mockup files in this repo. The mockups were an earlier design phase — the live site has new pages, new articles, and some structural differences. Our clone is close but needs updates.

---

## Page-by-Page Comparison

### 1. Homepage (`/`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Hero section | ✅ Same tagline & stats | ✅ Same | Match |
| Four Territories cards | ✅ 4 cards | ✅ Same 4 cards | Match |
| Featured Insights | 3 articles (Markov Brain, Barnum Effect, Ancient Dreams) | 3 articles (may differ) | ⚠️ Check |
| Learn With Me (Late Compiler promo) | ✅ Present | ✅ Present | Match |
| Media Spotlight (Garhwal Post) | ✅ Present | ✅ Present | Match |
| Testimonials | 7 quotes, auto-rotate | 1 quote visible | ⚠️ Check if carousel differs |
| Newsletter CTA | ✅ Present | ✅ Present | Match |

### 2. About (`/about`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Hero hook | ✅ Same tagline | ✅ Same | Match |
| Bio narrative | ✅ Full story | ✅ Same | Match |
| Three Faces cards | ✅ 3 identity cards | ✅ Same | Match |
| Proof Points (credentials) | ✅ 4 badges | ✅ Same | Match |
| Operating Principles | ✅ 4 beliefs | ✅ Same | Match |
| Current Focus | ✅ 4 focus areas | ✅ Same | Match |
| Human File | ✅ Personal section | ✅ Same | Match |
| Get In Touch CTA | ✅ Present | ✅ Present | Match |

### 3. Mind & Machine (`/mind-and-machine`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Hero | ✅ "Essays · 13 Articles" | "Essays" (article count may differ) | ⚠️ Update count |
| Start Here paths | ✅ 2 reading paths | ✅ Same | Match |
| **"Learn AI with Me" blog section** | ❌ MISSING | ✅ 3 NEW articles | 🔴 Add |
| Algorithmic Mind — Foundations | 5 articles | 5 articles | Match |
| Algorithmic Mind — Frontiers | 2 articles | **5 articles** | 🔴 Missing 3 articles |
| Examined Life — Western | 4 articles | 4 articles | Match |
| Examined Life — Indic | 1 article (Honey/Sweetness) | **3 items** (Gita, Geeta Revisited, Patanjali) | 🔴 Missing 2 items |
| Late Compiler promo banner | ✅ Present | ✅ Present | Match |

**New articles on live site NOT in our clone:**
- "The LLM Wiki for Governments Working Primarily with English-Language Files" (Apr 2026)
- "AI and Why Its Growth Will Eventually Slow Down" (Mar 2026)
- "Two Laws That Silently Shape Your Digital Life"
- "AI's Secret Weapon: Why India Needs More Compute Power"
- "Will AI Really Steal Your Job?"
- Bhagavad Gita chapter-wise reading
- "The Geeta Revisited" commentary series
- Patanjali Yog Sutras (coming soon)

### 4. Policy Lab (`/policy-lab`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Stories Through Data | 1 article (UPSC) | ✅ Same | Match |
| Policy Research | 1 article (Heat and Milk) | ✅ Same | Match |

### 5. Proving Ground (`/proving-ground`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Personal/Official tabs | ✅ Present | ✅ Present | Match |
| Personal essays | 2 articles | ✅ Same | Match |
| Accountability Board | ✅ Placeholder | ✅ Same placeholder | Match |
| Official achievements | 5 cards with metrics | ✅ Present | ⚠️ Verify |
| WhatsApp community link | ✅ Placeholder link | ✅ Same | Match |

### 6. Contact (`/contact`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Contact form | ✅ Dynamic fields per type | ✅ Present | Match |
| Direct channels | ✅ 4 channels | ✅ Present | Match |
| FAQ | ✅ 3 items | ✅ Present | Match |

### 7. The Late Compiler (`/the-late-compiler`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| 5 learning tracks | ✅ All 5 | ✅ All 5 | Match |
| Track content | Articles + videos listed | Similar structure | Match |
| Syllabus | ✅ Tabbed by track | ✅ Present | Match |
| Who Is This For | ✅ 3 personas | **4 personas** (added UPSC candidate) | 🔴 Missing 1 |
| How It Works | ✅ 4 steps | ✅ Present | Match |
| Upcoming Schedule | ✅ 5 weeks | **6 weeks** | ⚠️ Update |

### 8. Article Detail (`/insights/[slug]`)

| Feature | Our Clone | Live Site | Status |
|---------|-----------|-----------|--------|
| Reading progress bar | ✅ Present | ✅ Likely present | Match |
| Table of Contents | ✅ Present | ✅ Present | Match |
| Takeaways card | ✅ Present | ✅ Present | Match |
| Share buttons | ✅ Twitter, LinkedIn, WhatsApp, Copy | ✅ Present | Match |
| Only 1 hardcoded article | ⚠️ Only "Markov Brain" | Multiple real articles | 🔴 Need CMS |

---

## 🔴 MISSING PAGES (exist on live site, NOT in our clone)

### `/philosophy-spirituality` — NEW PAGE
The live site has an entire section dedicated to Philosophy & Spirituality that does **not exist** in the mockup files or our clone. It includes:
- Hero with spiritual philosophy intro
- "My Spiritual Journey" narrative
- Core Texts & Reflections:
  - Bhagavad Gita study
  - Patanjali Yog Sutras
  - "The Geeta Revisited" commentary
- Newsletter CTA

**Action:** Need to create `app/philosophy-spirituality/page.js`

### `/insights` — Insights Hub
Live site has a dedicated insights listing page. Our clone only has `insights/[slug]` for individual articles.

**Action:** Need to create `app/insights/page.js`

---

## Navigation Differences

| Our Clone Nav | Live Site Nav |
|--------------|---------------|
| Home | Home |
| About | About |
| Mind & Machine | Mind & Machine |
| The Policy Lab | The Policy Lab |
| The Proving Ground | The Proving Ground |
| The Late Compiler | The Late Compiler |
| Contact | Contact |
| ❌ Missing | **Philosophy & Spirituality** |

---

## Content Differences

### New Articles on Live Site (not in mockups)
1. "The LLM Wiki for Governments Working Primarily with English-Language Files" (Apr 2026)
2. "AI and Why Its Growth Will Eventually Slow Down" (Mar 2026)
3. "Two Laws That Silently Shape Your Digital Life"
4. "AI's Secret Weapon: Why India Needs More Compute Power"
5. "Will AI Really Steal Your Job?"
6. Bhagavad Gita chapter-wise reading
7. "The Geeta Revisited" commentary series

### Structural Differences
- Live site has a **"Learn AI with Me"** blog section on Mind & Machine page (3 featured articles) — not in our clone
- Live site's Indic Canon section has expanded from 1 to 3 items
- Late Compiler has a 4th persona ("UPSC candidate")

---

## What Matches Well ✅
- Overall design system (navy + gold color scheme)
- Page layouts and section ordering
- Component structure (Nav, Footer, Newsletter variants)
- Hero sections across all pages
- About page biographical narrative
- Contact form with dynamic fields
- Testimonials content
- Credential badges
- Proving Ground tabs and accountability board

---

## Priority Action Items to Match Live Site

### High Priority
1. **Create `/philosophy-spirituality` page** — entirely missing
2. **Create `/insights` listing page** — missing hub page
3. **Add "Learn AI with Me" section** to Mind & Machine page (3 new blog articles)
4. **Add 5 missing articles** to Algorithmic Mind → Frontiers section
5. **Update Indic Canon** — add Gita study, Geeta Revisited, Patanjali Sutras
6. **Update nav** — add Philosophy & Spirituality link

### Medium Priority
7. Add 4th persona to Late Compiler ("UPSC candidate")
8. Update Late Compiler schedule to 6 weeks
9. Update article count on Mind & Machine hero
10. Verify testimonial carousel behavior

### Low Priority
11. Compare exact article slugs/URLs
12. Check if any styling differences exist (font sizes, spacing, etc.)
13. Verify mobile responsiveness matches
