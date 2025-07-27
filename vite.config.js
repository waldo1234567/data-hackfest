import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path';
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss(),
  ],
  resolve: {
    alias: {
      // Point all imports to the same module
      '@auth0/auth0-react': path.resolve(__dirname, 'node_modules/@auth0/auth0-react')
    }
  },
  optimizeDeps: {
    include: ['@auth0/auth0-react']
  }
})
