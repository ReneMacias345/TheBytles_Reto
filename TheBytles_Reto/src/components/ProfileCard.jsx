import React, { useState } from 'react';

// Componente que muestra una tarjeta de perfil de usuario
export const ProfileCard = ({ userId,profilePic,firstName,lastName,capability,assignmentPercentage,similarityPercent,isSelected,onToggleSelect,similarityColor,}) => {
  return (
    <div
      onClick={() => onToggleSelect(userId)} // Cambia el estado de selección al hacer clic
      className={`relative cursor-pointer border p-4 rounded-2xl transition-all bg-white shadow-md w-full max-w-xs text-center ${
        isSelected
          ? 'border-[#A100FF] ring-2 ring-[#A100FF] bg-purple-50' // Estilos cuando está seleccionada
          : 'border-gray-200 hover:shadow' // Estilos cuando no está seleccionada
      }`}
    >
      {/* Porcentaje de similitud en la esquina superior derecha */}
      <div className={`absolute top-2 right-3 text-xs font-semibold ${similarityColor}`}>
        {similarityPercent != null
          ? `${similarityPercent.toFixed(1)}%` // Muestra porcentaje con un decimal
          : '0%'}
      </div>

      <div className="mt-2">
        {/* Imagen de perfil */}
        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
          {profilePic ? (
            <img src={profilePic} alt="profile" className="object-cover w-full h-full" />
          ) : (
            // Placeholder si no hay imagen de perfil
            <div className="bg-gray-200 w-full h-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-10 h-10 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
          )}
        </div>

        {/* Nombre del usuario */}
        <h3 className="text-lg font-semibold mt-3">
          {firstName} {lastName}
        </h3>

        {/* Capacidad del usuario */}
        <p className="text-gray-500 text-sm">{capability}</p>
      </div>
    </div>
  );
};
