# Decoration method photography — "Decoration methods, matched to the garment"

One photograph per method. The section globs this folder and matches on
filename, so nothing else needs editing.

| File                        | Method                  |
| --------------------------- | ----------------------- |
| `sublimation.webp`          | 01 Sublimation Printing |
| `silk-screen.webp`          | 02 Silk Screen Printing |
| `embroidery.webp`           | 03 Embroidery           |
| `dtf.webp`                  | 04 DTF Printing         |
| `dtg.webp`                  | 05 DTG Printing         |
| `heat-transfer-vinyl.webp`  | 06 Heat Transfer Vinyl  |

`.jpg`, `.jpeg` and `.png` are picked up too. A method with no file shows
"Photography to come" rather than a broken frame.

## Optimise before shipping

```bash
python3 scripts/optimize-photos.py printing
```

Rewrites everything here as 1000px WebP and deletes the originals. Run it with
no arguments to do `process/` and `services/` as well.

## Framing

Panels are 3:2, which the existing six already are (1536x1024), so nothing is
cropped. Keep new photographs at 3:2 and they will drop in cleanly; anything
else is centre-cropped with `object-cover`.

The panel is about 270px wide in the row on a desktop, so the shot wants to
show the method plainly — ink in a screen, a needle in cloth, film lifting off
a garment — rather than a wide view of the room.
