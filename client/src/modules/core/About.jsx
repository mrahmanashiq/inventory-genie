import React from 'react';
import { AiOutlineMail } from 'react-icons/ai';
import profileImage from '../../assets/profile.jpg';
import supervisorImage from '../../assets/supervisor.jpg';

export default function Example() {
	return (
		<div className="bg-white">
			<div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
				<div className="space-y-12">
					<h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
						Meet our{' '}
						<span className="bg-gradient-to-r from-purple-500 via-blue-300 to-teal-200 bg-[length:0%_5px] bg-no-repeat bg-left-bottom hover:bg-[length:100%_5px] transition-all duration-500 text-purple-500 text-4xl">
							leadership
						</span>
					</h2>

					<div className="flex justify-center">
						<figure className="p-8 m-2 md:flex bg-slate-300 rounded-xl md:p-0">
							<img
								className="w-24 h-24 mx-auto rounded-l-full md:w-48 md:h-auto md:rounded-l-xl"
								src={profileImage}
								alt=""
								width="384"
								height="512"
							/>
							<div className="pt-6 space-y-4 text-center md:p-8 md:text-left">
								<div className="text-xl italic font-medium underline decoration-sky-500">
									Presented By
								</div>

								<figcaption className="font-medium">
									<div>
										<span className="text-xl text-sky-500">
											Mizanur Rahman Ashiq
										</span>{' '}
										<br />
										<div className="text-slate-700 dark:text-slate-500">
											Developer, InventoryGenie
										</div>
										<span className="text-slate-500">
											Student ID: 192-35-2844
										</span>
										<br />
										<div className="flex items-center">
											<AiOutlineMail className="mr-2" />
											<span className="font-normal">
												mizanur35-2844@diu.edu.bd
											</span>
										</div>
									</div>
								</figcaption>
							</div>
						</figure>

						<figure className="p-8 m-2 md:flex bg-slate-300 rounded-xl md:p-0">
							<img
								className="w-24 h-24 mx-auto rounded-l-full md:w-48 md:h-auto md:rounded-l-xl"
								src={supervisorImage}
								alt=""
								width="384"
								height="512"
							/>
							<div className="pt-6 space-y-4 text-center md:p-8 md:text-left">
								<div className="text-xl italic font-medium underline decoration-sky-500">
									Supervised by
								</div>
								<figcaption className="font-medium">
									<div>
										<span className="text-xl text-sky-500">
											Mr. Esraq Humayun
										</span>{' '}
										<br />
										<div className="text-slate-700 dark:text-slate-500">
											Lecturer, Department of SWE
										</div>
										<span className="text-slate-500">
											Daffodil International University
										</span>
										<br />
										<div className="flex items-center">
											<AiOutlineMail className="mr-2" />
											<span className="font-normal">esraq.swe@diu.edu.bd</span>
										</div>
									</div>
								</figcaption>
							</div>
						</figure>
					</div>
				</div>
			</div>
		</div>
	);
}
