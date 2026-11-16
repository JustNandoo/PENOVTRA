import { useState } from 'react'
import { api } from '../api'
import { Field, FormError, Spinner, inputCls } from './atoms'

const EMPTY = { label: 'Rumah', recipient: '', phone: '', line: '', city: '', province: '', postalCode: '' }

/* Create or edit a shipping address. Calls onSaved(address) with the API's copy. */
export default function AddressForm({ initial, defaults, onSaved, onCancel, submitLabel = 'Simpan alamat' }) {
  const [f, setF] = useState({ ...EMPTY, ...defaults, ...initial })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const set = k => e => setF(s => ({ ...s, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    e.stopPropagation() // the form can sit inside the checkout form
    setBusy(true)
    setError('')
    const body = { label: f.label, recipient: f.recipient, phone: f.phone, line: f.line, city: f.city, province: f.province, postalCode: f.postalCode }
    try {
      const r = initial?.id
        ? await api(`/addresses/${initial.id}`, { method: 'PATCH', body })
        : await api('/addresses', { method: 'POST', body })
      onSaved(r.address)
    } catch (err) {
      setError(err.message)
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-3.5 animate-swap">
      <div className="grid grid-cols-[160px_minmax(0,1fr)] gap-3 max-xs:grid-cols-1">
        <Field label="Label"><input required maxLength={30} value={f.label} onChange={set('label')} placeholder="Rumah" className={inputCls} /></Field>
        <Field label="Nama penerima"><input required minLength={2} autoComplete="name" value={f.recipient} onChange={set('recipient')} placeholder="Nama lengkap" className={inputCls} /></Field>
      </div>
      <Field label="Nomor HP penerima"><input required type="tel" inputMode="tel" autoComplete="tel" pattern="\+?[0-9 \-]{8,18}" title="8–18 digit angka" value={f.phone} onChange={set('phone')} placeholder="+62 812 3456 7890" className={inputCls} /></Field>
      <Field label="Alamat lengkap"><input required minLength={5} autoComplete="street-address" value={f.line} onChange={set('line')} placeholder="Jalan, nomor rumah, RT/RW, kelurahan, kecamatan" className={inputCls} /></Field>
      <div className="grid grid-cols-[1fr_1fr_130px] gap-3 max-tab:grid-cols-2">
        <Field label="Kota / kabupaten"><input required autoComplete="address-level2" value={f.city} onChange={set('city')} placeholder="Surabaya" className={inputCls} /></Field>
        <Field label="Provinsi"><input required autoComplete="address-level1" value={f.province} onChange={set('province')} placeholder="Jawa Timur" className={inputCls} /></Field>
        <Field label="Kode pos"><input required inputMode="numeric" autoComplete="postal-code" pattern="\d{5}" title="5 digit angka" maxLength={5} value={f.postalCode} onChange={set('postalCode')} placeholder="60111" className={inputCls} /></Field>
      </div>
      <FormError>{error}</FormError>
      <div className="flex flex-wrap gap-2.5 pt-1">
        <button type="submit" disabled={busy} className="inline-flex items-center gap-2 h-[50px] px-6 rounded-full bg-forest text-white text-[14.5px] font-medium hover:bg-forest-2 disabled:opacity-70">
          {busy && <Spinner />}{submitLabel}
        </button>
        {onCancel && <button type="button" onClick={onCancel} className="h-[50px] px-6 rounded-full border border-ink/18 text-[14.5px] font-medium text-forest hover:border-forest">Batal</button>}
      </div>
    </form>
  )
}

export const addressText = a => `${a.line}, ${a.city}, ${a.province} ${a.postalCode}`
