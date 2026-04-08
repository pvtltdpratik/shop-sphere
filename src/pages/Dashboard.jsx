import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LogOut, User, Package, MapPin, Phone, Mail, Edit2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { subscribeToUserOrders, updateUserProfile } from '../firebase/firebaseServices';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user, userProfile, logout } = useAuth();
  const { notify } = useNotification();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    phone: '',
    displayName: '',
  });

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToUserOrders(user.uid, (userOrders) => {
        setOrders(userOrders);
        setLoading(false);
      });

      return unsubscribe;
    }
  }, [user]);

  useEffect(() => {
    if (userProfile) {
      setEditData({
        phone: userProfile.phone || '',
        displayName: userProfile.displayName || '',
      });
    }
  }, [userProfile, isEditing]);

  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile(user.uid, {
        displayName: editData.displayName,
        phone: editData.phone,
      });
      notify('Profile updated successfully', 'success');
      setIsEditing(false);
    } catch (error) {
      notify('Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      notify('Logged out successfully', 'success');
    } catch (error) {
      notify(error.message, 'error');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please login first</h2>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* User Card */}
              <div className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center gap-4 mb-4">
                  {user.photoURL && (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="font-semibold">{userProfile?.displayName}</p>
                    <p className="text-sm opacity-90">{user.email}</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="p-4 space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                    activeTab === 'profile'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <User size={20} />
                  Profile
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition text-left ${
                    activeTab === 'orders'
                      ? 'bg-blue-50 text-blue-600 font-semibold'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Package size={20} />
                  Orders
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition text-left"
                >
                  <LogOut size={20} />
                  Logout
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 size={20} />
                    {isEditing ? 'Cancel' : 'Edit'}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.displayName}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            displayName: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-700 font-medium">
                        {userProfile?.displayName}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Mail size={18} />
                      <label className="text-sm font-semibold">Email</label>
                    </div>
                    <p className="text-gray-700 font-medium">{user.email}</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Phone size={18} />
                      <label className="text-sm font-semibold">Phone</label>
                    </div>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editData.phone}
                        onChange={(e) =>
                          setEditData({
                            ...editData,
                            phone: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-700 font-medium">
                        {userProfile?.phone || 'Not added'}
                      </p>
                    )}
                  </div>

                  {/* User ID */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      User ID
                    </label>
                    <p className="text-gray-600 font-mono text-sm break-all">
                      {user.uid}
                    </p>
                  </div>

                  {/* Member Since */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Member Since
                    </label>
                    <p className="text-gray-700">
                      {user.metadata?.creationTime
                        ? new Date(user.metadata.creationTime).toLocaleDateString(
                            'en-IN',
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            }
                          )
                        : 'N/A'}
                    </p>
                  </div>

                  {isEditing && (
                    <button
                      onClick={handleSaveProfile}
                      disabled={loading}
                      className="btn-primary w-full py-3 font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>

                {loading ? (
                  <LoadingSpinner />
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <Package size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start shopping to see your orders here
                    </p>
                    <Link to="/shop" className="btn-primary">
                      Continue Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Link
                        key={order.orderId}
                        to={`/order/${order.orderId}`}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-gray-600 text-sm">Order ID</p>
                            <p className="font-semibold truncate">
                              {order.orderId}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Date</p>
                            <p className="font-semibold">
                              {order.createdAt
                                ? new Date(
                                    order.createdAt.toDate()
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Total</p>
                            <p className="font-semibold text-blue-600">
                              ₹{order.totalAmount.toFixed(2)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 text-sm">Status</p>
                            <p
                              className={`font-semibold ${
                                order.orderStatus === 'Delivered'
                                  ? 'text-green-600'
                                  : order.orderStatus === 'Cancelled'
                                  ? 'text-red-600'
                                  : 'text-blue-600'
                              }`}
                            >
                              {order.orderStatus}
                            </p>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <span>{order.items.length} item(s)</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;