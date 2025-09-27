import { API_CLIENT } from './axios';

export const getUsersApi = async () => API_CLIENT.get('/users');
export const deleteUserApi = async (userId) => API_CLIENT.delete(`/user/${userId}`);
export const editUserApi = async (userId, userData) => API_CLIENT.put(`/user/${userId}`, userData);
export const addUserApi = async (userData) => API_CLIENT.post('/auth/registration', userData);
