import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import supabase from '../config/supabaseClient';

export const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      const { data: userInfoData, error } = await supabase
        .from("User")
        .select("firstName, lastName")
        .eq("userId", userId)
        .single();

      if (error) {
        console.error("Error fetching user info:", error);
      } else {
        setUserData(userInfoData);
      }
    };

    fetchUserInfo();
  }, []);

  const workingIn = {
    projectName: 'Mobile Application for Starbucks',
    projectDescription: 'Mobile app for placing Starbucks orders online',
    role: 'SCRUM Master',
    startDate: '13/05/2025',
    endDate: '13/08/2025'
  };

  const projects = [
    {
      ...workingIn,
      feedback: 'Pedro managed the SCRUM team with excellent communication and delivery pace.'
    },
    {
      projectName: 'E-Commerce Platform for Nike',
      projectDescription: 'Online store for Nike products and accessories',
      role: 'Web Dev',
      startDate: '01/06/2025',
      endDate: '01/11/2025',
      feedback: 'Delivered well-structured and responsive frontend components.'
    },
    {
      projectName: 'Fitness Tracker App for Apple',
      projectDescription: 'Health and activity monitoring application',
      role: 'Full Stack',
      startDate: '15/07/2025',
      endDate: '15/10/2025',
      feedback: 'Built full-stack features including login, dashboard, and analytics.'
    },
    {
      projectName: 'Smart Home System for Google',
      projectDescription: 'IoT-based home automation solution',
      role: 'BackEnd Dev',
      startDate: '20/08/2025',
      endDate: '20/12/2025',
      feedback: 'Implemented secure APIs for device communication.'
    },
    {
      projectName: 'Online Learning Portal for Coursera',
      projectDescription: 'Platform for interactive courses and quizzes',
      role: 'FrontEnd Dev',
      startDate: '05/09/2025',
      endDate: '05/02/2026',
      feedback: 'Designed accessible and responsive UI with modern design principles.'
    }
  ];

  return (
    <ScreenLayout>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'} 👋🏼
        </h2>
      </div>

      <InfoCard>
        <h3 className="font-semibold text-lg text-gray-800 mb-2">Working In</h3>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2">Project Name</th>
              <th>Description</th>
              <th>Role</th>
              <th className="w-32">Start Date</th>
              <th className="w-32">End Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            <tr className="border-t">
              <td className="py-2">{workingIn.projectName}</td>
              <td>{workingIn.projectDescription}</td>
              <td>{workingIn.role}</td>
              <td>{workingIn.startDate}</td>
              <td>{workingIn.endDate}</td>
            </tr>
          </tbody>
        </table>
      </InfoCard>

      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">My Project History</h3>
            <p className="text-sm text-[#38B2AC]">Monterrey, Nuevo León</p>
          </div>

          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.65 16.65A7.5 7.5 0 1010.5 3a7.5 7.5 0 007.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Search project..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2">Project Name</th>
              <th>Description</th>
              <th>Role</th>
              <th className="w-32">Start Date</th>
              <th className="w-32">End Date</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {projects
              .filter(p =>
                p.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
              .map((project, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{project.projectName}</td>
                  <td>{project.projectDescription}</td>
                  <td>{project.role}</td>
                  <td>{project.startDate}</td>
                  <td>{project.endDate}</td>
                  <td>
                    <button
                      className="px-4 py-1 bg-gray-100 text-sm rounded-md text-gray-600 hover:shadow"
                      onClick={() => setSelectedFeedback(project.feedback)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </InfoCard>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setSelectedFeedback(null)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-gray-800">Feedback</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedFeedback}</p>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};