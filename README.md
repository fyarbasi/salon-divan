# Salon Divan · divandugunsalonu.com

Salon Divan Düğün Salonu'nun (Yenidoğan, Sancaktepe) web sitesi. Tek sayfalık, sade bir statik site:
HTML + CSS + biraz JavaScript. Derleme adımı yok.

## Klasörler

| Yol | Ne var |
|---|---|
| `site/` | Yayındaki sitenin tamamı. Sadece bu klasör internete çıkar. |
| `site/index.html` | Bütün metinler (adres, telefon, başlıklar) burada. |
| `site/main.js` | Galeri listesi ve WhatsApp formu. |
| `site/img/` | Web için küçültülmüş fotoğraflar (elle düzenleme, script üretir). |
| `fotograflar/` | Orijinal fotoğraflar (WhatsApp'tan gelenler). |
| `scripts/optimize-images.mjs` | Fotoğrafları küçültüp `site/img/` altına yazan script. |

## Bilgisayarda açmak

```bash
npm install
npm run dev     # http://localhost:4173
```

## Yayına alma

`main` dalına her `git push` yapıldığında GitHub Actions siteyi GitHub Pages'e yükler
(`.github/workflows/deploy.yml`). Ücretsizdir, ayrıca bir şey yapmaya gerek yok.

## Sık yapılacak işler

**Telefon, adres veya metin değiştirmek:** `site/index.html` içinde arayıp değiştir.
Telefon numarası `main.js` içinde de var (`WHATSAPP_NUMBER`).

**Yeni fotoğraf eklemek:**
1. Fotoğrafı `fotograflar/` klasörüne koy.
2. `scripts/optimize-images.mjs` içindeki `PHOTOS` listesine bir satır ekle (örn. `{ src: "dosya.jpg", name: "kina-gecesi" }`).
3. `npm run images` çalıştır.
4. Galeride görünmesi için `site/main.js` içindeki `GALLERY` listesine ekle.

## Alan adı (GoDaddy DNS)

GoDaddy > Alan Adlarım > divandugunsalonu.com > DNS bölümünde:

| Tür | Ad | Değer |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | fyarbasi.github.io |

GoDaddy'nin kendi koyduğu "Parked" A kaydını ve varsa yönlendirmeyi (Forwarding) sil.
Ayarlar yayıldıktan sonra (genelde 10 dk ile birkaç saat) GitHub otomatik HTTPS sertifikası verir.
