import React from 'react';

export const AuthCard = ({ title, children }) => {
  return (
    <div className="bg-white p-10 rounded-3xl shadow-xl custom-width">
      {title && (
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          {title}
        </h1>
      )}
      {children}
    </div>
  );
};
