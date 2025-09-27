import { useMutation, useQuery } from '@tanstack/react-query';

import {
    addVendorApi,
    getSingleVendorApi,
    getVendorsApi,
    updateVendorApi,
} from '../apis/vendor.apis.js';

export const useGetVendors = () => {
  return useQuery(['vendors'], getVendorsApi, {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 60 * 24,
    select: (data) => {
      const vendors = data?.data?.data?.vendors || [];
      const totalCount = data?.data?.data?.totalCount || 0;
      return { vendors, totalCount };
    },
  });
};

export const useGetSingleVendor = (id) => {
  return useQuery(['vendor', id], () => getSingleVendorApi(id), {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
    staleTime: 1000 * 60 * 60 * 24,
    select: (data) => {
      const vendor = data?.data?.data?.vendor || {};
      return { vendor };
    },
  });
};

export const useUpdateVendor = () => {
  return useMutation((data) => updateVendorApi(data));
};

export const useAddVendor = () => {
  return useMutation((data) => addVendorApi(data));
};