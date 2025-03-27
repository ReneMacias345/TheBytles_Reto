import React from 'react';

export const Button = ({
  children,
  onClick,
  type = 'button',
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        py-3 px-5 
        font-semibold text-white
        bg-[#A100FF]
        rounded-full 
        hover:opacity-90
        focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};
