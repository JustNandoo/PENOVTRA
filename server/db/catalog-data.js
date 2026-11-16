/* Starting catalog for the database (npm run db:seed). After seeding, the
   products table is the source of truth; edit prices and stock there. */

const A = '/assets'

export const CATEGORIES = [
  { id: 'unit', label: 'Unit tanam', img: `${A}/device.webp` },
  { id: 'paket', label: 'Paket refill', img: `${A}/products/grow-kit.webp` },
  { id: 'media', label: 'Media tanam', img: `${A}/products/media-tanam.webp` },
  { id: 'benih', label: 'Benih', img: `${A}/products/benih.webp` },
  { id: 'nutrisi', label: 'Nutrisi', img: `${A}/products/nutrisi-ab.webp` },
  { id: 'part', label: 'Suku cadang', img: `${A}/products/kipas.webp` },
]

export const PRODUCTS = [
  {
    slug: 'pe-novtra-2-in-1', name: 'PE-NOVTRA 2-in-1 Smart Modular Growing System', short: 'PE-NOVTRA 2-in-1',
    cat: 'unit', method: 'both', price: 1_799_000, unit: 'per paket', tag: 'Garansi 1 tahun',
    img: `${A}/device.webp`,
    gallery: [`${A}/device.webp`, `${A}/products/grow-kit.webp`, `${A}/app/pindai-qr.webp`, `${A}/app/beranda.webp`],
    blurb: 'Media tanam + hidroponik, naungan insect net, kipas sirkulasi.',
    desc: 'Media tanam dan hidroponik dalam satu bak modular, dengan naungan insect net yang menahan hama dan kipas sirkulasi yang menjaga udara tetap bergerak. Didampingi aplikasi NOVTRA Grow Companion sampai panen.',
    variants: [
      { id: 'std', name: 'Paket standar', price: 1_799_000, desc: 'Unit, protective cover, 1 grow kit, panduan QR dan aplikasi.' },
      { id: 'plus', name: 'Paket + Grow Kit Refill', price: 1_938_000, desc: 'Tambahan 1 grow kit refill untuk siklus tanam kedua.' },
    ],
    specs: [['Metode tanam', 'Media tanam dan hidroponik'], ['Ukuran unit', '±120 × 40 cm'], ['Naungan', 'Insect net, kanopi buka-tutup'], ['Sirkulasi udara', 'Kipas sirkulasi'], ['Aplikasi', 'NOVTRA Grow Companion'], ['Garansi', '1 tahun']],
    box: ['Unit dengan protective cover', '1 paket grow kit', 'Panduan QR dan aplikasi', '1 tahun garansi produk'],
    hasParts: true, featured: true,
  },
  {
    slug: 'pe-novtra-indoor-box', name: 'PE-NOVTRA Indoor Box', short: 'Indoor Box', cat: 'unit', method: 'hydro',
    price: 0, soon: true, unit: '', img: `${A}/products/indoor-box.webp`,
    blurb: 'Unit hidroponik ringkas untuk dalam ruangan.',
    desc: 'Unit hidroponik ringkas untuk ruang dalam rumah. Sedang dikembangkan; daftarkan diri untuk diberi tahu saat rilis.',
  },
  {
    slug: 'grow-kit-refill', name: 'Grow Kit Refill NovGrow', short: 'Grow Kit Refill', cat: 'paket', method: 'both',
    price: 139_000, unit: 'per paket', tag: 'Paket hemat', img: `${A}/products/grow-kit.webp`,
    blurb: 'Media tanam, benih, dan nutrisi untuk satu siklus.',
    desc: 'Isi ulang untuk satu siklus tanam di unit PE-NOVTRA: media tanam organik, benih premium, dan nutrisi hidroponik.',
    box: ['NovGrow Media Tanam', 'NovGrow Benih Premium', 'NovGrow Nutrisi A dan B'],
  },
  {
    slug: 'media-tanam-organik', name: 'NovGrow Media Tanam Organik 5 kg', short: 'Media Tanam 5 kg', cat: 'media', method: 'soil',
    price: 45_000, unit: 'per kantong', img: `${A}/products/media-tanam.webp`,
    blurb: 'Dari limbah sawit, untuk zona media tanam.',
    desc: 'Media tanam organik dari pemanfaatan limbah sawit, untuk zona media tanam di unit PE-NOVTRA atau pot di rumah.',
  },
  {
    slug: 'benih-premium', name: 'NovGrow Benih Premium', short: 'Benih Premium', cat: 'benih', method: 'both',
    price: 15_000, unit: 'per sachet', img: `${A}/products/benih.webp`,
    blurb: 'Benih sayuran daun pilihan.',
    desc: 'Benih sayuran daun pilihan untuk zona media tanam maupun hidroponik.',
  },
  {
    slug: 'nutrisi-ab-mix', name: 'NovGrow Nutrisi AB Mix 1 L', short: 'Nutrisi AB Mix 1 L', cat: 'nutrisi', method: 'hydro',
    price: 60_000, unit: 'per botol', img: `${A}/products/nutrisi-ab.webp`,
    blurb: 'Nutrisi lengkap untuk zona hidroponik.',
    desc: 'Nutrisi lengkap siap campur untuk zona hidroponik.',
  },
  {
    slug: 'nutrisi-a', name: 'NovGrow Nutrisi A 500 ml', short: 'Nutrisi A 500 ml', cat: 'nutrisi', method: 'hydro',
    price: 35_000, unit: 'per botol', img: `${A}/products/nutrisi-a.webp`,
    blurb: 'Larutan A, berpasangan dengan B.',
    desc: 'Larutan nutrisi A untuk hidroponik. Dipakai berpasangan dengan larutan B.',
  },
  {
    slug: 'nutrisi-b', name: 'NovGrow Nutrisi B 500 ml', short: 'Nutrisi B 500 ml', cat: 'nutrisi', method: 'hydro',
    price: 35_000, unit: 'per botol', img: `${A}/products/nutrisi-b.webp`,
    blurb: 'Larutan B, berpasangan dengan A.',
    desc: 'Larutan nutrisi B untuk hidroponik. Dipakai berpasangan dengan larutan A.',
  },
  {
    slug: 'kipas-sirkulasi', name: 'Kipas Sirkulasi Pengganti', short: 'Kipas Sirkulasi', cat: 'part', method: 'both',
    price: 95_000, unit: 'per unit', img: `${A}/products/kipas.webp`,
    blurb: 'Suku cadang resmi untuk naungan PE-NOVTRA.',
    desc: 'Kipas sirkulasi pengganti resmi untuk naungan unit PE-NOVTRA.',
  },
  {
    slug: 'modul-daya-surya', name: 'Modul Daya Surya PE-NOVTRA', short: 'Modul Daya Surya', cat: 'part', method: 'both',
    price: 899_000, unit: 'per unit', img: `${A}/products/daya-surya.webp`,
    blurb: 'Panel surya dan baterai untuk kipas dan sensor.',
    desc: 'Panel surya dan baterai untuk menyalakan kipas dan sensor unit PE-NOVTRA tanpa colokan listrik.',
  },
]
