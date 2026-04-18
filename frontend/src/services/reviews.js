import api from '../lib/axios';

export const reviewsApi = {
  listForHost: (hostId) =>
    api.get(`/cuidadores/${hostId}/reviews`).then((r) => r.data),

  upsert: (hostId, payload) =>
    api.post(`/cuidadores/${hostId}/reviews`, payload).then((r) => r.data),

  remove: (id) => api.delete(`/reviews/${id}`).then((r) => r.data),
};
