import React, { useState, useRef, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { ProjectCard } from '../components/ProjectCard';
import supabase from '../config/supabaseClient';

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
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState('');
  const [rolesMap, setRolesMap] = useState({});

  const today = new Date().toISOString().split("T")[0];

  const projectPicRef = useRef(null);
  const RFPRef = useRef(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase.from("Project").select("*");

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data);
      const { data: roleData, error: roleError } = await supabase.from("Role").select("*");
    if (roleError) return;

    const grouped = {};
    roleData.forEach(role => {
      if (!grouped[role.project_id]) grouped[role.project_id] = [];
      grouped[role.project_id].push(role);
    });

    setRolesMap(grouped);
    };

    fetchProjects();
  }, []);

  const handleAddNew = () => {
    setShowProjectForm(true);
    setError('');
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
    setError('');
  };

  const uploadRFPToSupabase = async (file) => {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    if (!userId || !file) {
      console.error("User not logged in or file missing.");
      setError("You must be logged in and upload a file.");
      return null;
    }
  
    const fileName = `rfps/${userId}-${Date.now()}-rfp.pdf`; // carpeta correcta
    const contentType = file.type || "application/pdf";
  
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("media") // bucket correcto
      .upload(fileName, file, {
        upsert: false,
        contentType,
        cacheControl: '3600',
      });
  
    if (uploadError) {
      console.error("Upload error:", uploadError.message);
      setError("Error uploading RFP. Try again.");
      return null;
    }
  
    const { data: publicUrlData } = supabase.storage
      .from("media")
      .getPublicUrl(fileName);
  
    return publicUrlData?.publicUrl || null;
  };
  

  const handleAddProject = async () => {
    if (!RFPFile) {
      setError('Please upload an RFP file.');
      return;
    }
    if (!projectPic) {
      setError('Please upload a project picture.');
      return;
    }
  
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;
  
    const rfpUrl = await uploadRFPToSupabase(RFPFile);
    if (!rfpUrl) return;
  
    const newProject = {
      Project_Name: projectName,
      description: projectDescription,
      StaffingStage: staffingStage,
      StartDate: startDate,
      EndDate: endDate,
      rfp_url: rfpUrl,
      created_by: userId,
    };
  
    const { data, error } = await supabase
      .from("Project")
      .insert([newProject])
      .select();
  
    if (error) {
      console.error("Error inserting project:", error);
      setError("Error saving project. Try again.");
      return;
    }
  
    setProjects([...projects, data[0]]);
    handleCloseForm();
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

      {projects
      .filter(project =>
        project.Project_Name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((project, index) => (
        <ProjectCard
          key={index}
          projectName={project.Project_Name}
          projectDescription={project.description}
          staffingStage={project.StaffingStage}
          startDate={project.StartDate}
          endDate={project.EndDate}
          projectPic={null}
          rfp_url={project.rfp_url}
          roles={rolesMap[project.Project_ID] || []}
        />
      ))}

      {showProjectForm && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-5xl p-10 rounded-3xl shadow-md relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 bg-gray-500 text-white rounded-full w-7 h-7 flex items-center justify-center"
            >
              &times;
            </button>
            <form onSubmit={(e) => { e.preventDefault(); handleAddProject(); }}>
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-3 flex flex-col items-center">
                  <div className="w-28 h-28 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center mt-32">
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
                    className="bg-[#A100FF] mt-2 px-4 py-1 rounded-full border border-gray-300 text-white"
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
                <div className="col-span-9 grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">Project Name</label>
                    <input
                      type="text"
                      minLength={"10"}
                      maxLength={"35"}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-700">Project Description</label>
                    <textarea
                      rows="3"
                      minLength={"10"}
                      maxLength={"50"}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      value={projectDescription}
                      onChange={(e) => setProjectDescription(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Staffing Stage</label>
                    <input
                      type="date"
                      min={today}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      value={staffingStage}
                      onChange={(e) => setStaffingStage(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <input
                      type="date"
                      min={today}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <input
                      type="date"
                      min={today}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex flex-col items-start justify-end">
                    <label className="text-sm font-medium text-gray-700">Upload RFP</label>
                    <button
                      onClick={() => RFPRef.current.click()}
                      type="button"
                      className="mt-1 px-4 py-2 border border-gray-300 rounded-3xl bg-[#A100FF] text-white"
                    >
                      Upload RFP
                    </button>
                    <input
                      type="file"
                      accept="application/pdf"
                      ref={RFPRef}
                      className="hidden"
                      onChange={(e) => setRFPFile(e.target.files[0])}
                    />
                    {RFPFile && (
                      <p className="text-sm text-gray-600 mt-1">File selected: {RFPFile.name}</p>
                    )}
                  </div>
                </div>
              </div>
              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
              <div className="flex justify-end mt-6">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90 transition"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};
