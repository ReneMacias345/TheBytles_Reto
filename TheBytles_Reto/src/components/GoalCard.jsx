import React from 'react';

export const GoalCard = ({ title, targetDate, description, onComplete }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">Target date: {targetDate}</span>
      </div>

      <div className="mt-2 h-1 bg-[#A100FF] rounded"></div>

      <div className="mt-4">
        <p className="text-sm font-bold text-gray-800">Description:</p>
        <p className="mt-1 text-gray-700 leading-relaxed">{description}</p>
      </div>
      <div className="flex justify-end">
        <button
          onClick={onComplete}
          className="mt-4 px-4 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
        >
          Complete
        </button>
      </div>
    </div>
  );
};
