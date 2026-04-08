import React from 'react';

const Toast = ({ message, type }) => {
  return (
    <div className={`toast toast-${type}`}>
      {message}
    </div>
  );
};

export default Toast;
