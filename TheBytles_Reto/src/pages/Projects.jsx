import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import supabase from '../config/supabaseClient';

export const Projects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [userData, setUserData] = useState(null);
  const [historyProjects, setHistoryProjects] = useState([]);
  const [activeFeedbackTarget, setActiveFeedbackTarget] = useState(null);
  const [feedbackInput, setFeedbackInput] = useState('');
  const [status, setStatus] = useState("Ready");
  const [pendingStatus, setPendingStatus] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [workingIn, setWorkingIn] = useState({
    projectName: "N/A",
    projectDescription: "N/A",
    role: "N/A",
    startDate: "N/A",
    endDate: "N/A",
  });
  const [employeesAssociated, setEmployeesAssociated] = useState([]);
  

  const extractHighlightedText = (text) => {
    const match = text?.match(/Role:\s*(.*?)\s*·/);
    return match ? match[1].trim() : 'N/A';
  };

  const extractHighlightedText2 = (text) => {
    const match = text?.match(/Role:\s*(.*)/);
    return match ? match[1].trim() : 'N/A';
  };
  const fetchEmployeesAssociated = async (projectId) => {
    // Obtener el ID del usuario actual
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;

    if (!currentUserId) {
      console.error("User not logged in.");
      return;
    }

    // Paso 1: Obtener todos los roles del proyecto actual
    const { data: roles, error: roleError } = await supabase
      .from("Role")
      .select("id_role, role_description")
      .eq("project_id", projectId);

    if (roleError || !roles) {
      console.error("Error fetching roles by project:", roleError);
      return;
    }

    const roleIds = roles.map(r => r.id_role);

    // Paso 2: Obtener los usuarios asignados a esos roles
    const { data: userRols, error: userRolError } = await supabase
      .from("User_Rol")
      .select("id_user, id_rol")
      .in("id_rol", roleIds);

    if (userRolError || !userRols) {
      console.error("Error fetching users from User_Rol:", userRolError);
      return;
    }

    // Excluir al usuario actual
    const filteredUserRols = userRols.filter(ur => ur.id_user !== currentUserId);
    const userIds = filteredUserRols.map(ur => ur.id_user);

    // Paso 3: Obtener la información de los usuarios
    const { data: users, error: usersError } = await supabase
      .from("User")
      .select("userId, firstName, lastName, email")
      .in("userId", userIds);

    if (usersError || !users) {
      console.error("Error fetching user info:", usersError);
      return;
    }

    // Paso 4: Combinar usuarios con sus roles
    const formatted = filteredUserRols.map(userRol => {
      const user = users.find(u => u.userId === userRol.id_user);
      const role = roles.find(r => r.id_role === userRol.id_rol);
      return {
        id: userRol.id_user,
        firstName: user?.firstName || "N/A",
        lastName: user?.lastName || "N/A",
        email: user?.email || "N/A",
        role: extractHighlightedText(role?.role_description),
        feedback: "",
      };
    });

    setEmployeesAssociated(formatted);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, Status")
        .eq("userId", userId)
        .single();

      if (userError) {
        console.error("Error fetching user info:", userError);
        return;
      }

      setUserData(userInfoData);

      const { data: historyData, error: historyError } = await supabase
        .from("User_History")
        .select(`
          FeedBack,
          project_element_id,
          user_element_id,
          Project:project_element_id (
            Project_Name,
            description,
            StartDate,
            EndDate
          )
        `)
        .eq("user_element_id", userId);

      if (historyError) {
        console.error("Error fetching project history:", historyError);
        return;
      }

      const { data: userRoles, error: userRolesError } = await supabase
        .from("User_Rol")
        .select("id_rol")
        .eq("id_user", userId);

      if (userRolesError || !userRoles || userRoles.length === 0) {
        console.error("Error fetching user roles:", userRolesError);
        return;
      }

      const roleIds = userRoles.map(r => r.id_rol);

      const { data: rolesData, error: rolesError } = await supabase
        .from("Role")
        .select("id_role, project_id, role_description")
        .in("id_role", roleIds);

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        return;
      }

      const historyWithRoles = historyData.map((history) => {
        const matchingRole = rolesData.find(role =>
          role.project_id === history.project_element_id
        );
        return {
          ...history,
          role_description: extractHighlightedText(matchingRole?.role_description),
        };
      });

      setHistoryProjects(historyWithRoles);

      const { data: userRolData, error: userRolError } = await supabase
        .from("User_Rol")
        .select("id_rol")
        .eq("id_user", userId)
        .maybeSingle();

      if (userRolError || !userRolData) {
        console.error("Error fetching user role assignment:", userRolError);
        setWorkingIn({
          projectName: "N/A",
          projectDescription: "N/A",
          role: "N/A",
          startDate: "N/A",
          endDate: "N/A",
        });
        return;
      }

      const { data: roleInfo, error: roleError } = await supabase
        .from("Role")
        .select("role_description, project_id")
        .eq("id_role", userRolData.id_rol)
        .maybeSingle();

      if (roleError || !roleInfo) {
        console.error("Error fetching role data:", roleError);
        return;
      }

      const { data: projectData, error: projectError } = await supabase
        .from("Project")
        .select("Project_Name, description, StartDate, EndDate")
        .eq("Project_ID", roleInfo.project_id)
        .single();

      if (projectError || !projectData) {
        console.error("Error fetching project for workingIn:", projectError);
        return;
      }

      setWorkingIn({
        projectName: projectData.Project_Name,
        projectDescription: projectData.description,
        role: extractHighlightedText2(roleInfo.role_description),
        startDate: projectData.StartDate,
        endDate: projectData.EndDate,
      });

      await fetchEmployeesAssociated(roleInfo.project_id);
    };

    fetchData();
  }, []);

  const handleSaveFeedback = () => {
    setEmployeesAssociated(prev =>
      prev.map(emp =>
        emp.id === activeFeedbackTarget.id ? { ...emp, feedback: feedbackInput } : emp
      )
    );
    setActiveFeedbackTarget(null);
    setFeedbackInput('');
  };

  return (
    <ScreenLayout>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'} 👋🏼
        </h2>
      </div>

      <InfoCard>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-lg text-gray-800">Working In</h3>
          <select
            className="px-4 py-1 rounded-full border border-gray-300 bg-[#A100FF] text-white text-sm hover:bg-[#8800cc] transition"
            value={status}
            onChange={(e) => {
              setPendingStatus(e.target.value);
              setShowConfirmModal(true);
            }}
          >
            <option value="Ready" className="text-black">Ready</option>
            <option value="Ongoing" className="text-black">Ongoing</option>
            <option value="Finished" className="text-black">Finished</option>
          </select>
        </div>

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
        <h3 className="font-semibold text-lg text-gray-800 mb-2">
          Employees Associated to {workingIn.projectName}
        </h3>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2"> Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Add Feedback</th>
              <th> Feedback Recieved </th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {employeesAssociated.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="py-2">{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.role}</td>
                <td>
                  <button
                    onClick={() => setActiveFeedbackTarget(emp)}
                    className="flex items-center px-3 py-1 bg-white text-sm text-[#A100FF] rounded hover:underline"
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
                    Add Feedback
                  </button>
                </td>
                <td>{emp.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>
      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">My Project History</h3>
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
            {historyProjects
              .filter(p =>
                p.Project?.Project_Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.Project?.description?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .sort((a, b) => new Date(b.Project?.EndDate) - new Date(a.Project?.EndDate))
              .map((item, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{item.Project?.Project_Name}</td>
                  <td>{item.Project?.description}</td>
                  <td>{item.role_description}</td>
                  <td>{item.Project?.StartDate}</td>
                  <td>{item.Project?.EndDate}</td>
                  <td>
                    <button
                      className="px-4 py-1 bg-gray-100 text-sm rounded-md text-gray-600 hover:shadow"
                      onClick={() => setSelectedFeedback(item.FeedBack)}
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
      
      {activeFeedbackTarget && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg relative">
            <button
              onClick={() => setActiveFeedbackTarget(null)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-4 text-[#A100FF]">
              Feedback for {activeFeedbackTarget.firstName} {activeFeedbackTarget.lastName}
            </h2>
            <textarea
              value={feedbackInput}
              onChange={(e) => setFeedbackInput(e.target.value)}
              className="w-full h-24 p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A100FF] text-gray-800 bg-gray-100"
              placeholder="Write your feedback here..."
            ></textarea>
            <button 
              onClick={handleSaveFeedback}
              className="mt-4 w-full py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90">
              Save Feedback
            </button>
          </div>
        </div>
      )}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl w-full max-w-sm shadow-xl text-center">
            <h2 className="text-lg font-bold text-[#A100FF] mb-4">Confirm Status Change</h2>
            <p className="text-gray-700 mb-6">Are you sure you want to change the status to <strong>{pendingStatus}</strong>?</p>
            <div className="flex justify-center gap-4">
              <button
                className="px-4 py-2 bg-[#A100FF] text-white rounded-full hover:opacity-90"
                onClick={() => {
                  setStatus(pendingStatus);
                  setPendingStatus(null);
                  setShowConfirmModal(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300"
                onClick={() => {
                  setPendingStatus(null);
                  setShowConfirmModal(false);
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};
