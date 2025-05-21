import React, { useState, useEffect, useRef } from 'react';
import { ProfileCard } from './ProfileCard';
import supabase from '../config/supabaseClient';
import { cosineSimilarity } from '../utilis/cosineSimilarity'


export const ProjectCard = ({ projectId, projectName, projectDescription, staffingStage, startDate, endDate, projectPic, rfp_url = [], highlightedRoleId }) => {
  const [showProfiles, setShowProfiles] = useState(false);
  const [profiles, setProfiles] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState(null);
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const [roles, setRoles] = useState([]);
  const roleRefs = useRef({});

  const fetchRoles = async () => {
    const { data, error } = await supabase
      .from('Role')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error("Error fetching updated roles:", error);
      return;
    }

    setRoles(data);
  };

  const checkAndSetProjectReady = async () => {
    const { data: updatedRoles, error } = await supabase
      .from('Role')
      .select('status')
      .eq('project_id', projectId);
  
    if (error) {
      console.error("Error checking role statuses:", error);
      return;
    }
  
    const allFilled = updatedRoles.every(role => role.status === 'filled');
  
    if (allFilled) {
      const { error: updateError } = await supabase
        .from('Project')
        .update({ Status: 'ready' })
        .eq('Project_ID', projectId);
  
      if (updateError) {
        console.error("Error updating project status:", updateError);
      } else {
        console.log("Project status updated to 'ready'");
      }
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [projectId]);

  useEffect(() => {
    if (highlightedRoleId && roleRefs.current[highlightedRoleId]) {
      roleRefs.current[highlightedRoleId].scrollIntoView({ behavior: 'smooth', block: 'center' });
      roleRefs.current[highlightedRoleId].classList.add('ring-2', 'ring-[#A100FF]');
      setTimeout(() => {
        roleRefs.current[highlightedRoleId]?.classList.remove('ring-2', 'ring-[#A100FF]');
      }, 3000);
    }
  }, [roles, highlightedRoleId]);

const handleRoleClick = async (role) => {
  setSelectedRoleId(role.id_role);
  setShowProfiles(true);

  // 1. Validate role vector exists
  if (!role.embedding_vector) {
    console.error("Role is missing an embedding vector.");
    return;
  }

  // 2. Call Supabase RPC that returns top matched users
  const { data: topUsers, error } = await supabase.rpc('get_top8', {
    role_vec: role.embedding_vector  // Make sure column in SQL matches this name
  });

  // 3. Handle error
  if (error) {
    console.error("Error fetching top users:", error);
    return;
  }

  // 4. Process similarity % and set state
const usersWithPercent = topUsers.map(user => ({
  ...user,
 similarityPercent: typeof user.similarity === 'number'
    ? Math.min(
        Math.round((user.similarity / 0.65) * 1000) / 10,
        100
      )
    : 0.0,
}));

  setProfiles(usersWithPercent);
};

  const handleRoleSubmission = async () => {
    try {
      if (selectedUserIds.length === 0) {
        alert("No users selected.");
        return;
      }
  
      const { error: updateError } = await supabase
        .from('User')
        .update({ Status: 'staffed' })
        .in('userId', selectedUserIds);
  
      if (updateError) {
        console.error("Error updating statuses:", updateError);
        alert("Failed to update user statuses.");
        return;
      }
  
      const assignments = selectedUserIds.map(userId => ({
        id_user: userId,
        id_rol: selectedRoleId,
      }));
  
      const { error: insertError } = await supabase
        .from('User_Rol')
        .insert(assignments);
  
      if (insertError) {
        console.error("Error inserting into User_Rol:", insertError);
        alert("Users were updated but roles were not linked.");
        return;
      }
  
      const { error: roleUpdateError } = await supabase
        .from('Role')
        .update({ status: 'filled' })
        .eq('id_role', selectedRoleId);

      if (roleUpdateError) {
        console.error("Error marking role as filled:", roleUpdateError);
      }

      setRoles((prevRoles) =>
      prevRoles.map((r) =>
        r.id_role === selectedRoleId ? { ...r, status: 'filled' } : r
      )
    );

    setTimeout(() => {
      fetchRoles();
    }, 2000);

    await checkAndSetProjectReady();

      alert("Employees successfully staffed and linked to role!");
      setShowConfirm(false);
      setSelectedUserIds([]);
      setSelectedRoleId(null);
      setShowProfiles(false);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
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
              ref={el => roleRefs.current[role.id_role] = el}
              key={role.id_role}
              onClick={() =>
                  handleRoleClick(role)}
              disabled={role.status === 'filled'}
              className={`w-full text-left px-4 py-2 text-sm rounded-xl transition whitespace-normal break-words ${
                role.status === 'filled'
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
          {profiles.map((user, index) => {
            const similarity = parseFloat(user.similarityPercent);
            let colorClass = 'text-[#ef4444]';
            if (similarity > 80) colorClass = 'text-[#38B2AC]';
            else if (similarity >= 70) colorClass = 'text-orange-400';

            return (
              <ProfileCard
                key={index}
                userId={user.userId}
                isSelected={selectedUserIds.includes(user.userId)}
                onToggleSelect={(id) => {
                  setSelectedUserIds((prev) =>
                    prev.includes(id)// 👈 pass ID
                      ? prev.filter((uid) => uid !== id)
                      : [...prev, id]
                  );
                }}
                firstName={user.firstName}
                lastName={user.lastName}
                capability={user.capability}
                assignmentPercentage={user.assignmentPercentage}
                similarityPercent={user.similarityPercent}
                profilePic={user.profilePic_url}
                similarityColor={colorClass} 
              />
            );
          })}

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
                  onClick={handleRoleSubmission}
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
