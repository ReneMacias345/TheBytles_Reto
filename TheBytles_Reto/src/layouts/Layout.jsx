import React from 'react';
// Importa el logo de la aplicación
import logo from '../assets/logo.png';

// Componente de layout general con encabezado, contenido y pie de página
export const Layout = ({ children }) => {
  return (
    // Contenedor principal con diseño vertical y fondo claro
    <div className="flex flex-col min-h-screen bg-[#F8F9FD]">

      {/* Encabezado con el logo y título */}
      <header className="p-4 ml-32 mt-9">
        <div className="flex items-center">
          {/* Logo de la aplicación */}
          <img src={logo} alt="Logo" className="w-10 h-10 mr-2" />
          {/* Nombre de la app */}
          <h2 className="text-lg font-bold text-gray-800">PathExplorer</h2>
          {/* Versión de la app */}
          <span className="ml-2 text-xs text-gray-500">v.01</span>
        </div>
      </header>

      {/* Contenido principal (dinámico, se inyecta con children) */}
      <main className="flex-1 flex items-center justify-center">
        {children}
      </main>

      {/* Pie de página con texto de derechos */}
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 PathExplorer</p>
      </footer>
    </div>
  );
};
