import React, { useState } from 'react';

export const AlertCard = () => {
  const certifications = [
    "AWS Cloud Practitioner ",
    "Scrum Master Certification ",
    "Google Data Analytics "
  ];

  return (
    <div className="bg-[#A100FF] text-white p-6 rounded-3xl shadow-md w-64 relative">
      <button className="absolute top-2 right-2 text-white hover:text-gray-300 transition">
        ×
      </button>

      <p className="text-sm font-semibold mb-2">
        The following Certifications are about to expire:
      </p>

      <ul className="text-sm list-disc pl-5 mb-4 space-y-1">
        {certifications.map((cert, idx) => (
          <li key={idx}>{cert}</li>
        ))}
      </ul>

      <button className="text-sm bg-white text-[#A100FF] font-semibold px-4 py-1 rounded-full hover:bg-gray-100 transition">
        See more
      </button>
    </div>
  );
};
