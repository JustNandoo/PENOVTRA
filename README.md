# PE-NOVTRA — Company Profile

Website company profile satu halaman untuk PE-NOVTRA (2-in-1 Smart Modular Growing System).
Dibangun dengan **React 18 + Vite + Tailwind CSS v4**.

## Menjalankan

```bash
npm install
npm run dev      # server pengembangan
npm run build    # hasil produksi ke folder dist/
npm run preview  # cek hasil build
```

## Struktur

```
public/assets/        gambar (render alat, HP aplikasi, logo, foto tim, dll.)
src/index.css         token desain Tailwind (@theme): warna, breakpoint, easing, animasi
src/App.jsx           urutan section
src/components/
  ui.jsx              komponen kecil bersama: Reveal, CountUp, SecHead, H2, Pill, Btn, Tag, Icon
  Nav.jsx             navigasi melayang + menu mobile
  Hero.jsx            hero: kanvas "tanam", data sensor live, animasi alat
  About.jsx           latar belakang (statistik) + pernyataan + 4 pilar
  Explorer.jsx        penjelajah alat (hotspot, zoom, tilt) + tab aplikasi
  HowItWorks.jsx      Choose → Sense → Adapt → Grow + dampak
  Ecosystem.jsx       paket B2C + NovGrow, layanan, edukasi
  Sdg.jsx             pilar SDGs
  Journey.jsx         timeline, penghargaan, validasi pasar, pendukung
  Team.jsx            tim & advisor
  Closing.jsx         ajakan kontak + footer
src/hooks/            useInView (reveal saat di-scroll), useScrollFrame
```

## SEO

Meta tag, Open Graph, dan data terstruktur (JSON-LD) ada di `index.html`; `robots.txt`, `sitemap.xml`, `site.webmanifest`, ikon, dan `og-image.jpg` ada di `public/`.
Semua URL memakai domain `https://www.penovtra.id`. Kalau domainnya berbeda, ganti di `index.html`, `public/robots.txt`, dan `public/sitemap.xml`, lalu perbarui `lastmod` di sitemap setiap ada perubahan besar.

Breakpoint mengikuti desain asli dan dipakai sebagai varian `max-*`:
`max-lap` (< 1100px), `max-tab` (< 860px), `max-xs` (< 560px).
