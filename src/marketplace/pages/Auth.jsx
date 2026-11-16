import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { cx } from '../../components/ui'
import { DarkBand } from '../components/DotField'
import { Em, Field, Kicker, SecHead, inputCls } from '../components/atoms'
import { useStore } from '../store'
import { rupiah } from '../data'

function useNext() {
  const [sp] = useSearchParams()
  return sp.get('next') || '/marketplace/profil'
}

const Primary = ({ children, ...rest }) => (
  <button {...rest} className="group mt-1.5 w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-colors active:scale-[.99]">
    {children} <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
  </button>
)
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
)
const GoogleBtn = ({ children, onClick }) => (
  <button type="button" onClick={onClick}
    className="w-full h-[54px] flex items-center justify-center gap-3 rounded-full border border-ink/18 bg-white text-[15px] font-medium text-forest shadow-[0_10px_24px_-20px_rgba(0,40,30,.6)] hover:border-forest hover:shadow-[0_14px_30px_-20px_rgba(0,40,30,.7)] transition-[border-color,box-shadow] duration-300 active:scale-[.99]">
    <GoogleIcon />{children}
  </button>
)
/* Inline text link: forest, bold, lime underline (never the muted body grey) */
const TL = 'font-semibold text-forest underline decoration-lime decoration-2 underline-offset-[5px] hover:text-lime hover:decoration-forest transition-colors'
const Divider = ({ children = 'atau' }) => (
  <div role="separator" className="flex items-center gap-3.5 my-6 text-[12px] tracking-[.14em] uppercase text-muted"><span className="flex-1 h-px bg-ink/12" />{children}<span className="flex-1 h-px bg-ink/12" /></div>
)

/* Split layout: dark brand panel on the left, form on the right. The panel collapses on phones. */
function Split({ aside, children }) {
  return (
    <main className="grid grid-cols-2 min-h-screen max-tab:grid-cols-1">
      <DarkBand word="" className="px-[clamp(32px,4.5vw,64px)] pt-[150px] pb-16 flex flex-col max-tab:hidden">
        {aside}
      </DarkBand>
      <div className="flex items-center justify-center px-[clamp(20px,4.5vw,64px)] pt-[140px] pb-20 max-tab:pt-28">
        <div className="w-full max-w-[460px] animate-fade-up" style={{ animationDelay: '.15s' }}>{children}</div>
      </div>
    </main>
  )
}

