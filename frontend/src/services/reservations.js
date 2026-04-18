import api from '../lib/axios';

export const reservationsApi = {
  mine: () => api.get('/reservations').then((r) => r.data),

  forHost: () => api.get('/reservations/host').then((r) => r.data),

  create: (payload) => api.post('/reservations', payload).then((r) => r.data),

  updateStatus: (id, status) =>
    api.put(`/reservations/${id}`, { status }).then((r) => r.data),

  cancel: (id) => api.patch(`/reservations/${id}/cancel`).then((r) => r.data),
};
