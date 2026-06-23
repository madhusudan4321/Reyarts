import api from './api';

export const getFavorites = () => api.get('/favorites');
export const addFavorite = (artworkId) => api.post('/favorites', { artworkId });
export const removeFavorite = (artworkId) => api.delete(`/favorites/${artworkId}`);
export const checkFavorite = (artworkId) => api.get(`/favorites/check/${artworkId}`);