export function Login() {
  const { login, items, subtotal } = useStore()
  const nav = useNavigate()
  const next = useNext()
  const [mode, setMode] = useState('pw')
  const [show, setShow] = useState(false)
  const fromCheckout = next.includes('checkout')

  const submit = e => {
    e.preventDefault()
    if (mode === 'otp') return nav(`/marketplace/verifikasi?next=${encodeURIComponent(next)}`)
    login(); nav(next)
  }

  return (
    <Split aside={<>
      <p className="self-start inline-flex items-center gap-2.5 mb-6 px-4 py-2 rounded-full text-[13px] font-medium bg-white/6 border border-white/16 animate-fade-up"><span className="w-2 h-2 rounded-full bg-lime-2 animate-pulse-dot" />{fromCheckout ? 'Satu langkah lagi' : 'Akun PE-NOVTRA'}</p>
      <h2 className="mb-[18px] text-[clamp(40px,4vw,56px)] leading-[1.04] tracking-[-.04em] font-semibold">
        <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.15s' }}>Menanam tanpa batas,</span></span>
        <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.27s' }}><Em light>tanpa cemas.</Em></span></span>
      </h2>
      <p className="mb-9 max-w-[42ch] text-[15.5px] leading-[1.6] font-light text-white/72 animate-fade-up" style={{ animationDelay: '.4s' }}>Masuk supaya pesanan, alamat, dan garansi unitmu tersimpan, dan unitnya bisa langsung dihubungkan ke aplikasi Grow Companion.</p>
      {items.length > 0 && (
        <div className="max-w-[460px] rounded-[24px] bg-forest-3/55 border border-white/14 backdrop-blur-[10px] px-6 py-[22px] animate-chip-in" style={{ animationDelay: '.6s' }}>
          <Kicker className="mb-3.5 text-lime-2">Keranjangmu</Kicker>
          <ul className="grid gap-2.5 text-[14px] text-white/82">
            {items.slice(0, 3).map(it => <li key={it.key} className="flex justify-between gap-3"><span className="truncate">{it.product.short}{it.qty > 1 ? ` × ${it.qty}` : ''}</span><span>{rupiah(it.price * it.qty)}</span></li>)}
          </ul>
          <div className="flex justify-between items-baseline mt-4 pt-3.5 border-t border-white/14"><span className="text-[14px] text-white/70">Subtotal</span><span className="text-[26px] font-semibold tracking-[-.03em] text-lime-2">{rupiah(subtotal)}</span></div>
        </div>
      )}
      <img src="/assets/device.webp" alt="" className="w-[min(380px,70%)] h-auto mt-auto ml-auto pt-8 drop-shadow-[0_30px_40px_rgba(0,0,0,.45)] animate-device-in" />
    </>}>
      <SecHead idx="02" className="mb-6">Masuk</SecHead>
      <h1 className="mb-2.5 text-[clamp(36px,4vw,48px)] leading-[1.05] tracking-[-.04em] font-semibold text-forest">Masuk ke <Em>akunmu.</Em></h1>
      <p className="mb-8 text-[15px] text-muted">Belum punya akun? <Link to={`/marketplace/daftar?next=${encodeURIComponent(next)}`} className={TL}>Daftar gratis</Link></p>
      <GoogleBtn onClick={() => { login(); nav(next) }}>Lanjut dengan Google</GoogleBtn>
      <Divider />
      <div role="tablist" aria-label="Cara masuk" className="grid grid-cols-2 p-[5px] mb-5 rounded-full bg-white border border-ink/12">
        {[['pw', 'Kata sandi'], ['otp', 'Kode OTP']].map(([id, l]) => (
          <button key={id} type="button" role="tab" aria-selected={mode === id} onClick={() => setMode(id)}
            className={cx('h-[42px] rounded-full text-[14px] font-medium transition-colors duration-300', mode === id ? 'bg-forest text-white' : 'text-muted hover:text-forest')}>{l}</button>
        ))}
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <Field label="Email atau nomor WhatsApp">
          <input required autoComplete="username" placeholder="nama@email.com atau 08xx" className={inputCls} />
        </Field>
        {mode === 'pw' ? (
          <div key="pw" className="grid gap-4 animate-swap">
            <Field label="Kata sandi" right={<Link to="/marketplace/lupa-sandi" className="font-medium text-forest underline decoration-lime underline-offset-4 hover:text-lime">Lupa kata sandi?</Link>}>
              <span className="relative block">
                <input required type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="Minimal 8 karakter" className={cx(inputCls, 'pr-[124px]')} />
                <button type="button" onClick={() => setShow(s => !s)} className="absolute right-[7px] top-[7px] h-10 px-4 rounded-full bg-mist text-[13px] text-forest hover:bg-lime-soft">{show ? 'Sembunyikan' : 'Tampilkan'}</button>
              </span>
            </Field>
            <Primary type="submit">{fromCheckout ? 'Masuk dan lanjut checkout' : 'Masuk'}</Primary>
          </div>
        ) : (
          <div key="otp" className="grid gap-4 animate-swap">
            <p className="px-[18px] py-3.5 rounded-[18px] bg-mist text-[13.5px] leading-[1.6] text-ink-2">Kode 6 digit dikirim ke email yang terdaftar. Tidak perlu kata sandi.</p>
            <Primary type="submit">Kirim kode</Primary>
          </div>
        )}
      </form>
      <p className="mt-7 text-[13px] leading-[1.6] text-muted">Dengan masuk, kamu menyetujui <a href="#" className={TL}>Syarat &amp; Ketentuan</a> dan <a href="#" className={TL}>Kebijakan Privasi</a> PE-NOVTRA.</p>
    </Split>
  )
}

function strength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[0-9]/.test(pw) && /[a-zA-Z]/.test(pw)) s++
  if (pw.length >= 12 || /[^a-zA-Z0-9]/.test(pw)) s++
  if (pw.length > 0 && s === 0) s = 1
  return s
}

