import React from 'react';

export const ProfileCard = ({ profilePic, firstName, lastName, capability }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 w-full max-w-xs text-center">
      <div className="flex justify-between items-center">
      </div>
      <div className="mt-2">
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
          {profilePic ? (
            <img src={profilePic} alt="profile" className="object-cover w-full h-full" />
          ) : (
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          )}
        </div>
        <h3 className="text-lg font-semibold mt-3">{firstName} {lastName}</h3>
        <p className="text-gray-500 text-sm">{capability}</p>
      </div>
    </div>
  );
};
