import { Component, StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

type ErrorBoundaryState = { error: unknown | null }

class ErrorBoundary extends Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
    return { error }
  }

  componentDidCatch(error: unknown) {
    // Gives a breadcrumb even if UI renders fallback.
    // eslint-disable-next-line no-console
    console.error('[Kontor-timer] Runtime error:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 16, maxWidth: 880, margin: '24px auto', color: '#111', background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.12)' }}>
          <div style={{ fontWeight: 900, fontSize: 18 }}>Noe gikk galt</div>
          <div style={{ marginTop: 6, opacity: 0.85, lineHeight: 1.45 }}>
            Sjekk Console for detaljer. Hvis dette skjer etter deploy: sjekk Network for 404 på <code>/assets/*</code> og at <code>VITE_BASE</code> er riktig.
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

window.addEventListener('error', (event) => {
  // eslint-disable-next-line no-console
  console.error('[Kontor-timer] window.error:', event.error ?? event.message)
})

window.addEventListener('unhandledrejection', (event) => {
  // eslint-disable-next-line no-console
  console.error('[Kontor-timer] unhandledrejection:', event.reason)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
