/* Email delivery. With RESEND_API_KEY set, mail goes out through Resend's
   HTTP API. Without it (local development) the message is printed in the
   API terminal so codes and links can still be used. */

export async function sendMail({ to, subject, text }) {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.log(`\n✉️  [email ke ${to}] ${subject}\n${text}\n`)
    return
  }
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.MAIL_FROM || 'PE-NOVTRA <noreply@penovtra.com>', to, subject, text }),
  })
  if (!res.ok) {
    console.error('Gagal mengirim email:', res.status, await res.text())
    throw new Error('Email gagal dikirim')
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
