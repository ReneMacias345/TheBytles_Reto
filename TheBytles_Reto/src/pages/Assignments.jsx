import React, { useState,useRef} from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { ProjectCard } from '../components/ProjectCard';

export const Assignments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [staffingStage, setStaffingStage] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectPic, setProjectPic] = useState(null);
  const [RFPFile, setRFPFile] = useState(null);

  const projectPicRef = useRef(null);
  const RFPRef = useRef(null);

  const handleAddNew = () => {
    setShowProjectForm(true);
  };

  const handleCloseForm = () => {
    setShowProjectForm(false);
    setProjectName('');
    setProjectDescription('');
    setStaffingStage('');
    setStartDate('');
    setEndDate('');
    setProjectPic(null);
    setRFPFile(null);
  };

  const caseData = {
    projectName: "Mobile Application for Starbucks",
    projectDescription: "Strong understanding of scalable system architecture, data security, and high-performance backend development. Expertise in designing and maintaining APIs for seamless app functionality. Ability to manage databases, authentication, and third-party integrations. Strong leadership, strategic thinking, and problem-solving. Ability to define product vision, prioritize features, and align business and technical teams. Expertise in customer experience, digital commerce, and user engagement.",
    staffingStage: "Planning",
    startDate: "2025-04-15",
    endDate: "2025-08-30",
    projectPic: null,
    rfp: null
  };

  return (
    <ScreenLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="white" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1110.5 3a7.5 7.5 0 016.15 13.65z" />
          </svg>
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-gray-700 placeholder-gray-400 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button
          onClick={handleAddNew}
          className="ml-4 px-4 py-2 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold hover:shadow"
        >
          Add new project
        </button>
      </div>

        <ProjectCard {...caseData} />
        {showProjectForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-58 max-w-xl p-8 rounded-3xl shadow-md relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 bg-gray-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
            >
              &times;
            </button>
            <div className="grid grid-cols-2 gap-6 items-start">
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                  {projectPic ? (
                    <img
                      src={URL.createObjectURL(projectPic)}
                      alt="Project"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-12 h-12 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5.121 17.804A6.978 6.978 0 0112 15c1.57 0 3.013.51 4.121 1.375M15 10a3 3 0 11-6 0 3 3 0 016 0zM2 20h20"
                      />
                    </svg>
                  )}
                </div>
                <button
                  type="button"
                  className="mt-2 px-4 py-1 rounded-full border border-gray-300 text-gray-200 bg-[#A100FF]"
                  onClick={() => projectPicRef.current.click()}
                >
                  Change
                </button>
                <input
                  type="file"
                  accept="image/png"
                  ref={projectPicRef}
                  className="hidden"
                  onChange={(e) => setProjectPic(e.target.files[0])}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-700">Project Name</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};

