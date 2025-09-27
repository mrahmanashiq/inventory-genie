import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { CgProfile } from 'react-icons/cg';
import { FiLogOut } from 'react-icons/fi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { RiBugLine } from 'react-icons/ri';
import { VscAccount } from 'react-icons/vsc';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { logoutApi } from '../../apis/auth.apis';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

const LoggedInNavbar = () => {
	const queryClient = useQueryClient();
	const [isOpen, setIsOpen] = useState(false);
	const [activeLink, setActiveLink] = useState('');
	const { data } = useIsLoggedIn();
	const sidebarRef = useRef(null);
	const navigate = useNavigate();

	const closeSidebar = () => {
		setIsOpen(false);
	};

	const handleClickOutside = (event) => {
		if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden'; // Prevent scrolling when the sidebar is open
		} else {
			document.body.style.overflow = ''; // Allow scrolling when the sidebar is closed
		}
	}, [isOpen]);

	const logOutToast = () =>
		toast.success('You have successfully signed out!', {
			theme: 'colored',
			autoClose: 2000,
			icon: '👋',
		});

	const dashboardLink =
		data?.userData?.role === 'admin'
			? '/admin-dashboard'
			: '/dashboard';

	return (
		<div className="relative h-12">
			<div className="flex items-center justify-between h-full px-4 bg-gradient-to-r from-teal-500 via-blue-200 to-blue-400">
				<div
					className="flex flex-col justify-between w-10 h-6 cursor-pointer"
					onClick={() => setIsOpen(true)}
				>
					<GiHamburgerMenu className="h-10 ml-auto text-3xl text-white " />
				</div>

				<div className="flex items-center">
					<VscAccount className="h-10 ml-auto text-2xl text-grey-700" />
					<span className="hidden ml-3 overflow-hidden font-semibold text-gray-700 overflow-ellipsis lg:block">
						{data.userData?.name}
					</span>
				</div>

				<div
					ref={sidebarRef}
					className={`fixed bottom-0 left-0 z-20 w-64 h-screen transition-transform duration-300 transform ${
						isOpen ? 'translate-x-0' : '-translate-x-full'
					} bg-gradient-to-b from-navy-900 to-teal-500`}
				>
					<div className="p-3 bg-gradient-to-r from-blue-300 to-teal-400">
						{data?.userData?.role === 'manager' ? (
							<p className="mr-3">Manager Portal</p>
						) : (
							<p className="mr-3 font-medium text-slate-700">
								Admin Portal
							</p>
						)}

						<button
							className="absolute top-2 right-3 focus:outline-none group"
							onClick={closeSidebar}
						>
							<AiOutlineCloseCircle className="text-3xl text-white" />
							<span className="absolute px-2 py-1 mt-1 text-white transition-opacity duration-300 transform -translate-x-1/2 rounded opacity-0 bg-slate-600 group-hover:opacity-100 top-full left-1/2">
								close
							</span>
						</button>
					</div>

					<div className="flex-grow px-4 pt-3">
						<ul className="flex flex-col flex-grow space-y-4">
							{/* Modern Dashboard - Available to all logged-in users */}
							<li className="text-white">
								<Link to="/modern-dashboard">
									<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
										📊 Modern Dashboard
									</div>
								</Link>
							</li>

							{/* Product Management - Available to managers and admins */}
							{(data?.userData?.role === 'manager' || data?.userData?.role === 'admin') && (
								<li className="text-white">
									<Link to="/product-management">
										<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
											📦 Product Management
										</div>
									</Link>
								</li>
							)}

							{/* Admin Panel - Available to admins only */}
							{data?.userData?.role === 'admin' && (
								<li className="text-white">
									<Link to="/admin-panel">
										<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
											👥 Admin Panel
										</div>
									</Link>
								</li>
							)}

							<hr className="border-white/30" />
							<p className="text-white/70 text-sm font-medium">Legacy Features</p>

							{data?.userData?.role === 'manager' && (
								<>
									<li
										className={`text-white ${
											activeLink === '/dashboard'
												? 'font-medium'
												: ''
										}`}
									>
										<Link
											to={dashboardLink}
											className={`${
												activeLink === '/dashboard'
													? 'font-medium'
													: ''
											}`}
											onMouseEnter={() =>
												setActiveLink('/dashboard')
											}
											onMouseLeave={() =>
												setActiveLink('/dashboard')
											}
										>
											<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
												Legacy Dashboard
											</div>
										</Link>
									</li>
									<li
										className={`text-white ${
											activeLink === '/manage-admin'
												? 'font-medium'
												: ''
										}`}
									>
										<Link
											to="/manage-admin"
											className={`${
												activeLink === '/manage-admin'
													? 'font-medium'
													: ''
											}`}
											onMouseEnter={() =>
												setActiveLink('/manage-admin')
											}
											onMouseLeave={() =>
												setActiveLink('/manage-admin')
											}
										>
											<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
												Manage Admin
											</div>
										</Link>
									</li>
								</>
							)}
							{data?.userData?.role === 'admin' && (
								<>
									<li
										className={`text-white ${
											activeLink === '/manage-inventory'
												? 'font-medium'
												: ''
										}`}
									>
										<Link
											to="/manage-inventory"
											className={`${
												activeLink ===
												'/manage-inventory'
													? 'font-medium'
													: ''
											}`}
											onMouseEnter={() =>
												setActiveLink(
													'/manage-inventory'
												)
											}
											onMouseLeave={() =>
												setActiveLink(
													'/manage-inventory'
												)
											}
										>
											<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
												Manage Inventory
											</div>
										</Link>
									</li>

									<li
										className={`text-white ${
											activeLink === '/manage-customer'
												? 'font-medium'
												: ''
										}`}
									>
										<Link
											to="/manage-customer"
											className={`${
												activeLink ===
												'/manage-customer'
													? 'font-medium'
													: ''
											}`}
											onMouseEnter={() =>
												setActiveLink(
													'/manage-customer'
												)
											}
											onMouseLeave={() =>
												setActiveLink(
													'/manage-customer'
												)
											}
										>
											<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
												Manage Customers
											</div>
										</Link>
									</li>

									<li
										className={`text-white ${
											activeLink === '/vendors'
												? 'font-medium'
												: ''
										}`}
									>
										<Link
											to="/manage-vendor"
											className={`${
												activeLink === '/vendors'
													? 'font-medium'
													: ''
											}`}
											onMouseEnter={() =>
												setActiveLink('/vendors')
											}
											onMouseLeave={() =>
												setActiveLink('/vendors')
											}
										>
											<div className="p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
												Manage Vendors
											</div>
										</Link>
									</li>
								</>
							)}

							<hr />
							<li className="mt-2 text-white">
								<Link
									to="/contact"
									className={`font-medium ${
										activeLink === '/contact'
											? 'border border-white rounded-md p-1'
											: ''
									}`}
									onMouseEnter={() =>
										setActiveLink('/contact')
									}
									onMouseLeave={() =>
										setActiveLink('/contact')
									}
								>
									<div className="flex items-center w-full p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
										<RiBugLine className="mr-2" />
										Report Bug
									</div>
								</Link>
							</li>

							<li className="mt-2 text-white">
								<Link
									to="/profile"
									className={`font-medium ${
										activeLink === '/profile'
											? 'border border-white rounded-md p-1'
											: ''
									}`}
									onMouseEnter={() =>
										setActiveLink('/profile')
									}
									onMouseLeave={() =>
										setActiveLink('/profile')
									}
								>
									<div className="flex items-center w-full p-1 px-4 py-2 text-white border border-white rounded-md text-md hover:bg-gray-100 hover:text-gray-900">
										<CgProfile className="mr-2" />
										Your Profile
									</div>
								</Link>
							</li>

							<li className="mt-2 text-white">
								<button
									className="block w-full px-4 py-2 text-white border border-white rounded-md hover:bg-red-400 hover:text-gray-900"
									onClick={async () => {
										logOutToast();
										await logoutApi();
										await queryClient.invalidateQueries({
											queryKey: 'isLoggedIn',
										});
										navigate('/login'); // Navigate to the login page
									}}
								>
									Logout
									<FiLogOut className="inline-block w-4 h-4 ml-1" />
								</button>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoggedInNavbar;
