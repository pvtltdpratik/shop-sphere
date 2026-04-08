import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { getOrderById, updateOrderStatus, subscribeToOrder } from '../../firebase/firebaseServices';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';

const statuses = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OrderDetailAdmin = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { notify } = useNotification();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (orderData) => {
      setOrder(orderData);
      setNewStatus(orderData.orderStatus);
      setLoading(false);
    });

    return unsubscribe;
  }, [orderId]);

  const handleStatusUpdate = async () => {
    if (newStatus === order.orderStatus) {
      notify('No changes to update', 'error');
      return;
    }

    try {
      setUpdating(true);
      await updateOrderStatus(orderId, newStatus);
      notify('Order status updated successfully', 'success');
    } catch (error) {
      console.error('Error updating status:', error);
      notify('Failed to update order status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  if (!order) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Order not found</h2>
        <button
          onClick={() => navigate('/admin/orders')}
          className="btn-primary"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Out for Delivery':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/admin/orders')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
      >
        <ChevronLeft size={20} />
        Back to Orders
      </button>

      <h1 className="text-3xl font-bold mb-8">Order Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Information</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Order ID</p>
                <p className="font-mono font-semibold text-sm break-all">
                  {order.orderId}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Date</p>
                <p className="font-semibold">
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Amount</p>
                <p className="font-semibold text-blue-600">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment</p>
                <p className="font-semibold text-green-600">
                  {order.paymentStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Status</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-semibold mb-2">
                  Current Status: <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input-field"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleStatusUpdate}
                disabled={updating || newStatus === order.orderStatus}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Save size={20} />
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Customer & Shipping</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Customer</h3>
                <p className="text-gray-700 font-semibold">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.email}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.phone}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Shipping Address</h3>
                <p className="text-gray-700 text-sm">
                  {order.shippingAddress.address}
                </p>
                <p className="text-gray-700 text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-700 text-sm">
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 pb-4 border-b last:border-b-0">
                  {item.image && (
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600 text-sm">
                      Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                    </p>
                    <p className="font-bold text-blue-600 mt-1">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-6">Price Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">
                  ₹
                  {(
                    order.totalAmount -
                    (order.totalAmount > 999 ? 0 : 49)
                  ).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">
                  {order.totalAmount > 999 ? 'Free' : '₹49'}
                </span>
              </div>

              <div className="border-t pt-3 flex justify-between">
                <span className="text-lg font-bold">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  ₹{order.totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold mb-3">Timeline</p>
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <strong>Created:</strong>
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleString()
                    : 'N/A'}
                </p>
                <p>
                  <strong>Updated:</strong>
                  {order.updatedAt
                    ? new Date(order.updatedAt.toDate()).toLocaleString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailAdmin;