import {
	AiFillFacebook,
	AiFillLinkedin,
	AiFillInstagram,
	AiFillTwitterSquare,
	AiFillGithub,
} from 'react-icons/ai';

const navigation = {
	main: [
		{ name: 'About', href: '#' },
		{ name: 'Blog', href: '#' },
		{ name: 'Jobs', href: '#' },
		{ name: 'Press', href: '#' },
		{ name: 'Accessibility', href: '#' },
		{ name: 'Partners', href: '#' },
	],
	social: [
		{
			name: 'Facebook',
			href: 'https://www.facebook.com/mmr.ashiq/',
			icon: (props) => <AiFillFacebook size={25} />,
		},
		{
			name: 'Instagram',
			href: 'https://www.instagram.com/mmr_ashiq/',
			icon: (props) => <AiFillInstagram size={25} />,
		},
		{
			name: 'GitHub',
			href: 'https://github.com/mrahmanashiq',
			icon: (props) => <AiFillGithub size={25} />,
		},
		{
			name: 'LinkedIn',
			href: 'https://www.linkedin.com/in/mrahmanashiq/',
			icon: (props) => <AiFillLinkedin size={25} />,
		},
		{
			name: 'Twitter',
			href: 'https://twitter.com/mmr_ashiq',
			icon: (props) => <AiFillTwitterSquare size={25} />,
		},
	],
};

export default function Example() {
	return (
		<footer className="bg-white">
			<div className="px-6 py-20 mx-auto overflow-hidden max-w-7xl sm:py-24 lg:px-8">
				<nav
					className="-mb-6 columns-2 sm:flex sm:justify-center sm:space-x-12"
					aria-label="Footer"
				>
					{navigation.main.map((item) => (
						<div key={item.name} className="pb-6">
							<a
								href={item.href}
								className="text-sm leading-6 text-gray-600 hover:text-gray-900"
							>
								{item.name}
							</a>
						</div>
					))}
				</nav>
				<div className="flex justify-center mt-10 space-x-10">
					{navigation.social.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className="text-gray-400 hover:text-gray-500"
						>
							<span className="sr-only">{item.name}</span>
							<item.icon className="w-6 h-6" aria-hidden="true" />
						</a>
					))}
				</div>
				<p className="mt-10 text-xs leading-5 text-center text-gray-500">
					&copy; 2023, inventoryGenie, Inc. All rights reserved.
				</p>
				<p className="mt-1 text-xs leading-5 text-center text-gray-500">
					&copy; Made with 🖤 by{' '}
					<a href="https://mrahmanashiq.github.io/">
						<span className="text-blue-500">@mmr_ashiq</span>
					</a>
					.
				</p>
			</div>
		</footer>
	);
}
