import React from 'react';

export const SignUpButton = ({
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
        font-medium text-[#A100FF]
        hover:underline
        bg-transparent
        ${className}
      `}
    >
      {children}
    </button>
  );
};
