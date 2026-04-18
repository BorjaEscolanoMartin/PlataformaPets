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

export const petsApi = {
  list: () => api.get('/pets').then((r) => r.data),

  get: (id) => api.get(`/pets/${id}`).then((r) => r.data),

  create: (payload) =>
    api
      .post('/pets', toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  update: (id, payload) =>
    api
      .post(`/pets/${id}?_method=PUT`, toFormData(payload), {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data),

  remove: (id) => api.delete(`/pets/${id}`).then((r) => r.data),
};
