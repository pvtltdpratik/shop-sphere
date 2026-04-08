import React from 'react';

const LoadingSpinner = ({ size = 'md', fullPage = false }) => {
  const sizeClass = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }[size];

  const spinner = (
    <div className={`${sizeClass} border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin`} />
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        {spinner}
      </div>
    );
  }

  return <div className="flex justify-center items-center">{spinner}</div>;
};

export default LoadingSpinner;