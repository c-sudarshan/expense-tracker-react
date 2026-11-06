import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the GitHub repo name so assets load at
// https://priiyanshu-kumar.github.io/expense-tracker/
export default defineConfig({
  plugins: [react()],
  base: '/expense-tracker/',
})
