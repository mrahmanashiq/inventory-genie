import { useQuery, useMutation } from '@tanstack/react-query';

import {
	getCustomersApi,
	getSingleCustomerApi,
	updateCustomerApi,
	addCustomerApi,
	deleteCustomerApi,
	getTopSixCustomersApi,
} from '../apis/customer.apis.js';

export const useGetCustomers = () => {
	return useQuery(['customers'], getCustomersApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const customers = data?.data?.data?.customers || [];
			const totalCount = data?.data?.data?.totalCount || 0;

			return { customers, totalCount };
		},
	});
};

export const useGetSingleCustomer = (id) => {
	return useQuery(['getSingleCustomer', id], () => getSingleCustomerApi(id), {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const customer = data?.data?.data?.customer || {};

			return { customer };
		},
	});
};

export const useUpdateCustomer = () => {
	return useMutation((data) => updateCustomerApi(data));
};

export const useAddCustomer = () => {
	return useMutation((data) => addCustomerApi(data));
};

export const useDeleteCustomer = () => {
	return useMutation((id) => deleteCustomerApi(id));
};

export const useGetTopSixCustomers = () => {
	return useQuery(['getTopSixCustomers'], getTopSixCustomersApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,
		select: (data) => {
			const customers = data?.data?.data?.customers || [];
			return { customers };
		},
	});
};
