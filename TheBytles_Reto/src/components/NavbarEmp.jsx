import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import supabase from '../config/supabaseClient';

export const NavbarEmp = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }
      // User info
      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, role")
        .eq("userId", userId)
        .single();

      if (userError) {
        console.error("Error fetching user info:", userError);
      } else {
        setUserData(userInfoData);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/login';

  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white flex flex-col justify-between border-r border-gray-200 z-50">
      <div>
        <div className="flex items-center p-4">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">PathExplorer</h2>
            <p className="text-xs text-gray-500">v.01</p>
          </div>
        </div>

        <nav className="mt-4 space-y-2 px-2">
          <Link
            to="/perfil"
            className="group flex items-center justify-between py-2 px-3 rounded-lg text-[#696969] transition-colors hover:bg-[#A100FF] hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 transition-colors group-hover:stroke-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              <span>Profile</span>
            </div>
            <svg
              className="w-4 h-4 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          <Link
            to="/projects"
            className="group flex items-center justify-between py-2 px-3 rounded-lg text-[#696969] transition-colors hover:bg-[#A100FF] hover:text-white"
          >
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6 transition-colors group-hover:stroke-white"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" 
                />
              </svg>
              <span>Projects</span>
            </div>
            <svg
              className="w-4 h-4 transition-colors group-hover:text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </nav>
      </div>

      <div className="p-4 flex flex-col items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            <svg
              className="w-10 h-8 text-gray-400 mx-auto my-auto"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5.121 17.804A6.978 6.978 0 0112 15c1.57 0 3.013.51 4.121 1.375M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-xs text-gray-500">{userData?.role}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-3 px-3 py-1 bg-gray-50 text-sm text-[#A100FF] rounded hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};
