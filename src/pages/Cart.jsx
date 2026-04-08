import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const Cart = () => {
  const { items, removeItem, updateQuantity } = useCart();
  const { notify } = useNotification();

  const { subtotal, shipping, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = subtotal > 999 ? 0 : 49;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items]);

  const handleRemove = (productId) => {
    removeItem(productId);
    notify('Item removed from cart', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center py-20">
            <ShoppingCart size={80} className="text-gray-300 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link to="/shop" className="btn-primary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 p-6 border-b last:border-b-0 hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      to={`/product/${item.id}`}
                      className="text-lg font-semibold hover:text-blue-600 mb-2"
                    >
                      {item.name}
                    </Link>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{item.price.toFixed(2)}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-gray-300 rounded-lg">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="p-2 hover:bg-gray-100"
                      >
                        <Minus size={18} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="w-12 text-center border-l border-r border-gray-300 py-2"
                      />
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-2 hover:bg-gray-100"
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right sm:col-span-2 sm:col-span-none">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-xl font-bold">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                  </span>
                </div>

                {shipping === 0 && (
                  <p className="text-sm text-green-600 font-semibold">
                    ✓ Free shipping on this order!
                  </p>
                )}

                {shipping > 0 && (
                  <p className="text-sm text-gray-600">
                    Free shipping above ₹999
                  </p>
                )}

                <div className="border-t pt-4">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                to="/checkout"
                className="w-full btn-primary py-3 text-center font-semibold mb-4"
              >
                Proceed to Checkout
              </Link>

              <details className="text-sm text-gray-600">
                <summary className="cursor-pointer font-semibold mb-2">
                  Have a coupon?
                </summary>
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">Coming soon!</p>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;