export function Register() {
  const nav = useNavigate()
  const next = useNext()
  const [pw, setPw] = useState('')
  const [email, setEmail] = useState('')
  const toVerify = mail => nav(`/marketplace/verifikasi?next=${encodeURIComponent(next)}`, { state: { email: mail } })
  const s = strength(pw)
  const col = s >= 3 ? 'bg-forest' : s === 2 ? 'bg-lime' : 'bg-warn'
  const label = !pw ? 'Gunakan minimal 8 karakter dengan huruf dan angka.' : s >= 3 ? 'Kuat' : s === 2 ? 'Cukup. Tambah simbol agar lebih kuat.' : 'Lemah. Minimal 8 karakter dengan huruf dan angka.'
  const steps = [['Lacak', 'Status pesanan dan perjalanan paket di Profil.'], ['Simpan', 'Alamat pengiriman untuk pesanan berikutnya.'], ['Lindungi', 'Garansi 1 tahun tercatat di akunmu.'], ['Tanam', 'Hubungkan unit ke aplikasi lewat QR.']]

  return (
    <Split aside={<>
      <h2 className="mb-[18px] text-[clamp(40px,4vw,56px)] leading-[1.04] tracking-[-.04em] font-semibold">
        <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.15s' }}>Satu akun,</span></span>
        <span className="block overflow-hidden"><span className="inline-block animate-line-up" style={{ animationDelay: '.27s' }}><Em light>dari beli sampai panen.</Em></span></span>
      </h2>
      <p className="mb-11 max-w-[42ch] text-[15.5px] leading-[1.6] font-light text-white/72 animate-fade-up" style={{ animationDelay: '.4s' }}>Akun yang sama dipakai di marketplace dan aplikasi NOVTRA Grow Companion.</p>
      <ol className="grid grid-cols-2 gap-x-7 gap-y-[30px] max-w-[560px]">
        {steps.map(([t, d], i) => (
          <li key={t} className="animate-fade-up" style={{ animationDelay: `${.5 + i * .1}s` }}>
            <span className={cx('grid place-items-center w-11 h-11 rounded-full text-[13px] mb-3.5', i === 0 ? 'bg-lime text-forest-3 font-bold' : 'border border-white/20 font-semibold')}>0{i + 1}</span>
            <b className="block mb-1.5 text-[22px] italic font-bold tracking-[-.03em]">{t}</b>
            <span className="text-[14px] leading-[1.55] font-light text-white/65">{d}</span>
          </li>
        ))}
      </ol>
    </>}>
      <SecHead idx="02" className="mb-6">Daftar</SecHead>
      <h1 className="mb-2.5 text-[clamp(36px,4vw,48px)] leading-[1.05] tracking-[-.04em] font-semibold text-forest">Buat <Em>akun baru.</Em></h1>
      <p className="mb-7 text-[15px] text-muted">Sudah punya akun? <Link to={`/marketplace/masuk?next=${encodeURIComponent(next)}`} className={TL}>Masuk</Link></p>
      <GoogleBtn onClick={() => toVerify('dimas@gmail.com')}>Daftar dengan Google</GoogleBtn>
      <Divider>atau isi data</Divider>
      <form onSubmit={e => { e.preventDefault(); toVerify(email) }} className="grid gap-4">
        <Field label="Nama lengkap"><input required autoComplete="name" placeholder="Nama penerima paket" className={inputCls} /></Field>
        <div className="grid grid-cols-2 gap-3 max-xs:grid-cols-1">
          <Field label="Email"><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className={inputCls} /></Field>
          <Field label="Nomor WhatsApp">
            <span className="flex h-[54px] rounded-full border border-ink/18 bg-white overflow-hidden focus-within:border-forest transition-colors">
              <span className="grid place-items-center pl-[18px] pr-2.5 text-[15px] font-normal text-muted">+62</span>
              <input required type="tel" autoComplete="tel-national" placeholder="812 3456 7890" className="flex-1 min-w-0 border-0 outline-none pr-4 text-[15px] font-normal" />
            </span>
          </Field>
        </div>
        <Field label="Kata sandi" hint={label}>
          <input required type="password" autoComplete="new-password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Minimal 8 karakter" className={inputCls} />
          <span aria-hidden="true" className="grid grid-cols-3 gap-1.5 px-2">
            {[1, 2, 3].map(n => <span key={n} className={cx('h-[5px] rounded-full transition-colors duration-500', s >= n ? col : 'bg-ink/12')} />)}
          </span>
        </Field>
        <label className="flex gap-2.5 px-[18px] py-3.5 rounded-[18px] bg-mist text-[13.5px] leading-[1.55] text-ink-2">
          <input required type="checkbox" className="flex-none mt-0.5 w-[18px] h-[18px] accent-forest" />
          <span>Saya setuju dengan <a href="#" className={TL}>Syarat &amp; Ketentuan</a> dan <a href="#" className={TL}>Kebijakan Privasi</a>.</span>
        </label>
        <Primary type="submit">Buat akun</Primary>
      </form>
    </Split>
  )
}

