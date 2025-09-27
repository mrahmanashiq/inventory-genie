import { useState } from 'react';
import { toast } from 'react-toastify';
import { addUserApi } from '../../apis/user.api';

const AddNewAdmin = ({ onClose }) => {
	const [adminData, setAdminData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		role: 'admin',
		permissions: [],
	});

	const handleChange = (e) => {
		setAdminData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await addUserApi(adminData);

			// Display toast message on success
			toast.success('Admin added successfully!', {
				position: toast.POSITION.TOP_RIGHT,
			});

			// Close the modal
			onClose();
		} catch (error) {
			console.log(error);
			toast.error('Failed to add admin. Please try again.', {
				position: toast.POSITION.TOP_RIGHT,
			});
		}
	};

	return (
		<div className="container mx-auto">
			<h2 className="mb-4 text-2xl font-bold text-center">
				Add New Admin
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
						value={adminData.name}
						onChange={handleChange}
						className="w-full p-2 mt-1 border border-gray-300 rounded-md"
						required
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
						value={adminData.email}
						onChange={handleChange}
						className="w-full p-2 mt-1 border border-gray-300 rounded-md"
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700"
					>
						Password:
					</label>
					<input
						type="password"
						id="password"
						name="password"
						value={adminData.password}
						onChange={handleChange}
						className="w-full p-2 mt-1 border border-gray-300 rounded-md"
						required
					/>
				</div>

				<div className="mb-4">
					<label
						htmlFor="confirmPassword"
						className="block text-sm font-medium text-gray-700"
					>
						Confirm Password:
					</label>
					<input
						type="password"
						id="confirmPassword"
						name="confirmPassword"
						value={adminData.confirmPassword}
						onChange={handleChange}
						className="w-full p-2 mt-1 border border-gray-300 rounded-md"
						required
					/>
				</div>

				<hr />

				<button
					type="submit"
					className="px-4 py-2 mt-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
				>
					Add Admin
				</button>
			</form>
		</div>
	);
};

export default AddNewAdmin;
