import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { petsApi } from '../services/pets';

const PETS_KEY = ['pets'];

export function usePets() {
  return useQuery({
    queryKey: PETS_KEY,
    queryFn: petsApi.list,
  });
}

export function useCreatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: petsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: PETS_KEY }),
  });
}

export function useUpdatePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => petsApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: PETS_KEY }),
  });
}

export function useDeletePet() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: petsApi.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: PETS_KEY }),
  });
}
