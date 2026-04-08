import React, { createContext, useCallback } from 'react';
import toast from 'react-hot-toast';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const notify = useCallback((message, type = 'success', duration = 3000) => {
    switch (type) {
      case 'success':
        toast.success(message, { duration });
        break;
      case 'error':
        toast.error(message, { duration });
        break;
      case 'loading':
        toast.loading(message);
        break;
      default:
        toast(message, { duration });
    }
  }, []);

  const value = { notify };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};