// Firebase Crashlytics Configuration
// Note: Crashlytics requires Firebase SDK with Crashlytics module
// For web, use Firebase Performance and Error Reporting

interface CrashlyticsError {
  name: string
  message: string
  stack?: string
  timestamp: string
  context?: Record<string, any>
}

// Error context storage
let errorContext: Record<string, any> = {}

// Initialize crash reporting
export function initCrashlytics(): void {
  // Set up global error handler
  const originalErrorHandler = window.onerror

  window.onerror = (message, source, lineno, colno, error) => {
    logError(error || new Error(String(message)), {
      source,
      lineno,
      colno,
    })

    if (originalErrorHandler) {
      return originalErrorHandler(message, source, lineno, colno, error)
    }
    return false
  }

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logError(event.reason instanceof Error ? event.reason : new Error(String(event.reason)), {
      type: 'unhandledrejection',
    })
  })

  console.log('Crashlytics initialized')
}

// Log custom error
export function logError(error: Error, context?: Record<string, any>): void {
  const errorData: CrashlyticsError = {
    name: error.name,
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context: { ...errorContext, ...context },
  }

  // In production, send to Firebase Crashlytics or error reporting service
  console.error('[Crashlytics]', errorData)

  // Store for debugging (in production, send to backend)
  if (import.meta.env.PROD) {
    sendErrorToServer(errorData)
  }
}

// Log custom message
export function log(message: string, context?: Record<string, any>): void {
  const logData = {
    message,
    timestamp: new Date().toISOString(),
    context: { ...errorContext, ...context },
  }

  console.log('[Crashlytics]', logData)
}

// Set user identifier
export function setCrashlyticsUserId(userId: string): void {
  errorContext.userId = userId
}

// Set custom key-value pair
export function setCrashlyticsCustomKey(key: string, value: any): void {
  errorContext[key] = value
}

// Clear user context on logout
export function clearCrashlyticsUser(): void {
  delete errorContext.userId
}

// Record exception
export function recordException(
  error: Error,
  attributes?: Record<string, string>
): void {
  logError(error, { attributes, type: 'recordedException' })
}

// Send error to server (would be implemented with actual error reporting service)
async function sendErrorToServer(error: CrashlyticsError): Promise<void> {
  try {
    // In production, this would send to Firebase Crashlytics or a custom endpoint
    await fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(error),
    }).catch(() => {
      // Silently fail if error reporting fails
    })
  } catch {
    // Ignore errors in error reporting
  }
}

// Non-fatal errors that should be tracked but don't crash the app
export const NonFatalErrors = {
  apiError: (endpoint: string, error: Error) => {
    recordException(error, { type: 'api_error', endpoint })
  },

  bookingError: (bookingId: string, error: Error) => {
    recordException(error, { type: 'booking_error', bookingId })
  },

  paymentError: (transactionId: string, error: Error) => {
    recordException(error, { type: 'payment_error', transactionId })
  },

  navigationError: (path: string, error: Error) => {
    recordException(error, { type: 'navigation_error', path })
  },
}

// Export for React Error Boundary integration
export function captureReactError(
  error: Error,
  errorInfo: { componentStack?: string }
): void {
  logError(error, {
    type: 'react_error_boundary',
    componentStack: errorInfo.componentStack,
  })
}
