import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // Tout ce qui commence par /api est renvoyé vers ton proxy PHP.
      // Le navigateur croit parler à la même origine -> pas de souci CORS.
      // On retire le préfixe /api avant de transmettre : /api?format=json
      // devient http://127.0.0.1:8000/?format=json
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
