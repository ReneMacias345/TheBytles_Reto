import React from 'react';

// Componente reutilizable de botón
export const Button = ({
  children,      // Contenido dentro del botón (texto o iconos)
  onClick,       // Función que se ejecuta al hacer clic
  type = 'button', // Tipo de botón por defecto
  className = '',  // Clases adicionales opcionales
}) => {
  return (
    <button
      type={type}           // Tipo del botón (submit, button, etc.)
      onClick={onClick}     // Evento al hacer clic
      className={`
        py-3 px-5                   /* Padding interno */
        font-semibold text-white   /* Texto en blanco y negrita */
        bg-[#A100FF]               /* Fondo morado personalizado */
        rounded-full               /* Bordes redondeados completamente */
        hover:opacity-90           /* Efecto al pasar el cursor */
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2  /* Estilo de foco accesible */
        ${className}              /* Permite clases adicionales externas */
      `}
    >
      {children}  {/* Inserta contenido del botón */}
    </button>
  );
};