/* Centered card on the dark band, used by OTP and password reset */
function DarkCard({ children }) {
  return (
    <DarkBand id="mk-hero" word="NOVTRA" className="min-h-screen pt-[150px] pb-28 max-xs:pt-28">
      <div className="wrap relative flex flex-col items-center">{children}</div>
    </DarkBand>
  )
}

function maskEmail(mail) {
  const [user, domain] = mail.split('@')
  if (!domain) return mail
  return `${user[0]}${'•'.repeat(Math.min(Math.max(user.length - 1, 3), 6))}@${domain}`
}

export function Verify() {
  const { login } = useStore()
  const nav = useNavigate()
  const { state } = useLocation()
  const email = state?.email || 'dimas@email.com'
  const next = useNext()
  const [digits, setDigits] = useState(['', '', '', '', '', ''])
  const [left, setLeft] = useState(59)
  const refs = useRef([])

  useEffect(() => {
    refs.current[0]?.focus()
    const id = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000)
    return () => clearInterval(id)
  }, [])

  const setAt = (i, v) => {
    const clean = v.replace(/\D/g, '')
    if (clean.length > 1) { // pasted code
      const arr = clean.slice(0, 6).split('')
      setDigits(d => d.map((_, k) => arr[k] ?? ''))
      refs.current[Math.min(arr.length, 5)]?.focus()
      return
    }
    setDigits(d => d.map((x, k) => k === i ? clean : x))
    if (clean && i < 5) refs.current[i + 1]?.focus()
  }
  const onKey = (i, e) => { if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus() }
  const full = digits.every(Boolean)
  const submit = e => { e.preventDefault(); if (!full) return; login(); nav(next) }

  return (
    <DarkCard>
      <form onSubmit={submit} className="w-full max-w-[520px] bg-paper text-ink rounded-[32px] px-11 pt-11 pb-9 shadow-[0_50px_80px_-40px_rgba(0,0,0,.6)] animate-toast-in max-xs:px-6 max-xs:pt-8">
        <SecHead idx="02" className="mb-[22px]">Verifikasi</SecHead>
        <h1 className="mb-2.5 text-[clamp(32px,3.6vw,40px)] leading-[1.08] tracking-[-.04em] font-semibold text-forest">Cek <Em>email-mu.</Em></h1>
        <p className="mb-[30px] text-[15px] leading-[1.6] text-ink-2">Kode 6 digit dikirim ke <b className="font-semibold text-forest">{maskEmail(email)}</b>. Berlaku 5 menit. Tidak ada di kotak masuk? Cek folder spam.</p>
        <fieldset>
          <legend className="sr-only">Kode verifikasi 6 digit</legend>
          <div className="grid grid-cols-6 gap-2.5 max-xs:gap-1.5">
            {digits.map((d, i) => (
              <input key={i} ref={el => (refs.current[i] = el)} aria-label={`Digit ${i + 1}`} inputMode="numeric" autoComplete={i === 0 ? 'one-time-code' : 'off'}
                value={d} onChange={e => setAt(i, e.target.value)} onKeyDown={e => onKey(i, e)}
                className={cx('h-[66px] w-full min-w-0 text-center rounded-[20px] bg-white text-[26px] font-semibold text-forest outline-none transition-[border-color,box-shadow] duration-200 max-xs:h-14 max-xs:rounded-[14px] max-xs:text-[22px]',
                  d ? 'border-[1.5px] border-forest' : 'border border-ink/18 focus:border-2 focus:border-lime focus:shadow-[0_0_0_4px_rgba(128,178,20,.18)]')} />
            ))}
          </div>
        </fieldset>
        <div className="flex justify-between items-center mt-[18px] mb-[26px] text-[14px] text-muted">
          {left > 0
            ? <span>Kirim ulang dalam <b className="font-semibold text-forest tabular-nums">00:{String(left).padStart(2, '0')}</b></span>
            : <button type="button" onClick={() => setLeft(59)} className="font-semibold text-forest underline underline-offset-4">Kirim ulang kode</button>}
          <a href="#" className="font-medium text-forest underline decoration-lime underline-offset-4 hover:text-lime">Kirim lewat WhatsApp</a>
        </div>
        <button type="submit" disabled={!full} className="group w-full h-14 flex items-center justify-center gap-2.5 rounded-full bg-lime text-forest-3 text-[15.5px] font-medium hover:bg-lime-2 transition-[background-color,color] duration-300 disabled:bg-lime-soft disabled:text-forest/55 disabled:cursor-not-allowed">
          Verifikasi dan lanjut <span aria-hidden="true" className="transition-[translate] duration-400 group-hover:translate-x-1">→</span>
        </button>
        <p className="mt-[22px] text-center text-[14px] text-muted">Email salah? <Link to="/marketplace/daftar" className={TL}>Ganti email</Link></p>
      </form>
    </DarkCard>
  )
}

