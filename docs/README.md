# Cadıların Maskesi — karakter kağıdı sitesi

Statik bir site: `index.html`, `app.js`, `data.js`, `styles.css`, `firebase-config.js`. Kurulum gerektirmez.

## Kodlar
`data.js` içinde:
- DM: `KRAKER`
- Yiğit `LADY` · Bilge `YAGA` · Beste `ZOLT` · Elif `FEY`

Kodlar sadece ekranı seçer; şifre değildir. Değiştirmek için `data.js`'de `code` alanlarını düzenle.

## 1) GitHub Pages ile yayınlama
1. GitHub'da yeni bir repo aç (ör. `yuzsuz-ay`).
2. Bu klasördeki (`docs/`) dosyaları repoya **`docs/` klasörü olarak** yükle.
3. Repo → Settings → Pages → Source: "Deploy from a branch", Branch: `main`, Folder: `/docs` → Save.
4. 1-2 dakika sonra adres: `https://<kullanıcı>.github.io/<repo>/`

Telefondan da aynı adres açılır; ana ekrana eklenebilir.

## 2) Cihazlar arası eş zamanlı senkron (Firebase, ücretsiz)
Firebase ayarlanmadan site çalışır ama değişiklikler yalnızca o cihazda kalır. Senkron için:
1. https://console.firebase.google.com → "Add project" → isim ver, Analytics kapalı olabilir.
2. Sol menü → Build → **Realtime Database** → Create database → bölge seç (europe-west1) → **Start in test mode** (30 gün açık kurallar).
3. Rules sekmesine şunu yapıştır ve Publish (oyun süresince açık kalır; sonra kapatabilirsin):
   ```json
   { "rules": { "games": { ".read": true, ".write": true } } }
   ```
4. Project settings (dişli) → General → "Your apps" → Web (`</>`) → bir isim ver → Register → çıkan `firebaseConfig` nesnesini kopyala.
5. `firebase-config.js` içindeki `window.FIREBASE_CONFIG = null;` satırını o nesneyle değiştir. `databaseURL` alanının olduğundan emin ol (Realtime Database sayfasının üstünde yazar).
6. Repoya push et. Siteyi açınca üstte "● bağlı" görünür.

Not: kurallar açık olduğu için adresi ve kodları yalnızca oyuncularla paylaş. Oyun bitince Rules'u `".read": false, ".write": false` yapabilirsin.

## 3) Yerelde deneme
Klasörde bir statik sunucu çalıştır (örn. `python -m http.server 8080`) ve `http://localhost:8080` aç. Firebase yokken iki sekme arasında senkron BroadcastChannel ile çalışır; farklı cihazlar için Firebase gerekir.

## Veri modeli (Firebase'de `games/yuzsuz-ay`)
- `chars/<id>`: `hp`, `res` veya `omens[]`, `ws`, `portent[]`, `shortUsed`, `daily{}`, `notes`
- `shared`: `notes`, `moon`

Karakter metinlerini (yetenek açıklamaları, HP, AC) `data.js`'den değiştirirsin; durum verisi etkilenmez.

## Hikâye (DM sekmesi)
DM girişinde "Hikâye" sekmesi `prep/story.json` dosyasından gelir. Düzenledikten sonra proje kökünde:
```
python tools/build_story.py
```
Bu komut `docs/story.js` üretir (base64 gömülü; oyuncuların kaynak koddan okumasını zorlaştırır, şifreleme değildir). Sonra push et.

## Zamanın Kumları
DM, Ortak sekmesinde "Kum çevir (+1)" dedikçe tüm açık ekranlarda tam ekran "Zaman ilerliyor" bildirimi ve çan sesi çıkar. Ses, tarayıcı kuralı gereği kullanıcı sayfaya en az bir kez dokunduktan sonra çalar (giriş yapmak yeterli).
