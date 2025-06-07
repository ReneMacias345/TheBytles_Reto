import React from 'react';

// Componente SkillCard que representa una habilidad individual (blanda o técnica)
export const SkillCard = ({ name, type, onRemove }) => {
  // Verifica si la habilidad es de tipo "soft"
  const isSoft = type === 'soft';

  return (
    // Contenedor de la tarjeta de habilidad con estilo redondeado
    <div name='SkillCard' className="flex items-center gap-2 px-4 py-1 bg-gray-100 text-sm text-gray-700 rounded-full shadow-sm group relative">

      {/* Icono diferente según si es habilidad blanda o técnica */}
      {isSoft ? (
        // Icono para habilidades blandas
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="w-4 h-4 text-purple-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ) : (
        // Icono para habilidades técnicas
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-4 h-4 text-purple-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-2.25-2.25l3.276-3.276a4.5 4.5 0 0 0-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437 1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008Z"
          />
        </svg>
      )}

      {/* Nombre de la habilidad */}
      <span>{name}</span>

      {/* Botón de eliminación si se proporciona la función onRemove */}
      {onRemove && (
        <button
          onClick={() => onRemove(name, type)} // Llama a la función para remover esta habilidad
          name={name}
          className="absolute top-[-6px] right-[-6px] opacity-0 group-hover:opacity-100 transition-opacity bg-white text-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs border border-red-300 shadow hover:bg-red-500 hover:text-white"
          title="Remove skill"
        >
          ×
        </button>
      )}
    </div>
  );
};
