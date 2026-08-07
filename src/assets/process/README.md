# Process photography — "Everything under one roof"

Drop one photograph per stage in here and it appears on the home page. Nothing
else needs editing: the section globs this folder and matches on filename.

| File                        | Stage                |
| --------------------------- | -------------------- |
| `fabric-selection.webp`     | 01 Fabric Selection  |
| `sample-making.webp`        | 02 Sample Making     |
| `labelling-hangtag.webp`    | 03 Labelling & Hangtag |
| `ironing.webp`              | 04 Ironing           |
| `quality-check.webp`        | 05 Quality Check     |
| `packaging-shipping.webp`   | 06 Packaging & Shipping |

`.jpg`, `.jpeg` and `.png` are picked up too, so a photo straight off a phone
works immediately. A stage with no file shows its icon and "Photography to
come" rather than a broken frame, so the section is never half-built.

## Optimise before shipping

Phone photos run 3–8 MB each and all six load on the home page. Convert them
first:

```bash
python3 scripts/optimize-photos.py process
```

That rewrites everything here as 1000px WebP and deletes the originals. The
portfolio photos went from 40.8 MB to 0.65 MB the same way.

## Framing

The panels are a fixed 128px tall and crop with `object-cover`, sitting near
2.6:1 in the grid — the existing six are cut wide, around 2.4:1 to 3:1, so
match that. The subject wants to be roughly centred; a tight shot of hands, a
machine, or a carton reads better at this size than a wide view of the floor.
