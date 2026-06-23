import api from './api';

export const getBlogs = (params) => api.get('/blogs', { params });
export const getBlogById = (id) => api.get(`/blogs/${id}`);
export const createBlog = (formData) => api.post('/blogs', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, formData) => api.put(`/blogs/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);
