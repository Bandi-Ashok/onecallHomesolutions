import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react'
import { useUIStore } from '@/store/uiStore'

interface ToastProps {
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  onClose: () => void
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertCircle className="w-5 h-5 text-yellow-600" />,
  }

  const bgColors = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    info: 'bg-blue-50 border-blue-200',
    warning: 'bg-yellow-50 border-yellow-200',
  }

  return (
    <div
      className={`fixed top-4 right-4 flex items-center gap-3 px-4 py-3 rounded-lg border ${bgColors[type]} animate-slide-in z-50`}
    >
      {icons[type]}
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

const ToastContainer: React.FC = () => {
  const toast = useUIStore((state) => state.toast)
  const hideToast = useUIStore((state) => state.hideToast)

  if (!toast) return null

  return (
    <Toast message={toast.message} type={toast.type} onClose={hideToast} />
  )
}

export default ToastContainer
