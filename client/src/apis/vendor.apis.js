import { API_CLIENT } from './axios';

export const getVendorsApi = async () => API_CLIENT.get('/vendors');

export const getSingleVendorApi = async (id) =>
	API_CLIENT.get(`/vendors/${id}/single`);

export const updateVendorApi = async ({ id, data }) =>
	API_CLIENT.put(`/vendors/${id}`, data);

export const addVendorApi = async (data) => API_CLIENT.post('/vendors', data);
