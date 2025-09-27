import React, { useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import { toast, ToastContainer } from 'react-toastify';

import {
	AiFillFacebook,
	AiFillGithub,
	AiFillTwitterCircle,
	AiOutlinePhone,
	AiOutlineMail,
} from 'react-icons/ai';

export default function Example() {
	const [state, handleSubmit, reset] = useForm('moqzkwzl');
	const [toastShown, setToastShown] = useState(false);

	const sendEmailToast = () => {
		toast.success('Email Sent Successfully', {
			theme: 'colored',
			autoClose: 2000,
			icon: '📨',
		});
		reset();
		setToastShown(true);
	};

	if (state.succeeded && !toastShown) {
		sendEmailToast();
	}
	
	return (
		<>
			<ToastContainer />
			<div className="bg-gray-100">
				<div className="px-6 py-16 mx-auto max-w-7xl sm:py-24 lg:px-8">
					<div className="relative bg-gray-100 shadow-xl">
						<h2 className="sr-only">Contact us</h2>

						<div className="grid grid-cols-1 lg:grid-cols-3">
							{/* Contact information */}
							<div className="relative px-6 py-10 overflow-hidden bg-indigo-700 sm:px-10 xl:p-12">
								<div
									className="absolute inset-0 pointer-events-none sm:hidden"
									aria-hidden="true"
								>
									<svg
										className="absolute inset-0 w-full h-full"
										width={343}
										height={388}
										viewBox="0 0 343 388"
										fill="none"
										preserveAspectRatio="xMidYMid slice"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M-99 461.107L608.107-246l707.103 707.107-707.103 707.103L-99 461.107z"
											fill="url(#linear1)"
											fillOpacity=".1"
										/>
										<defs>
											<linearGradient
												id="linear1"
												x1="254.553"
												y1="107.554"
												x2="961.66"
												y2="814.66"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#fff" />
												<stop offset={1} stopColor="#fff" stopOpacity={0} />
											</linearGradient>
										</defs>
									</svg>
								</div>
								<div
									className="absolute top-0 bottom-0 right-0 hidden w-1/2 pointer-events-none sm:block lg:hidden"
									aria-hidden="true"
								>
									<svg
										className="absolute inset-0 w-full h-full"
										width={359}
										height={339}
										viewBox="0 0 359 339"
										fill="none"
										preserveAspectRatio="xMidYMid slice"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M-161 382.107L546.107-325l707.103 707.107-707.103 707.103L-161 382.107z"
											fill="url(#linear2)"
											fillOpacity=".1"
										/>
										<defs>
											<linearGradient
												id="linear2"
												x1="192.553"
												y1="28.553"
												x2="899.66"
												y2="735.66"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#fff" />
												<stop offset={1} stopColor="#fff" stopOpacity={0} />
											</linearGradient>
										</defs>
									</svg>
								</div>
								<div
									className="absolute top-0 bottom-0 right-0 hidden w-1/2 pointer-events-none lg:block"
									aria-hidden="true"
								>
									<svg
										className="absolute inset-0 w-full h-full"
										width={160}
										height={678}
										viewBox="0 0 160 678"
										fill="none"
										preserveAspectRatio="xMidYMid slice"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M-161 679.107L546.107-28l707.103 707.107-707.103 707.103L-161 679.107z"
											fill="url(#linear3)"
											fillOpacity=".1"
										/>
										<defs>
											<linearGradient
												id="linear3"
												x1="192.553"
												y1="325.553"
												x2="899.66"
												y2="1032.66"
												gradientUnits="userSpaceOnUse"
											>
												<stop stopColor="#fff" />
												<stop offset={1} stopColor="#fff" stopOpacity={0} />
											</linearGradient>
										</defs>
									</svg>
								</div>
								<h3 className="text-lg font-medium text-white">
									Contact information
								</h3>
								<p className="max-w-3xl mt-6 text-base text-indigo-50">
									The contact page for our inventoryGenie project allows you to
									get in touch with us easily. You can use the contact form to
									send us a message with any questions or concerns you may have.
									We'll get back to you as soon as possible. You can also find
									our phone number and email address on this page if you prefer
									to contact us directly. We're always happy to help you with
									any issues you may encounter while using our inventory
									management system.
								</p>
								<dl className="mt-8 space-y-6">
									<dt>
										<span className="sr-only">Phone number</span>
									</dt>
									<dd className="flex text-base text-indigo-50">
										<AiOutlinePhone
											className="flex-shrink-0 w-6 h-6 text-indigo-200"
											aria-hidden="true"
										/>
										<span className="ml-3">+880 1521-728296</span>
									</dd>
									<dt>
										<span className="sr-only">Email</span>
									</dt>
									<dd className="flex text-base text-indigo-50">
										<AiOutlineMail
											className="flex-shrink-0 w-6 h-6 text-indigo-200"
											aria-hidden="true"
										/>
										<span className="ml-3">mizanur35-2844@diu.edu.bd</span>
									</dd>
								</dl>
								<ul className="flex mt-8 space-x-12">
									<li>
										<a
											className="text-indigo-200 hover:text-indigo-100"
											href="https://www.facebook.com/mmr.ashiq/"
											target='_blank'
											rel='noreferrer'
										>
											<span className="sr-only">Facebook</span>
											<AiFillFacebook size={30} />
										</a>
									</li>
									<li>
										<a
											className="text-indigo-200 hover:text-indigo-100"
											href="https://github.com/mrahmanashiq"
											target='_blank'
											rel='noreferrer'
										>
											<span className="sr-only">GitHub</span>
											<AiFillGithub size={30} />
										</a>
									</li>
									<li>
										<a
											className="text-indigo-200 hover:text-indigo-100"
											href="https://twitter.com/mmr_ashiq"
											target='_blank'
											rel='noreferrer'
										>
											<span className="sr-only">Twitter</span>
											<AiFillTwitterCircle size={30} />
										</a>
									</li>
								</ul>
							</div>

							{/* Contact form */}
							<div className="px-6 py-10 sm:px-10 lg:col-span-2 xl:p-12">
								<h3 className="text-lg font-medium text-gray-900">
									Send us a message
								</h3>
								<form
									className="grid grid-cols-1 mt-6 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
									onSubmit={handleSubmit}
								>
									<div>
										<label
											htmlFor="first-name"
											className="block text-sm font-medium text-gray-900"
										>
											First name
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="first-name"
												id="first-name"
												autoComplete="given-name"
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="last-name"
											className="block text-sm font-medium text-gray-900"
										>
											Last name
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="last-name"
												id="last-name"
												autoComplete="family-name"
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											/>
										</div>
									</div>
									<div>
										<label
											htmlFor="email"
											className="block text-sm font-medium text-gray-900"
										>
											Email
										</label>
										<div className="mt-1">
											<input
												id="email"
												name="email"
												type="email"
												autoComplete="email"
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											/>
											<ValidationError
												prefix="Email"
												field="email"
												errors={state.errors}
											/>
										</div>
									</div>
									<div>
										<div className="flex justify-between">
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-900"
											>
												Phone
											</label>
											<span
												id="phone-optional"
												className="text-sm text-gray-500"
											>
												Optional
											</span>
										</div>
										<div className="mt-1">
											<input
												type="text"
												name="phone"
												id="phone"
												autoComplete="tel"
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
												aria-describedby="phone-optional"
											/>
										</div>
									</div>
									<div className="sm:col-span-2">
										<label
											htmlFor="subject"
											className="block text-sm font-medium text-gray-900"
										>
											Subject
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="subject"
												id="subject"
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
											/>
										</div>
									</div>
									<div className="sm:col-span-2">
										<div className="flex justify-between">
											<label
												htmlFor="message"
												className="block text-sm font-medium text-gray-900"
											>
												Message
											</label>
											<span id="message-max" className="text-sm text-gray-500">
												Max. 500 characters
											</span>
										</div>
										<div className="mt-1">
											<textarea
												id="message"
												name="message"
												rows={4}
												className="block w-full px-4 py-3 text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
												aria-describedby="message-max"
												defaultValue={''}
											/>
											<ValidationError
												prefix="Message"
												field="message"
												errors={state.errors}
											/>
										</div>
									</div>
									<div className="sm:col-span-2 sm:flex sm:justify-end">
										<button
											type="submit"
											className="inline-flex items-center justify-center w-full px-6 py-3 mt-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
											disabled={state.submitting}
										>
											Submit
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
