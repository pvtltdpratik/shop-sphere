import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  RefreshCw,
  Calendar,
  DollarSign,
  Package,
  Users
} from 'lucide-react';
import { getAllOrders } from '../../firebase/firebaseServices';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterStatus, setFilterStatus] = useState(searchParams.get('status') || '');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { notify } = useNotification();

  const statuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const allOrders = await getAllOrders();
      setOrders(allOrders.sort((a, b) => b.createdAt - a.createdAt));
    } catch (error) {
      console.error('Error loading orders:', error);
      notify('Failed to load orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = !filterStatus || order.orderStatus === filterStatus;
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.userId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusConfig = (status) => {
    const statusConfig = {
      'Delivered': { bg: 'bg-gradient-to-r from-emerald-400 to-emerald-500', text: 'text-emerald-900', icon: '✅' },
      'Cancelled': { bg: 'bg-gradient-to-r from-rose-400 to-rose-500', text: 'text-rose-900', icon: '❌' },
      'Shipped': { bg: 'bg-gradient-to-r from-blue-400 to-blue-500', text: 'text-blue-900', icon: '🚚' },
      'Out for Delivery': { bg: 'bg-gradient-to-r from-amber-400 to-amber-500', text: 'text-amber-900', icon: '📦' },
      'Confirmed': { bg: 'bg-gradient-to-r from-indigo-400 to-indigo-500', text: 'text-indigo-900', icon: '📋' }
    };
    return statusConfig[status] || { bg: 'bg-gradient-to-r from-gray-400 to-gray-500', text: 'text-gray-900', icon: '⭕' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600 font-medium">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Orders
            </h1>
            {/* <p className="text-xl text-gray-600 font-medium">Manage all customer orders ✨</p> */}
          </div>

        </div>

        {/* Stats Cards */}


        {/* Orders List */}
        <div className="space-y-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 border border-white/50">
          {filteredOrders.length === 0 ? (
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl shadow-2xl p-16 text-center border border-dashed border-gray-300">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-6 opacity-60" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders found</h3>
              <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you're looking for
              </p>
              <button
                onClick={loadOrders}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
                Refresh Orders
              </button>
            </div>
          ) : (
            filteredOrders.map(order => {
              const statusConfig = getStatusConfig(order.orderStatus);
              return (
                <Link
                  key={order.orderId}
                  to={`/admin/order/${order.orderId}`}
                  className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-white/50 overflow-hidden"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start group-hover:items-center transition-all duration-300">
                      <div className="flex-1">
                        {/* Order Info Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                              Order ID
                            </div>
                            <p className="font-mono text-xl font-black text-gray-900 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text truncate">
                              {order.orderId}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                              <Calendar className="w-4 h-4" />
                              Date
                            </div>
                            <p className="text-lg font-bold text-gray-900">
                              {order.createdAt
                                ? new Date(order.createdAt.toDate()).toLocaleDateString('en-IN', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })
                                : 'N/A'}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              Amount
                            </div>
                            <p className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
                              ₹{order.totalAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                              <Users className="w-4 h-4" />
                              Status
                            </div>
                            <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold shadow-lg ${statusConfig.bg} ${statusConfig.text}`}>
                              <span>{statusConfig.icon}</span>
                              {order.orderStatus}
                            </div>
                          </div>
                        </div>
                        
                        {/* Items Info */}
                        <div className="flex items-center gap-4 text-sm bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-2xl">
                          <div className="flex items-center gap-2 text-emerald-600 font-semibold">
                            <Package className="w-4 h-4" />
                            {order.items.length} item(s)
                          </div>
                          <div className="w-px h-6 bg-gray-300" />
                          <div className="flex items-center gap-2 text-blue-600 font-semibold">
                            📦 {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                          </div>
                        </div>
                      </div>
                      
                      {/* Chevron */}
                      <ChevronRight className="w-8 h-8 text-gray-400 group-hover:text-indigo-500 transition-colors duration-300 shrink-0 ml-6" />
                    </div>
                  </div>
                  
                  {/* Hover Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl -m-1" />
                </Link>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;