import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/uploads': {
        target: 'https://ahpbca-api.webonly.io',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://ahpbca-api.webonly.io',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
