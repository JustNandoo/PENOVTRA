import nodemailer from 'nodemailer'
import { fail } from './http.js'

/* Email delivery, first match wins:
   1. SMTP (SMTP_USER + SMTP_PASS), e.g. Gmail with an app password
   2. Resend's HTTP API (RESEND_API_KEY)
   3. nothing configured: printed in the API terminal (local development) */

const from = () => process.env.MAIL_FROM || (process.env.SMTP_USER ? `PE-NOVTRA <${process.env.SMTP_USER}>` : 'PE-NOVTRA <noreply@penovtra.com>')

let transport
function smtp() {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null
  const port = Number(process.env.SMTP_PORT || 465)
  transport ??= nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS.replace(/\s+/g, '') },
  })
  return transport
}

/* Checks the SMTP login without sending anything */
export async function verifyMail() {
  const t = smtp()
  if (!t) return 'SMTP belum diisi'
  await t.verify()
  return `SMTP siap (${process.env.SMTP_USER})`
}

export async function sendMail({ to, subject, text }) {
  const t = smtp()
  if (t) {
    try {
      await t.sendMail({ from: from(), to, subject, text })
    } catch (e) {
      console.error('Gagal mengirim email lewat SMTP:', e.message)
      fail(502, 'Email belum bisa dikirim. Coba lagi sebentar.')
    }
    return
  }
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log(`\n✉️  [email ke ${to}] ${subject}\n${text}\n`)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: from(), to, subject, text }),
  })
  if (!res.ok) {
    console.error('Gagal mengirim email:', res.status, await res.text())
    fail(502, 'Email belum bisa dikirim. Coba lagi sebentar.')
  }
}

export const codeMail = (code, purpose) => ({
  subject: purpose === 'verify' ? `${code} adalah kode verifikasi PE-NOVTRA` : `${code} adalah kode masuk PE-NOVTRA`,
  text: [
    purpose === 'verify' ? 'Terima kasih sudah mendaftar di PE-NOVTRA.' : 'Ada permintaan masuk ke akun PE-NOVTRA-mu.',
    '',
    `Kode: ${code}`,
    '',
    'Kode berlaku 5 menit. Jangan bagikan kode ini ke siapa pun, termasuk pihak yang mengaku dari PE-NOVTRA.',
    'Kalau kamu tidak merasa meminta kode ini, abaikan email ini.',
  ].join('\n'),
})

export const resetMail = link => ({
  subject: 'Buat kata sandi baru untuk akun PE-NOVTRA',
  text: [
    'Ada permintaan untuk membuat kata sandi baru di akun PE-NOVTRA-mu.',
    '',
    `Buka tautan ini (berlaku 30 menit): ${link}`,
    '',
    'Kalau kamu tidak memintanya, abaikan email ini. Kata sandimu tidak berubah.',
  ].join('\n'),
})
