import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Star } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { notify } = useNotification();

  // Ensure price is a number
  const price = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
  const stock = typeof product.stock === 'string' ? parseInt(product.stock) : product.stock;

  // Validate product data
  if (!product.id || !product.name || isNaN(price)) {
    console.warn('Invalid product data:', product);
    return null;
  }

  const handleAddToCart = () => {
    try {
      addToCart(product, 1);
      notify(`${product.name} added to cart`, 'success');
    } catch (error) {
      notify('Failed to add to cart', 'error');
    }
  };

  return (
    <div className="card">
      <Link to={`/product/${product.id}`}>
        <div className="relative overflow-hidden rounded-lg bg-gray-100 h-48 mb-4">
          <img
            src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
            }}
          />
          {product.isFeatured && (
            <span className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-semibold">
              Featured
            </span>
          )}
          {product.isTrending && (
            <span className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold">
              Trending
            </span>
          )}
          {product.isNew && (
            <span className="absolute bottom-2 left-2 bg-green-600 text-white px-2 py-1 rounded text-xs font-semibold">
              New
            </span>
          )}
        </div>
      </Link>

      <h3 className="font-semibold text-lg mb-2 truncate">
        <Link to={`/product/${product.id}`} className="hover:text-blue-600">
          {product.name}
        </Link>
      </h3>

      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < Math.floor(product.rating || 4) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="text-sm text-gray-600">({product.reviews || 0})</span>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {product.description}
      </p>

      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-blue-600">
          ₹{isNaN(price) ? '0.00' : price.toFixed(2)}
        </span>
        <button
          onClick={handleAddToCart}
          disabled={stock <= 0}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
            stock <= 0
              ? 'bg-gray-300 cursor-not-allowed text-gray-600'
              : 'btn-primary'
          }`}
        >
          <ShoppingCart size={18} />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {stock <= 0 && (
        <p className="text-red-600 text-sm mt-2 font-semibold">Out of Stock</p>
      )}
    </div>
  );
};

export default ProductCard;