import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { addUserApi, deleteUserApi, editUserApi, getUsersApi } from '../apis/user.api';

export const useGetUsers = () => {
	return useQuery(['users'], getUsersApi, {
		refetchOnWindowFocus: false,
		refetchOnReconnect: false,
		retry: 1,
		staleTime: 1000 * 60 * 60 * 24,

		select: (data) => {
			const users = data?.data?.data?.users || [];
			const totalCount = data?.data?.data?.totalCount || 0;

			return { users, totalCount };
		},
	});
};

export const useDeleteUser = () => {
	const queryClient = useQueryClient();

	return useMutation(deleteUserApi, {
		onSuccess: () => {
			queryClient.invalidateQueries('users');
		},
	});
};

export const useEditUser = () => {
	const queryClient = useQueryClient();

	return useMutation(editUserApi, {
		onSuccess: () => {
			queryClient.invalidateQueries('users');
		},
	});
};

export const useAddUser = () => {
	const queryClient = useQueryClient();

	return useMutation(addUserApi, {
		onSuccess: () => {
			queryClient.invalidateQueries('users');
		},
	});
};
