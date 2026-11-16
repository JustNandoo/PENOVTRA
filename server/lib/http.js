import { HTTPException } from 'hono/http-exception'

/* Throw from any handler: becomes { error, ...extra } with the given status */
export function fail(status, message, extra) {
  throw new HTTPException(status, { message, cause: extra })
}

/* Parse and validate a JSON body with a zod schema; 400 with the first issue otherwise */
export async function body(c, schema) {
  let raw
  try {
    raw = await c.req.json()
  } catch {
    fail(400, 'Body harus berupa JSON.')
  }
  const r = schema.safeParse(raw)
  if (!r.success) {
    const issue = r.error.issues[0]
    fail(400, issue?.message || 'Data tidak valid.', { field: issue?.path?.join('.') })
  }
  return r.data
}
