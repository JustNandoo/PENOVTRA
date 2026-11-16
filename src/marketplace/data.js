/* Dummy catalog for UI slicing. Prices other than the 2-in-1 unit are samples. */

export const rupiah = n => 'Rp' + n.toLocaleString('id-ID')

const A = '/assets'

export const CATEGORIES = [
  { id: 'unit', label: 'Unit tanam', img: `${A}/device.webp` },
  { id: 'paket', label: 'Paket refill', img: `${A}/products/grow-kit.webp` },
  { id: 'media', label: 'Media tanam', img: `${A}/products/media-tanam.webp` },
  { id: 'benih', label: 'Benih', img: `${A}/products/benih.webp` },
  { id: 'nutrisi', label: 'Nutrisi', img: `${A}/products/nutrisi-ab.webp` },
  { id: 'part', label: 'Suku cadang', img: `${A}/products/kipas.webp` },
]
export const categoryLabel = id => CATEGORIES.find(c => c.id === id)?.label ?? ''

export const METHODS = [
  { id: 'all', label: 'Semua metode' },
  { id: 'soil', label: 'Media tanam' },
  { id: 'hydro', label: 'Hidroponik' },
]

export const PRICE_RANGES = [
  { id: 'all', label: 'Semua harga', min: 0, max: Infinity },
  { id: 'lt100', label: 'Di bawah Rp100rb', min: 0, max: 99_999 },
  { id: 'mid', label: 'Rp100rb – Rp1jt', min: 100_000, max: 1_000_000 },
  { id: 'gt1jt', label: 'Di atas Rp1jt', min: 1_000_001, max: Infinity },
]

