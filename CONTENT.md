# Publishing content — practical guide

This is a **how-to** guide for adding content to every section of
basavapurushottam.com.

For the *what-tag-goes-where* reference, see [TAGGING.md](./TAGGING.md). This
file complements that with concrete step-by-step Ghost workflows.

> **One-line summary:** every public-facing section pulls posts from Ghost
> (`cms.basavapurushottam.com`) by tag. Publish in Ghost with the right
> tag(s), and the post appears on the matching page within seconds — no
> code change required.

---

## Table of contents

- [Before you start](#before-you-start)
- [Featured Insights (homepage)](#featured-insights-homepage)
- [Reading — Books · Videos · Podcasts](#reading--books--videos--podcasts)
- [Media — Web articles · Clippings](#media--web-articles--clippings)
- [Mind & Machine](#mind--machine)
- [Philosophy](#philosophy)
- [The Policy Lab](#the-policy-lab)
- [The Proving Ground](#the-proving-ground)
- [The Late Compiler](#the-late-compiler)
- [Cheat sheet — every tag at a glance](#cheat-sheet--every-tag-at-a-glance)

---

## Before you start

### Anatomy of a Ghost post (the four fields that matter)

| Field | Where it shows on the site |
|---|---|
| **Title** | Card heading on the section page + `/insights/[slug]` heading |
| **Excerpt** (or "Custom excerpt" in Ghost) | The 1–2 line preview text on every card |
| **Feature image** | The thumbnail image on cards + the hero image on the post page |
| **Body** | The full post content at `/insights/[slug]` — paste URLs, embed PDFs, write notes here |
| **Tags** | What controls where the post appears (see TAGGING.md) |

### How to keep things consistent

- **Title**: include the source/context when relevant — e.g.
  *"Education Ministry's Quiet Revolution — Indian Express, 2022"*
  rather than just *"Education Ministry's Quiet Revolution"*. Makes
  cards self-explanatory at a glance.
- **Excerpt**: 1–2 sentences. This is the line that shows on the home/about
  page cards, so write it for someone who hasn't clicked yet.
- **Date**: Ghost auto-stamps publish date. If a clipping is from 2021 but
  you upload today, manually set the **Publish date** in the post sidebar
  to the original date — the cards sort by that.

### Embedding files (PDFs, scans, photos)

In the Ghost editor, on a new line, type **`/`** and pick:

- **File** → opens a file picker, uploads any file (PDF, ZIP, etc.) and
  inserts a download link
- **Image** → for JPGs/PNGs of scanned newspaper pages
- **Bookmark** → paste a URL → Ghost auto-fetches the title and preview

For multi-page newspaper clippings, the easiest path is to upload one PDF
that contains all pages, plus the front-page image as the **Feature image**
so it shows on cards.

---

## Featured Insights (homepage)

The 3 most recent posts with the **Featured** toggle ON appear on the
homepage in the *"Featured Insights"* row.

### Steps

1. New post (or open an existing one)
2. Write title, body, excerpt, and add the post's normal tag(s)
   (e.g. `mind-machine` if it's an essay)
3. In the right sidebar → toggle **Featured** ON
4. Publish

That's it. The post will show on the homepage *in addition to* its normal
section page.

> **Cap is 3.** If you mark more than 3 posts as featured, only the 3 most
> recent show on the homepage.

---

## Reading — Books · Videos · Podcasts

Each post represents **one** book / video / podcast you want to log.
External link + short intro goes in the post body. Ghost is the database;
the site pulls from it.

### Tag convention

| Type | Tags to add |
|---|---|
| Book | `r-book` + `reading` |
| YouTube video | `r-video` + `reading` |
| Podcast episode | `r-podcast` + `reading` |

### Where the post appears

- The latest item from each sub-tag surfaces on **`/about`** in the
  "Currently" section (one tile per type)
- Every `reading`-tagged post appears on **`/reading`** archive with
  filter chips
- The post itself opens at `/insights/[slug]` showing your full intro

### Step-by-step — adding a book

1. **New post** in Ghost
2. **Title:** *"The Book of Why — Judea Pearl & Dana Mackenzie"*
3. **Tags:** type `r-book`, hit enter, type `reading`, hit enter (so both
   are added)
4. **Custom excerpt** (right sidebar): one sentence like
   *"Causal inference, do-calculus, and why ML's prediction-first lens
   misses how the world actually works."*
5. **Feature image** (optional): book cover image
6. **Body:** 2–4 sentence intro on what stood out, plus an optional
   purchase / publisher link (`/` → Bookmark)
7. Publish

### Step-by-step — adding a YouTube video

Same flow as above, but:
- **Tags:** `r-video` + `reading`
- **Body:** type `/` → **YouTube** → paste the video URL → Ghost auto-embeds
  the player. Add your 2–4 sentence note above or below the embed.

### Step-by-step — adding a podcast

Same flow, but:
- **Tags:** `r-podcast` + `reading`
- **Body:** paste the podcast episode URL (Spotify / Apple Podcasts /
  Pocket Casts share link). Ghost will turn it into a bookmark card.

---

## Media — Web articles · Clippings

For press mentions, interviews, op-eds, and newspaper clippings.

### Tag convention

| Type | Tags to add | What goes in the body |
|---|---|---|
| Online article / interview | `m-web` + `media` | The external URL + 2–4 sentence intro |
| Scanned newspaper clipping (PDF/image) | `m-pdf` + `media` | The uploaded PDF or image + 2–4 sentence intro |

### Where the post appears

- The latest 4 surface on **`/about`** in the *"In the Media"* section
- Every `media`-tagged post appears on the **`/media`** archive with
  filter chips for Web articles / Clippings
- Each post opens at `/insights/[slug]` showing your intro and the file
  or link

### Step-by-step — adding a web article

1. **New post**
2. **Title:** *"On NEP 2020's implementation roadmap — The Hindu, Aug 2022"*
3. **Tags:** `m-web` + `media`
4. **Custom excerpt:** *"Interviewed by The Hindu on the operational
   challenges of rolling out the National Education Policy across states."*
5. **Body:** type `/` → **Bookmark** → paste the article URL → Ghost
   auto-fetches a preview card. Add a short note above it about the
   context.
6. **Publish date:** if the article is from August 2022, set the publish
   date manually so cards sort correctly.
7. Publish

### Step-by-step — adding a clipping (PDF or scan)

1. **New post**
2. **Title:** *"Hindustan Times — Education Ministry feature, 2021"*
3. **Tags:** `m-pdf` + `media`
4. **Custom excerpt:** *"Feature in Hindustan Times on the National
   Education Policy's stakeholder consultation process."*
5. **Feature image:** upload the front-page JPG of the clipping — this
   becomes the card thumbnail.
6. **Body:**
   - Type `/` → **File** → upload the full PDF (or `/` → **Image** if it's
     a single page JPG)
   - Add a 2–4 sentence intro above the embed describing the context
7. **Publish date:** set to the original publication date
8. Publish

> **Tip:** if you have a stack of old clippings, scan them in batches and
> create one Ghost post per piece. You can leave them as drafts and
> publish in a batch when ready.

---

## Mind & Machine

Two sub-sections — **Mind** (neuroscience / cognition) and **Machine**
(AI / ML / CS).

### Tags

| Sub-section | Tags |
|---|---|
| Mind (Neuroscience, cognition) | `mm-mind` + `mind-machine` |
| Machine (AI, ML, CS) | `mm-machine` + `mind-machine` |
| Generic (neither sub) | `mind-machine` only — falls into the "Other Mind & Machine Essays" bucket |

### Steps

Standard essay flow — write in Ghost's editor, set a feature image, add
both tags above, publish.

The post will appear in the matching column on `/mind-and-machine` and
also at `/insights/[slug]`.

---

## Philosophy

Pure philosophy / Indic-thought essays.

### Tag

Just `philosophy`.

### Steps

Standard essay flow. The post appears on `/philosophy`.

---

## The Policy Lab

Four department sub-sectors. Pick the one that matches.

| Sub-sector | Tags |
|---|---|
| Animal Husbandry | `pl-animal-husbandry` + `policy-lab` |
| Dairy | `pl-dairy` + `policy-lab` |
| Fisheries | `pl-fisheries` + `policy-lab` |
| Elections | `pl-elections` + `policy-lab` |
| Generic policy writing | `policy-lab` only |
| Press coverage in the policy section | `news` (separate `News & Media` strip) |

### Steps

Standard essay flow with both the sub-sector tag and the parent
`policy-lab` tag.

---

## The Proving Ground

Personal essays + official-impact projects.

### Tag

Just `proving-ground`.

### Steps

Standard essay flow. The post appears on `/proving-ground` mixed in with
the impact catalogue.

---

## The Late Compiler

Five learning tracks. Pick the one that matches.

| Track | Tags |
|---|---|
| AI Fundamentals | `lc-ai-fundamentals` + `late-compiler` |
| Applied AI | `lc-applied-ai` + `late-compiler` |
| Agentic AI | `lc-agentic-ai` + `late-compiler` |
| Machine Learning | `lc-machine-learning` + `late-compiler` |
| Python from Zero | `lc-python` + `late-compiler` |

### Steps

Standard essay flow with both the track-specific tag and the parent
`late-compiler` tag.

---

## Cheat sheet — every tag at a glance

Copy-paste reference. Each row shows the **two tags** to put on a Ghost
post for that destination.

| Want to publish into… | Tags (paste both into Ghost) |
|---|---|
| Featured Insights (homepage) | *toggle the **Featured** switch* — no tag needed |
| Reading → Book | `r-book` + `reading` |
| Reading → Video | `r-video` + `reading` |
| Reading → Podcast | `r-podcast` + `reading` |
| Media → Web article | `m-web` + `media` |
| Media → Clipping (PDF) | `m-pdf` + `media` |
| Mind & Machine → Mind | `mm-mind` + `mind-machine` |
| Mind & Machine → Machine | `mm-machine` + `mind-machine` |
| Philosophy | `philosophy` |
| Policy Lab → Animal Husbandry | `pl-animal-husbandry` + `policy-lab` |
| Policy Lab → Dairy | `pl-dairy` + `policy-lab` |
| Policy Lab → Fisheries | `pl-fisheries` + `policy-lab` |
| Policy Lab → Elections | `pl-elections` + `policy-lab` |
| Policy Lab → News strip | `news` |
| Proving Ground | `proving-ground` |
| Late Compiler → AI Fundamentals | `lc-ai-fundamentals` + `late-compiler` |
| Late Compiler → Applied AI | `lc-applied-ai` + `late-compiler` |
| Late Compiler → Agentic AI | `lc-agentic-ai` + `late-compiler` |
| Late Compiler → Machine Learning | `lc-machine-learning` + `late-compiler` |
| Late Compiler → Python from Zero | `lc-python` + `late-compiler` |

---

## Troubleshooting

**"I published but nothing shows on the site."**
- Check the **post status** is *Published*, not *Draft* or *Scheduled*.
- Check the **tag slug** matches exactly. `reading` ≠ `Reading` ≠ `read`.
- The site pages use `force-dynamic` rendering, so a hard refresh
  (Cmd+Shift+R) should show the new post within seconds. If still missing,
  check if Ghost is reachable from the deployment (Vercel logs).

**"I edited the post but the change isn't showing."**
- Same as above — `force-dynamic` means it re-fetches each request, but
  CDN caches at the edge can take ~1 minute. Hard refresh after that.

**"I want to remove a clipping."**
- Unpublish or delete the post in Ghost. The section auto-updates.

**"My PDF is too big to upload."**
- Ghost's default upload limit is 50 MB. Compress the PDF (Smallpdf,
  ILovePDF, or `pdftk`) before uploading. Aim for under 5 MB so it loads
  fast on mobile.

---

*This guide pairs with [TAGGING.md](./TAGGING.md). When in doubt about
where a piece of content should live, look up the tag there first.*
