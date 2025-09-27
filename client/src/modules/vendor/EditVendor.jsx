import { Button } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { updateVendorApi } from '../../apis/vendor.apis';
import { useGetSingleVendor } from '../../hooks/useVendors';

export const EditVendor = ({ vendorId }) => {
	const id = vendorId;
	const queryClient = useQueryClient();

	const { data } = useGetSingleVendor(id);
	const vendor = data?.vendor || {};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const vendorData = Object.fromEntries(formData.entries());

		try {
			await updateVendorApi({
				id,
				data: vendorData,
			});

			// Invalidate query
			queryClient.invalidateQueries({ queryKey: ['vendors'] });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="max-w-md p-6 mx-auto my-4 bg-white rounded-md shadow-md">
			<h1 className="mb-4 text-2xl font-bold text-center">Edit Vendor</h1>

			<form onSubmit={handleSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="agentName"
						className="block mb-2 font-semibold text-gray-700"
					>
						Agent Name
					</label>
					<input
						type="text"
						name="agentName"
						id="agentName"
						defaultValue={vendor.agentName}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="companyName"
						className="block mb-2 font-semibold text-gray-700"
					>
						Company Name
					</label>
					<input
						type="text"
						name="companyName"
						id="companyName"
						defaultValue={vendor.companyName}
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
						defaultValue={vendor.email}
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
						type="text"
						name="phone"
						id="phone"
						defaultValue={vendor.phone}
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
