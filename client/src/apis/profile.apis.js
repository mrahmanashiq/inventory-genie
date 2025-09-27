import { API_CLIENT } from './axios';

export const getUserProfileApi = async () => API_CLIENT.get('/user/profile');
