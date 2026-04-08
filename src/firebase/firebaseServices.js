import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  addDoc,
  arrayUnion,
  arrayRemove,
  writeBatch,
  Timestamp,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from './firebaseConfig';
import { v4 as uuidv4 } from 'uuid';

// ==================== USER SERVICES ====================

export const createUserProfile = async (uid, userData) => {
  try {
    console.log('Creating user profile with:', { uid, ...userData });
    
    const userRef = doc(db, 'users', uid);
    
    const profileData = {
      uid,
      email: userData.email,
      displayName: userData.displayName || 'User',
      photoURL: userData.photoURL || null,
      isAdmin: false,
      phone: userData.phone || '',
      addresses: userData.addresses || [],
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
    
    await setDoc(userRef, profileData);
    console.log('User profile created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const getUserProfile = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      console.log('User profile found:', userDoc.data());
      return userDoc.data();
    } else {
      console.log('User profile not found:', uid);
      return null;
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (uid, updates) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    console.log('Fetching all users...');
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const users = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        uid: data.uid,
        email: data.email,
        displayName: data.displayName || 'User',
        photoURL: data.photoURL,
        isAdmin: data.isAdmin || false,
        phone: data.phone || '',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });
    
    console.log('Users fetched:', users);
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// ==================== PRODUCT SERVICES ====================

export const createProduct = async (productData, imageFiles) => {
  try {
    const productId = uuidv4();
    const imageUrls = [];

    // Upload images to Firebase Storage
    for (const imageFile of imageFiles) {
      const storageRef = ref(storage, `products/${productId}/${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    // Create product document
    const productRef = doc(db, 'products', productId);
    await setDoc(productRef, {
      id: productId,
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      category: productData.category,
      stock: parseInt(productData.stock),
      images: imageUrls,
      isFeatured: productData.isFeatured || false,
      isTrending: productData.isTrending || false,
      isNew: productData.isNew || false,
      rating: 0,
      reviews: 0,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return productId;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(productsRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    return productDoc.exists() ? productDoc.data() : null;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const getFeaturedProducts = async (count = 8) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('isFeatured', '==', true),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      };
    });
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
};

export const getTrendingProducts = async (count = 8) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('isTrending', '==', true),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      };
    });
  } catch (error) {
    console.error('Error fetching trending products:', error);
    return [];
  }
};

export const getNewProducts = async (count = 8) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('isNew', '==', true),
      orderBy('createdAt', 'desc'),
      limit(count)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      };
    });
  } catch (error) {
    console.error('Error fetching new products:', error);
    return [];
  }
};


export const getProductsByCategory = async (category) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : data.price,
        stock: typeof data.stock === 'string' ? parseInt(data.stock) : data.stock,
      };
    });
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const updateProduct = async (productId, updates, newImages = []) => {
  try {
    // Upload new images if provided
    if (newImages.length > 0) {
      const imageUrls = [];
      for (const imageFile of newImages) {
        const storageRef = ref(storage, `products/${productId}/${imageFile.name}`);
        await uploadBytes(storageRef, imageFile);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      updates.images = imageUrls;
    }

    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    // Delete product images from storage
    const product = await getProductById(productId);
    if (product && product.images) {
      for (const imageUrl of product.images) {
        try {
          const imageRef = ref(storage, imageUrl);
          await deleteObject(imageRef);
        } catch (err) {
          console.warn('Image not found, skipping:', err);
        }
      }
    }

    // Delete product document
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ==================== CART SERVICES ====================

export const saveCartToFirestore = async (userId, cartItems) => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, {
      userId,
      items: cartItems,
      updatedAt: Timestamp.now(),
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error saving cart:', error);
    throw error;
  }
};

export const getCart = async (userId) => {
  try {
    const cartRef = doc(db, 'carts', userId);
    const cartDoc = await getDoc(cartRef);
    return cartDoc.exists() ? cartDoc.data().items || [] : [];
  } catch (error) {
    console.error('Error fetching cart:', error);
    return [];
  }
};

export const clearCart = async (userId) => {
  try {
    const cartRef = doc(db, 'carts', userId);
    await setDoc(cartRef, { items: [], userId, updatedAt: Timestamp.now() });
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// ==================== ORDER SERVICES ====================

export const createOrder = async (userId, orderData) => {
  try {
    const orderId = uuidv4();
    const orderRef = doc(db, 'orders', orderId);

    await setDoc(orderRef, {
      orderId,
      userId,
      items: orderData.items,
      totalAmount: orderData.totalAmount,
      shippingAddress: orderData.shippingAddress,
      paymentId: orderData.paymentId,
      paymentStatus: 'success',
      orderStatus: 'Confirmed',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // Update product stock
    const batch = writeBatch(db);
    for (const item of orderData.items) {
      const productRef = doc(db, 'products', item.id);
      const productDoc = await getDoc(productRef);
      if (productDoc.exists()) {
        const currentStock = productDoc.data().stock;
        batch.update(productRef, {
          stock: Math.max(0, currentStock - item.quantity),
        });
      }
    }
    await batch.commit();

    return orderId;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getUserOrders = async (userId) => {
  try {
    console.log('Fetching user orders for:', userId);
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        totalAmount: typeof data.totalAmount === 'string' ? parseFloat(data.totalAmount) : data.totalAmount,
      };
    });
    
    console.log('Orders fetched:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

export const getAllOrders = async () => {
  try {
    console.log('Fetching all orders...');
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    
    const orders = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        totalAmount: typeof data.totalAmount === 'string' ? parseFloat(data.totalAmount) : data.totalAmount,
      };
    });
    
    console.log('All orders fetched:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching all orders:', error);
    throw error;
  }
};

export const subscribeToUserOrders = (userId, callback) => {
  try {
    console.log('Subscribing to user orders:', userId);
    
    const ordersRef = collection(db, 'orders');
    const q = query(
      ordersRef,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    return onSnapshot(
      q,
      snapshot => {
        const orders = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            totalAmount: typeof data.totalAmount === 'string' ? parseFloat(data.totalAmount) : data.totalAmount,
          };
        });
        console.log('User orders updated:', orders);
        callback(orders);
      },
      error => {
        console.error('Error subscribing to user orders:', error);
        // Fallback to fetching orders
        getUserOrders(userId)
          .then(orders => callback(orders))
          .catch(err => console.error('Fallback fetch failed:', err));
      }
    );
  } catch (error) {
    console.error('Error in subscribeToUserOrders:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
};


export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    const orderDoc = await getDoc(orderRef);
    return orderDoc.exists() ? orderDoc.data() : null;
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, {
      orderStatus: newStatus,
      updatedAt: Timestamp.now(),
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};



export const subscribeToOrder = (orderId, callback) => {
  const orderRef = doc(db, 'orders', orderId);
  return onSnapshot(orderRef, doc => {
    if (doc.exists()) {
      callback(doc.data());
    }
  }, error => {
    console.error('Error subscribing to order:', error);
  });
};

