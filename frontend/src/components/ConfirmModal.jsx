import { useModal } from '../hooks/useModal'

const ConfirmModal = () => {
  const { confirmModal, hideConfirm } = useModal()

  if (!confirmModal) return null
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-black/60 via-purple-900/30 to-blue-900/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="fixed inset-0" onClick={hideConfirm}></div>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 z-10 shadow-2xl border border-blue-100 relative transform transition-all duration-300 scale-100 hover:scale-[1.02]">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar acción</h3>
        <p className="text-gray-600 mb-6">{confirmModal.message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={confirmModal.onCancel}
            className="px-6 py-3 text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={confirmModal.onConfirm}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 font-medium shadow-lg"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
