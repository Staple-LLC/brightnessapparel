# Service photography — "Made for movement and scale"

One photograph per service. The section globs this folder and matches on
filename, so nothing else needs editing.

| File                                | Service                       |
| ----------------------------------- | ----------------------------- |
| `event-apparel.webp`                | 01 Event Apparel              |
| `custom-uniform-solution.webp`      | 02 Custom Uniform Solution    |
| `premium-streetwear.webp`           | 03 Premium Streetwear         |
| `clothing-brand-development.webp`   | 04 Clothing Brand Development |

`.jpg`, `.jpeg` and `.png` are picked up too. A service with no file shows
"Photography to come" rather than a broken frame.

## Optimise before shipping

```bash
python3 scripts/optimize-photos.py services
```

Rewrites everything here as 1000px WebP and deletes the originals. Run it with
no arguments to do `process/` as well.

## Framing

Panels are 208px tall in the grid and 288px on a phone, cropped with
`object-cover`, so square-ish photographs sit best — roughly 1:1 through 5:4.
A tight detail (an embroidered chest, a folded garment, a screen) reads better
at this size than a wide scene.

Renaming a service in `src/pages/studio.tsx` means renaming its file here to
match the new slug.
