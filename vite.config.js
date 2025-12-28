import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with '/api-hf' will be forwarded to Hugging Face
      '/api-hf': {
        target: 'https://api-inference.huggingface.co',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-hf/, ''),
        secure: false, // Sometimes needed for proxying HTTPS
      },
    },
  },
})