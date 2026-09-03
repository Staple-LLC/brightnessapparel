# Blog cover images

One image per article, named after the article's **slug** — the last part of
its URL. Nothing else needs editing; the filename is the link.

| Article | File |
| --- | --- |
| Choosing between sublimation and silk screen | `sublimation-vs-silk-screen.webp` |
| What actually happens in a sampling round | `what-happens-in-a-sampling-round.webp` |
| Fabric weights, explained in plain terms | `fabric-weights-explained.webp` |
| Planning a first apparel run as a new label | `planning-a-first-apparel-run.webp` |

Slugs live in `src/content/articles.ts`. `.jpg`, `.jpeg` and `.png` work too.

## Where each image is used

The same file appears twice, cropped by `object-cover` in both places:

- **Listing** (`/journal`) — a 3:2 thumbnail, 270×180 on a desktop
- **Article page** — a 16:9 hero above the title, full width of the band

So supply something **wide** — 16:9 or 3:2, around 1600px across. A portrait
photo will survive, but the thumbnail will crop it hard.

## Optional, and it degrades cleanly

With no images at all, the listing renders as a plain text list exactly as it
did before, and article pages simply have no hero. Once **any** article has a
cover, every row gets the image column so the list stays aligned — an article
still missing one shows a soft empty panel rather than knocking the row out of
line.

## Optimise before shipping

```bash
python3 scripts/optimize-photos.py journal
```
