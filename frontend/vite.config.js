import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: https://hu-tec.github.io/AI-Ethics-Standard-Test/
// 빌드 시에만 저장소 하위경로를 base로, 로컬 개발(dev)은 '/' 유지
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/AI-Ethics-Standard-Test/' : '/',
  plugins: [react()],
}))
