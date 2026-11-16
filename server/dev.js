import { serve } from '@hono/node-server'
import { app } from './app.js'

// Local API server. Vite (port 5174) proxies /api here, so the browser sees one origin.
const port = Number(process.env.API_PORT || 3001)
serve({ fetch: app.fetch, port }, () => console.log(`API PE-NOVTRA jalan di http://localhost:${port}/api`))
