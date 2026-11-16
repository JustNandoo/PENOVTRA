/* Shared marketplace constants and helpers. Products and categories live in
   the database (served by /api); the server also imports this file so
   shipping, insurance and payment options stay identical on both sides. */

export const rupiah = n => 'Rp' + Number(n).toLocaleString('id-ID')

export const METHODS = [
  { id: 'all', label: 'Semua metode' },
  { id: 'soil', label: 'Media tanam' },
  { id: 'hydro', label: 'Hidroponik' },
]

export const PRICE_RANGES = [
  { id: 'all', label: 'Semua harga' },
  { id: 'lt100', label: 'Di bawah Rp100rb' },
  { id: 'mid', label: 'Rp100rb – Rp1jt' },
  { id: 'gt1jt', label: 'Di atas Rp1jt' },
]

export const SORTS = [
  { id: 'relevan', label: 'Paling relevan' },
  { id: 'murah', label: 'Harga terendah' },
  { id: 'mahal', label: 'Harga tertinggi' },
  { id: 'nama', label: 'Nama A–Z' },
]

/* hotspot positions are % of the device render */
export const PARTS = [
  { t: 'Naungan Insect Net', s: 'Proteksi hama', x: 35, y: 17, d: 'Jaring halus menutup seluruh bak. Hama tertahan di luar, cahaya dan udara tetap masuk.' },
  { t: 'Kipas Sirkulasi', s: 'Smart environment', x: 73.6, y: 13.8, d: 'Menjaga udara di dalam naungan tetap bergerak sehingga panas dan kelembapan berlebih terbuang.' },
  { t: 'Kanopi Buka-Tutup', s: 'Akses mudah', x: 12.5, y: 40, d: 'Rangka lengkung berengsel, dibuka saat menanam dan memanen, ditutup saat hujan lebat atau terik.' },
  { t: 'Zona Media Tanam', s: '2-in-1 · sisi kiri', x: 24, y: 58, d: 'Bak berisi tanah atau media tanam NovGrow untuk sayuran daun dan herbal.' },
  { t: 'Zona Hidroponik', s: '2-in-1 · sisi kanan', x: 76, y: 53, d: 'Panel net pot hidroponik untuk selada dan sayuran daun yang tumbuh cepat.' },
  { t: 'Rangka Modular', s: 'Modular estetik', x: 41, y: 70, d: 'Bak berkaki setinggi pinggang, mudah dipasang dan rapi untuk teras atau balkon.' },
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

export const ORDER_STATUS = {
  bayar: { label: 'Menunggu bayar', cls: 'bg-[#fff1e6] text-[#9a3412]' },
  proses: { label: 'Diproses', cls: 'bg-lime-soft text-forest' },
  kirim: { label: 'Dikirim', cls: 'bg-forest text-white' },
  selesai: { label: 'Selesai', cls: 'bg-mist text-ink-2' },
  batal: { label: 'Dibatalkan', cls: 'bg-[#fdeceb] text-[#b42318]' },
}

export const methodLabel = m => (m === 'hydro' ? 'Hidroponik' : m === 'soil' ? 'Media tanam' : 'Media tanam + hidroponik')

const DAY = { day: 'numeric', month: 'short', year: 'numeric' }
export const fmtDate = d => new Date(d).toLocaleDateString('id-ID', DAY)
export const fmtDateTime = d => {
  const x = new Date(d)
  return `${x.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · ${x.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '.')}`
}
