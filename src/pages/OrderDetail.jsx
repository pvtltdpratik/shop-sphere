import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Package, Truck, CheckCircle } from 'lucide-react';
import { getOrderById, subscribeToOrder } from '../firebase/firebaseServices';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, (orderData) => {
      if (orderData.userId === user.uid) {
        setOrder(orderData);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [orderId, user]);

  if (loading) return <LoadingSpinner fullPage />;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <Link to="/account" className="btn-primary">
            Back to Account
          </Link>
        </div>
      </div>
    );
  }

  const getStatusStage = (status) => {
    const stages = ['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'];
    return stages.indexOf(status) + 1;
  };

  const currentStage = getStatusStage(order.orderStatus);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/account')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
        >
          <ChevronLeft size={20} />
          Back to My Orders
        </button>

        <h1 className="text-3xl font-bold mb-8">Order Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Header */}
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
                  <p className="text-gray-600 text-sm">Total Amount</p>
                  <p className="font-semibold text-blue-600">
                    ₹{order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <p className="font-semibold text-green-600">
                    {order.paymentStatus}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Status Timeline */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-6">Delivery Status</h2>
              <div className="relative">
                {/* Timeline */}
                <div className="flex justify-between mb-8">
                  {['Confirmed', 'Shipped', 'Out for Delivery', 'Delivered'].map(
                    (status, index) => {
                      const isCompleted = currentStage > index + 1;
                      const isCurrent = currentStage === index + 1;

                      return (
                        <div key={status} className="flex flex-col items-center flex-1">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold transition ${
                              isCompleted
                                ? 'bg-green-600 text-white'
                                : isCurrent
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-300 text-white'
                            }`}
                          >
                            {isCompleted ? '✓' : index + 1}
                          </div>
                          <p className="text-center text-sm font-semibold">{status}</p>
                        </div>
                      );
                    }
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-300 rounded-full h-1 mb-4">
                  <div
                    className="bg-green-600 h-1 rounded-full transition-all"
                    style={{ width: `${(currentStage / 4) * 100}%` }}
                  />
                </div>
              </div>

              <p className="text-center text-sm text-gray-600">
                Current Status: <span className="font-bold">{order.orderStatus}</span>
              </p>

              {order.deliveryDate && (
                <p className="text-center text-sm text-gray-600 mt-2">
                  Expected Delivery:{' '}
                  <span className="font-bold">
                    {new Date(order.deliveryDate).toLocaleDateString()}
                  </span>
                </p>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Items</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 pb-4 border-b last:border-b-0"
                  >
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
                        Quantity: {item.quantity}
                      </p>
                      <p className="font-bold text-blue-600 mt-1">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-semibold">
                  {order.shippingAddress.firstName}{' '}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  {order.shippingAddress.address}
                </p>
                <p className="text-gray-600 text-sm">
                  {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                  {order.shippingAddress.zipCode}
                </p>
                <p className="text-gray-600 text-sm mt-2">
                  Phone: {order.shippingAddress.phone}
                </p>
              </div>
            </div>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
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

              <Link
                to="/shop"
                className="w-full btn-secondary py-3 text-center font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;