import React, { useState } from 'react';

export const CourCard = ({ title, description, date , finished}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDate, setEditDate] = useState(date);
  const [editFinished, setEditFinished] = useState(finished);
  const [editDescription, setEditDescription] = useState(description)

  return (
    <div className="bg-gray-100 p-6 rounded-3xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{description}</p>
        
      </div>
      <div className="flex justify-between items-center text-xs text-gray-500 mt-auto">
        <div>
          <p><strong>Realized:</strong> {date}</p>
          <p><strong>Completed:</strong> {finished}</p>
        </div>
        <div className="flex gap-2 items-center ml-12"></div>
        <button
          onClick={() => setShowEditModal(true)}
          className="flex items-center px-3 py-1 bg-gray-200 text-gray-800 rounded-full hover:opacity-90 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5 mr-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82
              a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685
              a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Z"
            />
          </svg>
          Edit
        </button>
        </div>
        
        {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Edit Course</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Course Name</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Realization</label>
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Date of Completion</label>
                <input
                  type="date"
                  value={editFinished}
                  onChange={(e) => setEditFinished(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  rows="3"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-full py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
              >
                Save
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
    
  );
};
