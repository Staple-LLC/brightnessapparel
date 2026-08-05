"""Normalise the client's portfolio photographs for the web.

The originals are 40.8 MB of RGBA PNG at ~1000-1290px. The alpha channel is
fully opaque on every file, so it is pure overhead. Two WebP sets are written:

    cards/  520px wide — the coverflow deck, which holds all 21 at once
    full/  1200px wide — the single-product page

Output names are slugified because the source names carry ", (, ), + and &,
which are extglob metacharacters that would break import.meta.glob patterns.
"""

import glob
import json
import os
import re

from PIL import Image

SRC = "/Users/joelchiang/Desktop/Projects/brightnessapparel/src/assets/portfolio"
CARD_W, FULL_W = 520, 1200


def slugify(name: str) -> str:
    s = name.lower()
    s = s.replace("&", " and ")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    return s.strip("-")


os.makedirs(f"{SRC}/cards", exist_ok=True)
os.makedirs(f"{SRC}/full", exist_ok=True)

manifest = []
for path in sorted(glob.glob(f"{SRC}/*.png")):
    stem = os.path.splitext(os.path.basename(path))[0]
    slug = slugify(stem)

    im = Image.open(path)
    # Flatten onto white: the alpha is opaque everywhere, so this only drops
    # the unused channel rather than compositing anything away.
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        ground = Image.new("RGB", im.size, (255, 255, 255))
        ground.paste(im, mask=im.getchannel("A"))
        im = ground
    else:
        im = im.convert("RGB")

    sizes = {}
    for label, width, quality in (("cards", CARD_W, 80), ("full", FULL_W, 82)):
        h = round(im.height * width / im.width)
        out = im.resize((width, h), Image.LANCZOS)
        dest = f"{SRC}/{label}/{slug}.webp"
        out.save(dest, "WEBP", quality=quality, method=6)
        sizes[label] = os.path.getsize(dest)

    manifest.append(
        {
            "slug": slug,
            "source": stem,
            "w": im.width,
            "h": im.height,
            "card_kb": round(sizes["cards"] / 1024, 1),
            "full_kb": round(sizes["full"] / 1024, 1),
        }
    )

print(json.dumps(manifest, indent=1))
print(
    f"\n{len(manifest)} files | "
    f"deck total {sum(m['card_kb'] for m in manifest)/1024:.2f} MB | "
    f"full total {sum(m['full_kb'] for m in manifest)/1024:.2f} MB"
)
