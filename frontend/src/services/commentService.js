import api from './api';

export const getComments = (params) => api.get('/comments', { params });
export const addComment = (data) => api.post('/comments', data);
export const updateComment = (id, data) => api.put(`/comments/${id}`, data);
export const deleteComment = (id) => api.delete(`/comments/${id}`);
export const getAllComments = () => api.get('/comments/admin/all');
