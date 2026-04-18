import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useConfirm } from '../hooks/useModal';
import { useUpsertReview, useDeleteReview } from '../hooks/useReviews';

const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  comment: z
    .string()
    .trim()
    .min(1, 'Escribe un comentario')
    .max(1000, 'Máximo 1000 caracteres'),
});

const DEFAULTS = { rating: 5, comment: '' };

export default function ReviewForm({ hostId, onSubmit, existingReview }) {
  const confirm = useConfirm();
  const upsertReview = useUpsertReview(hostId);
  const deleteReview = useDeleteReview(hostId);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: DEFAULTS,
  });

  useEffect(() => {
    if (existingReview) {
      reset({
        rating: existingReview.rating,
        comment: existingReview.comment,
      });
    }
  }, [existingReview, reset]);

  const submitReview = async (values) => {
    await upsertReview.mutateAsync(values);
    onSubmit?.();
  };

  const handleDelete = async () => {
    if (!existingReview) return;
    const confirmed = await confirm('¿Estás seguro de que quieres eliminar tu reseña?');
    if (!confirmed) return;

    await deleteReview.mutateAsync(existingReview.id);
    onSubmit?.();
  };

  const busy = isSubmitting || upsertReview.isPending || deleteReview.isPending;

  return (
    <form onSubmit={handleSubmit(submitReview)} className="space-y-4 mb-8" noValidate>
      <div>
        <label htmlFor="review-rating" className="block mb-1 font-semibold">
          Puntuación:
        </label>
        <select
          id="review-rating"
          className="border p-2 rounded"
          {...register('rating')}
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {'★'.repeat(n)}{'☆'.repeat(5 - n)}
            </option>
          ))}
        </select>
        {errors.rating && (
          <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="review-comment" className="block mb-1 font-semibold">
          Comentario:
        </label>
        <textarea
          id="review-comment"
          className="w-full border p-2 rounded"
          rows="4"
          {...register('comment')}
        />
        {errors.comment && (
          <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="submit"
          disabled={busy}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {existingReview ? 'Actualizar reseña' : 'Enviar reseña'}
        </button>

        {existingReview && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            className="text-red-600 hover:underline text-sm disabled:opacity-50"
          >
            Eliminar reseña
          </button>
        )}
      </div>
    </form>
  );
}
