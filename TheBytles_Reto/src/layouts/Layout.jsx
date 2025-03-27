import React from 'react';
import logo from '../assets/logo.png';

export const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8F9FD]">
      <header className="p-4 ml-32 mt-9">
        <div className="flex items-center">
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          <h2 className="text-lg font-bold text-gray-800">PathExplorer</h2>
          <span className="ml-2 text-xs text-gray-500">v.01</span>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      <footer className="p-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 PathExplorer</p>
      </footer>
    </div>
  );
};
