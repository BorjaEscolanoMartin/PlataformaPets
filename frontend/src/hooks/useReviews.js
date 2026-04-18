import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reviewsApi } from '../services/reviews';

export function useHostReviews(hostId) {
  return useQuery({
    queryKey: ['reviews', hostId],
    queryFn: () => reviewsApi.listForHost(hostId),
    enabled: !!hostId,
  });
}

export function useUpsertReview(hostId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => reviewsApi.upsert(hostId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', hostId] });
      qc.invalidateQueries({ queryKey: ['cuidador', hostId] });
    },
  });
}

export function useDeleteReview(hostId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => reviewsApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reviews', hostId] });
      qc.invalidateQueries({ queryKey: ['cuidador', hostId] });
    },
  });
}
