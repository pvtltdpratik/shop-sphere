import React, { createContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { saveCartToFirestore, getCart } from '../firebase/firebaseServices';

export const CartContext = createContext();

const initialState = {
  items: [],
  loading: false,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    }

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ).filter(item => item.quantity > 0),
      };

    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };

    case 'CLEAR_CART':
      return { ...state, items: [] };

    case 'SET_LOADING':
      return { ...state, loading: action.payload };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { user, authInitialized } = useAuth();
  const cartLoadedRef = useRef(false);

  // Load cart only when user changes and auth is initialized
  useEffect(() => {
    if (!authInitialized) return;

    const loadCart = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        if (user) {
          const cartItems = await getCart(user.uid);
          dispatch({ type: 'SET_ITEMS', payload: cartItems });
        } else {
          // Load from localStorage if not authenticated
          const localCart = localStorage.getItem('cart');
          if (localCart) {
            dispatch({ type: 'SET_ITEMS', payload: JSON.parse(localCart) });
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadCart();
  }, [user, authInitialized]);

  // Save cart to Firestore/localStorage - debounced
  useEffect(() => {
    const saveCart = async () => {
      if (user && state.items.length >= 0) {
        try {
          await saveCartToFirestore(user.uid, state.items);
        } catch (error) {
          console.error('Error saving cart:', error);
        }
      } else if (!user) {
        // Save to localStorage if not authenticated
        localStorage.setItem('cart', JSON.stringify(state.items));
      }
    };

    const timer = setTimeout(saveCart, 500);
    return () => clearTimeout(timer);
  }, [state.items, user]);

  const addToCart = useCallback((product, quantity = 1) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        quantity,
      },
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { id: productId, quantity },
    });
  }, []);

  const removeItem = useCallback((productId) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: productId,
    });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  const cartTotal = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const itemCount = state.items.reduce((count, item) => count + item.quantity, 0);

  const value = {
    items: state.items,
    itemCount,
    cartTotal,
    loading: state.loading,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};