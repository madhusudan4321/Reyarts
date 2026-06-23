import api from './api';

export const getArtworks = (params) => api.get('/artworks', { params });
export const getArtworkById = (id) => api.get(`/artworks/${id}`);
export const createArtwork = (formData) => api.post('/artworks', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateArtwork = (id, formData) => api.put(`/artworks/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteArtwork = (id) => api.delete(`/artworks/${id}`);
export const toggleLike = (id) => api.post(`/artworks/${id}/like`);
export const getRelatedArtworks = (id) => api.get(`/artworks/${id}/related`);
