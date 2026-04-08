import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus, Minus, Heart, Share2 } from 'lucide-react';
import { getProductById } from '../firebase/firebaseServices';
import { useCart } from '../hooks/useCart';
import { useNotification } from '../hooks/useNotification';
import LoadingSpinner from '../components/LoadingSpinner';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const { notify } = useNotification();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (error) {
        console.error('Error loading product:', error);
        notify('Failed to load product', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id, notify]);

  if (loading) return <LoadingSpinner fullPage />;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity <= 0) {
      notify('Please select a valid quantity', 'error');
      return;
    }
    if (quantity > product.stock) {
      notify(`Only ${product.stock} items available`, 'error');
      return;
    }
    addToCart(product, quantity);
    notify(`${product.name} added to cart!`, 'success');
    setQuantity(1);
  };

  const nextImage = () => {
    setCurrentImageIndex(
      (prev) => (prev + 1) % product.images.length
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + product.images.length) % product.images.length
    );
  };

  const handleShare = () => {
    const text = `Check out ${product.name} on ShopSphere!`;
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      notify('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-blue-600">
            Shop
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="relative rounded-lg overflow-hidden bg-gray-100 mb-4">
                <img
                  src={product.images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                        currentImageIndex === index
                          ? 'border-blue-600'
                          : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`View ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span
                        key={i}
                        className={`text-lg ${
                          i < Math.floor(product.rating || 4)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="text-gray-600">
                    ({product.reviews || 0} reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-blue-600 mb-2">
                    ₹{product.price.toFixed(2)}
                  </p>
                  <p className="text-gray-600">Inclusive of all taxes</p>
                </div>

                {/* Stock Status */}
                <div className="mb-6">
                  <p className={`font-semibold ${
                    product.stock > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : 'Out of stock'}
                  </p>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-2">Description</h2>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* Category */}
                <div className="mb-8">
                  <p className="text-gray-600">
                    <span className="font-semibold">Category:</span> {product.category}
                  </p>
                </div>
              </div>

              {/* Add to Cart Section */}
              <div className="mb-6">
                {product.stock > 0 ? (
                  <>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center border border-gray-300 rounded-lg">
                        <button
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          className="p-2 hover:bg-gray-100"
                        >
                          <Minus size={20} />
                        </button>
                        <input
                          type="number"
                          min="1"
                          max={product.stock}
                          value={quantity}
                          onChange={(e) =>
                            setQuantity(
                              Math.max(
                                1,
                                Math.min(
                                  product.stock,
                                  parseInt(e.target.value) || 1
                                )
                              )
                            )
                          }
                          className="w-16 text-center border-l border-r border-gray-300 py-2"
                        />
                        <button
                          onClick={() =>
                            setQuantity(Math.min(product.stock, quantity + 1))
                          }
                          className="p-2 hover:bg-gray-100"
                        >
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleAddToCart}
                      className="w-full btn-primary py-3 text-lg font-semibold mb-3"
                    >
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <button disabled className="w-full btn-secondary py-3 text-lg font-semibold cursor-not-allowed opacity-50 mb-3">
                    Out of Stock
                  </button>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition border-2 ${
                      isWishlisted
                        ? 'border-red-600 text-red-600'
                        : 'border-gray-300 text-gray-600 hover:border-red-600 hover:text-red-600'
                    }`}
                  >
                    <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                    Wishlist
                  </button>

                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition border-2 border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                  >
                    <Share2 size={20} />
                    Share
                  </button>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Why buy from ShopSphere?</h3>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>✓ 100% Original Products</li>
                  <li>✓ 7-Day Return Policy</li>
                  <li>✓ Fast & Free Delivery</li>
                  <li>✓ Secure Payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;