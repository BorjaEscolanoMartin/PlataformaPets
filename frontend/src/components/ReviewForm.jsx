import { useState, useEffect } from 'react'
import api from '../lib/axios'
import { useConfirm } from '../hooks/useModal'

export default function ReviewForm({ hostId, onSubmit, existingReview }) {
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const confirm = useConfirm()

  useEffect(() => {
    if (existingReview) {
      setRating(existingReview.rating)
      setComment(existingReview.comment)
    }
  }, [existingReview])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post(`/cuidadores/${hostId}/reviews`, {
        rating,
        comment,      })
      onSubmit()
    } catch {
      // Error sending review
    } finally {
      setLoading(false)
    }
  }
  const handleDelete = async () => {
    if (!existingReview) return
    const confirmed = await confirm('¿Estás seguro de que quieres eliminar tu reseña?')
    if (!confirmed) return

    setLoading(true)
    try {
      await api.delete(`/reviews/${existingReview.id}`)
      onSubmit()
    } catch {
      // Error deleting review
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mb-8">
      <div>
        <label className="block mb-1 font-semibold">Puntuación:</label>
        <select
          value={rating}
          onChange={(e) => setRating(parseInt(e.target.value))}
          className="border p-2 rounded"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block mb-1 font-semibold">Comentario:</label>
        <textarea
          className="w-full border p-2 rounded"
          rows="4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          {existingReview ? 'Actualizar reseña' : 'Enviar reseña'}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="text-red-600 hover:underline text-sm"
          >
            Eliminar reseña
          </button>
        )}
      </div>
    </form>
  )
}

