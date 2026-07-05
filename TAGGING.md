# Tagging Guide — basavapurushottam.com

This document maps every section page on the public site to the Ghost tag(s)
required to publish into it. When in doubt, use the cheat sheet near the
bottom.

The website is a headless Next.js front-end that pulls content from Ghost
(`cms.basavapurushottam.com`) by tag. Each section's `page.js` fetches posts
via `getPostsByTag("…")`, so changing what appears on a section page is just a
matter of tagging in Ghost — no code change required.

## Top-level section pages

| Page URL | Ghost tag slug | Notes |
|---|---|---|
| `/` (Home — Featured Insights) | **Featured ⭐ toggle** | Not a tag. Turn ON the **Featured** switch in the post sidebar. Top 3 most recent featured posts surface on the homepage. |
| `/mind-and-machine` | parent: `mind-machine` | Use one of the sub-tags below. Parent alone goes into the **Other Mind & Machine Essays** bucket at the bottom of the page. |
| `/philosophy` | `philosophy` | Pure philosophy / Indic-thought essays. |
| `/policy-lab` | parent: `policy-lab` | Use one of the sub-tags below. Parent alone goes into the **Other Policy Writing** bucket at the bottom of the page. |
| `/policy-lab` (News & Media section) | `news` | Press coverage, statements, media appearances. |
| `/proving-ground` | `proving-ground` | Personal essays and official projects. |
| `/the-late-compiler` | parent: `late-compiler` | Use one of the sub-tracks below. |
| `/reading` | parent: `reading` | Use one of the sub-tags below. The /reading archive lists all `reading`-tagged posts and offers Books/Videos/Podcasts filter chips. The About page's "Currently" section surfaces the most recent item from each sub-tag. |
| `/media` | parent: `media` | Use one of the sub-tags below. The /media archive lists all `media`-tagged posts (press mentions) with Web-articles/Clippings filter chips. The About page's "In the Media" section surfaces the latest 4. |
| `/all-posts` | *all tags* | Searchable content library — every published post appears here automatically. |

## Mind & Machine sub-sections

`/mind-and-machine` is split into two sub-sections based on subject matter.

| Sub-section | Tag to use in Ghost | Focus |
|---|---|---|
| **Mind** (Neuroscience) | `mm-mind` + `mind-machine` | Neuroscience, cognition, psychology, attention, memory, perception |
| **Machine** (AI/ML/CS/IT) | `mm-machine` + `mind-machine` | AI, machine learning, computer science, information theory |

## Policy Lab sub-sectors

`/policy-lab` is split into four department sub-sectors plus a generic bucket.

| Sub-sector | Tag to use in Ghost | Focus |
|---|---|---|
| **Animal Husbandry** | `pl-animal-husbandry` + `policy-lab` | Livestock policy, fodder, cattle, breed protection |
| **Dairy** | `pl-dairy` + `policy-lab` | Milk, dairy cooperatives, Badri cow / ghee |
| **Fisheries** | `pl-fisheries` + `policy-lab` | Trout, aquaculture, cold-water fisheries |
| **Elections** | `pl-elections` + `policy-lab` | Electoral administration, voter outreach, technology, EVMs |

## Reading sub-types

`/reading` is split into three media types. Each post lists one book / video /
podcast and links to it externally; the post body holds a short intro
(2–4 sentences) and any further notes. Use the parent tag `reading` PLUS one
of the sub-tags below so the post appears on both the archive page and the
About page's Currently section.

| Type | Tag to use in Ghost | Examples |
|---|---|---|
| **Book** | `r-book` + `reading` | Book notes, reading-in-progress, recently-finished books |
| **YouTube video** | `r-video` + `reading` | Long-form lectures, interviews, explainers worth keeping |
| **Podcast** | `r-podcast` + `reading` | Episodes that shaped your thinking, recent listens |

## Media (press mentions) sub-types

