import React from 'react';
import { AiOutlineUser } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import logo from '../../assets/diulogo_white.png';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

const navigation = [
	{ name: 'Solutions', href: '/solutions' },
	{ name: 'Pricing', href: '/price' },
	{ name: 'About', href: '/about' },
	{ name: 'Contact', href: '/contact' },
];

export default function Example() {


	const { data } = useIsLoggedIn();

	return (
		<>
			<header className="bg-indigo-600">
				<nav
					className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
					aria-label="Top"
				>
					<div className="flex items-center justify-between w-full py-6 border-b border-indigo-500 lg:border-none">
						<div className="flex items-center">
							<Link to="/">
								<img className="w-auto h-10" src={logo} alt="" />
							</Link>
							<div className="hidden ml-10 space-x-8 lg:block">
								{navigation.map((link) => (
									<Link
										to={link.href}
										key={link.name}
										className="text-base font-medium text-white hover:text-indigo-100"
									>
										{link.name}{' '}
									</Link>
								))}
							</div>
						</div>
						<div className="flex items-center ml-10 space-x-4">
							{data?.isLoggedIn ? (
								<>
									<span className="flex items-center">
										<AiOutlineUser className="w-6 h-6" />
										<span className="ml-2 text-black transition-colors duration-500 cursor-pointer hover:text-indigo-50">
											{data.userData?.name || 'User'}
										</span>
									</span>
								</>
							) : (
								<>
									<Link
										to="/login"
										className="inline-block px-4 py-2 text-base font-medium text-white bg-indigo-500 border border-transparent rounded-md hover:bg-opacity-75"
									>
										Log in
									</Link>
								</>
							)}
						</div>
					</div>
				</nav>
			</header>
		</>
	);
}
