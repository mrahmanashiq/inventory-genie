import { Button, Modal, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import {
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlinePlusCircle,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';

import { useDeleteUser, useEditUser, useGetUsers } from '../../hooks/useUsers';
import AddNewAdmin from './AddNewAdmin';

export default function ManageAdmin() {
	const [userId, setUserId] = useState(null);
	const [
		openedDeleteModal,
		{ open: openDeleteModal, close: closeDeleteModal },
	] = useDisclosure(false);
	const [openedEditModal, { open: openEditModal, close: closeEditModal }] =
		useDisclosure(false);
	const [openedAddModal, { open: openAddModal, close: closeAddModal }] =
		useDisclosure(false);

	const {
		data: usersData,
		error: usersError,
		mutate: mutateUsers,
	} = useGetUsers();
	const users = usersData?.users || [];

	const deleteUserMutation = useDeleteUser();
	const editUserMutation = useEditUser();

	const itemsPerPage = 5;
	const totalPages = Math.ceil(users.length / itemsPerPage);

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => prevPage - 1);
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const [searchQuery, setSearchQuery] = useState('');
	const [currentPage, setCurrentPage] = useState(1);
	const navigate = useNavigate();

	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset current page when search query changes
	};

	const handleDeleteUser = async (userId) => {
		try {
			await deleteUserMutation.mutateAsync(userId);
			// Remove the deleted user from the users list
			mutateUsers((prevData) => ({
				...prevData,
				users: prevData.users.filter((user) => user.id !== userId),
			}));
			closeDeleteModal(); // Close the modal after successful deletion
		} catch (error) {
			console.log(error);
		}
	};

	if (usersError) {
		return <div>Failed to load users</div>;
	}

	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleAddProduct = () => {
		setUserId(null); // Reset the userId
		openAddModal();
	};

	return (
		<div className="container mx-auto mt-4">
			<div className="flex mt-2">
				<div className="flex justify-start">
					<button
						className="flex items-center px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
						onClick={handleAddProduct}
					>
						<AiOutlinePlusCircle size={20} className="mr-2" />
						Add an Admin
					</button>
				</div>

				<div className="flex-grow"></div>

				<input
					type="text"
					placeholder="Search Admin"
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
							<th className="px-6 py-3 text-left">ID</th>
							<th className="px-6 py-3 text-left">Name</th>
							<th className="px-6 py-3 text-left">Email</th>
							<th className="px-6 py-3 text-left">Role</th>
							<th className="px-6 py-3 text-left">Permissions</th>
							<th className="px-6 py-3 text-left">Action</th>
						</tr>
					</thead>
					<tbody className="text-sm font-light text-gray-600">
						{filteredUsers.map((user, index) => (
							<tr
								key={user._id}
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
										{user.name}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{user.email}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{user.role}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="text-sm font-medium text-gray-900">
										{user.permissions}
									</div>
								</td>
								<td className="px-6 py-3 text-left whitespace-nowrap">
									<div className="flex items-center space-x-4 text-sm font-medium">
										<button
											className="text-indigo-600 hover:text-indigo-900"
											onClick={() => {
												setUserId(user.id);
												openEditModal();
											}}
										>
											<AiOutlineEdit size={25} />
										</button>
										<button
											className="text-red-600 hover:text-red-900"
											onClick={() => {
												setUserId(user._id);
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
						Delete User
					</Text>
					<Text size="sm" className="mb-6">
						Are you sure you want to delete this user?
					</Text>
					<div className="flex justify-end">
						<Button
							onClick={() => handleDeleteUser(userId)}
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
				{/* <EditUser userId={userId} /> */}
			</Modal>

			<Modal
				opened={openedAddModal}
				onClose={closeAddModal}
				size="md"
				shadow="md"
			>
				<AddNewAdmin />
			</Modal>
		</div>
	);
}
