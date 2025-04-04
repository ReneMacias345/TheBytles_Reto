import React, { useState } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import { GoalCard } from '../components/GoalCard';
import supabase from '../config/supabaseClient';
import { useEffect } from 'react';

export const Perfil = () => {
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [title, setTitle] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [description, setDescription] = useState('');
  const today = new Date().toISOString().split("T")[0]


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

      // Goals
      const { data: goalsData, error: goalsError } = await supabase
        .from("Goal")
        .select("*")
        .eq("goalUserId", userId);

      if (goalsError) {
        console.error("Error fetching goals:", goalsError);
      } else {
        setGoals(goalsData);
      }

      // User info
      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, role, atc, careerLevel")
        .eq("userId", userId)
        .single();

      if (userError) {
        console.error("Error fetching user info:", userError);
      } else {
        setUserData(userInfoData);
      }
    };

    fetchData();
  }, []);

  const handleCompleteGoal = (goalTitle) => {
    alert(`Goal Completed: ${goalTitle}`);
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


  return (
    <ScreenLayout>
      <InfoCard>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
              {userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <svg
                  className="w-20 h-20 text-gray-400 mx-auto my-auto"
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
            <div className="ml-4">
              <h2 className="text-2xl font-bold text-gray-800">{userData?.firstName} {userData?.lastName}</h2>
              <p className="text-sm text-gray-500">
                {userData?.role} | {userData?.atc} | Career Level: {userData?.careerLevel}
              </p>
            </div>
          </div>
          <button
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Download CV
          </button>
        </div>
        <p className="mt-4 text-gray-700 leading-relaxed">{userData?.bio}</p>
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
          {goals.map((goal, index) => (
            <GoalCard
              key={index}
              title={goal.title}
              targetDate={goal.targetDate}
              description={goal.description}
              onComplete={() => handleCompleteGoal(goal.title)}
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
                  minLength={"20"}
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
                  minLength={"100"}
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
    </ScreenLayout>
  );
};
