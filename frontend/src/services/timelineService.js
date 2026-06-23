import api from './api';

export const getTimeline = () => api.get('/timeline');
export const createTimelineEvent = (formData) => api.post('/timeline', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateTimelineEvent = (id, formData) => api.put(`/timeline/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteTimelineEvent = (id) => api.delete(`/timeline/${id}`);
