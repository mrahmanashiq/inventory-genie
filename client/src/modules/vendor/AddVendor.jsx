import { Button, Text } from '@mantine/core';
import React, { useState } from 'react';
import { addVendorApi } from '../../apis/vendor.apis';

export const AddVendor = ({ onClose, onSuccess }) => {
	const [formData, setFormData] = useState({
		agentName: '',
		companyName: '',
		email: '',
		phone: '',
	});
	const [loading, setLoading] = useState(false);

	const handleChange = (e) => {
		setFormData((prevFormData) => ({
			...prevFormData,
			[e.target.name]: e.target.value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			// Make an API call to add a new vendor
			await addVendorApi(formData);

			// Call the onSuccess callback to trigger any necessary actions
			onSuccess();

			// Close the Add Vendor modal
			onClose();
		} catch (error) {
			console.log(error);
			// Handle error case or show a notification
		}

		setLoading(false);
	};

	return (
		<div className="p-6">
			<Text size="lg" weight="bold" className="mb-6 text-center">
				Add Vendor
			</Text>
			<form onSubmit={handleSubmit}>
				<div className="mb-4">
					<label htmlFor="agentName" className="block mb-1 text-sm">
						Agent Name
					</label>
					<input
						type="text"
						id="agentName"
						name="agentName"
						value={formData.agentName}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="companyName" className="block mb-1 text-sm">
						Company Name
					</label>
					<input
						type="text"
						id="companyName"
						name="companyName"
						value={formData.companyName}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="email" className="block mb-1 text-sm">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						value={formData.email}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
					/>
				</div>
				<div className="mb-4">
					<label htmlFor="phone" className="block mb-1 text-sm">
						Phone
					</label>
					<input
						type="text"
						id="phone"
						name="phone"
						value={formData.phone}
						onChange={handleChange}
						required
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none"
					/>
				</div>
				<div className="flex justify-end">
					<Button
						type="submit"
						loading={loading}
						disabled={loading}
						color="blue"
						className="mr-2 text-slate-600 hover:text-slate-50"
					>
						Save
					</Button>
					<Button
						onClick={onClose}
						disabled={loading}
						variant="outline"
					>
						Cancel
					</Button>
				</div>
			</form>
		</div>
	);
};
