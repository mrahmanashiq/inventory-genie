import React from 'react';
import logo from '../../assets/homePage.svg';
import { useIsLoggedIn } from '../../hooks/useIsLoggedIn';

const HomePage = () => {
  const { data } = useIsLoggedIn();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <img src={logo} alt="Logo" className="w-48 mb-10" />
      <h1 className="mb-8 text-4xl font-bold">InventoryGenie</h1>
      {data && data.userData?.role === 'manager' && (
        <p className="max-w-md text-lg text-center text-gray-500">
          Welcome to <span className="font-bold">Manager</span> Dashboard.
        </p>
      )}
      {data && data.userData?.role === 'admin' && (
        <p className="max-w-md text-lg text-center text-gray-500">
          Welcome to <span className="font-bold">Admin</span> Dashboard.
        </p>
      )}
      {!data || !data.isLoggedIn ? (
        <p className="max-w-md text-lg text-center text-gray-500">
          Welcome to our <span className="font-bold">inventory management system</span>. This system will help you manage your inventory and streamline your business operations.
        </p>
      ) : null}
    </div>
  );
};

export default HomePage;
