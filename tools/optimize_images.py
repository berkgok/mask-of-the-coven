"""docs/img altındaki PNG/JPG görselleri web için küçültüp JPG'ye çevirir.

- Uzun kenar en fazla 1600 px, JPEG kalite 85, EXIF yok.
- Çıktı aynı klasöre .jpg olarak yazılır; PNG kaynaklar yerinde kalır (git'e girmez, .gitignore).
- Zaten .jpg olan ve 1600 px'i aşmayan dosyalara dokunmaz.

Kullanım (proje kökünde): python tools/optimize_images.py
"""
import pathlib
import sys

from PIL import Image

root = pathlib.Path(__file__).resolve().parents[1] / "docs" / "img"
MAX = 1600
done = 0
for p in sorted(root.rglob("*")):
    if p.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp"):
        continue
    out = p.with_suffix(".jpg")
    try:
        im = Image.open(p)
    except Exception as e:  # noqa: BLE001
        print("atlandi:", p, e)
        continue
    w, h = im.size
    scale = min(1.0, MAX / max(w, h))
    if p.suffix.lower() == ".jpg" and scale == 1.0:
        continue
    if scale < 1.0:
        im = im.resize((round(w * scale), round(h * scale)), Image.LANCZOS)
    if im.mode in ("RGBA", "P", "LA"):
        bg = Image.new("RGB", im.size, (13, 11, 18))
        bg.paste(im.convert("RGBA"), mask=im.convert("RGBA").split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    im.save(out, "JPEG", quality=85, optimize=True, progressive=True)
    done += 1
    print(f"{p.relative_to(root)} -> {out.name} ({w}x{h} -> {im.size[0]}x{im.size[1]}, {out.stat().st_size // 1024} KB)")
print("ok:", done, "dosya")
sys.exit(0)
