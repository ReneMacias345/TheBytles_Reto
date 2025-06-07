import React from 'react';

// Componente reutilizable de botón estilizado para acciones como "Sign In" o similares
export const SignUpButton = ({
  children,       // Contenido del botón (texto o elementos)
  onClick,        // Función que se ejecuta al hacer clic
  type = 'button',// Tipo de botón (por defecto: 'button')
  className = '', // Clases adicionales para personalización
}) => {
  return (
    <button
      type={type}          // Define el tipo de botón (submit, button, etc.)
      onClick={onClick}    // Asocia la función a ejecutarse al hacer clic
      className={`
        font-medium text-[#A100FF]  
        hover:underline            
        bg-transparent              
        ${className}                
      `}
    >
      {children} // Contenido dinámico dentro del botón
    </button>
  );
};
