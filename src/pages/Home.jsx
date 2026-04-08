import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SkeletonLoader from '../components/SkeletonLoader';
import {
  getFeaturedProducts,
  getTrendingProducts,
  getNewProducts,
} from '../firebase/firebaseServices';

const CATEGORIES = [
  { name: 'Electronics', icon: '💻' },
  { name: 'Fashion', icon: '👗' },
  { name: 'Home', icon: '🏠' },
  { name: 'Sports', icon: '⚽' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Books', icon: '📚' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const [featured, trending, newArrivals] = await Promise.all([
          getFeaturedProducts(8).catch(err => {
            console.error('Error loading featured:', err);
            return [];
          }),
          getTrendingProducts(8).catch(err => {
            console.error('Error loading trending:', err);
            return [];
          }),
          getNewProducts(8).catch(err => {
            console.error('Error loading new products - this requires a Firestore index:', err);
            return [];
          }),
        ]);

        setFeaturedProducts(featured.filter(p => p && p.id));
        setTrendingProducts(trending.filter(p => p && p.id));
        setNewProducts(newArrivals.filter(p => p && p.id));
      } catch (error) {
        console.error('Error loading products:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Welcome to ShopSphere</h1>
            <p className="text-xl mb-8">
              Discover premium products at unbeatable prices. Shop now and enjoy fast delivery!
            </p>
            <Link
              to="/shop"
              className="btn-primary bg-white text-blue-600 hover:bg-gray-100 inline-flex items-center gap-2"
            >
              Start Shopping <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                to={`/shop?category=${category.name}`}
                className="card text-center hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="text-4xl mb-2">{category.icon}</div>
                <p className="font-semibold">{category.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/shop?featured=true"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>
          {loading ? (
            <SkeletonLoader count={4} />
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">No featured products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Trending Now</h2>
            <Link
              to="/shop?trending=true"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>
          {loading ? (
            <SkeletonLoader count={4} />
          ) : trendingProducts.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No trending products available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {trendingProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link
              to="/shop?new=true"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
            >
              View All <ChevronRight size={20} />
            </Link>
          </div>
          {loading ? (
            <SkeletonLoader count={4} />
          ) : newProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-600">
                No new arrivals yet. New products require a Firestore index to display.
                <br />
                <a
                  href="https://console.firebase.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Create index in Firebase Console
                </a>
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mx-4 mb-4">
          <p className="text-yellow-800">
            ⚠️ Some products couldn't load. Please create the required Firestore indexes.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;