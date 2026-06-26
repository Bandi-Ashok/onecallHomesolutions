import React from 'react'
import { AlertTriangle, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface AlertProps {
  type: 'error' | 'warning' | 'success' | 'info'
  title: string
  message?: string
  dismissible?: boolean
  onDismiss?: () => void
}

const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  dismissible = false,
  onDismiss,
}) => {
  const styles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  }

  const icons = {
    error: <AlertTriangle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  }

  return (
    <div className={`border rounded-lg p-4 flex gap-3 ${styles[type]}`}>
      {icons[type]}
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{title}</h3>
        {message && <p className="text-sm opacity-90">{message}</p>}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="text-lg font-bold opacity-50 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  )
}

export default Alert
