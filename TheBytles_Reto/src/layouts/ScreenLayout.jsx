import React from 'react';
import { Navbar } from '../components/Navbar';

export const ScreenLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div className="ml-64 min-h-screen bg-[#F8F9FD] p-6">
        {children}
      </div>
    </div>
  );
};
