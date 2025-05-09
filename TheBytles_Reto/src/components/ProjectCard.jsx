import React, { useState, useEffect } from 'react';
import { ProfileCard } from './ProfileCard';
import supabase from '../config/supabaseClient';
import { cosineSimilarity } from '../utilis/cosineSimilarity'


export const ProjectCard = ({ projectName, projectDescription, staffingStage, startDate, endDate, projectPic, rfp_url, roles = [] }) => {
  const [showProfiles, setShowProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [assignedRoles, setAssignedRoles] = useState([]);




  useEffect(() => {
    const fetchProfiles = async () => {
      const { data, error } = await supabase
        .from('User')
        .select('firstName, lastName, capability') 
        .limit(8); 

      if (error) {
        console.error("Error fetching profiles:", error);
      } else {
        setProfiles(data);
      }
    };

    if (showProfiles) fetchProfiles();
  }, [showProfiles]);

  const handleRoleClick = async (role) => {
    setSelectedRoleId(role.id_role);
    setShowProfiles(true);

    if (!role.embedding_vector) {
      console.error("Role is missing an embedding vector.");
      return;
    }

    const { data: users, error } = await supabase
    .from('User')
    .select('firstName, lastName, capability, assignmentPercentage, embedding');


    if (error) {
      console.error("Error fetching user embeddings:", error);
      return;
    }
  
    // se calcula similtiud con rol 
    const scoredUsers = users
    .filter(u => u.embedding)
    .map(user => {
      const sim = cosineSimilarity(role.embedding_vector, user.embedding);
      return {
        ...user,
        similarity: sim,
        similarityPercent: ((1 - sim) * 100).toFixed(1), 
      };
    });

  const topMatches = scoredUsers
    .sort((a, b) => a.similarity - b.similarity)
    .slice(0, 8);

  setProfiles(topMatches);
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-lg mb-6">
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {projectPic ? (
              <img src={projectPic} alt="Project" className="w-full h-full object-cover" />
            ) : (
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.121 17.804A6.978 6.978 0 0112 15
                    c1.57 0 3.013.51 4.121 1.375
                    M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 20h20"
                />
              </svg>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">{projectName}</h2>
            <p className="text-sm text-gray-500">Start Date: {startDate}</p>
          </div>
        </div>
        <button
            onClick={() => {
              if (rfp_url) {
                const link = document.createElement('a');
                link.href = rfp_url;
                link.download = rfp_url.split('/').pop(); // opcional: usa el nombre del archivo
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } else {
                alert("No RFP file available.");
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Download RFP
          </button>
      </div>
      <div className="mt-4">
        <p className="text-gray-700 leading-relaxed text-gd">
          {projectDescription}
        </p>
      </div>
      {/* ROLES */}
      {roles.length > 0 && (
      <div className="mt-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">Available Roles:</h3>
        <div className="flex flex-col gap-2">
          {roles.map((role) => (
            <button
              key={role.id_role}
              onClick={() => {
                if (!assignedRoles.includes(role.id_role)) {
                  handleRoleClick(role);
                }
              }}
              disabled={assignedRoles.includes(role.id_role)}
              className={`w-full text-left px-4 py-2 text-sm rounded-xl transition whitespace-normal break-words ${
                assignedRoles.includes(role.id_role)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : selectedRoleId === role.id_role
                    ? 'bg-[#A100FF] text-white'
                    : 'bg-white text-gray-700 hover:bg-purple-200 hover:text-[#A100FF]'
              }`}
              
            >
              {role.role_description}
            </button>
          ))}
        </div>
      </div>
    )}

      {showProfiles && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          {profiles.map((user, index) => (
            <ProfileCard
              key={index}
              firstName={user.firstName}
              lastName={user.lastName}
              capability={user.capability}
              assignmentPercentage={user.assignmentPercentage}
              similarityPercent={user.similarityPercent}
              // profilePic={user.profilePic}
            />
          ))}
          <div className="col-span-4 flex justify-center mt-4">
            <button 
              onClick={() => setShowConfirm(true)}
              className="w-1/2 py-3 bg-[#A100FF] text-white text-lg rounded-full hover:opacity-90 transition">
              Add to Project
            </button>
          </div>
        </div>
      )}
      {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
              <button
                onClick={() => setShowConfirm(false)}
                className="absolute top-3 right-3 bg-gray-400 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                &times;
              </button>
              <h2 className="text-xl font-bold text-center mb-4">Are you sure?</h2>
              <p className="text-gray-700 text-center mb-6">
                You want to add these employees to the project: {projectName}?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    alert("Employees assigned!"); 
                    setAssignedRoles(prev => [...prev, selectedRoleId]);
                    setShowConfirm(false);
                    setSelectedRoleId(null); 
                  }}
                  className="px-6 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
    
  );
};
