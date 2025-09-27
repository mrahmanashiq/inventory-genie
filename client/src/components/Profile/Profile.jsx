import { useEffect, useState } from 'react';
import { getUserProfileApi } from '../../apis/profile.apis';

const img =
	'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80';

export default function Profile() {
	const [user, setUser] = useState();

	useEffect(() => {
		async function fetchUserProfile() {
			try {
				const {
					data: { user },
				} = await getUserProfileApi();
				setUser(user);
			} catch (e) {
				console.log(e);
			}
		}
		fetchUserProfile();
	}, []);

	const formatDate = (timestamp) => {
		return new Date(timestamp).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		});
	};

	return (
		<div className="container mx-auto mt-5">
			<div className="flex flex-col md:flex-row">
				<div className="md:w-1/3">
					<img
						src={img}
						className="inline-block w-full h-auto max-w-xs mb-8 rounded-lg"
						alt=""
					/>
				</div>
				<div className="pl-8 md:w-2/3">
					<div className="space-y-3 text-xl">
						<div className="flex items-center gap-3">
							<span className="font-bold">Name:</span>{' '}
							<span>{user?.name}</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-bold">Email:</span>{' '}
							<span>{user?.email}</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-bold">Role:</span>{' '}
							<span>{user?.role?.toUpperCase()}</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-bold">Permission:</span>{' '}
							<span>Read, Write, Edit, Delete</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-bold">Created At:</span>{' '}
							<span>{formatDate(user?.createdAt)}</span>
						</div>
						<div className="flex items-center gap-3">
							<span className="font-bold">Updated At:</span>{' '}
							<span>{formatDate(user?.updatedAt)}</span>
						</div>
						<div className="flex flex-col w-72">
							<span className="font-bold">Change Password:</span>
							<input
								type="password"
								placeholder="Current Password"
								className="p-2 mt-2 rounded-lg"
							/>
							<input
								type="password"
								placeholder="Confirm Password"
								className="p-2 mt-2 rounded-lg"
							/>
							<button className="py-2 mt-2 transition-all bg-gray-100 rounded-lg hover:bg-gray-200">
								Save
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
