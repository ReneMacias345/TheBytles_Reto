import React from 'react';

export const InfoCard = ({ children, className = '' }) => {
  return (
    <div className={`max-w-7xl mx-auto mt-6 p-6 bg-white shadow-md rounded-3xl ${className}`}>
      {children}
    </div>
  );
};
