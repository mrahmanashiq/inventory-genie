/* eslint-disable react/jsx-no-duplicate-props */
import { MantineProvider } from '@mantine/core';
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Cart from '../src/components/Cart';
import CheckOut from '../src/components/CheckOut';
import OrderHistory from '../src/components/OrderHistory';
import Profile from '../src/components/Profile/Profile';

// Modern Components
import ModernDashboard from './components/Dashboard/ModernDashboard';
import AdminPanel from './components/admin/AdminPanel';
import ProductManagement from './components/product/ProductManagement';
import ModernNavbar from './components/navigation/ModernNavbar';
import ModernWelcome from './components/welcome/ModernWelcome';

import About from '../src/modules/core/About';
import Contact from '../src/modules/core/Contact';
import Pricing from '../src/modules/core/Pricing';
import Dashboard from './components/Dashboard/Dashboard';
import ProductOverview from './components/ProductOverview';
import { CartProvider } from './context/products.context';
import { useIsLoggedIn } from './hooks/useIsLoggedIn';
import ManageCustomer from './modules/admin/ManageCustomer';
import ManageInventory from './modules/admin/ManageInventory';
import ManageVendor from './modules/admin/ManageVendor';
import Footer from './modules/core/Footer';
import HomePage from './modules/core/HomePage';
import LoggedInFooter from './modules/core/LoggedInFooter';
import Navbar from './modules/core/Navbar';
import NotFound from './modules/core/NotFound';
import SignIn from './modules/core/SignIn';
import SignUp from './modules/core/SignUp';
import Solutions from './modules/core/Solutions';
import ManageAdmin from './modules/manager/ManageAdmin';
import { EditProduct } from './modules/product/EditProduct';

export default function App() {
	const { data, isLoading, error } = useIsLoggedIn();
	// const navigate = useNavigate();

	const isAdmin = data?.userData?.role === 'admin';
	const isManager = data?.userData?.role === 'manager';

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="text-lg">Loading...</div>
			</div>
		);
	}

	return (
		<>
			<CartProvider>
				<MantineProvider withGlobalStyles withNormalizeCSS>
					{data?.isLoggedIn ? (
						<ModernNavbar 
							userData={data?.userData} 
							onLogout={() => {
								localStorage.removeItem('token');
								window.location.reload();
							}} 
						/>
					) : (
						<Navbar />
					)}
					<Routes>
						<Route path="/" element={data?.isLoggedIn ? <ModernWelcome userData={data?.userData} /> : <HomePage />} />
						<Route path="/welcome" element={<ModernWelcome userData={data?.userData} />} />
						<Route path="/about" element={<About />} />
						<Route path="/price" element={<Pricing />} />
						<Route path="/contact" element={<Contact />} />
						<Route path="/login" element={<SignIn />} />
						<Route path="/signup" element={<SignUp />} />
						{/* Modern Dashboard Routes */}
						{(isManager || isAdmin) && (
							<Route path="/dashboard" element={<ModernDashboard userRole={data?.userData?.role} />} />
						)}
						{(isManager || isAdmin) && (
							<Route path="/modern-dashboard" element={<ModernDashboard userRole={data?.userData?.role} />} />
						)}
						{isAdmin && (
							<Route path="/admin-panel" element={<AdminPanel />} />
						)}
						{(isManager || isAdmin) && (
							<Route path="/product-management" element={<ProductManagement />} />
						)}
						
						{/* Legacy Routes */}
						{isManager && (
							<Route path="/legacy-dashboard" element={<Dashboard />} />
						)}
						{isManager && (
							<Route
								path="/manage-admin"
								element={<ManageAdmin />}
							/>
						)}
						{isAdmin && (
							<Route
								path="/manage-inventory"
								element={<ManageInventory />}
							/>
						)}
						{isAdmin && (
							<Route
								path="/manage-vendor"
								element={<ManageVendor />}
							/>
						)}
						{isAdmin && (
							<Route
								path="/manage-customer"
								element={<ManageCustomer />}
							/>
						)}
						<Route
							path="/orderHistory"
							element={<OrderHistory />}
						/>
						<Route path="/cart" element={<Cart />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/checkout" element={<CheckOut />} />
						<Route
							path="/productOverview"
							element={<ProductOverview />}
						/>
						<Route
							path="/edit-product/:id"
							element={<EditProduct />}
						/>
						<Route path="/solutions" element={<Solutions />} />
						<Route path="*" element={<NotFound />} />
					</Routes>
					{data?.isLoggedIn ? <LoggedInFooter /> : <Footer />}
				</MantineProvider>
			</CartProvider>
			<ToastContainer />
		</>
	);
}
