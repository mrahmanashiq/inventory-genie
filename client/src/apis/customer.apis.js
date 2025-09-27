import { API_CLIENT } from './axios';

export const getCustomersApi = async (value) =>
	API_CLIENT.get(`/customers?value=${value}`);

export const getSingleCustomerApi = async (id) =>
	API_CLIENT.get(`/customers/${id}/single`);

export const updateCustomerApi = async ({ id, data }) =>
	API_CLIENT.put(`/customers/${id}`, data);

export const addCustomerApi = async (data) =>
	API_CLIENT.post('/customers', data);

export const deleteCustomerApi = async (id) =>
	API_CLIENT.delete(`/customers/${id}`);

export const getTopSixCustomersApi = async () =>
	API_CLIENT.get('/top-six-customers');
