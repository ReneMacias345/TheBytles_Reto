import React from 'react';

export const CertCard = ({ certName, description, date, expiration }) => {
  return (
    <div className="bg-gray-100 p-6 rounded-3xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{certName}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      </div>
      <div className="text-xs text-gray-500 mt-auto">
        <p><strong>Realized:</strong> {date}</p>
        <p><strong>Expires:</strong> {expiration || 'N/A'}</p>
      </div>
    </div>
  );
};
