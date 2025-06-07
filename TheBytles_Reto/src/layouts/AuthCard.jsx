import React from 'react';

// Componente de tarjeta para pantallas de autenticación (login, registro, etc.)
export const AuthCard = ({ title, children }) => {
  return (
    // Contenedor de tarjeta con fondo blanco, bordes redondeados y sombra
    <div className="bg-white p-10 rounded-3xl shadow-xl custom-width">

      {/* Si se proporciona un título, se muestra en la parte superior centrado */}
      {title && (
        <h1 className="mb-6 text-2xl font-semibold text-center text-gray-800">
          {title}
        </h1>
      )}

      {/* Contenido dinámico dentro de la tarjeta */}
      {children}
    </div>
  );
};
