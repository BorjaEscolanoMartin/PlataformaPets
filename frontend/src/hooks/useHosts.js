import { useQuery } from '@tanstack/react-query';
import { hostsApi } from '../services/hosts';

export function useMyHost() {
  return useQuery({
    queryKey: ['hosts', 'mine'],
    queryFn: hostsApi.mine,
    select: (data) => (Array.isArray(data) && data.length > 0 ? data[0] : null),
  });
}

export function useHostServicePrices(hostId) {
  return useQuery({
    queryKey: ['hosts', hostId, 'service-prices'],
    queryFn: () => hostsApi.getServicePrices(hostId),
    enabled: !!hostId,
  });
}
