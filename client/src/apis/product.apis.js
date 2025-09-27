import { API_CLIENT } from './axios';

export const getProductsApi = async () => API_CLIENT.get('/products');
export const getSingleProductApi = async (id) =>
	API_CLIENT.get(`/products/${id}/single`);

export const createProductApi = async (formData) =>
	API_CLIENT.post('/products', formData);

export const updateProductApi = async ({ id, data }) =>
	API_CLIENT.put(`/products/${id}`, data);

export const getTopSixProductsApi = async (month) => {
	const monthData = month ? `?month=${month}` : '';

	return API_CLIENT.get(`/top-six-products${monthData}`);
};

export const yearlySellReportApi = async () => API_CLIENT.get(`/sell-report`);

export const sellProductsApi = async (data) =>
	API_CLIENT.post('/product-sells', data);
