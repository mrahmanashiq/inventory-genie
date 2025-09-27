import React from 'react';

const LoggedInFooter = () => {
	return (
		<footer className="fixed bottom-0 w-full px-6 py-4 bg-gray-200 sm:px-8 md:px-12 lg:px-16 xl:px-20">
			<p className="text-sm text-center text-gray-600 sm:text-base md:text-lg lg:text-xl">
				All Rights Reserved @{''}
				<a
					href="https://mrahmanashiq.vercel.app/"
					target="_blank"
					rel="noreferrer"
					className="text-blue-500 hover:underline"
				>
					Mizanur Rahman Ashiq
				</a>
				.
			</p>
		</footer>
	);
};

export default LoggedInFooter;
