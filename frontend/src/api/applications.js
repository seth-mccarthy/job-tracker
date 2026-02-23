import api from './axios';

export const getAll = () => api.get('/api/applications');
export const getById = (id) => api.get(`/api/applications/${id}`);
export const create = (data) => api.post('/api/applications', data);
export const update = (id, data) => api.put(`/api/applications/${id}`, data);
export const remove = (id) => api.delete(`/api/applications/${id}`);
export const getAnalytics = () => api.get('/api/applications/analytics');