import React from 'react';
import { Navbar } from '../components/Navbar';
import { NavbarEmp } from '../components/NavbarEmp';
import { useUser } from '../context/UserContext';

export const ScreenLayout = ({ children }) => {
  const { userData, loading } = useUser();
  console.log("User clearance level:", userData?.clearanceLevel);
  if (loading) return <div>Loading layout...</div>;
  return (
    <div>
      {userData?.clearanceLevel === 1 ? <NavbarEmp /> : <Navbar />}
      <div className="ml-64 min-h-screen bg-[#F8F9FD] p-6">
        {children}
      </div>
    </div>
  );
};
