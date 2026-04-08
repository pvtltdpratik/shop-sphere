import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Download, Home } from 'lucide-react';
import { getOrderById } from '../firebase/firebaseServices';
import LoadingSpinner from '../components/LoadingSpinner';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const orderData = await getOrderById(orderId);
        setOrder(orderData);
      } catch (error) {
        console.error('Error loading order:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  if (loading) return <LoadingSpinner fullPage />;

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order not found</h2>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle size={80} className="text-green-600" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Order Placed Successfully!</h1>
            <p className="text-gray-600 text-lg">
              Thank you for your purchase. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            {/* Order Number */}
            <div className="border-b pb-6 mb-6">
              <p className="text-gray-600 text-sm mb-1">Order Number</p>
              <p className="text-2xl font-bold text-blue-600 break-all">
                {order.orderId}
              </p>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div>
                <p className="text-gray-600 text-sm">Order Date</p>
                <p className="font-semibold">
                  {order.createdAt
                    ? new Date(order.createdAt.toDate()).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Amount</p>
                <p className="font-semibold text-lg text-blue-600">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Payment Status</p>
                <p className="font-semibold text-green-600">
                  {order.paymentStatus}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Order Status</p>
                <p className="font-semibold">{order.orderStatus}</p>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold mb-3">Shipping Address</h3>
              <p className="text-gray-700">
                {order.shippingAddress.firstName}{' '}
                {order.shippingAddress.lastName}
                <br />
                {order.shippingAddress.address}
                <br />
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.zipCode}
              </p>
            </div>

            {/* Items */}
            <div className="border-t pt-6 mb-6">
              <h3 className="font-bold mb-3">Items</h3>
              <div className="space-y-3">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-6 text-right">
              <div className="flex justify-end gap-8">
                <div>
                  <p className="text-gray-600">Subtotal</p>
                  <p className="text-gray-600 mt-2">Shipping</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    ₹
                    {(
                      order.totalAmount -
                      (order.totalAmount > 999 ? 0 : 49)
                    ).toFixed(2)}
                  </p>
                  <p className="font-semibold mt-2">
                    {order.totalAmount > 999 ? 'Free' : '₹49'}
                  </p>
                </div>
              </div>
              <div className="border-t mt-4 pt-4 flex justify-end gap-8">
                <p className="text-lg font-bold">Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  ₹{order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-bold mb-3">What's Next?</h3>
            <ol className="space-y-2 text-gray-700">
              <li>
                <span className="font-semibold">1.</span> You'll receive an email
                confirmation shortly
              </li>
              <li>
                <span className="font-semibold">2.</span> Our team will prepare your
                order
              </li>
              <li>
                <span className="font-semibold">3.</span> You'll receive a tracking
                link when shipped
              </li>
              <li>
                <span className="font-semibold">4.</span> Expected delivery in 5-7
                business days
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => navigate(`/order/${orderId}`)}
              className="flex-1 btn-primary py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Download size={20} />
              View Order Details
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 btn-secondary py-3 font-semibold flex items-center justify-center gap-2"
            >
              <Home size={20} />
              Back to Home
            </button>
          </div>

          <p className="text-center text-sm text-gray-600 mt-6">
            Order ID: <span className="font-mono">{order.orderId}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;