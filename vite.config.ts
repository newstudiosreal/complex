import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// Base configurabile: VITE_BASE=/nome-repo/ (impostato in GitHub Actions). In locale resta './'.
export default defineConfig({ base: process.env.VITE_BASE ?? './', plugins: [react()] })
