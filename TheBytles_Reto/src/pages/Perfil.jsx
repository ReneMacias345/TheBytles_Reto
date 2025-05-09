import React, { useState, useRef} from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import { GoalCard } from '../components/GoalCard';
import { SkillCard } from '../components/SkillCard';
import supabase from '../config/supabaseClient';
import { useEffect } from 'react';
import { CertCard } from '../components/CertCard';

export const Perfil = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const today = new Date().toISOString().split("T")[0]
  const [showBioForm, setShowBioForm] = useState(false);
  const [newBio, setNewBio] = useState('');
  const [cvFile, setCVFile] = useState(null);
  const profilePicInputRef = useRef(null);
  const cvInputRef = useRef(null);
  
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [skillSuggestions, setSkillSuggestions] = useState([]);

  const [showCertForm, setShowCertForm] = useState(false);
  const [certName, setCertName] = useState('');
  const [certDate, setCertDate] = useState('');
  const [certExpire, setCertExpire] = useState('');
  const [certDesc, setCertDesc] = useState('');

  const [certifications, setCertifications] = useState([
    {
      cert_name: "Certified Digital Product Leader (CDPL)",
      cert_date: "2023-06-01",
      expiration_date: "2026-06-01",
      description: "Product strategy, digital transformation and go-to-market execution."
    },
    {
      cert_name: "Mobile Commerce & Loyalty Certification",
      cert_date: "2023-08-15",
      expiration_date: "2025-08-15",
      description: "Covers mobile UX, user retention and loyalty systems."
    },
    {
      cert_name: "AI-Driven Personalization Specialist",
      cert_date: "2024-01-10",
      expiration_date: "2026-01-10",
      description: "Agile development with backlog prioritization and sprint planning."
    }
  ]);
  const [skills, setSkills] = useState({
    technical: [],
    soft: []
  });

  const [availableSkills, setAvailableSkills] = useState([]);
  const [softSkills, setSoftSkills] = useState([]);
  const [skillNameToIdMap, setSkillNameToIdMap] = useState({});

  const [goals, setGoals] = useState([]);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;
  
      if (!userId) {
        console.error("User not logged in.");
        return;
      }
  
      const { data: goalsData, error: goalsError } = await supabase
        .from("Goal")
        .select("*")
        .eq("goalUserId", userId);
  
      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
      } else {
        setGoals(goalsData);
      }
  
      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, capability, atc, careerLevel, bio, cv_url, profilePic_url")
        .eq("userId", userId)
        .single();
  
      if (userError) {
        console.error("Error fetching user info:", userError);
      } else {
        setUserData(userInfoData);
      }
      
      const { data: skillsData, error: skillsError } = await supabase
        .from("Skills")
        .select("SkillID, SkillName, Type");
        
      if (skillsError) {
        console.error("Error fetching skills:", skillsError);
      } else {
        const allSkills = skillsData.map(skill => skill.SkillName);
        setAvailableSkills(allSkills);
        
        const softSkillsList = skillsData
          .filter(skill => skill.Type === "Soft")
          .map(skill => skill.SkillName);
        setSoftSkills(softSkillsList);
        
        // Crear un mapa de nombres de habilidades a sus IDs para uso posterior
        const skillNameToIdMap = {};
        skillsData.forEach(skill => {
          skillNameToIdMap[skill.SkillName] = skill.SkillID;
        });
        setSkillNameToIdMap(skillNameToIdMap);
      }
      
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from("User_Skills")
        .select(`
          skillid,
          Skills (SkillID, SkillName, Type)
        `)
        .eq("userid", userId);
        
      if (userSkillsError) {
        console.error("Error fetching user skills:", userSkillsError);
      } else {
        const technicalSkills = [];
        const softSkills = [];
        
        userSkillsData.forEach(item => {
          if (item.Skills.Type === "Soft") {
            softSkills.push(item.Skills.SkillName);
          } else {
            technicalSkills.push(item.Skills.SkillName);
          }
        });
        
        setSkills({
          technical: technicalSkills,
          soft: softSkills
        });
      }
    };
  
    fetchData();
  }, []);

  const handleCompleteGoal = async (goalId) => {
    const { data, error } = await supabase
      .from("Goal")
      .update({ Status: "completed" })
      .eq("Goal_ID", goalId)
      .select();
  
    if (error) {
      console.error("Error marking goal as completed:", error);
      return;
    }
  
    const updatedGoals = goals.map((goal) =>
      goal.Goal_ID === goalId ? data[0] : goal
    );
    setGoals(updatedGoals);
  };

  const handleAddGoal = () => {
    setShowGoalForm(true);
  };

  const handleCloseForm = () => {
    setShowGoalForm(false);
    setTitle('');
    setTargetDate('');
    setDescription('');
  };

  const handleSaveGoal = async (e) => {
    e.preventDefault();
  
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      console.error("User not logged in.");
      return;
    }
  
    const newGoal = {
      title,
      targetDate, // YYYY-MM-DD
      description,
      goalUserId: userId,
    };
  
    const { data, error } = await supabase
      .from("Goal")
      .insert([newGoal])
      .select(); 
  
    if (error) {
      console.error("Error inserting goal:", error);
      return;
    }
  
    setGoals([...goals, data[0]]);
    handleCloseForm(); 
  };

  const handleOpenBioForm = () => {
    setNewBio(userData?.bio || "");
    setShowBioForm(true);
  };

  const handleUpdateGoal = async (updatedGoal) => {
    const { data, error } = await supabase
      .from("Goal")
      .update({
        title: updatedGoal.title,
        targetDate: updatedGoal.targetDate,
        description: updatedGoal.description,
      })
      .eq("Goal_ID", updatedGoal.id)
      .select();
  
    if (error) {
      console.error("Error updating goal:", error);
      return;
    }
  
    const updatedGoals = goals.map((goal) =>
      goal.Goal_ID === updatedGoal.id ? data[0] : goal
    );
    setGoals(updatedGoals);
  };

  const handleAbandonGoal = async (goalId) => {
    const { data, error } = await supabase
      .from("Goal")
      .update({ Status: "abandoned" })
      .eq("Goal_ID", goalId)
      .select();
  
    if (error) {
      console.error("Error marking goal as abandoned:", error);
      return;
    }
  
    const updatedGoals = goals.map((goal) =>
      goal.Goal_ID === goalId ? data[0] : goal
    );
    setGoals(updatedGoals);
  };

  const handleSaveBio = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      console.error("User not logged in.");
      return;
    }
  
    const { error } = await supabase
      .from("User")
      .update({ bio: newBio })
      .eq("userId", userId);
  
    if (error) {
      console.error("Error updating bio:", error);
      return;
    }
  
    setUserData({ ...userData, bio: newBio });
    setShowBioForm(false);
  };

  const handleProfilePicChange = async (e) => {
    const file = e.target.files[0];
  
    if (!file || !file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
  
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      console.error("User not logged in.");
      return;
    }
  
    const fileName = `profilepics/${userId}-${Date.now()}.png`;
    const contentType = file.type || "image/png";
  
    // Subir la imagen
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file, {
        upsert: true,
        contentType,
        cacheControl: "3600",
      });
  
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      alert("Error uploading profile picture.");
      return;
    }
  
    // Obtener la URL pública
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);
  
    const publicUrl = publicUrlData?.publicUrl;
    if (!publicUrl) {
      alert("Failed to get public URL.");
      return;
    }
  
    // Guardar en la tabla User
    const { error: updateError } = await supabase
      .from("User")
      .update({ profilePic_url: publicUrl })
      .eq("userId", userId);
  
    if (updateError) {
      console.error("Error saving profile URL:", updateError.message);
      alert("Profile picture uploaded, but failed to update profile.");
      return;
    }
  
    // Actualizar estado local
    setUserData(prev => ({ ...prev, profilePic_url: publicUrl }));
    alert("Profile picture updated!");
  };
  

  const handleCVChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setCVFile(file);
      uploadCVToSupabase(file); // <- llama la nueva función
    } else {
      alert('Please upload a PDF file.');
    }
  };
  
  const uploadCVToSupabase = async (file) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId || !file) {
      console.error("User not logged in or file missing.");
      alert("You must be logged in and select a valid file.");
      return;
    }
  
    const fileExt = file.name.split('.').pop();
    const fileName = `cvs/${userId}-cv.pdf`;
    const contentType = file.type || "application/pdf";
  
    // 🔥 Eliminar archivo anterior si existe
    const { data: deletedData, error: deleteError } = await supabase.storage
      .from("media")
      .remove([fileName]);
  
    if (deleteError) {
      console.error("❌ Delete error:", deleteError.message);
    } else {
      console.log("✅ Deleted previous file:", deletedData);
    }
  
    // 📤 Subir nuevo archivo
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media")
      .upload(fileName, file, {
        upsert: false,
        contentType,
        cacheControl: '3600',
      });
  
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      alert("Error uploading CV. Please try again.");
      return;
    }
  
    // 🔗 Obtener la URL pública del archivo
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);
  
    const publicUrl = publicUrlData.publicUrl;
  
    // 📝 Actualizar `cv_url` en la tabla User
    const { error: updateError } = await supabase
      .from("User")
      .update({ cv_url: publicUrl })
      .eq("userId", userId);
  
    if (updateError) {
      console.error("Error updating user CV URL:", updateError.message);
      alert("CV uploaded but failed to link it to your profile.");
      return;
    }
  
    // ✅ Actualizar estado local en el frontend
    setUserData(prev => ({ ...prev, cv_url: publicUrl }));
    alert("CV uploaded and linked successfully!");
    await fetch("http://localhost:8000/generate-summary", {
      method: "POST",
      body: JSON.stringify({ user_id: userId }),
      headers: { "Content-Type": "application/json" },
  });
  };
  
  useEffect(() => {
    if (!newSkill) {
      setSkillSuggestions([]);
      return;
    }
    const filtered = availableSkills.filter(skill =>
      skill.toLowerCase().includes(newSkill.toLowerCase())
    );
    setSkillSuggestions(filtered);
  }, [newSkill, availableSkills]);

  const handleAddSkill = async () => {
    const trimmedSkill = newSkill.trim();
    const isInSuggestions = availableSkills.some(
      (skill) => skill.toLowerCase() === trimmedSkill.toLowerCase()
    );
    const isAlreadyAdded =
      skills.technical.includes(trimmedSkill) || skills.soft.includes(trimmedSkill);
  
    if (isAlreadyAdded) {
      alert("You already have this skill.");
      return;
    }
  
    if (!isInSuggestions) {
      alert("Please select a skill from the suggestion list.");
      return;
    }
  
    const isSoft = softSkills.includes(trimmedSkill);
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId) {
      console.error("User not logged in.");
      return;
    }
  
    const skillId = skillNameToIdMap[trimmedSkill];
    
    if (!skillId) {
      alert("Error identifying skill ID. Please try again.");
      return;
    }

    const { error } = await supabase
      .from("User_Skills")
      .insert([
        { 
          userid: userId,
          skillid: skillId
        }
      ]);
  
    if (error) {
      console.error("Error adding skill to user:", error);
      alert("Failed to add skill. Please try again.");
      return;
    }
  
    setSkills((prev) => ({
      ...prev,
      [isSoft ? 'soft' : 'technical']: [...prev[isSoft ? 'soft' : 'technical'], trimmedSkill]
    }));
  
    setNewSkill('');
    setSkillSuggestions([]);
    setShowSkillForm(false);
  };

  const handleRemoveSkill = async (skillName, skillType) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    if (!userId) {
      console.error("User not logged in.");
      return;
    }

    const skillId = skillNameToIdMap[skillName];
    
    if (!skillId) {
      alert("Error identifying skill ID. Please try again.");
      return;
    }

    const { error } = await supabase
      .from("User_Skills")
      .delete()
      .eq("userid", userId)
      .eq("skillid", skillId);

    if (error) {
      console.error("Error removing skill from user:", error);
      alert("Failed to remove skill. Please try again.");
      return;
    }

    // Actualizar el estado local
    setSkills((prev) => ({
      ...prev,
      [skillType]: prev[skillType].filter(skill => skill !== skillName)
    }));

  };
  const handleSaveCert = (e) => {
    e.preventDefault();
    const newCert = {
      cert_name: certName,
      cert_date: certDate,
      expiration_date: certExpire,
      description: certDesc
    };
    setCertifications((prev) => [...prev, newCert]);
    setShowCertForm(false);
    setCertName('');
    setCertDate('');
    setCertExpire('');
    setCertDesc('');
  };
  
  return (
    <ScreenLayout>
      <InfoCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative w-24 h-24 bg-gray-200 rounded-full">
              {userData?.profilePic_url ? (
                <img
                  src={userData.profilePic_url}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <svg
                  className="w-24 h-20 text-gray-400 mx-auto my-auto"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A6.978 6.978 0 0112 15c1.57 0 3.013.51 4.121 1.375M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 20h20" />
                </svg>
              )}
  
              <button
                onClick={() => profilePicInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white border border-gray-300 rounded-full p-1 shadow-md z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-5 h-5 text-gray-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>

            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-800">
                {userData?.firstName} {userData?.lastName}
              </h2>
              <p className="text-sm text-gray-500">
                {userData?.capability} | {userData?.atc} | Career Level: {userData?.careerLevel}
              </p>
              {userData?.cv_url && (
                <a
                  href={`${userData.cv_url}?t=${Date.now()}`} // 💡 evita caché
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-[#A100FF] hover:underline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  View CV
                </a>
              )}

            </div>
          </div>
          
          <button
            onClick={() => cvInputRef.current.click()}
            className="flex items-center border border-gray-300 px-4 py-2 rounded-full text-white bg-[#A100FF] hover:bg-[#A100FF] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            Upload CV
          </button>
          <input
            type="file"
            ref={cvInputRef}
            accept="application/pdf"
            className="hidden"
            onChange={handleCVChange}
          />
        </div>

        <p className="mt-4 text-gray-700 leading-relaxed">
          {userData?.bio}
        </p>      
        <div className="mt-4">
          <button
            onClick={handleOpenBioForm}
            className="border border-gray-300 px-4 py-2 rounded-full text-white bg-[#A100FF] hover:bg-[#A100FF] transition-colors"
          >
            Bio
          </button>
        </div>
        <input
          type="file"
          ref={profilePicInputRef}
          accept="image/png"
          className="hidden"
          onChange={handleProfilePicChange}
        />
      </InfoCard>

      <InfoCard>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Professional Goals</h2>
          <button
            onClick={handleAddGoal}
            className="flex items-center px-3 py-1 bg-gray-50 text-sm text-[#A100FF] rounded hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2 transition-colors group-hover:stroke-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Add new goal
          </button>
        </div>
        <div className="mt-4">
          {goals
            .filter((goal) => goal.Status === "active")
            .map((goal) => (
              <GoalCard
                key={goal.Goal_ID}
                id={goal.Goal_ID}
                title={goal.title}
                targetDate={goal.targetDate}
                description={goal.description}
                onComplete={handleCompleteGoal}
                onUpdate={handleUpdateGoal}
                onDeleteStatus={handleAbandonGoal}
              />
          ))}
        </div>
      </InfoCard>

      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Skills</h3>
          <button
            onClick={() => {
              setNewSkill('');
              setShowSkillForm(true);
            }}
            className="flex items-center px-3 py-1 bg-gray-50 text-sm text-[#A100FF] rounded hover:underline"
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2 transition-colors group-hover:stroke-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Add new skill
          </button>
        </div>

        <div className="mb-4">
          <h4 className="bg-[#A100FF] text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-2">Technical</h4>
          <div className="flex flex-wrap gap-2">
            {skills.technical.map((skill, index) => (
              <SkillCard 
                key={index} 
                name={skill} 
                type="technical"
                onRemove={handleRemoveSkill} 
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="bg-[#A100FF] text-white px-3 py-1 rounded-full inline-block text-sm font-medium mb-2">Soft</h4>
          <div className="flex flex-wrap gap-2">
            {skills.soft.map((skill, index) => (
              <SkillCard 
                key={index} 
                name={skill} 
                type="soft"
                onRemove={handleRemoveSkill} 
              />
            ))}
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">Certifications</h3>
          <button
            onClick={() => {
              setCertName('');
              setCertDate('');
              setCertExpire('');
              setCertDesc('');
              setShowCertForm(true);
            }}
            className="flex items-center px-3 py-1 bg-gray-50 text-sm text-[#A100FF] rounded hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 inline-block mr-2 transition-colors group-hover:stroke-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            Add new certification
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 max-h-[600px] overflow-y-auto pr-2">
          {certifications.map((cert, index) => (
            <CertCard
              key={index}
              certName={cert.cert_name}
              date={cert.cert_date}
              expiration={cert.expiration_date}
              description={cert.description}
            />
          ))}
        </div>
      </InfoCard>

      {showGoalForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-md relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Professional Goal</h2>
            <form onSubmit={handleSaveGoal} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  minLength={"10"}
                  maxLength={"50"}
                  className="w-full px-3 py-2 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Target Date</label>
                <input
                  type="date"
                  min={today}
                  className="w-full px-3 py-2 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="w-full px-3 py-2 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                  rows="3"
                  minLength={"50"}
                  maxLength={"250"}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full mt-3 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
              >
                Save Goal
              </button>
            </form>
          </div>
        </div>
      )}
     {showBioForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-md relative">
            <button
              onClick={() => setShowBioForm(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-center mb-4">Edit Bio</h2>
            <div className="space-y-4">
              <label className="block mb-1 text-sm font-large text-gray-700">Tell us about your strength, experiences and skills :</label>
              <textarea
                className="w-full px-3 py-2 text-base text-gray-700 bg-gray-100 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#A100FF]"
                rows="3"
                value={newBio}
                onChange={(e) => setNewBio(e.target.value)}
              />
              <button
                onClick={handleSaveBio}
                className="w-full mt-3 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showSkillForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md relative">
            <button
              onClick={() => setShowSkillForm(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-center mb-4">New skill</h3>
          
            <input
              type="text"
              placeholder="Search"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="w-full mb-2 px-3 py-2 border rounded-lg bg-gray-50"
            />

            {skillSuggestions.length > 0 && (
              <ul className="border mb-3 rounded-lg bg-white shadow max-h-40 overflow-y-auto z-50">
                {skillSuggestions.map((skill, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setNewSkill(skill);
                    }}
                  >
                    {skill}
                  </li>
                ))}
              </ul>)}
            <button
              onClick={handleAddSkill}
              className="w-full py-2 bg-[#A100FF] text-white rounded-full"
            >
              Save skill
            </button>
          </div>
        </div>
      )}
      {showCertForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-md relative">
            <button
              onClick={() => setShowCertForm(false)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h3 className="text-lg font-bold text-center mb-4">New Certification</h3>
            <form onSubmit={handleSaveCert} className="space-y-3">
              <input
                type="text"
                placeholder="Certification Name"
                value={certName}
                minLength={"10"}
                maxLength={"40"}
                onChange={(e) => setCertName(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                required
              />
              <input
                type="date"
                placeholder="Date of realization"
                min = "2020-01-01"
                value={certDate}
                onChange={(e) => setCertDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                required
              />
              <input
                type="date"
                placeholder="Expiration date"
                value={certExpire}
                onChange={(e) => setCertExpire(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
              />
              <textarea
                placeholder="Description"
                rows="3"
                value={certDesc}
                minLength={"10"}
                maxLength={"80"}
                onChange={(e) => setCertDesc(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg bg-gray-50"
                required
              />
              <button
                type="submit"
                className="w-full py-2 bg-[#A100FF] text-white rounded-full"
              >
                Save Certification
              </button>
            </form>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};