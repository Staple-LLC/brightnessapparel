# Instagram posts and reels

Drop media in here and it appears in the carousel at the foot of the home page.
Reels play in the tile; photos sit still. Tiles are 9:16, the shape reels are
shot in.

## Getting the files

Reels and photos are **downloaded and hosted here** — the site does not read a
live feed. Instagram's API needs an app registration and a token that expires,
and a token shipped to the browser would be public. Every site you have seen
with a wall of reels is doing the same thing; the Instagram watermark in the
corner of their tiles is the one the app adds when you download your own reel.

Best source is the original file you uploaded — no watermark, full quality.
Failing that, either:

- **In the app**, open your own reel → ⋯ → *Save to device*. Instagram burns its
  logo and your handle into the corner of anything downloaded this way.
- **Instagram → Settings → Your activity → Download your information**, which
  returns everything you have posted at the quality they hold.

A post URL is not a file — nothing can be fetched from it, and automated
downloading is against Instagram's terms. Download first, then name the file:

```bash
python3 scripts/optimize-reels.py --names \
  "https://www.instagram.com/reel/C8xKp2LtAbc/" \
  "https://www.instagram.com/p/DbrzolfiMa_/"
```

That prints the filename each download should be saved under. It reads
shortcodes out of any URL shape — `/p/`, `/reel/`, with or without `www` or a
tracking query string — and flags duplicates.

## Filenames

A filename is read as `[01-] shortcode [.reel]`. The **shortcode** is the
segment after `/p/` or `/reel/` in the URL:

```
https://www.instagram.com/reel/C8xKp2LtAbc/   ->  C8xKp2LtAbc.reel.mp4
https://www.instagram.com/p/C8xKp2LtAbc/      ->  C8xKp2LtAbc.webp
```

| Filename                     | Tile                              |
| ---------------------------- | --------------------------------- |
| `C8xKp2LtAbc.reel.mp4`       | plays, links to that reel         |
| `C8xKp2LtAbc.webp`           | still, links to that post         |
| `03-C8xKp2LtAbc.reel.mp4`    | plays, sorted third               |
| `marathon-run.webp`          | still, links to the profile       |

Any `.mp4` is treated as a reel whether or not the name says `.reel`; the
suffix only decides whether the link goes to `/reel/` or `/p/`.

Tiles order by filename, so the optional `01-` prefix controls sequence without
breaking the link. One edge: a filename that is exactly 11 characters of
letters, digits, `-` or `_` is read as a shortcode — give plain images a longer
or more descriptive name.

## Preparing them

```bash
python3 scripts/optimize-reels.py     # videos: re-encode + extract poster
python3 scripts/optimize-photos.py instagram   # stills
```

The reel script re-encodes to 640px wide, drops the audio track (the page plays
muted), moves the MP4 index to the front so playback starts before the file has
finished arriving, and pulls a poster frame. A test reel went 1.61 MB → 0.61 MB
plus a 126 KB poster. It skips anything already prepared, so it is safe to
re-run.

A video's poster is the image with the same stem — `C8xKp2LtAbc.reel.mp4` pairs
with `C8xKp2LtAbc.reel.webp` — and that image is not also shown as its own
tile.

## Playback

Nothing downloads until a tile is halfway into view (`preload="none"`), and
playback stops when it leaves. A wall of reels all buffering at once is what
makes these sections slow. Reduced-motion users get the poster and no video.

## The handle

`src/content/instagram.ts` has `INSTAGRAM_HANDLE`, set to `oem_apparel` — read
off the embed of a supplied post. The follow button and every profile link
point at it, so confirm it is the right account.
