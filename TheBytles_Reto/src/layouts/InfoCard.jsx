import React from 'react';

// Componente reutilizable para mostrar una tarjeta de información
export const InfoCard = ({ children, className = '' }) => {
  return (
    // Contenedor con estilos de tarjeta, acepta clases adicionales vía props
    <div className={`max-w-7xl mx-auto mt-6 p-6 bg-white shadow-md rounded-3xl ${className}`}>
      {children} {/* Contenido dinámico insertado dentro de la tarjeta */}
    </div>
  );
};
