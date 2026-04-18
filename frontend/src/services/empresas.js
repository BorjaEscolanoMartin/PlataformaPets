import api from '../lib/axios';

export const empresasApi = {
  list: () => api.get('/empresas').then((r) => r.data),
};
