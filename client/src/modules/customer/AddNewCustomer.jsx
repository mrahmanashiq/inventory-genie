import { useState } from 'react';
import { toast } from 'react-toastify';
import { addCustomerApi } from '../../apis/customer.apis';
import { useGetCustomers } from '../../hooks/useCustomers';

const AddNewCustomer = ({ onClose }) => {
	const { mutate } = useGetCustomers();
	const [customerData, setCustomerData] = useState({
		name: '',
		email: '',
		phone: '',
		address: '',
	});

	const handleChange = (e) => {
		setCustomerData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await addCustomerApi(customerData);

			// Display toast message on success
			toast.success('Customer added successfully!', {
				position: toast.POSITION.TOP_RIGHT,
			});

			// Close the modal
			onClose();

			// Update the customer table in real-time by re-fetching the customers
			mutate(async (data) => {
				// Make a shallow copy of the data array
				const newData = [...data];

				// Add the newly created customer to the copy
				newData.push(response.data);

				return newData;
			});
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container mx-auto">
			<h2 className="mb-4 text-2xl font-bold text-center">
				Add New Customer
			</h2>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label
						htmlFor="name"
						className="block text-sm font-medium text-gray-700"
					>
						Name:
					</label>
					<input
						type="text"
						id="name"
						name="name"
						value={customerData.name}
						onChange={handleChange}
						className="mt-1 p-2 border border-gray-300 rounded-md w-full"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email:
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={customerData.email}
						onChange={handleChange}
						className="mt-1 p-2 border border-gray-300 rounded-md w-full"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="phone"
						className="block text-sm font-medium text-gray-700"
					>
						Phone:
					</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						value={customerData.phone}
						onChange={handleChange}
						className="mt-1 p-2 border border-gray-300 rounded-md w-full"
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="address"
						className="block text-sm font-medium text-gray-700"
					>
						Address:
					</label>
					<input
						type="text"
						id="address"
						name="address"
						value={customerData.address}
						onChange={handleChange}
						className="mt-1 p-2 border border-gray-300 rounded-md w-full"
					/>
				</div>

				<hr />

				<button
					type="submit"
					className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mt-2"
				>
					Add Customer
				</button>
			</form>
		</div>
	);
};

export default AddNewCustomer;
