"""prep/story.json -> docs/story.js (base64 ile gömülü).

Hikâye metni GitHub Pages'te herkese açık dosyada durur; base64 oyuncuların
kaynak koda bakıp hikâyeyi rahatça okumasını zorlaştırır (şifreleme değildir).

Kullanım (proje kökünde):
    python tools/build_story.py
"""
import base64
import json
import pathlib

root = pathlib.Path(__file__).resolve().parents[1]
src = root / "prep" / "story.json"
dst = root / "docs" / "story.js"

data = json.loads(src.read_text(encoding="utf-8"))  # JSON geçerli mi kontrolü
compact = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
b64 = base64.b64encode(compact.encode("utf-8")).decode("ascii")
dst.write_text(
    "// Otomatik üretildi: tools/build_story.py (kaynak: prep/story.json). Elle düzenleme.\n"
    f'window.STORY_B64 = "{b64}";\n',
    encoding="utf-8",
)
print(f"ok: {dst} ({len(b64)} karakter)")
