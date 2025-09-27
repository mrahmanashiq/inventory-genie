import { Button } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import { updateProductApi } from '../../apis/product.apis';
import { useGetSingleProduct } from '../../hooks/useProducts';

export const EditProduct = ({ productId }) => {
	const id = productId;
	const queryClient = useQueryClient();

	const { data } = useGetSingleProduct(id);
	const product = data?.product || {};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData(e.target);
		const productData = Object.fromEntries(formData.entries());

		try {
			await updateProductApi({
				id,
				shopId: product?.shopId,
				data: productData,
			});

			//   invalidate query
			queryClient.invalidateQueries({ queryKey: ['products'] });
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<div className="max-w-md p-6 mx-auto my-4 bg-white rounded-md shadow-md">
			<h1 className="mb-4 text-2xl font-bold text-center">
				Edit Product
			</h1>

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
						defaultValue={product.name}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="description"
						className="block mb-2 font-semibold text-gray-700"
					>
						Description
					</label>
					<input
						type="text"
						name="description"
						id="description"
						defaultValue={product.description}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="price"
						className="block mb-2 font-semibold text-gray-700"
					>
						Price
					</label>
					<input
						type="number"
						name="price"
						id="price"
						defaultValue={product.price}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				{/* category */}
				<div>
					<label
						htmlFor="category"
						className="block mb-2 font-semibold text-gray-700"
					>
						Category
					</label>
					<select
						name="category"
						id="category"
						defaultValue={product.category}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					>
						<option value="electronics">Electronics</option>
						<option value="fashion">Fashion</option>
						<option value="grocery">Grocery</option>
						<option value="beauty">Beauty</option>
						<option value="toys">Toys</option>
						<option value="sports">Sports</option>
						<option value="outdoor">Outdoor</option>
					</select>
				</div>
				<div>
					<label
						htmlFor="stock"
						className="block mb-2 font-semibold text-gray-700"
					>
						Stock
					</label>
					<input
						type="number"
						name="stock"
						id="stock"
						defaultValue={product.stock}
						className="w-full px-3 py-2 leading-tight text-gray-700 border rounded-md focus:outline-none focus:shadow-outline"
					/>
				</div>
				<div>
					<label
						htmlFor="discount"
						className="block mb-2 font-semibold text-gray-700"
					>
						Discount
					</label>
					<input
						type="number"
						name="discount"
						id="discount"
						defaultValue={product.discount}
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
