import React, { useState } from 'react';

export const GoalCard = ({ id,title, targetDate, description, onComplete, onUpdate, onDeleteStatus }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(null);
  const [editTargetDate, setEditTargetDate] = useState(null);
  const [editDescription, setEditDescription] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleYes = () => {
    setShowConfirm(false);
    onComplete(id);
  };

  const handleNo = () => {
    setShowConfirm(false);
  };

  return (
    <div name="GoalsCards" className="bg-gray-50 p-4 rounded-xl shadow-sm mb-4 relative">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <span className="text-sm text-gray-500">Target date: {targetDate}</span>
      </div>

      <div className="mt-2 h-1 bg-[#A100FF] rounded"></div>

      <div className="mt-4">
        <p className="text-sm font-bold text-gray-800">Description:</p>
        <p className="mt-1 text-gray-700 leading-relaxed">{description}</p>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <button
          title = "editGoal"
          onClick={() => {
            setEditTitle(title);
            setEditTargetDate(targetDate);
            setEditDescription(description);
            setShowEditModal(true);
          }}
          name = {title}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:opacity-90 transition"
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
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
            />
          </svg>
          Edit
        </button>
        <button
          onClick={() => setShowConfirm(true)}
          className="px-4 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
        >
          Complete
        </button>
      </div>

      {showConfirm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md relative">
            <p className="text-gray-800 font-semibold mb-4"> Are you sure you want to mark this goal as completed?</p>
            <p className="text-gray-800 font-bold mb-6 text-center "> {title} </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleYes}
                className="px-4 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
              >
                Yes
              </button>

              <button
                onClick={handleNo}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md relative">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Edit Goal</h2>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Target Date</label>
                <input
                  type="date"
                  value={editTargetDate}
                  onChange={(e) => setEditTargetDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  rows="3"
                ></textarea>
              </div>
              <div className="flex justify-between mt-6 space-x-4">
                <button
                  name = "deleteGoal"
                  type="button"
                  onClick={() => {
                    onDeleteStatus(id);
                    setShowEditModal(false);
                  }}
                  className="w-full py-2 bg-red-500 text-white rounded-full hover:opacity-90"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const updatedGoal = {
                      id,
                      title: editTitle,
                      targetDate: editTargetDate,
                      description: editDescription,
                    };
                    onUpdate(updatedGoal);
                    setShowEditModal(false);
                  }}
                  className="w-full py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
