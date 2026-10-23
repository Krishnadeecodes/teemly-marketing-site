import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import routePreload from './scripts/route-preload.js'

export default defineConfig(({ mode }) => {
  // Read PORT from .env so the dev proxy always matches the Node server
  const env = loadEnv(mode, process.cwd(), '')
  const api = `http://localhost:${env.PORT || 3001}`

  return {
    plugins: [react(), routePreload()],
    server: {
      // Forward form submissions to the Node server (npm run server) in dev
      proxy: {
        '/api': api,
        '/uploads': api,
      },
    },
  }
})