export const SORTS = [
  { id: 'relevan', label: 'Paling relevan' },
  { id: 'murah', label: 'Harga terendah' },
  { id: 'mahal', label: 'Harga tertinggi' },
  { id: 'nama', label: 'Nama A–Z' },
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
export const productBySlug = slug => PRODUCTS.find(p => p.slug === slug)

/* hotspot positions are % of the device render */
export const PARTS = [
  { t: 'Naungan Insect Net', s: 'Proteksi hama', x: 35, y: 17, d: 'Jaring halus menutup seluruh bak. Hama tertahan di luar, cahaya dan udara tetap masuk.' },
  { t: 'Kipas Sirkulasi', s: 'Smart environment', x: 73.6, y: 13.8, d: 'Menjaga udara di dalam naungan tetap bergerak sehingga panas dan kelembapan berlebih terbuang.' },
  { t: 'Kanopi Buka-Tutup', s: 'Akses mudah', x: 12.5, y: 40, d: 'Rangka lengkung berengsel, dibuka saat menanam dan memanen, ditutup saat hujan lebat atau terik.' },
  { t: 'Zona Media Tanam', s: '2-in-1 · sisi kiri', x: 24, y: 58, d: 'Bak berisi tanah atau media tanam NovGrow untuk sayuran daun dan herbal.' },
  { t: 'Zona Hidroponik', s: '2-in-1 · sisi kanan', x: 76, y: 53, d: 'Panel net pot hidroponik untuk selada dan sayuran daun yang tumbuh cepat.' },
  { t: 'Rangka Modular', s: 'Modular estetik', x: 41, y: 70, d: 'Bak berkaki setinggi pinggang, mudah dipasang dan rapi untuk teras atau balkon.' },
]

export const ADDRESSES = [
  { id: 'rumah', label: 'Rumah', name: 'Dimas Pratama', addr: 'Jl. Keputih Tegal No. 12, Sukolilo, Surabaya, Jawa Timur 60111', phone: '+62 812-3456-4421' },
  { id: 'kantor', label: 'Kantor', name: 'Dimas Pratama', addr: 'Jl. Raya Darmo No. 45, Wonokromo, Surabaya, Jawa Timur 60241', phone: '+62 812-3456-4421' },
]

export const SHIPPING = [
  { id: 'cargo', name: 'Kargo', eta: '3–5 hari', note: 'Disarankan untuk unit berukuran besar', price: 52_000 },
  { id: 'reg', name: 'Reguler', eta: '2–3 hari', note: 'Cocok untuk media, benih, dan nutrisi', price: 38_000 },
  { id: 'instant', name: 'Instan Surabaya', eta: 'tiba hari ini', note: 'Pesan sebelum pukul 14.00', price: 45_000 },
]
export const INSURANCE = 9_000

export const PAY_METHODS = [
  { id: 'va', label: 'Virtual account' },
  { id: 'qris', label: 'QRIS' },
  { id: 'wallet', label: 'E-wallet' },
  { id: 'card', label: 'Kartu' },
]
export const BANKS = ['BCA', 'Mandiri', 'BNI', 'BRI', 'Permata']
export const WALLETS = ['GoPay', 'OVO', 'DANA', 'ShopeePay']

export const DEMO_USER = { name: 'Dimas Pratama', first: 'Dimas', email: 'dimas@email.com', phone: '+62 812-3456-4421', since: 'Sep 2026' }

/* orders that already exist on the demo account */
export const SEED_ORDERS = [
  {
    id: 'PNV-2610-0031', date: '28 Okt 2026', status: 'kirim',
    lines: [{ slug: 'grow-kit-refill', qty: 1 }, { slug: 'nutrisi-ab-mix', qty: 1 }],
    shipping: 'reg', insured: false, pay: 'VA BCA', resi: 'JX0042817731', eta: 'estimasi tiba 18 Nov 2026',
    events: [
      ['18 Nov · 08.20', 'Dibawa kurir ke alamatmu', 'Sukolilo, Surabaya', 'now'],
      ['17 Nov · 21.02', 'Tiba di hub tujuan', 'Surabaya Timur', 'done'],
      ['16 Nov · 16.45', 'Diserahkan ke kurir', 'Gudang Surabaya', 'done'],
      ['16 Nov · 10.12', 'Dikemas', 'Gudang Surabaya', 'done'],
    ],
  },
  {
    id: 'PNV-2609-0017', date: '12 Sep 2026', status: 'selesai',
    lines: [{ slug: 'media-tanam-organik', qty: 1 }, { slug: 'benih-premium', qty: 1 }],
    shipping: 'reg', insured: false, pay: 'QRIS', resi: 'JX0039917204', eta: 'diterima 15 Sep 2026',
    events: [
      ['15 Sep · 13.30', 'Diterima', 'Diterima oleh Dimas', 'now'],
      ['15 Sep · 09.02', 'Dibawa kurir ke alamatmu', 'Sukolilo, Surabaya', 'done'],
      ['13 Sep · 15.40', 'Diserahkan ke kurir', 'Gudang Surabaya', 'done'],
    ],
  },
]

export const ORDER_STATUS = {
  bayar: { label: 'Menunggu bayar', cls: 'bg-[#fff1e6] text-[#9a3412]' },
  proses: { label: 'Diproses', cls: 'bg-lime-soft text-forest' },
  kirim: { label: 'Dikirim', cls: 'bg-forest text-white' },
  selesai: { label: 'Selesai', cls: 'bg-mist text-ink-2' },
}

export function lineItems(lines) {
  return lines.map(l => {
    const p = productBySlug(l.slug)
    const v = p.variants?.find(x => x.id === l.variant)
    return { ...l, product: p, variantName: v?.name, price: v?.price ?? p.price, key: l.slug + (l.variant ? ':' + l.variant : '') }
  })
}
export const subtotalOf = items => items.reduce((a, i) => a + i.price * i.qty, 0)
export function orderTotal(order) {
  const items = lineItems(order.lines)
  const ship = SHIPPING.find(s => s.id === order.shipping)?.price ?? 0
  return subtotalOf(items) + ship + (order.insured ? INSURANCE : 0)
}
