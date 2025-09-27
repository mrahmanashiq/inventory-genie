import { useQuery } from '@tanstack/react-query';
import {
	getProductsApi,
	getSingleProductApi,
	getTopSixProductsApi,
	yearlySellReportApi,
	createProductApi,
} from '../apis/product.apis';

export const useGetProducts = () => {
	return useQuery(['products'], getProductsApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const products = data?.data?.data?.products || [];
			const totalCount = data?.data?.data?.totalCount || 0;

			return { products, totalCount };
		},
	});
};

export const useGetSingleProduct = (id) => {
	return useQuery(['getSingleProduct', id], () => getSingleProductApi(id), {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const product = data?.data?.data?.product || {};

			return { product };
		},
	});
};

export const useAddProduct = () => {
	return useQuery(['addProduct'], createProductApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,
	});
};

export const useTopSixProducts = (month) => {
	console.log(month);

	return useQuery(['topSixProducts'], () => getTopSixProductsApi(month), {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			console.log(data);

			const products = data?.data?.data?.products || [];

			return { products };
		},
	});
};

export const useYearlySellReport = () => {
	return useQuery(['yearlySellReport'], yearlySellReportApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const report = data?.data?.data?.report || [];

			return { report };
		},
	});
};
