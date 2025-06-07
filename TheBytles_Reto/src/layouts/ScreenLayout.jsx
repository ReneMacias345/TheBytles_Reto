import React from 'react';
// Importa las dos barras de navegación según el rol
import { Navbar } from '../components/Navbar';
import { NavbarEmp } from '../components/NavbarEmp';
// Importa el contexto del usuario
import { useUser } from '../context/UserContext';

// Componente de layout general que muestra la barra correcta y el contenido
export const ScreenLayout = ({ children }) => {
  const { userData, loading } = useUser(); // Obtiene datos del usuario desde el contexto

  console.log("User clearance level:", userData?.clearanceLevel); // Log para depuración

  // Mientras se cargan los datos, muestra mensaje
  if (loading) return <div>Loading layout...</div>;

  return (
    <div>
      {/* Muestra NavbarEmp si el clearanceLevel es 1, si no Navbar normal */}
      {userData?.clearanceLevel === 1 ? <NavbarEmp /> : <Navbar />}
      
      {/* Contenedor principal con padding y color de fondo */}
      <div className="ml-64 min-h-screen bg-[#F8F9FD] p-6">
        {children} {/* Renderiza los componentes hijos */}
      </div>
    </div>
  );
};
