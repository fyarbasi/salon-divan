/* Salon Divan · sayfa davranışları */

// ---- Ayarlar ---------------------------------------------------------------
const WHATSAPP_NUMBER = "905415416698";

// Galerideki fotoğraflar (site/img altında, npm run images ile üretilir)
const GALLERY = [
  { name: "salon-orta", alt: "Masaları kurulmuş salonun ortasından genel görünüm", h: 1600 },
  { name: "pist", alt: "Renkli ışıklarla aydınlanan dans pisti ve masalar", h: 1376 },
  { name: "masadan-salon", alt: "Gelin ve damat koltuklarından salona bakış", h: 1600 },
  { name: "masa-altin", alt: "Altın servis tabaklarıyla kurulmuş yuvarlak masa", h: 1376 },
  { name: "salon-cicek", alt: "Tavanı çiçeklerle süslü salon ve mor ışıklı masalar", h: 1376 },
  { name: "gelin-yolu", alt: "Çiçek kemerlerin altından piste uzanan kırmızı gelin yolu", h: 1600 },
  { name: "salon-avize", alt: "Avizeler ve kırmızı ışıklı tavanın altında beyaz sandalyeler", h: 1376 },
  { name: "masa-mor", alt: "Mor ışık altında kurulu masa, arkada dans pisti", h: 1376 },
  { name: "sahne", alt: "Renkli spot ışıklarıyla aydınlanan sahne ve dans pisti", h: 1600 },
  { name: "salon-genel", alt: "Tavanı beyaz çiçeklerle ve renkli ışıklarla süslenmiş salon", h: 1600 },
];

// ---- Yardımcılar -----------------------------------------------------------
const $ = (sel, root = document) => root.querySelector(sel);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---- Üst bar ve mobil çubuk -------------------------------------------------
const header = $("[data-header]");
const actionBar = $(".action-bar");
const hero = $(".hero");

function onScroll() {
  const y = window.scrollY;
  header.toggleAttribute("data-scrolled", y > 24);
  const heroEnd = hero ? hero.offsetHeight * 0.55 : 400;
  actionBar.toggleAttribute("data-show", y > heroEnd);
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---- Görünür olunca beliren bölümler ---------------------------------------
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !reduceMotion) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -10% 0px", threshold: 0.08 }
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

// ---- Galeri + fotoğraf görüntüleyici ---------------------------------------
const grid = $("[data-gallery]");
const lightbox = $("[data-lightbox]");
const lbImg = $("[data-lightbox-img]");
const lbCaption = $("[data-lightbox-caption]");
let current = 0;

grid.innerHTML = GALLERY.map(
  (p, i) => `
  <button class="gallery-item" type="button" data-index="${i}" aria-label="Büyüt: ${p.alt}">
    <img src="img/${p.name}-480.webp"
         srcset="img/${p.name}-480.webp 480w, img/${p.name}-800.webp 800w"
         sizes="(min-width: 1100px) 22vw, (min-width: 720px) 31vw, 48vw"
         width="1200" height="${p.h}" loading="lazy" decoding="async" alt="${p.alt}">
  </button>`
).join("");

function show(i) {
  current = (i + GALLERY.length) % GALLERY.length;
  const p = GALLERY[current];
  lbImg.src = `img/${p.name}-1200.webp`;
  lbImg.alt = p.alt;
  lbCaption.textContent = `${p.alt} (${current + 1}/${GALLERY.length})`;
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest(".gallery-item");
  if (!btn) return;
  show(Number(btn.dataset.index));
  lightbox.showModal();
});

$("[data-lightbox-close]").addEventListener("click", () => lightbox.close());
$("[data-lightbox-prev]").addEventListener("click", () => show(current - 1));
$("[data-lightbox-next]").addEventListener("click", () => show(current + 1));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});
lightbox.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "ArrowRight") show(current + 1);
});

// Telefonda parmakla kaydırarak geçiş
let touchX = null;
lightbox.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
  touchX = null;
});

// ---- Tarih sor formu: WhatsApp mesajı hazırlar -----------------------------
const form = $("[data-ask-form]");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const lines = ["Merhaba, salonunuz hakkında bilgi almak istiyorum.", "", `Davet: ${d.tur}`];
  if (d.tarih.trim()) lines.push(`Tarih: ${d.tarih.trim()}`);
  if (d.kisi.trim()) lines.push(`Kişi sayısı: ${d.kisi.trim()}`);
  if (d.not.trim()) lines.push(`Not: ${d.not.trim()}`);
  if (d.ad.trim()) lines.push("", d.ad.trim());
  const text = lines.join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});

// ---- Yıl ---------------------------------------------------------------------
const year = $("[data-year]");
if (year) year.textContent = new Date().getFullYear();
