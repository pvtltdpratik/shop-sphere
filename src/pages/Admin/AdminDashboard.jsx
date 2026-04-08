import React, { useState, useEffect } from 'react';
import { BarChart3, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import { getAllOrders, getAllProducts, getAllUsers } from '../../firebase/firebaseServices';
import LoadingSpinner from '../../components/LoadingSpinner';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalUsers: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const [orders, products, users] = await Promise.all([
          getAllOrders(),
          getAllProducts(),
          getAllUsers(),
        ]);

        const totalRevenue = orders.reduce(
          (sum, order) => sum + order.totalAmount,
          0
        );
        const pendingOrders = orders.filter(
          (order) => order.orderStatus !== 'Delivered' && order.orderStatus !== 'Cancelled'
        ).length;

        setStats({
          totalOrders: orders.length,
          totalRevenue,
          totalProducts: products.length,
          totalUsers: users.length,
          pendingOrders,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) return <LoadingSpinner />;

  const StatCard = ({ icon: Icon, title, value, color = 'blue' }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className={`text-3xl font-bold text-${color}-600 mt-2`}>
            {typeof value === 'number' && value > 1000
              ? `₹${(value / 100000).toFixed(2)}L`
              : value}
          </p>
        </div>
        <div className={`p-3 bg-${color}-100 rounded-lg`}>
          <Icon className={`text-${color}-600`} size={32} />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          icon={ShoppingCart}
          title="Total Orders"
          value={stats.totalOrders}
          color="blue"
        />
        <StatCard
          icon={TrendingUp}
          title="Total Revenue"
          value={stats.totalRevenue}
          color="green"
        />
        <StatCard
          icon={Package}
          title="Total Products"
          value={stats.totalProducts}
          color="purple"
        />
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats.totalUsers}
          color="orange"
        />
        <StatCard
          icon={BarChart3}
          title="Pending Orders"
          value={stats.pendingOrders}
          color="red"
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.orderId} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-mono truncate">
                    {order.orderId.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {order.createdAt
                      ? new Date(order.createdAt.toDate()).toLocaleDateString()
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-blue-600">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.orderStatus === 'Delivered'
                          ? 'bg-green-100 text-green-800'
                          : order.orderStatus === 'Cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;