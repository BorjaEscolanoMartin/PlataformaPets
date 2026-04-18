import { useQuery } from '@tanstack/react-query';
import { cuidadoresApi } from '../services/cuidadores';

export function useCuidadores(params) {
  return useQuery({
    queryKey: ['cuidadores', 'list', params],
    queryFn: () => cuidadoresApi.search(params),
  });
}

export function useCuidador(id) {
  return useQuery({
    queryKey: ['cuidador', id],
    queryFn: () => cuidadoresApi.get(id),
    enabled: !!id,
  });
}
