import { handle } from 'hono/vercel'
import { app } from '../server/app.js'

// Vercel Function entry. vercel.json rewrites every /api/* request here.
const handler = handle(app)
export const GET = handler
export const POST = handler
export const PATCH = handler
export const PUT = handler
export const DELETE = handler
export const OPTIONS = handler
