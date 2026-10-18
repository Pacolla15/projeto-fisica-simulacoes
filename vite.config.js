import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          math: ['katex'],
          icons: ['lucide-react']
        }
      }
    }
  },
  test: {
    globals: true,
    environment: 'node'
  }
})
