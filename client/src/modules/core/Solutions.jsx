import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ closeModal }) => {
	return ReactDOM.createPortal(
		<div className="fixed inset-0 flex items-center justify-center z-50">
			<div className="absolute inset-0 bg-gray-800 opacity-75"></div>
			<div className="bg-white rounded-lg p-8">
				<h2 className="text-2xl font-bold mb-4">Modal Content</h2>
				<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
				<button
					className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600"
					onClick={closeModal}
				>
					Close
				</button>
			</div>
		</div>,
		document.getElementById('modal-root')
	);
};

const Solutions = () => {
	return (
		<>
			<div
				className="flex flex-col items-center justify-center bg-gray-200"
				style={{ zoom: '100%' }}
			>
				<div
					className="p-10 m-10 bg-white rounded-lg shadow-lg"
					style={{ zoom: 'inherit' }}
				>
					<h1 className="mb-4 text-4xl font-bold text-center">
						Our{' '}
						<span className="bg-gradient-to-r from-purple-500 via-blue-300 to-teal-200 bg-[length:0%_5px] bg-no-repeat bg-left-bottom hover:bg-[length:100%_5px] transition-all duration-500 text-purple-500 text-4xl">
							Solutions
						</span>
					</h1>
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						<div className="overflow-hidden rounded-lg shadow-lg">
							<img
								src="https://source.unsplash.com/random/300x201/?ecommerce"
								alt="Solution 1"
								className="object-cover w-full h-64"
							/>
							<div className="p-6">
								<h2 className="mb-2 text-xl font-bold sm:text-2xl">
									Inventory Tracking
								</h2>
								<p className="text-gray-800">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Sed ut elit vel est porta
									tristique.
								</p>
								<button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600">
									Learn More
								</button>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg">
							<img
								src="https://source.unsplash.com/random/300x201/?inventory"
								alt="Solution 2"
								className="object-cover w-full h-64"
							/>
							<div className="p-6">
								<h2 className="mb-2 text-xl font-bold sm:text-2xl">
									Stock Management
								</h2>
								<p className="text-gray-800">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Sed ut elit vel est porta
									tristique.
								</p>
								<button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600">
									Learn More
								</button>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg">
							<img
								src="https://source.unsplash.com/random/300x201/?analytics"
								alt="Solution 3"
								className="object-cover w-full h-64"
							/>
							<div className="p-6">
								<h2 className="mb-2 text-xl font-bold sm:text-2xl">
									Reporting & Analytics
								</h2>
								<p className="text-gray-800">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Sed ut elit vel est porta
									tristique.
								</p>
								<button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600">
									Learn More
								</button>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg">
							<img
								src="https://source.unsplash.com/random/300x201/?ordering-online"
								alt="Solution 4"
								className="object-cover w-full h-64"
							/>
							<div className="p-6">
								<h2 className="mb-2 text-xl font-bold sm:text-2xl">
									Order Management
								</h2>
								<p className="text-gray-800">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Sed ut elit vel est porta
									tristique.
								</p>
								<button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600">
									Learn More
								</button>
							</div>
						</div>
						<div className="overflow-hidden rounded-lg shadow-lg">
							<img
								src="https://source.unsplash.com/random/300x201/?vendor"
								alt="Solution 5"
								className="object-cover w-full h-64"
							/>
							<div className="p-6">
								<h2 className="mb-2 text-xl font-bold sm:text-2xl">
									Vendor Management
								</h2>
								<p className="text-gray-800">
									Lorem ipsum dolor sit amet, consectetur
									adipiscing elit. Sed ut elit vel est porta
									tristique.
								</p>
								<button className="px-4 py-2 mt-4 text-white bg-blue-500 rounded-3xl hover:bg-blue-600">
									Learn More
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default Solutions;
