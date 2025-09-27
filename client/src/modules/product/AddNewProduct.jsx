import { Button, MultiSelect } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createProductApi } from '../../apis/product.apis';
// import { useGetProducts } from '../../hooks/useProducts';

const AddNewProduct = ({ closeModal }) => {
	//   const { mutate } = useGetProducts();
	const queryClient = useQueryClient();

	const [productData, setProductData] = useState({
		name: '',
		description: '',
		price: '',
		category: [],
		variants: [],
		discount: 0,
		company: '',
		images: [],
		stock: 1,
	});

	const handleImageChange = (e) => {
		const files = e.target.files;
		const imagesArray = Array.from(files);
		setProductData((prevData) => ({
			...prevData,
			images: imagesArray,
		}));
	};

	const handleChange = (e) => {
		let value = e.target.value;

		if (e.target.name === 'discount') {
			value = Math.max(0, parseInt(value)); // Ensure the discount value is not less than 0
		}

		if (e.target.name === 'stock') {
			value = Math.max(1, parseInt(value)); // Ensure the stock value is not less than 1
		}

		setProductData((prevData) => ({
			...prevData,
			[e.target.name]: value,
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Check if the "Name" field is empty
		if (productData.name.trim() === '') {
			// Display an error message or perform necessary validation handling
			console.log('Name is required');
			return;
		}

		try {
			const formData = new FormData();

			// Append the product data fields to the formData object
			formData.append('name', productData.name);
			formData.append('description', productData.description);
			formData.append('price', productData.price);
			formData.append('category', JSON.stringify(productData.category));
			formData.append('variants', JSON.stringify(productData.variants));
			formData.append('discount', productData.discount);
			formData.append('company', productData.company);
			formData.append('stock', productData.stock);

			// Append each image file to the formData object
			for (const image of productData.images) {
				formData.append('images', image);
			}

			await createProductApi(formData);

			// Display toast message on success
			toast.success('Product added successfully!', {
				position: toast.POSITION.TOP_RIGHT,
			});

			// // Update the product table in real-time by re-fetching the products
			// mutate((data) => {
			// 	// Make a shallow copy of the data array
			// 	const newData = [...data];

			// 	// Add the newly created product to the copy
			// 	newData.push(response.data);

			// 	// Sort the array based on the creation date in descending order
			// 	newData.sort(
			// 		(a, b) => new Date(b.createdAt) - new Date(a.createdAt)
			// 	);

			// 	return newData;
			// });

			// Invalidate the query to update the UI
			queryClient.invalidateQueries('products');

			// Close the modal
			closeModal();
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="p-5">
			<h1 className="mb-4 text-2xl font-bold text-center">
				Add a new product
			</h1>

			<div>
				<form onSubmit={handleSubmit}>
					<div className="mb-3">
						<label htmlFor="name">Name</label>
						<input
							type="text"
							name="name"
							onChange={handleChange}
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="description">Description</label>
						<input
							type="text"
							name="description"
							onChange={handleChange}
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="price">Price</label>
						<input
							type="number"
							name="price"
							onChange={handleChange}
							min="1" // Minimum value is 1
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<MultiSelect
							label="Category"
							data={[]}
							placeholder="Shirt, Panjabi"
							searchable
							creatable
							getCreateLabel={(query) => `+ ${query}`}
							onCreate={(query) => {
								return { value: query, label: query };
							}}
							onChange={(e) => {
								setProductData((prev) => ({
									...prev,
									category: e,
								}));
							}}
						/>
					</div>

					<div className="mb-3">
						<MultiSelect
							label="Variants"
							data={[]}
							placeholder="S, M, L"
							searchable
							creatable
							getCreateLabel={(query) => `+ ${query}`}
							onCreate={(query) => {
								return { value: query, label: query };
							}}
							onChange={(e) => {
								setProductData((prev) => ({
									...prev,
									variants: e,
								}));
							}}
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="discount">Discount</label>
						<input
							type="number"
							name="discount"
							onChange={handleChange}
							min="0" // Minimum value is 0
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="company">Company</label>
						<input
							type="text"
							name="company"
							onChange={handleChange}
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<label htmlFor="stock">Stocks</label>
						<input
							type="number"
							name="stock"
							onChange={handleChange}
							min="1" // Minimum value is 1
							className="w-full px-2 py-1 border border-gray-300 rounded"
						/>
					</div>

					<div className="mb-3">
						<label
							htmlFor="images"
							className="block mb-1 font-medium text-gray-700"
						>
							Images
						</label>
						<input
							type="file"
							name="images"
							multiple
							accept="image/*"
							onChange={handleImageChange} // Use the handleImageChange function to handle image uploads
							className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
						/>
						<p className="text-xs text-gray-500">
							Upload image files only
						</p>
					</div>

					<hr />

					<div>
						<Button
							type="submit"
							className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:shadow-outline"
						>
							Save
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default AddNewProduct;
