import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlinePlusCircle,
} from 'react-icons/ai';

import { useGetVendors } from '../../hooks/useVendors';
import { AddVendor } from '../vendor/AddVendor';
import { EditVendor } from '../vendor/EditVendor';

export default function ManageVendor() {
	const [vendorId, setVendorId] = useState(null);
	const [
		openedDeleteModal,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
		useDisclosure(false);
	const [openedAddModal, { open: openAddModal, close: closeAddModal }] =
		useDisclosure(false);

	const { data, error, mutate } = useGetVendors(); // Added mutate function
	const vendors = data?.vendors || [];

	console.log(vendors);

	// Pagination
	const itemsPerPage = 5; // Number of items to show per page
	const totalPages = Math.ceil(vendors.length / itemsPerPage);
	const [currentPage, setCurrentPage] = useState(1);

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

	const handleDeleteVendor = async (vendorID) => {

	}

	// Apply pagination
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const paginatedVendors = vendors.slice(startIndex, endIndex);

	return (
		<div className="container mx-auto mt-4">
			<div className="flex mt-2">
					<div className="flex justify-start">
						<button
							className="flex items-center px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
							onClick={openAddModal}
						>
							<AiOutlinePlusCircle size={20} className="mr-2" />
							Add Vendor
						</button>
					</div>

					<div className="flex-grow"></div>

					<input
						type="text"
						placeholder="Search Vendor"
						value={searchQuery}
						onChange={handleSearchInputChange}
						className="justify-end px-4 py-2 ml-4 text-gray-600 transition-colors bg-gray-200 rounded-md focus:outline-none"
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
							<th className="px-4 py-3 text-left">ID</th>
							<th className="px-4 py-3 text-left">Agent Name</th>
							{/* <th className="px-4 py-3 text-left">Company</th> */}
							<th className="px-4 py-3 text-left">Email</th>
							<th className="px-4 py-3 text-left">Phone</th>
							<th className="px-4 py-3 text-left">Action</th>
						</tr>
					</thead>

					{/* Table body */}
					<tbody className="text-sm font-light text-gray-600">
						{paginatedVendors.map((vendor, index) => (
							<tr
								key={vendor.id}
								className="border-b border-gray-200 hover:bg-gray-100"
							>
								<td className="px-4 py-3 text-sm font-medium text-left">
									{index + 1}
								</td>
								<td className="px-4 py-3 text-sm font-medium text-left">
									{vendor.agentName}
								</td>
								{/* <td className="px-4 py-3 text-sm font-medium text-left">
									{vendor.company}
								</td> */}
								<td className="px-4 py-3 text-sm font-medium text-left">
									{vendor.email}
								</td>
								<td className="px-4 py-3 text-sm font-medium text-left">
									{vendor.phone}
								</td>
								<td className="px-4 py-3 text-left">
									<div className="flex space-x-2">
										<button
											className="flex items-center px-4 py-2 ml-4 text-indigo-600 transition-colors bg-gray-200 rounded-md hover:text-indigo-900"
											onClick={() => {
												setVendorId(vendor.id);
												openEditModal();
											}}
										>
											<AiOutlineEdit size={20} />
										</button>

										<button
											className="flex items-center px-4 py-2 ml-4 text-red-500 transition-colors bg-gray-200 rounded-md hover:text-red-700"
											onClick={() => {
												setVendorId(vendor.id);
												openDeleteModal();
											}}
										>
											<AiOutlineDelete size={20} />
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
				opened={openedEditModal}
				onClose={closeEditModal}
				size="md"
				shadow="md"
			>
				<EditVendor vendorId={vendorId} />
			</Modal>

			<Modal
				opened={openedDeleteModal}
				onClose={closeDeleteModal}
				size="md"
				shadow="md"
			>
				<div className="p-6">
					<Text size="lg" weight="bold" className="mb-4">
						Delete Vendor
					</Text>
					<Text size="sm" className="mb-6">
						Are you sure you want to delete this vendor?
					</Text>
					<div className="flex justify-end">
						<Button
							onClick={() => handleDeleteVendor(vendorId)}
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
				opened={openedAddModal}
				onClose={closeAddModal}
				size="md"
				shadow="md"
			>
				<div className="p-6">
					<AddVendor onClose={closeAddModal} onSuccess={mutate} />
				</div>
			</Modal>
		</div>
	);
}
