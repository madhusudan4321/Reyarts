import api from './api';

export const getExhibitions = (params) => api.get('/exhibitions', { params });
export const getExhibitionById = (id) => api.get(`/exhibitions/${id}`);
export const createExhibition = (formData) => api.post('/exhibitions', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateExhibition = (id, data) => api.put(`/exhibitions/${id}`, data);
export const deleteExhibition = (id) => api.delete(`/exhibitions/${id}`);
