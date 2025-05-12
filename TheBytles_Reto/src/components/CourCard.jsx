import React from 'react';

export const CourCard = ({ title, description }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-3xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
