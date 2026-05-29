import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@modules': '/src/modules',
      '@shared': '/src/shared',
      '@data': '/src/data',
    },
  },
})
