import { useToast } from '../context/ToastContext'

const Toast = ({ toast }) => {
  const { removeToast } = useToast()

  const getTypeStyles = (type) => {
    switch (type) {
      case 'success':
        return 'bg-gradient-to-r from-green-500 to-emerald-500 text-white border-green-600 shadow-green-500/25'
      case 'error':
        return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-red-600 shadow-red-500/25'
      case 'warning':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-600 shadow-yellow-500/25'
      default:
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-600 shadow-blue-500/25'
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✕'
      case 'warning':
        return '⚠'
      default:
        return 'ℹ'
    }
  }

  return (
    <div className={`flex items-center p-4 mb-3 rounded-2xl border shadow-xl max-w-sm backdrop-blur-sm ${getTypeStyles(toast.type)} animate-fade-in`}>
      <span className="text-lg mr-3 font-bold">{getIcon(toast.type)}</span>
      <span className="flex-1 text-sm font-medium">{toast.message}</span>
      <button
        onClick={() => removeToast(toast.id)}
        className="ml-3 text-lg hover:opacity-75 transition-opacity font-bold"
      >
        ×
      </button>
    </div>
  )
}

const ToastContainer = () => {
  const { toasts } = useToast()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  )
}

export default ToastContainer
