"""Web-size the section photography under src/assets.

Photos arrive from a phone or a designer at several megabytes each, and every
one of them loads on the home page. This converts a folder to WebP at 1000px
wide — comfortably above the largest panel even on a 3x screen — and deletes
the originals.

    python3 scripts/optimize-photos.py              # process + services
    python3 scripts/optimize-photos.py services     # just one folder

Safe to re-run: anything already converted is left alone.
"""

import glob
import os
import sys

from PIL import Image, ImageOps

# Characters that break a URL and therefore an asset filename.
#
#   %  begins a percent-escape. "60% Cotton" becomes "% C", which is not two
#      hex digits, so decodeURI throws URIError: URI malformed and takes the
#      whole page down — not just the image.
#   #  starts a fragment, ?  starts a query: both truncate the path.
#
# Spaces and parentheses are fine; the browser encodes them correctly.
UNSAFE = {"%": "pct", "#": "", "?": ""}


def safe_name(name: str) -> str:
    for bad, good in UNSAFE.items():
        name = name.replace(bad, good)
    return name

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_FOLDERS = ["process", "services", "printing", "instagram"]
WIDTH = 1000
QUALITY = 82
PATTERNS = ("*.jpg", "*.jpeg", "*.png", "*.JPG", "*.JPEG", "*.PNG")


def optimize(folder: str) -> int:
    src = os.path.join(ROOT, "src", "assets", folder)
    if not os.path.isdir(src):
        print(f"skip {folder}: no such folder")
        return 0

    originals = [
        p
        for pat in PATTERNS
        for p in glob.glob(os.path.join(src, pat))
        if "_originals" not in p
    ]
    if not originals:
        print(f"{folder}: nothing to convert")
        return 0

    print(f"\n{folder}/")
    saved = 0
    for path in sorted(originals):
        stem = safe_name(os.path.splitext(os.path.basename(path))[0])
        dest = os.path.join(src, f"{stem}.webp")

        im = Image.open(path)
        # Phones record orientation in EXIF rather than rotating the pixels.
        try:
            im = ImageOps.exif_transpose(im)
        except Exception:
            pass

        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            ground = Image.new("RGB", im.size, (255, 255, 255))
            ground.paste(im, mask=im.getchannel("A"))
            im = ground
        else:
            im = im.convert("RGB")

        if im.width > WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)

        im.save(dest, "WEBP", quality=QUALITY, method=6)
        before, after = os.path.getsize(path), os.path.getsize(dest)
        # Kept, not deleted. Conversion is lossy and one-way, and the file
        # dropped in here is sometimes somebody's only copy.
        keep = os.path.join(src, "_originals")
        os.makedirs(keep, exist_ok=True)
        os.replace(path, os.path.join(keep, os.path.basename(path)))
        saved += before - after
        print(
            f"  {os.path.basename(path):34} {before/1048576:6.2f} MB -> "
            f"{after/1024:7.1f} KB"
        )
    return saved


folders = sys.argv[1:] or DEFAULT_FOLDERS
total = sum(optimize(f) for f in folders)
if total:
    print(f"\nSaved {total/1048576:.2f} MB. Originals kept in _originals/.")
