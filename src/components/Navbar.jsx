import React, { useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const Navbar = () => {
  const { user, userProfile, logout, isAdmin, loading } = useAuth();
  const { itemCount } = useCart();
  const { notify } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      notify('Logged out successfully', 'success');
      navigate('/');
      setIsOpen(false);
    } catch (error) {
      notify(error.message, 'error');
    }
  }, [logout, notify, navigate]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setIsOpen(false);
    }
  }, [searchQuery, navigate]);

  const displayName = useMemo(() => {
    if (!user) return 'Account';
    return userProfile?.displayName || user.displayName || 'Account';
  }, [user, userProfile]);

  if (loading) {
    return (
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600">
              ShopSphere
            </Link>
            <div className="animate-pulse w-32 h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            ShopSphere
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="absolute right-3 top-2 text-gray-600 hover:text-gray-900"
              >
                <Search size={20} />
              </button>
            </div>
          </form>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/shop" className="hover:text-blue-600 transition font-semibold">
              Shop
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="hover:text-blue-600 transition font-semibold">
                    Admin
                  </Link>
                )}
                
                <Link to="/account" className="flex items-center gap-2 hover:text-blue-600 transition font-semibold">
                  <User size={20} />
                  <span className="hidden lg:inline">{displayName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 transition font-semibold"
                >
                  <LogOut size={20} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}

            <Link
              to="/cart"
              className="relative flex items-center hover:text-blue-600 transition"
            >
              <ShoppingCart size={24} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-4 pb-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="p-2 hover:bg-gray-100 rounded-lg">
                <Search size={20} />
              </button>
            </form>

            <Link to="/shop" className="block hover:text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>
              Shop
            </Link>

            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block hover:text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>
                    Admin Panel
                  </Link>
                )}
                <Link to="/account" className="block hover:text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>
                  My Account
                </Link>
                <button onClick={handleLogout} className="w-full text-left text-red-600 font-semibold">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="block btn-primary text-center" onClick={() => setIsOpen(false)}>
                Login
              </Link>
            )}

            <Link to="/cart" className="block hover:text-blue-600 font-semibold" onClick={() => setIsOpen(false)}>
              Cart ({itemCount})
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;