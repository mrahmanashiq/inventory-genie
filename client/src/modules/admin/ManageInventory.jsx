import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import {
	AiFillShopping,
	AiOutlineAppstoreAdd,
	AiOutlineArrowDown,
	AiOutlineCloseCircle,
	AiOutlineDelete,
	AiOutlineEdit,
	AiOutlinePlusCircle,
} from 'react-icons/ai';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../../context/products.context';
import { useGetProducts } from '../../hooks/useProducts';
import AddNewProduct from '../product/AddNewProduct';
import { EditProduct } from '../product/EditProduct';
import ProductDetailsModal from '../product/ProductDetailsModal';

export default function Example() {
	//   const [cartItems, setCartItems] = useState([]);
	const [productId, setProductId] = useState(null);
	const [opened, { open, close }] = useDisclosure(false);
	const { addToCart, cart, removeFromCart } = useCart();
	const { data, error } = useGetProducts();
	const navigate = useNavigate();
	const [
		addNewProductOpened,
		{ open: addNewProductOpen, close: addNewProductClose },
	] = useDisclosure(false);
	const [
		productDetailsModal,
		{ open: productDetailsModalOpen, close: productDetailsModalClose },
	] = useDisclosure(false);

	const products = data?.products || [];
	const totalCount = data?.totalCount || 0;

	// Filter out the out-of-stock products
	const outOfStockCount = products.filter(
		(product) => product.stock === 0
	).length;

	// Calculate the total number of categories
	//   const categoriesCount = [
	//     ...new Set(products.map((product) => product.category))
	//   ].length;

	const itemsPerPage = 5; // Number of items to show per page
	const totalPages = Math.ceil(products.length / itemsPerPage);

	const [currentPage, setCurrentPage] = useState(1);
	const [searchQuery, setSearchQuery] = useState('');

	const handlePreviousPage = () => {
		setCurrentPage((prevPage) => prevPage - 1);
	};

	const handleNextPage = () => {
		setCurrentPage((prevPage) => prevPage + 1);
	};

	const productSliceStart = (currentPage - 1) * itemsPerPage;
	const productSliceEnd = currentPage * itemsPerPage;

	const filteredProducts = products.filter((product) =>
		product.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const displayedProducts = filteredProducts.slice(
		productSliceStart,
		productSliceEnd
	);

	const handleSearchInputChange = (event) => {
		setSearchQuery(event.target.value);
		setCurrentPage(1); // Reset current page when search query changes
	};

	if (error) return <div>Failed to load</div>;

	return (
		<>
			<div className="flex mt-2 justify-evenly">
				<div className="box-border rounded flex items-center justify-between h-[100px] w-[250px] p-4 border-4 bg-purple-400">
					<div className="flex items-center">
						<MdProductionQuantityLimits size={36} color="white" />
					</div>
					<div className="text-right">
						<h3 className="text-lg font-bold text-white">
							Total Products
						</h3>
						<span className="text-2xl">{totalCount}</span>
					</div>
				</div>

				<div className="box-border rounded flex items-center justify-between h-[100px] w-[250px] p-4 border-4 bg-green-300">
					<div className="flex items-center">
						<AiOutlineCloseCircle size={36} color="white" />
					</div>
					<div className="text-right">
						<h3 className="text-lg font-bold text-white">
							Out of Stock
						</h3>
						<span className="text-2xl">{outOfStockCount}</span>
					</div>
				</div>

				<div className="box-border rounded flex items-center justify-between h-[100px] w-[250px] p-4 border-4 bg-blue-400">
					<div className="flex items-center">
						<AiOutlineAppstoreAdd size={36} color="white" />
					</div>
					<div className="text-right">
						<h3 className="text-lg font-bold text-white">
							All Categories
						</h3>
						<span className="text-2xl">7</span>
					</div>
				</div>
			</div>

			<div className="container mx-auto mt-4">
				<div className="flex items-center mt-2">
					<div className="flex justify-start">
						<button
							className="flex items-center px-4 py-2 text-gray-600 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
							onClick={() => {
								addNewProductOpen();
							}}
						>
							<AiOutlinePlusCircle size={20} className="mr-2" />
							Add Product
						</button>
					</div>

					<div className="flex-grow"></div>

					<div
						onClick={() => navigate('/cart')}
						className="ml-auto cursor-pointer flex items-center gap-3 rounded-lg bg-gray-200 px-5 py-[9px] h-full"
					>
						<span>
							{cart?.length < 1
								? 'No items in cart'
								: cart?.length}
						</span>{' '}
						<AiFillShopping size={25} />
					</div>
					<input
						type="text"
						placeholder="Search Product"
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
					{products.length === 0 ? (
						<div className="p-4">No products found.</div>
					) : (
						<table className="w-full table-auto">
							<thead>
								<tr className="text-sm leading-normal text-gray-600 uppercase bg-gray-200">
									<th className="px-6 py-3 text-left">ID</th>
									<th className="px-6 py-3 text-left">
										Name
										<AiOutlineArrowDown className="inline-block w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
									</th>
									<th className="px-6 py-3 text-left">
										Description
									</th>
									<th className="px-6 py-3 text-left">
										Price
										<AiOutlineArrowDown className="inline-block w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
									</th>
									<th className="px-6 py-3 text-left">
										Discount
										<AiOutlineArrowDown className="inline-block w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
									</th>
									<th className="px-6 py-3 text-left">
										Stock
										<AiOutlineArrowDown className="inline-block w-4 h-4 ml-1 text-gray-500 cursor-pointer" />
									</th>
									<th className="px-6 py-3 text-center">
										Image
									</th>
									<th className="px-6 py-3 text-center">
										Action
									</th>
								</tr>
							</thead>

							<tbody className="text-sm font-medium text-gray-600">
								{displayedProducts.map((product) => (
									<tr
										key={product.id}
										className="border-b border-gray-200 hover:bg-gray-100"
									>
										<td className="px-6 py-3 text-left whitespace-nowrap">
											<label>
												<input
													type="checkbox"
													className="checkbox"
												/>
											</label>
										</td>
										<td
											className="px-6 py-3 font-medium text-left cursor-pointer hover:underline"
											onClick={() => {
												setProductId(product?._id);
												productDetailsModalOpen();
											}}
										>
											{product.name}
										</td>
										<td className="px-6 py-3 text-left">
											{product.description}
										</td>
										<td className="px-6 py-3 text-left">
											৳{product.price.toFixed(2)}
										</td>
										<td className="px-6 py-3 text-center">
											{product.discount * 100}%
										</td>
										<td className="px-6 py-3 text-center">
											{product.stock}
										</td>
										<td className="px-6 py-3 text-center">
											{!!product.images.length && (
												<img
													className="w-12 h-12 mask mask-squircle"
													src={product.images[0]}
													alt="product_img"
												/>
											)}
										</td>
										<td className="px-4 py-3 text-left">
											<div className="flex space-x-2">
												<button
													className="flex items-center px-4 py-2 ml-4 text-indigo-600 transition-colors bg-gray-200 rounded-md hover:text-indigo-900"
													onClick={() => {
														setProductId(
															product._id
														);
														open();
													}}
													disabled={cart.find(
														(item) =>
															item._id ===
															product._id
													)}
													title="Edit product"
												>
													<AiOutlineEdit size={25} />
												</button>
												<button className="flex items-center px-4 py-2 ml-4 text-red-500 transition-colors bg-gray-200 rounded-md hover:text-red-700">
													<AiOutlineDelete
														size={25}
													/>
												</button>
												{!cart.find(
													(item) =>
														item._id === product._id
												) && (
													<button
														className="flex items-center px-4 py-2 ml-4 text-green-500 transition-colors bg-gray-200 rounded-md hover:text-green-700"
														onClick={() =>
															addToCart(product)
														}
													>
														<AiFillShopping
															size={25}
														/>
													</button>
												)}
												{cart.find(
													(item) =>
														item._id === product._id
												) && (
													<button
														className="flex items-center px-4 py-2 ml-4 text-yellow-500 transition-colors bg-gray-200 rounded-md hover:text-green-700"
														onClick={() =>
															removeFromCart(
																product._id
															)
														}
													>
														<AiFillShopping
															size={25}
														/>
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}

					{/* Pagination */}
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

					<Modal opened={opened} onClose={close}>
						<EditProduct productId={productId} />
					</Modal>

					<Modal
						opened={addNewProductOpened}
						onClose={addNewProductClose}
					>
						<AddNewProduct closeModal={addNewProductClose} />
					</Modal>
					<Modal
						opened={productDetailsModal}
						onClose={productDetailsModalClose}
					>
						<ProductDetailsModal productId={productId} />
					</Modal>
				</div>
			</div>
		</>
	);
}
