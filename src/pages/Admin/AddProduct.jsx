import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Upload } from 'lucide-react';
import { createProduct, getProductById, updateProduct } from '../../firebase/firebaseServices';
import { useNotification } from '../../hooks/useNotification';
import LoadingSpinner from '../../components/LoadingSpinner';

const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Sports', 'Beauty', 'Books'];

const AddProduct = () => {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { notify } = useNotification();
  const [loading, setLoading] = useState(!!productId);
  const [submitting, setSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    isFeatured: false,
    isTrending: false,
    isNew: false,
  });

  React.useEffect(() => {
    if (productId) {
      loadProduct();
    }
  }, [productId]);

  const loadProduct = async () => {
    try {
      const product = await getProductById(productId);
      if (product) {
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price.toString(),
          category: product.category,
          stock: product.stock.toString(),
          isFeatured: product.isFeatured,
          isTrending: product.isTrending,
          isNew: product.isNew,
        });
        setImagePreview(product.images || []);
      }
    } catch (error) {
      console.error('Error loading product:', error);
      notify('Failed to load product', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      notify('Product name is required', 'error');
      return false;
    }
    if (!formData.description.trim()) {
      notify('Description is required', 'error');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      notify('Valid price is required', 'error');
      return false;
    }
    if (!formData.category) {
      notify('Category is required', 'error');
      return false;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      notify('Valid stock is required', 'error');
      return false;
    }
    if (!productId && selectedImages.length === 0) {
      notify('At least one image is required', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setSubmitting(true);

      if (productId) {
        // Update existing product
        await updateProduct(productId, formData, selectedImages);
        notify('Product updated successfully', 'success');
      } else {
        // Create new product
        await createProduct(formData, selectedImages);
        notify('Product created successfully', 'success');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      notify(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner fullPage />;

  return (
    <div>
      <button
        onClick={() => navigate('/admin/products')}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8 font-semibold"
      >
        <ChevronLeft size={20} />
        Back to Products
      </button>

      <h1 className="text-3xl font-bold mb-8">
        {productId ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 max-w-4xl">
        <div className="space-y-6">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field resize-none"
              rows="5"
              placeholder="Enter product description"
              required
            />
          </div>

          {/* Price and Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Price (₹)
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="input-field"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Featured</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isTrending"
                checked={formData.isTrending}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">Trending</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isNew"
                checked={formData.isNew}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <span className="font-semibold">New Arrival</span>
            </label>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Product Images
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              <label className="cursor-pointer flex flex-col items-center justify-center">
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-gray-600 font-semibold">Click to upload images</span>
                <span className="text-sm text-gray-500">
                  {selectedImages.length > 0
                    ? `${selectedImages.length} image(s) selected`
                    : 'or drag and drop'}
                </span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </label>
            </div>

            {/* Image Preview */}
            {imagePreview.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-semibold mb-2">Image Preview</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative rounded-lg overflow-hidden bg-gray-100 h-32">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 btn-primary py-3 font-semibold disabled:opacity-50"
            >
              {submitting
                ? 'Saving...'
                : productId
                ? 'Update Product'
                : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="flex-1 btn-secondary py-3 font-semibold"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;