import { Component, type ReactNode } from 'react'
import { TriangleAlert as AlertTriangle, RefreshCw, Hop as Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: any
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })

    // In production, you would send this to an error reporting service
    if (import.meta.env.PROD) {
      // sendToErrorReporting(error, errorInfo)
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          background: 'var(--bg, #f1f5f9)',
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '400px',
            background: 'white',
            padding: '48px 24px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px',
            }}>
              <AlertTriangle size={40} style={{ color: '#ef4444' }} />
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
              Something went wrong
            </h1>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              An unexpected error occurred. Please try again or contact support if the problem persists.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div style={{
                background: '#fef2f2',
                padding: '16px',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'left',
                overflow: 'auto',
                maxWidth: '100%',
              }}>
                <code style={{ fontSize: '12px', color: '#ef4444', wordBreak: 'break-word' }}>
                  {this.state.error.message}
                </code>
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: '#1B3A5C',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={18} />
                Try Again
              </button>
              <button
                onClick={this.handleGoHome}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  background: 'transparent',
                  color: '#1B3A5C',
                  border: '2px solid #1B3A5C',
                  borderRadius: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Toast Container Component
export function ToastContainer() {
  const toasts: any[] = []

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button onClick={() => {}} className="toast-dismiss">x</button>
        </div>
      ))}
    </div>
  )
}

// Offline Banner Component
export function OfflineBanner() {
  const isOnline = true

  if (isOnline) return null

  return (
    <div className="offline-banner">
      <AlertTriangle size={16} />
      <span>You are offline. Some features may be limited.</span>
    </div>
  )
}
