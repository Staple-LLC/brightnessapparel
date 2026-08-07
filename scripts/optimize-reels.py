"""Web-size the Instagram reels in src/assets/instagram.

A reel straight off Instagram is 1080px wide with an audio track, and the site
plays it muted in a 224px tile. This re-encodes to 640px wide, drops the audio,
and moves the MP4 index to the front so playback can start before the file has
finished arriving. It also pulls a poster frame, which is what the tile shows
until the video is scrolled into view.

    python3 scripts/optimize-reels.py            # src/assets/reels
    python3 scripts/optimize-reels.py instagram  # a different folder

Originals are moved into an _originals/ subfolder rather than deleted — a
re-encode is lossy and there is no way back from it if the file you dropped in
was the only copy.

Safe to re-run: a file already carrying a poster is left alone.

There is also a naming mode, which turns post URLs into the filenames the
carousel expects. It does not download anything — Instagram does not serve the
file from the URL, and automated fetching is against their terms. Download each
reel yourself, then use this to name it:

    python3 scripts/optimize-reels.py --names <url> [<url> ...]
"""

import glob
import os
import subprocess
import sys

from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDER = next(
    (a for a in sys.argv[1:] if not a.startswith("-")), "reels"
)
SRC = os.path.join(ROOT, "src", "assets", FOLDER)
WIDTH = 640
CRF = "28"
POSTER_AT = "0.5"  # seconds; far enough in to clear a fade from black


def run(args: list[str]) -> None:
    subprocess.run(args, check=True, capture_output=True)


# --- naming mode ------------------------------------------------------------
if "--names" in sys.argv:
    import re

    urls = [a for a in sys.argv[1:] if a != "--names"]
    if not urls:
        sys.exit("Usage: python3 scripts/optimize-reels.py --names <url> ...")

    # Matches /p/SHORTCODE/ and /reel/SHORTCODE/, with or without query string.
    URL = re.compile(r"instagram\.com/(p|reel|tv)/([A-Za-z0-9_-]{5,})")

    print(f"\nSave each download into src/assets/instagram/ under these names:\n")
    seen, bad = set(), []
    for i, url in enumerate(urls, 1):
        m = URL.search(url)
        if not m:
            bad.append(url)
            continue
        shortcode = m.group(2)
        if shortcode in seen:
            print(f"  {i:2}. {shortcode}  — duplicate, skipped")
            continue
        seen.add(shortcode)
        print(f"  {i:2}. {shortcode}.reel.mp4")

    if bad:
        print("\nCould not read a shortcode from:")
        for url in bad:
            print(f"  {url}")

    print(
        "\nThen run:  python3 scripts/optimize-reels.py"
        "\n(.reel makes the tile link to /reel/; drop it for a /p/ link.)\n"
    )
    raise SystemExit(0)

# --- conversion mode --------------------------------------------------------
if subprocess.run(["which", "ffmpeg"], capture_output=True).returncode != 0:
    sys.exit("ffmpeg not found. Install it with: brew install ffmpeg")

videos = [
    p
    for pat in ("*.mp4", "*.mov", "*.MP4", "*.MOV")
    for p in glob.glob(os.path.join(SRC, pat))
    if "_originals" not in p
]

if not os.path.isdir(SRC):
    sys.exit(f"No such folder: {SRC}")

if not videos:
    sys.exit(f"No reels found in {SRC}")

print(f"\n{FOLDER}/")

saved = 0
for path in sorted(videos):
    stem = os.path.splitext(os.path.basename(path))[0]
    poster = os.path.join(SRC, f"{stem}.webp")
    encoded = os.path.join(SRC, f"{stem}.mp4")
    temp = os.path.join(SRC, f".{stem}.tmp.mp4")

    if os.path.exists(poster) and path == encoded:
        print(f"  {stem:34} already prepared, skipped")
        continue

    before = os.path.getsize(path)

    run(
        [
            "ffmpeg", "-y", "-i", path,
            # -2 keeps the height even, which H.264 requires.
            "-vf", f"scale={WIDTH}:-2",
            "-c:v", "libx264", "-crf", CRF, "-preset", "slow",
            "-an",                       # muted in the page; the audio is dead weight
            "-movflags", "+faststart",   # index first, so it streams
            temp,
        ]
    )
    # ffmpeg is not built with a WebP encoder here, and asking it for one
    # fails with "Encoder not found". So the frame comes out as PNG and PIL —
    # already a dependency of the photo script — does the conversion.
    frame_png = os.path.join(SRC, f".{stem}.frame.png")
    run(
        [
            "ffmpeg", "-y", "-ss", POSTER_AT, "-i", path,
            "-frames:v", "1", "-vf", f"scale={WIDTH}:-2",
            frame_png,
        ]
    )
    Image.open(frame_png).convert("RGB").save(
        poster, "WEBP", quality=80, method=6
    )
    os.remove(frame_png)

    # Kept, not deleted. Encoding is lossy and one-way, and the file dropped
    # in here is sometimes somebody's only copy.
    keep = os.path.join(SRC, "_originals")
    os.makedirs(keep, exist_ok=True)
    os.replace(path, os.path.join(keep, os.path.basename(path)))
    os.replace(temp, encoded)

    after = os.path.getsize(encoded)
    saved += before - after
    print(
        f"  {stem:34} {before/1048576:6.2f} MB -> {after/1048576:5.2f} MB "
        f"+ poster {os.path.getsize(poster)/1024:.0f} KB"
    )

if saved:
    print(f"\nSaved {saved/1048576:.2f} MB across {len(videos)} reels.")
