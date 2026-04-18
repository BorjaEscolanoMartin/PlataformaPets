import { useQuery } from '@tanstack/react-query';
import { empresasApi } from '../services/empresas';

export function useEmpresas() {
  return useQuery({
    queryKey: ['empresas', 'list'],
    queryFn: empresasApi.list,
  });
}
