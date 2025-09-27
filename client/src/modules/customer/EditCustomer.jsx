import React from 'react';
import { Button } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { updateCustomerApi } from '../../apis/customer.apis';
import { useGetSingleCustomer } from '../../hooks/useCustomers';

export const EditCustomer = ({ customerId }) => {
	const id = customerId;
	const queryClient = useQueryClient();

	const { data } = useGetSingleCustomer(id);
	const customer = data?.customer || {};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const customerData = Object.fromEntries(formData.entries());

		try {
			await updateCustomerApi({
				id,
				data: customerData,
			});

			// Invalidate query
			queryClient.invalidateQueries('customers');
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="max-w-md p-6 mx-auto my-4 bg-white rounded-md shadow-md">
			<h1 className="mb-4 text-2xl font-bold text-center">Edit Customer</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="name"
						className="block mb-2 font-semibold text-gray-700"
					>
						Name
					</label>
					<input
						type="text"
						name="name"
						id="name"
						defaultValue={customer.name}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="email"
						className="block mb-2 font-semibold text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						name="email"
						id="email"
						defaultValue={customer.email}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="phone"
						className="block mb-2 font-semibold text-gray-700"
					>
						Phone
					</label>
					<input
						type="tel"
						name="phone"
						id="phone"
						defaultValue={customer.phone}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="address"
						className="block mb-2 font-semibold text-gray-700"
					>
						Address
					</label>
					<input
						type="text"
						name="address"
						id="address"
						defaultValue={customer.address}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>

				<div>
					<Button
						type="submit"
						className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
					>
						Update
					</Button>
				</div>
			</form>
		</div>
	);
};