export function ForgotPassword() {
  const { login } = useStore()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  return (
    <DarkCard>
      <h1 className="mb-3 text-center text-[clamp(38px,4.6vw,60px)] leading-[1.04] tracking-[-.04em] font-semibold">
        <span className="block overflow-hidden"><span className="inline-block animate-line-up">Lupa kata sandi? <Em light>Tenang.</Em></span></span>
      </h1>
      <p className="mb-12 max-w-[46ch] text-center text-[16px] leading-[1.6] font-light text-white/72 animate-fade-up" style={{ animationDelay: '.2s' }}>Dua langkah singkat untuk membuat kata sandi baru.</p>
      <div className="grid grid-cols-2 gap-5 w-full max-w-[1000px] max-tab:grid-cols-1">
        <form onSubmit={e => { e.preventDefault(); setSent(true) }} className="bg-paper text-ink rounded-[32px] p-9 animate-toast-in max-xs:p-6" style={{ animationDelay: '.25s' }}>
          <span className="grid place-items-center w-11 h-11 mb-[18px] rounded-full bg-lime text-forest-3 text-[13px] font-bold">01</span>
          <h2 className="mb-2 text-[28px] italic font-bold tracking-[-.03em] text-forest">Kirim tautan</h2>
          <p className="mb-[22px] text-[14.5px] leading-[1.6] text-muted">Masukkan email akunmu. Tautan untuk membuat kata sandi baru dikirim ke sana.</p>
          <Field label="Email"><input required type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="nama@email.com" className={inputCls} /></Field>
          <div className="mt-[18px]"><Primary type="submit">{sent ? 'Kirim ulang tautan' : 'Kirim tautan'}</Primary></div>
          {sent && <p role="status" className="mt-[18px] px-[18px] py-3.5 rounded-[18px] bg-lime-soft text-[13.5px] leading-[1.55] text-forest animate-swap">Tautan terkirim ke <b className="font-semibold">{email}</b>, berlaku 30 menit. Cek juga folder spam.</p>}
        </form>
        <form onSubmit={e => { e.preventDefault(); login(); nav('/marketplace/profil') }}
          className={cx('bg-paper text-ink rounded-[32px] p-9 animate-toast-in transition-opacity duration-500 max-xs:p-6', !sent && 'opacity-60')} style={{ animationDelay: '.35s' }}>
          <span className={cx('grid place-items-center w-11 h-11 mb-[18px] rounded-full text-[13px] transition-colors', sent ? 'bg-lime text-forest-3 font-bold' : 'border border-ink/20 text-forest font-semibold')}>02</span>
          <h2 className="mb-2 text-[28px] italic font-bold tracking-[-.03em] text-forest">Buat kata sandi baru</h2>
          <p className="mb-[22px] text-[14.5px] leading-[1.6] text-muted">Dibuka dari tautan. Setelah disimpan kamu langsung masuk.</p>
          <div className="grid gap-3.5">
            <Field label="Kata sandi baru"><input required disabled={!sent} type="password" autoComplete="new-password" placeholder="Minimal 8 karakter" className={inputCls} /></Field>
            <Field label="Ulangi kata sandi"><input required disabled={!sent} type="password" autoComplete="new-password" placeholder="Ketik ulang" className={inputCls} /></Field>
          </div>
          <button type="submit" disabled={!sent} className="mt-5 w-full h-14 rounded-full bg-forest text-white text-[15px] font-medium hover:bg-forest-2 disabled:cursor-not-allowed">Simpan dan masuk →</button>
        </form>
      </div>
    </DarkCard>
  )
}
