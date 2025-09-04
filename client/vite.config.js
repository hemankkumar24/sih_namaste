import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // importing tailwind here

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
