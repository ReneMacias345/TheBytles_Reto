import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import supabase from '../config/supabaseClient';
import { AlertCard } from './AlertCard';

// Componente Navbar para la barra de navegación lateral
export const Navbar = () => {
  // Obtener la ruta actual para resaltar el enlace activo
  const location = useLocation();
  // Estado para almacenar datos del usuario
  const [userData, setUserData] = useState(null);
  
  // Efecto para cargar datos del usuario al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      // Obtener sesión del usuario
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }
      
      // Obtener información del usuario desde Supabase
      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, capability, profilePic_url")
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

  // Función para cerrar sesión
  async function signOut() {
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="fixed top-0 left-0 w-64 h-screen bg-white flex flex-col justify-between border-r border-gray-200 z-50">
      {/* Contenido superior del navbar */}
      <div>
        {/* Logo y nombre de la aplicación */}
        <div className="flex items-center p-4">
          <img src={logo} alt="Logo" className="w-8 h-8 mr-2" />
          <div>
            <h2 className="text-lg font-bold text-gray-800">PathExplorer</h2>
            <p className="text-xs text-gray-500">v.01</p>
          </div>
        </div>

        {/* Menú de navegación */}
        <nav className="mt-4 space-y-2 px-2">
          {/* Enlace al Dashboard */}
          <Link
            to="/dashboard"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/dashboard'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
          >
            <div name="Dashboard" className="flex items-center space-x-2">
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
                    d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z"
                  />
                </svg>
              <span>Dashboard</span>
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

          {/* Enlace al Perfil */}
          <Link
            to="/perfil"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/perfil'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
          >
            <div name="Profile" className="flex items-center space-x-2">
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

          {/* Enlace a Projects */}
          <Link
            to="/projects"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/projects'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
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

          {/* Enlace a Employees */}
          <Link
            to="/employees"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/employees'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
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
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" 
                />
              </svg>
              <span>Employees</span>
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
          
          {/* Enlace a Assignments */}
          <Link
            to="/assignments"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/assignments'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
          >
            <div name="Assignments" className="flex items-center space-x-2">
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
                  d="m8.99 14.993 6-6m6 3.001c0 1.268-.63 2.39-1.593 3.069a3.746 3.746 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043 3.745 3.745 0 0 1-3.068 1.593c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 0 1-3.296-1.043 3.746 3.746 0 0 1-1.043-3.297 3.746 3.746 0 0 1-1.593-3.068c0-1.268.63-2.39 1.593-3.068a3.746 3.746 0 0 1 1.043-3.297 3.745 3.745 0 0 1 3.296-1.042 3.745 3.745 0 0 1 3.068-1.594c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.297 3.746 3.746 0 0 1 1.593 3.068ZM9.74 9.743h.008v.007H9.74v-.007Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm4.125 4.5h.008v.008h-.008v-.008Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
              <span>Assignments</span>
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

          {/* Enlace a Growth */}
          <Link
            to="/growth"
            className={`group flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              location.pathname === '/growth'
                ? 'bg-[#A100FF] text-white'
                : 'text-[#696969] hover:bg-[#A100FF] hover:text-white'
            }`}
          >
            <div name="Growth" className="flex items-center space-x-2">
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
                    d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5-1.5h-9.5m0 0-.5 1.5m.75-9 3-3 2.148 2.148A12.061 12.061 0 0 1 16.5 7.605"
                  />
                </svg>
              <span>Growth</span>
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
        
        {/* Componente de alertas */}
        <AlertCard></AlertCard>
      </div>

      {/* Sección inferior del navbar con información del usuario */}
      <div className="p-4 flex flex-col items-center">
        <div className="flex items-center">
          {/* Avatar del usuario */}
          <div className="w-10 h-10 bg-gray-300 rounded-full overflow-hidden">
            {userData?.profilePic_url ? (
              <img
                src={userData.profilePic_url}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
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
            )}
          </div>

          {/* Información del usuario */}
          <div className="ml-3">
            <p className="text-sm font-semibold text-gray-800">{userData?.firstName} {userData?.lastName}</p>
            <p className="text-xs text-gray-500">{userData?.capability}</p>
          </div>
        </div>
        
        {/* Botón de logout */}
        <button
          name="logout"
          onClick={signOut}
          className="mt-3 px-3 py-1 bg-gray-50 text-sm text-[#A100FF] rounded hover:underline"
        >
          Logout
        </button>
      </div>
    </div>
  );
};