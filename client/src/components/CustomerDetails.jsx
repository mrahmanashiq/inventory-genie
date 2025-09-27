import { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getCustomersApi } from '../apis/customer.apis';
import { sellProductsApi } from '../apis/product.apis';
import { useCart } from '../context/products.context';

const CustomerDetails = ({
	setSelectedCustomer,
	totalAmount,
	selectedCustomer,
}) => {
	const [customers, setCustomers] = useState([]);
	const [paidFullAmount, setPaidFullAmount] = useState(false);

	const { cart } = useCart();

	const inputRef = useRef();
	const checkboxRef = useRef();

	const handleSearch = async (e) => {
		const searchQuery = e.target.value;
		try {
			const customers = await getCustomersApi(searchQuery);
			setCustomers(customers.data.data.customers);
		} catch (error) {
			console.log('Error fetching customers:', error);
		}
	};

	const handlePay = async () => {
		if (!selectedCustomer?._id) {
			toast.error('Customer ID is required');
			return;
		}

		if (!cart.length) {
			toast.error('Cart is empty');
			return;
		}

		const data = {
			customerId: selectedCustomer._id,
			paidPrice: paidFullAmount ? totalAmount : 0,
			products: cart.map((item) => ({
				productId: item._id,
				quantity: item.quantity || 1,
			})),
		};

		try {
			await sellProductsApi(data);
			toast.success('Products sold successfully');
		} catch (error) {
			console.error('Error selling products:', error);
			toast.error('Failed to sell products');
		}
	};

	const handleCheckboxChange = () => {
		setPaidFullAmount(checkboxRef.current.checked);
	};

	return (
		<div>
			<input
				type="text"
				name="customer"
				placeholder="Search Customer"
				onChange={handleSearch}
				ref={inputRef}
				className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
			/>

			<div className="overflow-y-scroll max-h-48">
				{customers?.map((customer) => (
					<div
						key={customer._id}
						onClick={() => {
							setSelectedCustomer(customer);
							setCustomers([]);
							inputRef.current.value = '';
						}}
						className="px-4 py-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100"
					>
						<p>{customer.name}</p>
					</div>
				))}
			</div>

			<div className="mt-4">
				<div className="flex items-center justify-between mb-2">
					<p className="font-bold">Total Amount</p>
					<p>{totalAmount || 0} &#2547;</p>
				</div>

				<div className="flex items-center justify-between mb-2">
					<p className="font-bold">Paid Price</p>
					<input
						type="number"
						value={paidFullAmount ? totalAmount : ''}
						onChange={(e) => setPaidFullAmount(e.target.value)}
						className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
					/>
				</div>

				<div className="flex items-center">
					<input
						type="checkbox"
						ref={checkboxRef}
						className="mr-2"
						onChange={handleCheckboxChange}
					/>
					<label>Paid Full Amount</label>
				</div>
			</div>

			<button
				onClick={handlePay}
				className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
			>
				Check out
			</button>
		</div>
	);
};

export default CustomerDetails;
