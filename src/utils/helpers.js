import { formatDistanceToNow } from 'date-fns';

export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(price);
};

export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date.toDate?.() || date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatDateTime = (date) => {
  if (!date) return 'N/A';
  return new Date(date.toDate?.() || date).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatTimeAgo = (date) => {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date.toDate?.() || date), {
    addSuffix: true,
  });
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  const regex = /^[0-9]{10}$/;
  return regex.test(phone.replace(/\D/g, ''));
};

export const truncateText = (text, length = 100) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const calculateDiscount = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

export const getShippingCost = (subtotal) => {
  return subtotal > 999 ? 0 : 49;
};