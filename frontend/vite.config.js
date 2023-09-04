import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/foo -> http://localhost:4567/foo
      // "/upload": "http://127.0.0.1:5000",
      // "/completion": "http://127.0.0.1:5000",
      // "/predict": "http://127.0.0.1:5000",
      // "/get_prompts": "http://127.0.0.1:5000",
      // "/search_keywords": "http://127.0.0.1:5000",

      "/predict": "",
      "/get_prompts": "",
      "/search_keywords": "",
    }
  }
})
