// Kaynak fotoğrafları (fotograflar/) web için küçültüp site/img/ altına yazar.
// Yeni fotoğraf eklemek için: dosyayı fotograflar/ klasörüne koy, aşağıdaki listeye
// bir satır ekle, sonra `npm run images` çalıştır.
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const SRC = "fotograflar";
const OUT = "site/img";
const WIDTHS = [480, 800, 1200];

// crop: alttan kesilecek oran (bazı fotoğraflarda alt köşede parmak var)
// wide: ayrıca yatay (3:2) bir kesit üret, top = kesitin başladığı yükseklik oranı
const PHOTOS = [
  { src: "WhatsApp Image 2026-06-12 at 11.41.19.jpeg", name: "gelin-yolu" },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (3).jpeg", name: "gelin-damat-masasi" },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (8).jpeg", name: "masadan-salon" },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (6).jpeg", name: "sofra" },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (2).jpeg", name: "sahne" },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (7).jpeg", name: "salon-genel", wide: { top: 0.17 } },
  { src: "WhatsApp Image 2026-06-12 at 11.41.21.jpeg", name: "salon-orta", wide: { top: 0.2 } },
  { src: "WhatsApp Image 2026-06-12 at 11.41.19 (1).jpeg", name: "pist", crop: 0.14 },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (1).jpeg", name: "masa-mor", crop: 0.14 },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (4).jpeg", name: "salon-avize", crop: 0.14 },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20 (5).jpeg", name: "masa-altin", crop: 0.14 },
  { src: "WhatsApp Image 2026-06-12 at 11.41.20.jpeg", name: "salon-cicek", crop: 0.14 },
];

await mkdir(OUT, { recursive: true });

for (const p of PHOTOS) {
  const input = sharp(path.join(SRC, p.src)).rotate();
  const { width, height } = await input.metadata();
  const keepH = Math.round(height * (1 - (p.crop ?? 0)));
  const base = sharp(path.join(SRC, p.src)).rotate().extract({ left: 0, top: 0, width, height: keepH });
  const buf = await base.toBuffer();

  for (const w of WIDTHS) {
    await sharp(buf).resize({ width: w }).webp({ quality: 76 }).toFile(`${OUT}/${p.name}-${w}.webp`);
  }

  if (p.wide) {
    const wideH = Math.round(width / 1.5);
    const top = Math.min(Math.round(height * p.wide.top), keepH - wideH);
    const wideBuf = await sharp(buf).extract({ left: 0, top, width, height: wideH }).toBuffer();
    for (const w of WIDTHS) {
      await sharp(wideBuf).resize({ width: w }).webp({ quality: 76 }).toFile(`${OUT}/${p.name}-genis-${w}.webp`);
    }
  }
  console.log("✓", p.name, `${width}x${keepH}`);
}

// Paylaşım görseli (WhatsApp / Facebook önizlemesi), 1200x630
const og = PHOTOS.find((p) => p.name === "salon-genel");
const ogMeta = await sharp(path.join(SRC, og.src)).metadata();
await sharp(path.join(SRC, og.src))
  .rotate()
  .extract({ left: 0, top: Math.round(ogMeta.height * 0.2), width: ogMeta.width, height: Math.round(ogMeta.width / 1.905) })
  .resize({ width: 1200, height: 630, fit: "cover" })
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile("site/og.jpg");
console.log("✓ og.jpg");
