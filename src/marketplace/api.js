/* Thin fetch wrapper for the marketplace API (/api, same origin, session cookie). */

export class ApiError extends Error {
  constructor(status, data) {
    super(data?.error || (status === 0 ? 'Tidak bisa terhubung ke server. Periksa koneksi internetmu.' : 'Terjadi kesalahan. Coba lagi.'))
    this.status = status
    this.data = data ?? {}
  }
}

export async function api(path, { method = 'GET', body, signal } = {}) {
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      credentials: 'same-origin',
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (e) {
    if (e.name === 'AbortError') throw e
    throw new ApiError(0)
  }
  const data = await res.json().catch(() => null)
  if (!res.ok) throw new ApiError(res.status, data)
  return data
}

export const qs = params => {
  const s = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== undefined && v !== '' && v !== false && v !== 'all'))
  return s.toString() ? `?${s}` : ''
}

/* Full-page redirect into Google sign-in (the API handles the OAuth round trip) */
export const googleSignIn = next => {
  window.location.href = `/api/auth/google?next=${encodeURIComponent(next || '/marketplace/profil')}`
}
