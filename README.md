# Portfolio

Live at https://rudrasharma3.github.io/Portfolio/

Plain HTML, CSS and JavaScript. No build step, no framework, no trackers.

## Files

- `index.html`: the page. Prose sections (About, Receipts, Work, Credentials, Contact) are written here.
- `code/data.js`: projects, "How I work" cards, the GitHub archive, language counts and badges. Most edits happen here.
- `code/style.css`: design tokens at the top (light only: paper, sand, one green accent, Inter).
- `code/script.js`: behaviour only (scroll reveals, nav, detail sheet, archive tabs, badge filter).
- `assets/`: portrait, resume PDF, link-preview image (`og-image.png`, 1200×630), certificates.

## Scroll flow

Borrowed from the Yahin project: the opening plays once on load (name rises, a hairline draws in, then the rest),
sections fade and rise as they scroll in, a sticky column sits on the left while the right column scrolls,
projects alternate left and right as chapters, and each one opens a detail sheet that slides up (Esc or the backdrop closes it).
The contact section plays its own short sequence when it's mostly on screen. `prefers-reduced-motion` turns all of this off.

## Common edits

- **Add a project:** add an object to `PROJECTS` in `code/data.js`. `flow` draws the figure; mark one step with `1` to highlight it.
  Links open as `#p-<id>`, e.g. `/Portfolio/#p-vox`.
- **Add a repo to the archive:** add a line to `ARCHIVE` with the year the repo was created.
- **Add a badge:** drop `<slug>.png` in `assets/certificates/`, make `thumbs/<slug>.webp` (about 440 px wide), add a line to `BADGES`.
- **Update numbers:** only use figures that appear in the resume or a public repo.

## Preview locally

```
python3 -m http.server
```

Then open http://localhost:8000/
