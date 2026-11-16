import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5174,
    strictPort: true,
    // the API runs separately (npm run dev:api); same-origin calls keep the session cookie simple
    proxy: { '/api': `http://localhost:${process.env.API_PORT || 3001}` },
  },
})
