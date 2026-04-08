import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, BarChart3, Package, ShoppingCart, Users,   Home, Store } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useNotification } from '../../hooks/useNotification';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuth();
  const { notify } = useNotification();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      notify('Logged out successfully', 'success');
      window.location.href = '/';
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  const isActive = (path) => {
    const currentPath = location.pathname;
    return currentPath === path || currentPath.startsWith(path + '/');
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: BarChart3 },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Shop', path: '/shop', icon: Store },
    { label: 'Home', path: '/', icon: Home },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-0`}
      >
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold">ShopSphere</h1>
          <p className="text-sm text-gray-400">Admin Panel</p>
        </div>

        <nav className="space-y-2 px-4 py-6">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 lg:hidden text-gray-400 hover:text-white"
        >
          <X size={24} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white shadow-md p-4 flex items-center justify-between lg:hidden">
          <h2 className="font-bold">Admin Panel</h2>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;