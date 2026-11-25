import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves the site under /<repository-name>/
export default defineConfig({
  base: '/official-web-page/',
  plugins: [react()],
  build: {
    // Swagger UI ships as a single bundle of about 1.6 MB; it is loaded only on the API tab
    chunkSizeWarningLimit: 1700,
  },
})
