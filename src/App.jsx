import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './pages/Admin/AdminLayout';

// Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderDetail from './pages/OrderDetail';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';
import AddProduct from './pages/Admin/AddProduct';
import EditProduct from './pages/Admin/EditProduct';
import OrderDetailAdmin from './pages/Admin/OrderDetail';

// Layout component for pages with Navbar and Footer
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <NotificationProvider>
            <Routes>
              {/* Admin Routes - No Navbar/Footer */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="edit-product/:productId" element={<EditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="order/:orderId" element={<OrderDetailAdmin />} />
                <Route path="users" element={<AdminUsers />} />
              </Route>

              {/* Public Routes with Navbar and Footer */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <Home />
                  </MainLayout>
                }
              />

              <Route
                path="/shop"
                element={
                  <MainLayout>
                    <Shop />
                  </MainLayout>
                }
              />

              <Route
                path="/product/:id"
                element={
                  <MainLayout>
                    <ProductDetail />
                  </MainLayout>
                }
              />

              <Route
                path="/cart"
                element={
                  <MainLayout>
                    <Cart />
                  </MainLayout>
                }
              />

              <Route
                path="/checkout"
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  </MainLayout>
                }
              />

              <Route
                path="/order-success/:orderId"
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <OrderSuccess />
                    </ProtectedRoute>
                  </MainLayout>
                }
              />

              <Route
                path="/order/:orderId"
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <OrderDetail />
                    </ProtectedRoute>
                  </MainLayout>
                }
              />

              <Route
                path="/account"
                element={
                  <MainLayout>
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  </MainLayout>
                }
              />

              <Route
                path="/login"
                element={
                  <MainLayout>
                    <Login />
                  </MainLayout>
                }
              />

              {/* 404 Route */}
              <Route
                path="*"
                element={
                  <MainLayout>
                    <NotFound />
                  </MainLayout>
                }
              />
            </Routes>

            <Toaster position="top-right" />
          </NotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;