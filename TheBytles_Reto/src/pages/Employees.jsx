import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import supabase from '../config/supabaseClient';

export const Employees = () => {
  const [searchTermStaffed, setSearchTermStaffed] = useState('');
  const [searchTermBenched, setSearchTermBenched] = useState('');
  const [searchProjectTerm, setSearchProjectTerm] = useState('');
  const [assignedEmpTotal, setAssignedEmpTotal] = useState(0);
  const [staffedTotal, setStaffedTotal] = useState(0);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const staffedEmployees = employees.filter(e => e.Status?.toLowerCase() === "staffed");
  const benchedEmployees = employees.filter(e => e.Status?.toLowerCase() === "benched");

  const extractHighlightedText = (text) => {
    const match = text?.match(/Role:\s*(.*?)\s*·/);
    return match ? match[1].trim() : 'N/A';
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      if (!userId) {
        console.error("User not logged in.");
        return;
      }

      const { data: userInfoData, error: userError } = await supabase
        .from("User")
        .select("firstName, lastName, atc")
        .eq("userId", userId)
        .single();

      if (!userError) {
        setUserData(userInfoData);
      } else {
        console.error("Error fetching user info:", userError);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchEnrichedEmployees = async () => {
      setIsLoading(true);
      
      try {
        const { data: users, error: userError } = await supabase
          .from("User")
          .select("userId, firstName, lastName, email, atc, careerLevel, Status");

        if (userError) throw userError;

        const { data: userRoles, error: userRolError } = await supabase
          .from("User_Rol")
          .select("id_user_rol, id_user, id_rol");

        if (userRolError) throw userRolError;

        const { data: roles, error: roleError } = await supabase
          .from("Role")
          .select("id_role, role_description, project_id");

        if (roleError) throw roleError;

        const { data: projects, error: projectError } = await supabase
          .from("Project")
          .select("Project_ID, Project_Name");

        if (projectError) throw projectError;

        const enrichedUsers = users.map(user => {
          const userStatus = user.Status?.toLowerCase();
          if (userStatus === "staffed") {
            const rolesOfUser = userRoles.filter(r => r.id_user === user.userId);
            const lastUserRole = rolesOfUser[rolesOfUser.length - 1];
            const role = roles.find(r => r.id_role === lastUserRole?.id_rol);
            const project = role ? projects.find(p => p.Project_ID === role.project_id) : null;

            return {
              ...user,
              role_description: extractHighlightedText(role?.role_description),
              project_name: project?.Project_Name || 'N/A',
            };
          }

          return {
            ...user,
            role_description: 'N/A',
            project_name: 'N/A',
          };
        });

        setEmployees(enrichedUsers);
        setAssignedEmpTotal(enrichedUsers.filter(u => u.Status?.toLowerCase() === "benched").length);
        setStaffedTotal(enrichedUsers.filter(u => u.Status?.toLowerCase() === "staffed").length);
      } catch (error) {
        console.error("Error fetching enriched employee data:", error);
      }

      setIsLoading(false);
    };

    fetchEnrichedEmployees();
  }, []);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data: projects, error: projectError } = await supabase
          .from("Project")
          .select("Project_ID, Project_Name, description, StartDate, EndDate");

        if (projectError) throw projectError;

        const { data: roles, error: roleError } = await supabase
          .from("Role")
          .select("id_role, project_id");

        if (roleError) throw roleError;

        const { data: userRoles, error: userRolError } = await supabase
          .from("User_Rol")
          .select("id_user_rol, id_rol");

        if (userRolError) throw userRolError;

        // Map project_id → count of users
        const roleUserCountMap = {};

        userRoles.forEach(({ id_rol }) => {
          const role = roles.find(r => r.id_role === id_rol);
          if (role) {
            const projectId = role.project_id;
            if (!roleUserCountMap[projectId]) {
              roleUserCountMap[projectId] = 1;
            } else {
              roleUserCountMap[projectId]++;
            }
          }
        });

        const enrichedProjects = projects.map(project => ({
          ...project,
          Members: roleUserCountMap[project.Project_ID] > 0 ? roleUserCountMap[project.Project_ID] : 'N/A',
        }));

        setProjects(enrichedProjects);
      } catch (error) {
        console.error("Error enriching projects:", error);
      }
    };

    fetchProjects();
  }, []);


  return (
    <ScreenLayout>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'} 👋🏼
        </h2>
      </div>
      <InfoCard>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div className="flex items-center justify-center space-x-3">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500">Benched</div>
              <div className="text-2xl font-semibold text-gray-800">{assignedEmpTotal.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center justify-center space-x-3">
            <div className="bg-green-100 rounded-full p-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-green-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="text-sm text-gray-500">Staffed</div>
              <div className="text-2xl font-semibold text-gray-800">{staffedTotal.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">All Employees - Staffed</h3>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.65 16.65A7.5 7.5 0 1010.5 3a7.5 7.5 0 007.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Search employee..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
              value={searchTermStaffed}
              onChange={(e) => setSearchTermStaffed(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th>Employee Name</th><th>Email</th><th>ATC</th><th>Level</th><th>Project</th><th>Role</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {staffedEmployees.filter(emp =>
              `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTermStaffed.toLowerCase()) ||
              emp.email?.toLowerCase().includes(searchTermStaffed.toLowerCase())
            ).map((emp, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.atc}</td>
                <td>{emp.careerLevel}</td>
                <td>{emp.project_name}</td>
                <td>{emp.role_description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>


      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">All Employees - Benched</h3>
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.65 16.65A7.5 7.5 0 1010.5 3a7.5 7.5 0 007.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Search employee..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
              value={searchTermBenched}
              onChange={(e) => setSearchTermBenched(e.target.value)}
            />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>ATC</th>
              <th>Level</th>
              <th>Project Recomended</th>
              <th>Percentage %</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {benchedEmployees.filter(emp =>
              `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTermBenched.toLowerCase()) ||
              emp.email?.toLowerCase().includes(searchTermBenched.toLowerCase())
            ).map((emp, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.atc}</td>
                <td>{emp.careerLevel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>


      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">All Projects</h3>
            <p className="text-sm text-[#38B2AC]">{userData?.atc || ''}</p>
          </div>

          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.65 16.65A7.5 7.5 0 1010.5 3a7.5 7.5 0 007.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Search project..."
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
              value={searchProjectTerm}
              onChange={(e) => setSearchProjectTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2">Project Name</th>
              <th>Description</th>
              <th>Members</th>
              <th>Start Date</th>
              <th>End Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {projects
              .filter(proj =>
                proj.Project_Name?.toLowerCase().includes(searchProjectTerm.toLowerCase()) ||
                proj.description?.toLowerCase().includes(searchProjectTerm.toLowerCase())
              )
              .map((proj, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{proj.Project_Name}</td>
                  <td>{proj.description}</td>
                  <td>{proj.Members}</td>
                  <td>{proj.StartDate}</td>
                  <td>{proj.EndDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </InfoCard>
    </ScreenLayout>
  );
};
