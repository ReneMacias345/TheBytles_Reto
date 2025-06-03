import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 

export const AlertCard = () => {
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate(); 

  const certifications = [
    "AWS Cloud Practitioner",
    "Scrum Master Certification",
    "Google Data Analytics",
  ];

  if (!visible) return null;

  return (
    <div className="bg-[#A100FF] text-white p-4 rounded-2xl shadow-lg w-[240px] relative mt-28 mx-auto">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-1 right-1 hover:text-gray-200 transition"
        aria-label="Close alert"
        style={{ background: 'transparent', right: '3px' }}
      >
        ×
      </button>

      <div className="mb-2 flex justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
          />
        </svg>
      </div>

      <p className="text-sm font-semibold mb-2 leading-snug text-center">
        The following Certifications are about to expire:
      </p>

      <ul className="text-sm list-disc pl-5 mb-3 space-y-1">
        {certifications.map((cert, idx) => (
          <li key={idx}>{cert}</li>
        ))}
      </ul>

      <div className="text-right">
        <button
          onClick={() => navigate('/perfil#certifications')} 
          className="bg-white text-[#A100FF] text-sm font-semibold px-4 py-1 rounded-full hover:bg-gray-100 transition"
        >
          See more
        </button>
      </div>
    </div>
  );
};
