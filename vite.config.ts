import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function normalizeBasePath(value: string): string {
  const trimmed = value.trim()
  if (!trimmed) return '/'
  const withLeading = trimmed.startsWith('/') ? trimmed : `/${trimmed}`
  const withTrailing = withLeading.endsWith('/') ? withLeading : `${withLeading}/`
  return withTrailing
}

// https://vite.dev/config/
export default defineConfig(() => {
  // For GitHub Pages you usually need base: "/<repo>/"
  // Set via env in CI (see README + workflow): VITE_BASE="/<repo>/"
  const base = normalizeBasePath(process.env.VITE_BASE ?? '/')

  return {
    base,
    plugins: [react()],
  }
})
