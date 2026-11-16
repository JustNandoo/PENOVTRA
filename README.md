# PE-NOVTRA — Company Profile

Website company profile satu halaman untuk PE-NOVTRA (2-in-1 Smart Modular Growing System).
Dibangun dengan **React 18 + Vite + Tailwind CSS v4**.

## Menjalankan

Butuh Node 20+ dan PostgreSQL (lokal: `brew install postgresql@17`).

```bash
npm install
cp .env.example .env       # lalu sesuaikan DATABASE_URL
createdb penovtra
npm run db:migrate         # buat tabel
npm run db:seed            # isi kategori dan produk dari server/db/catalog-data.js
npm run db:seed:demo       # opsional: akun demo Gilang untuk mencoba login (hanya database lokal)
npm run dev                # web di :5174 + API di :3001 (Vite meneruskan /api ke API)
```

Akun demo: email dan kata sandinya ada di `server/db/seed-demo.js`. Skrip ini menolak berjalan selain ke database localhost.

Lainnya: `npm run build` (hasil produksi ke `dist/`), `npm run preview`, `npm run db:studio` (lihat isi database di browser).

## Backend marketplace

API ada di `server/` (Hono + Drizzle ORM + PostgreSQL). Lokal dijalankan oleh `server/dev.js`;
di Vercel lewat `api/index.js` sebagai Vercel Function.

```
server/app.js            semua route /api, middleware (CSRF, sesi, error)
server/db/schema.js      tabel: users, sessions, email_codes, addresses, categories,
                         products, product_variants, product_waitlist, orders, order_items, order_events
server/db/migrations/    file SQL migrasi (dibuat dengan npm run db:generate setelah schema diubah)
server/lib/auth.js       sesi cookie httpOnly, kode email 6 digit, token reset sandi
server/lib/mail.js       kirim email lewat Resend; tanpa RESEND_API_KEY dicetak di terminal API
server/routes/           auth, products (katalog), addresses, orders
```

Endpoint utama:

| | |
|---|---|
| `GET /api/products?q=&cat=&method=&price=&ready=&sort=` | katalog dengan pencarian dan filter |
| `GET /api/products/:slug` | detail produk + varian |
| `POST /api/auth/register` → `POST /api/auth/verify` | daftar, lalu verifikasi kode 6 digit dari email |
| `POST /api/auth/login`, `POST /api/auth/otp`, `GET /api/auth/me`, `POST /api/auth/logout` | masuk dengan sandi atau kode email |
| `POST /api/auth/forgot` → `POST /api/auth/reset` | tautan reset kata sandi |
| `GET/POST/PATCH/DELETE /api/addresses` | alamat pengiriman |
| `POST /api/orders`, `GET /api/orders`, `GET /api/orders/:id` | checkout dan riwayat pesanan |
| `POST /api/orders/:id/pay` | pembayaran tiruan, hanya jika `PAYMENT_MOCK=true` |
| `GET /api/auth/google` | masuk dengan Google (OAuth + PKCE), kembali ke `?next=` |
| `PATCH /api/auth/me` | ubah nama dan nomor WhatsApp |

### Masuk dengan Google

1. Buka Google Cloud Console → APIs & Services → Credentials → Create credentials → OAuth client ID, tipe **Web application**.
2. Authorized redirect URI: `http://localhost:5174/api/auth/google/callback` (lokal) dan `https://www.penovtra.com/api/auth/google/callback` (produksi).
3. Isi `GOOGLE_CLIENT_ID` dan `GOOGLE_CLIENT_SECRET` di `.env` (dan di Environment Variables Vercel), lalu jalankan ulang `npm run dev`.

Akun Google dengan email yang sudah terdaftar otomatis ditautkan ke akun tersebut. Tanpa kredensial, tombol Google kembali ke halaman Masuk dengan pesan bahwa fitur ini belum aktif.

Harga, ongkir, dan total selalu dihitung ulang di server. Stok dikurangi saat checkout dan dikembalikan
kalau pesanan dibatalkan atau melewati batas bayar 24 jam.

## Struktur

```
public/assets/        gambar (render alat, HP aplikasi, logo, foto tim, dll.)
src/index.css         token desain Tailwind (@theme): warna, breakpoint, easing, animasi
src/App.jsx           routing: Home (/) dan Marketplace (/marketplace)
src/pages/Home.jsx    urutan section Home
src/marketplace/      UI marketplace (halaman, komponen, data contoh)
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
Semua URL memakai domain `https://www.penovtra.com`. Kalau domainnya berbeda, ganti di `index.html`, `public/robots.txt`, dan `public/sitemap.xml`, lalu perbarui `lastmod` di sitemap setiap ada perubahan besar.

Breakpoint mengikuti desain asli dan dipakai sebagai varian `max-*`:
`max-lap` (< 1100px), `max-tab` (< 860px), `max-xs` (< 560px).
