import api from '../lib/axios';

const buildSearch = (params = {}) => {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value == null || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        if (v != null && v !== '') sp.append(key, v);
      });
    } else {
      sp.append(key, value);
    }
  });
  return sp.toString();
};

export const cuidadoresApi = {
  search: (params = {}) => {
    const qs = buildSearch(params);
    return api.get(`/cuidadores${qs ? `?${qs}` : ''}`).then((r) => r.data);
  },

  get: (id) => api.get(`/cuidadores/${id}`).then((r) => r.data),
};
