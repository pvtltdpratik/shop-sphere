import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, Shield, Truck, RotateCcw } from 'lucide-react';

const Welcome = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-24">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to ShopSphere</h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Your ultimate destination for quality products and amazing deals
          </p>
          <div className="flex gap-4">
            <Link to="/shop" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
              Start Shopping
            </Link>
            <Link to="/login" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 transition px-8 py-3 rounded-lg font-semibold text-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ShopSphere?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Get your orders delivered in 5-7 business days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">100% Secure</h3>
              <p className="text-gray-600">Your payments are safe with Razorpay</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <Truck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Free Shipping</h3>
              <p className="text-gray-600">Free shipping on orders above ₹999</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <RotateCcw className="w-12 h-12 text-red-600 mx-auto mb-4" />
              <h3 className="font-bold mb-2">Easy Returns</h3>
              <p className="text-gray-600">7-day return policy with no questions asked</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Shop?</h2>
          <p className="text-lg mb-8 opacity-90">
            Browse thousands of products and find exactly what you're looking for
          </p>
          <Link to="/shop" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 inline-block">
            Explore Products
          </Link>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            <details className="bg-white p-6 rounded-lg shadow-md cursor-pointer">
              <summary className="font-bold text-lg">How do I create an account?</summary>
              <p className="text-gray-600 mt-3">
                Click on "Sign In" and use your Google account to create an account instantly.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md cursor-pointer">
              <summary className="font-bold text-lg">What payment methods do you accept?</summary>
              <p className="text-gray-600 mt-3">
                We accept all major payment methods through Razorpay including credit cards, debit cards, and net banking.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md cursor-pointer">
              <summary className="font-bold text-lg">How long does delivery take?</summary>
              <p className="text-gray-600 mt-3">
                Orders are typically delivered within 5-7 business days from the date of purchase.
              </p>
            </details>
            <details className="bg-white p-6 rounded-lg shadow-md cursor-pointer">
              <summary className="font-bold text-lg">Can I return products?</summary>
              <p className="text-gray-600 mt-3">
                Yes, we offer a 7-day return policy for all products. Simply contact our support team.
              </p>
            </details>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Welcome;