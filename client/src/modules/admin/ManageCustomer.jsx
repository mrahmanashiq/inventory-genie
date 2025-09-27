import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlinePlusCircle,
} from 'react-icons/ai';

import { useDeleteCustomer, useGetCustomers } from '../../hooks/useCustomers';
import AddNewCustomer from '../customer/AddNewCustomer';
import { EditCustomer } from '../customer/EditCustomer';

export default function Example() {
	const [customerId, setCustomerId] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5; // Number of items to show per page

	const [
		openedDeleteModal,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
		useDisclosure(false);
	const [
		addNewCustomerOpened,
		{ open: addNewCustomerOpen, close: addNewCustomerClose },
	] = useDisclosure(false);
	const { data, error } = useGetCustomers();
	const customers = data?.customers || [];
	const deleteCustomer = useDeleteCustomer();

	const totalPages = Math.ceil(customers.length / itemsPerPage);

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => prevPage - 1);
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const [searchQuery, setSearchQuery] = useState('');

	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;

	const displayedCustomers = customers
		.filter((customer) =>
			customer.name.toLowerCase().includes(searchQuery.toLowerCase())
		)
		.slice(startIndex, endIndex);

	if (error) return <div>failed to load</div>;

	const handleDeleteCustomer = async (customerId) => {
		try {
			await deleteCustomer.mutateAsync(customerId);
			closeDeleteModal();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="container mx-auto mt-4">
			<div className="flex mt-2">
				<div className="flex justify-start mt-2">
					<button
						className="flex items-center px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
						onClick={() => {
							addNewCustomerOpen();
						}}
					>
						<AiOutlinePlusCircle size={20} className="mr-2" />
						Add Customer
					</button>
				</div>

				<div className="flex-grow"></div>

				<input
					type="text"
					placeholder="Search Customer..."
					value={searchQuery}
					onChange={handleSearchInputChange}
					className="ustify-end px-4 py-2 ml-4 text-gray-600 transition-colors bg-gray-200 rounded-md focus:outline-none"
				/>
				<button
					className="flex items-center px-4 py-2 ml-2 text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
					onClick={() => setSearchQuery('')}
				>
					Clear
				</button>
			</div>

			<div className="my-6 bg-white rounded shadow-md">
				<table className="w-full table-auto">
					<thead>
						<tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
							<th className="px-6 py-3 text-left">ID</th>
							<th className="px-6 py-3 text-left">Name</th>
							<th className="px-6 py-3 text-left">Email</th>
							<th className="px-6 py-3 text-left">Phone</th>
							<th className="px-6 py-3 text-left">Address</th>
							<th className="px-6 py-3 text-left">Action</th>
						</tr>
					</thead>
					<tbody className="text-sm font-light text-gray-600">
						{displayedCustomers.map((customer, index) => (
							<tr
								key={customer._id}
								className="border-b border-gray-200 hover:bg-gray-100"
							>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="flex items-center">
										<div className="ml-4">
											<div className="text-sm font-medium text-gray-900">
												{index + 1}
											</div>
										</div>
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{customer.name}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{customer.email}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{customer.phone}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{customer.address}
									</div>
								</td>
								<td className="px-4 py-3 text-left whitespace-nowrap">
									<div className="flex items-center space-x-4 text-sm font-medium">
										<button
											className="flex items-center px-4 py-2 ml-4 text-indigo-600 transition-colors bg-gray-200 rounded-md hover:text-indigo-900"
											onClick={() => {
												setCustomerId(customer._id);
												openEditModal();
											}}
										>
											<AiOutlineEdit size={25} />
										</button>
										<button
											className="flex items-center px-4 py-2 ml-4 text-red-600 transition-colors bg-gray-200 rounded-md hover:text-red-900"
											onClick={() => {
												setCustomerId(customer._id);
												openDeleteModal();
											}}
										>
											<AiOutlineDelete size={25} />
										</button>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{totalPages > 1 && (
					<div className="flex items-center justify-center py-4">
						<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
							disabled={currentPage === 1}
							onClick={handlePreviousPage}
						>
							Previous
						</button>
						<div className="px-4 py-2 text-sm font-medium text-gray-700">
							Page {currentPage} of {totalPages}
						</div>
						<button
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none"
							disabled={currentPage === totalPages}
							onClick={handleNextPage}
						>
							Next
						</button>
					</div>
				)}
			</div>

			<Modal
				opened={openedDeleteModal}
				onClose={closeDeleteModal}
				size="md"
				shadow="md"
			>
				<div className="p-6">
					<Text size="lg" weight="bold" className="mb-4">
						Delete Customer
					</Text>
					<Text size="sm" className="mb-6">
						Are you sure you want to delete this customer?
					</Text>
					<div className="flex justify-end">
						<Button
							onClick={() => handleDeleteCustomer(customerId)}
							color="red"
							className="mr-2 text-black"
						>
							Yes
						</Button>
						<Button onClick={closeDeleteModal} variant="outline">
							No
						</Button>
					</div>
				</div>
			</Modal>

			<Modal
				opened={openedEditModal}
				onClose={closeEditModal}
				size="md"
				shadow="md"
			>
				<EditCustomer customerId={customerId} />
			</Modal>

			<Modal opened={addNewCustomerOpened} onClose={addNewCustomerClose}>
				<AddNewCustomer onClose={addNewCustomerClose} />
			</Modal>
		</div>
	);
}
