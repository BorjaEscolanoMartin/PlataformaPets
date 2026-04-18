import api from '../lib/axios';

const toFormData = (payload) => {
  const fd = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      fd.append(key, value);
    }
  });
  return fd;
};

export const hostsApi = {
  mine: () => api.get('/hosts').then((r) => r.data),

  get: (id) => api.get(`/hosts/${id}`).then((r) => r.data),

  create: (payload) =>
    api
      .post('/hosts', toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id, payload) =>
    api
      .post(`/hosts/${id}?_method=PUT`, toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  remove: (id) => api.delete(`/hosts/${id}`).then((r) => r.data),

  getServicePrices: (hostId) =>
    api.get(`/hosts/${hostId}/service-prices`).then((r) => r.data),

  updateServicePrices: (hostId, prices) =>
    api
      .post(`/hosts/${hostId}/service-prices`, { prices })
      .then((r) => r.data),
};