`/media` is split into two kinds — online articles and scanned print clippings.
Each post lists one mention. Use the parent tag `media` PLUS one of the
sub-tags below so the post appears on both the archive page and the About
page's "In the Media" section.

| Type | Tag to use in Ghost | What goes in the post body |
|---|---|---|
| **Web article** | `m-web` + `media` | A short intro (2–4 sentences) plus the external URL of the published piece. |
| **PDF clipping** | `m-pdf` + `media` | A short intro plus the uploaded PDF (use Ghost's File embed) or an image of the scanned page. |

## The Late Compiler sub-tracks

`/the-late-compiler` is split into five tracks. Tag the post with the
appropriate `lc-*` sub-tag.

| Track | Tag to use in Ghost |
|---|---|
| AI Fundamentals | `lc-ai-fundamentals` + `late-compiler` |
| Applied AI | `lc-applied-ai` + `late-compiler` |
| Agentic AI | `lc-agentic-ai` + `late-compiler` |
| Machine Learning | `lc-machine-learning` + `late-compiler` |
| Python from Zero | `lc-python` + `late-compiler` |

## Tagging cheat sheet

| Want to publish… | Tags to add |
|---|---|
| Neuroscience essay | `mm-mind` + `mind-machine` |
| AI / ML / CS essay | `mm-machine` + `mind-machine` |
| Pure philosophy essay | `philosophy` |
| Fisheries / Trout policy | `pl-fisheries` + `policy-lab` |
| Dairy / Badri / Milk | `pl-dairy` + `policy-lab` |
| Animal husbandry / Fodder / Cattle | `pl-animal-husbandry` + `policy-lab` |
| Elections / Voter | `pl-elections` + `policy-lab` |
| Personal essay or project | `proving-ground` |
| AI fundamentals tutorial | `lc-ai-fundamentals` + `late-compiler` |
| Python beginner tutorial | `lc-python` + `late-compiler` |
| Press coverage / statement about you | `news` |
| Cross-cutting (e.g., philosophy + AI) | both relevant tags |
| Top homepage feature | any of the above + **Featured ⭐ toggle ON** |

## Conventions

1. **Sub-tag implies parent.** Whenever you use `mm-*`, `pl-*`, or `lc-*`, also
   add the corresponding parent (`mind-machine`, `policy-lab`, `late-compiler`).
   The pages work either way, but this is the cleanest convention and keeps
   the parent-level bucket meaningful.
2. **Cross-tagging is fine.** A post tagged both `mm-mind` and `philosophy`
   appears on both the Mind & Machine page and the Philosophy page — useful
   for essays that genuinely fit both.
3. **Tag slugs are case-sensitive.** Use exact lowercase with hyphens. Ghost
   auto-generates the slug from the tag name; verify it in the tag's settings.
4. **First-time tag use creates it.** Type `pl-fisheries` once when editing a
   post and Ghost auto-creates the tag. Future posts get it from the dropdown.

## Where to manage tags in Ghost

- Tag list: `https://cms.basavapurushottam.com/ghost/#/tags`
- Per-tag settings (description, color, display name): click into any tag
- Per-post tagging: open the post in the editor → settings sidebar → Tags

## Updating section content

- Posts on a section page refresh automatically (each `page.js` uses
  `dynamic = "force-dynamic"`) — no redeploy needed after tag changes.
- Intros and section labels for **Mind & Machine** and **Policy Lab** live in
  `site/data/mind-and-machine/sections.json` and
  `site/data/policy-lab/sectors.json`. Edit, commit, push.
- Late Compiler track definitions: `site/data/late-compiler/tracks.json`.

## Bulk re-tagging

The script `site/scripts/apply-tag-plan.js` applies a JSON tag plan via the
Ghost Admin API. Useful for the kind of bulk re-categorisation the site went
through when this guide was first written.

```bash
cd site
GHOST_ADMIN_KEY='<admin-key>' node scripts/apply-tag-plan.js \
  --plan=scripts/tag-plan.json --dry-run
```

Drop `--dry-run` to actually apply.
