import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import supabase from '../config/supabaseClient';

export const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchProjectTerm, setSearchProjectTerm] = useState('');
  const [assignedEmpTotal, setAssignedEmpTotal] = useState(0);
  const [staffedTotal, setStaffedTotal] = useState(0);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userData, setUserData] = useState(null);

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
    const fetchCountsAndEmployees = async () => {
      const { data: allUsers, error } = await supabase
        .from("User")
        .select("firstName, lastName, email, atc, careerLevel, Status");

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      setEmployees(allUsers);

      const total = allUsers.length;
      const staffed = allUsers.filter(u => u.Status?.toLowerCase() === "staffed").length;

      setAssignedEmpTotal(total);
      setStaffedTotal(staffed);
    };

    fetchCountsAndEmployees();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      const { data, error } = await supabase
        .from("Project")
        .select("Project_Name, description, Members, StartDate, EndDate");

      if (error) {
        console.error("Error fetching projects:", error);
        return;
      }

      setProjects(data);
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    const fetchAllEmployees = async () => {
      const { data: users, error: userError } = await supabase
        .from("User")
        .select("userId, firstName, lastName, email, atc, careerLevel, Status");
  
      if (userError) {
        console.error("Error fetching users:", userError);
        return;
      }
  
      const { data: roles, error: roleError } = await supabase
        .from("Role")
        .select("user_id, role_description, project_id");
  
      if (roleError) {
        console.error("Error fetching roles:", roleError);
        return;
      }
  
      const { data: projects, error: projectError } = await supabase
        .from("Project")
        .select("Project_ID, Project_Name");
  
      if (projectError) {
        console.error("Error fetching projects:", projectError);
        return;
      }
  
      const enrichedUsers = users.map(user => {
        const userRole = roles.find(role => role.user_id === user.userId);
        const project = userRole
          ? projects.find(p => p.Project_ID === userRole.project_id)
          : null;
  
        return {
          ...user,
          role_description: user.Status?.toLowerCase() === 'benched' ? 'N/A' : userRole?.role_description || 'N/A',
          project_name: user.Status?.toLowerCase() === 'benched' ? 'N/A' : project?.Project_Name || 'N/A',
        };
      });
  
      setEmployees(enrichedUsers);
  
      setAssignedEmpTotal(enrichedUsers.filter(u => u.Status?.toLowerCase() === "benched").length);
      setStaffedTotal(enrichedUsers.filter(u => u.Status?.toLowerCase() === "staffed").length);
    };
  
    fetchAllEmployees();
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
          <div>
            <div className="text-sm text-gray-500">Benched</div>
            <div className="text-2xl font-semibold text-gray-800">{assignedEmpTotal.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-sm text-gray-500">Staffed</div>
            <div className="text-2xl font-semibold text-gray-800">{staffedTotal.toLocaleString()}</div>
          </div>
        </div>
      </InfoCard>

      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">All Employees</h3>
            <p className="text-sm text-[#38B2AC]">{userData?.atc || ''}</p>
          </div>

          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md w-full max-w-xs">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17.65 16.65A7.5 7.5 0 1010.5 3a7.5 7.5 0 007.15 13.65z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-400 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th className="py-2">Employee Name</th>
              <th>Email</th>
              <th>ATC</th>
              <th>Level</th>
              <th>Project</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {employees
              .filter(emp =>
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((emp, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.atc}</td>
                  <td>{emp.careerLevel}</td>
                  <td>{emp.project_name}</td>
                  <td>{emp.role_description}</td>
                  <td>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      emp.Status?.toLowerCase() === 'staffed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {emp.Status}
                    </span>
                  </td>
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
