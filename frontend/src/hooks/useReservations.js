import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { reservationsApi } from '../services/reservations';

const MINE_KEY = ['reservations', 'mine'];
const HOST_KEY = ['reservations', 'host'];

const sortByDateDesc = (list = []) =>
  [...list].sort((a, b) => {
    if (a.created_at && b.created_at) {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    return b.id - a.id;
  });

export function useMyReservations() {
  return useQuery({
    queryKey: MINE_KEY,
    queryFn: reservationsApi.mine,
    select: sortByDateDesc,
  });
}

export function useHostReservations() {
  return useQuery({
    queryKey: HOST_KEY,
    queryFn: reservationsApi.forHost,
    select: sortByDateDesc,
  });
}

export function useCancelReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.cancel,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

export function useUpdateReservationStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => reservationsApi.updateStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}

export function useCreateReservation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reservationsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reservations'] }),
  });
}
