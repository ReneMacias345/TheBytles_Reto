import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';
import supabase from '../config/supabaseClient';
import { useNavigate } from 'react-router-dom';

// Employees para gestionar y visualizar empleados y proyecto
export const Employees = () => {
  // Estados para búsqueda y filtros
  const [searchTermStaffed, setSearchTermStaffed] = useState('');
  const [searchTermBenched, setSearchTermBenched] = useState('');
  const [searchProjectTerm, setSearchProjectTerm] = useState('');

  // Estados para datos de empleados y proyectos
  const [assignedEmpTotal, setAssignedEmpTotal] = useState(0);
  const [staffedTotal, setStaffedTotal] = useState(0);
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Estados para filtros
  const staffedEmployees = employees.filter(e => e.Status?.toLowerCase() === "staffed");
  const benchedEmployees = employees.filter(e => e.Status?.toLowerCase() === "benched");
  const [filterATC, setFilterATC] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [allRoles, setAllRoles] = useState([]);

 // Estados para navegación y UI
  const navigate = useNavigate();
   const [roleInfo, setRoleInfo] = useState(null);

  const extractHighlightedText = (text) => {
    const match = text?.match(/Role:\s*(.*?)\s*·/);
    return match ? match[1].trim() : 'N/A';
  };

  // Efecto para cargar datos del usuario autenticado
  useEffect(() => {
  const fetchUserData = async () => {
    const {
      data: { user },
      error: sessionError
    } = await supabase.auth.getUser();

    if (sessionError || !user) {
      console.error("Error getting authenticated user:", sessionError);
      return;
    }

    const { data: userDetails, error: userError } = await supabase
      .from("User")
      .select("firstName, lastName")
      .eq("userId", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user details:", userError);
      return;
    }

    setUserData(userDetails);
  };

  fetchUserData();
}, []);

// Efecto principal para cargar y enriquecer datos de empleados
  useEffect(() => {
    const fetchEnrichedEmployees = async () => {
      setIsLoading(true);
      try {
        const { data: users, error: userError } = await supabase
          .from("User")
          .select("userId, firstName, lastName, email, atc, careerLevel, Status, StatusUpdateAt, embedding")
        if (userError) throw userError;

        const [{ data: roles, error: roleError },
              { data: projects, error: projectError }] = await Promise.all([
          supabase.from("Role").select("id_role, role_description, project_id"),
          supabase.from("Project").select("Project_ID, Project_Name")
        ]);
        if (roleError) throw roleError;
        if (projectError) throw projectError;

        const enrichedUsers = await Promise.all(
          users.map(async user => {
            const status = user.Status?.toLowerCase();

            // Si está en banco, calcular días y buscar recomendación
            if (status === "benched") {
              let timeBenched = "-";
              if (user.StatusUpdateAt) {
                const updateDate = new Date(user.StatusUpdateAt);
                const today = new Date();
                const diffTime = today.getTime() - updateDate.getTime();
                const diffDays = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
                timeBenched = `${diffDays} Day${diffDays === 1 ? '' : 's'}`;
              }

              // RPC: match_role_to_user
              const { data: [match], error: rpcError } = await supabase
                .rpc("match_role_to_user", { user_vec: user.embedding });

              if (rpcError || !match) {
                console.error("RPC error:", rpcError);
                return {
                  ...user,
                  timeBenched,
                  recommendedRole: "N/A",
                  recommendedProject: "N/A",
                  matchPercent: 0,
                };
              }

              const matchedRole = roles.find(r => r.id_role === match.id_role);
              const matchedProj = projects.find(p => p.Project_ID === matchedRole?.project_id);
              const matchPercent = Math.round((match.similarity * 1000) / 0.65) / 10;

              return {
                ...user,
                timeBenched,
                recommendedRole: matchPercent > 0
                  ? extractHighlightedText(matchedRole.role_description)
                  : 'N/A',
                recommendedProject: matchPercent > 0
                  ? (matchedProj?.Project_Name || 'N/A')
                  : 'N/A',
                recommendedProjectId: matchedProj?.Project_ID,
                recommendedRoleId: matchedRole?.id_role,
                matchPercent,
              };
            }

            // Si está staffeado, buscar su rol actual
            if (status === "staffed") {
              const userRoles = await supabase
                .from("User_Rol")
                .select("id_rol")
                .eq("id_user", user.userId);

              const lastRole = userRoles?.data?.length ? userRoles.data[userRoles.data.length - 1] : null;
              const roleObj = roles.find(r => r.id_role === lastRole?.id_rol);
              const projObj = projects.find(p => p.Project_ID === roleObj?.project_id);

              return {
                ...user,
                role_description: extractHighlightedText(roleObj?.role_description),
                project_name: projObj?.Project_Name || "N/A",
              };
            }

            // Para todos los demás (por ejemplo, nuevos empleados no clasificados)
            return {
              ...user,
            };
          })
        );
        
        const matchPercents = enrichedUsers
          .map(user => user.matchPercent)
          .filter(percent => !isNaN(percent)); 

        const avgMatchPercent = matchPercents.length
          ? matchPercents.reduce((a, b) => a + b, 0) / matchPercents.length: 0;

        // Guardar en localStorage
        localStorage.setItem("avgMatchPercent", JSON.stringify(avgMatchPercent));


        setEmployees(enrichedUsers);
        setAssignedEmpTotal(
          enrichedUsers.filter(u => u.Status.toLowerCase() === "benched").length
        );
        setStaffedTotal(
          enrichedUsers.filter(u => u.Status.toLowerCase() === "staffed").length
        );
      } catch (err) {
        console.error("Error fetching enriched employees:", err);
      }
      setIsLoading(false);
    };

    fetchEnrichedEmployees();
  }, []);

// Efecto para cargar proyectos y roles
useEffect(() => {
  const fetchProjects = async () => {
    try {
      const { data: projectsData, error: projectError } = await supabase
        .from("Project")
        .select("Project_ID, Project_Name, description, StartDate, EndDate, Status");

      if (projectError) throw projectError;

      const { data: rolesData, error: roleError } = await supabase
        .from("Role")
        .select("id_role, project_id, role_description");

      if (roleError) throw roleError;

      const { data: userRoles, error: userRolError } = await supabase
        .from("User_Rol")
        .select("id_user_rol, id_rol");

      if (userRolError) throw userRolError;

      // Contar miembros por proyecto basado en los roles asignados
      const roleUserCountMap = {};

      userRoles.forEach(({ id_rol }) => {
        const role = rolesData.find(r => r.id_role === id_rol);
        if (role) {
          const projectId = role.project_id;
          if (!roleUserCountMap[projectId]) {
            roleUserCountMap[projectId] = 1;
          } else {
            roleUserCountMap[projectId]++;
          }
        }
      });

      // Enriquecer proyectos con cantidad de miembros
      const enrichedProjects = projectsData.map(project => ({
        ...project,
        Members: roleUserCountMap[project.Project_ID] > 0 ? roleUserCountMap[project.Project_ID] : 'N/A',
      }));

      setProjects(enrichedProjects);
      setAllRoles(rolesData); // <— Se guarda todos los roles globalmente para el modal
    } catch (error) {
      console.error("Error enriching projects:", error);
    }
  };

  fetchProjects();
}, []);

// Mapeo de estados de proyecto a etiquetas legibles
  const statusLabels = {
    ready: 'Ready',
    ongoing: 'Ongoing',
    finished: 'Finished',
    recruiting: 'Recruiting',
    default: 'Unknown status'
  };

  const handleRoleClick = (role) => {
    console.log(`Role clicked: ${role}`);
  };
  // Función para determinar clase de color según tiempo en banco
  const getTimeBenchedColorClass = (timeBenched) => {
    if (!timeBenched || timeBenched === "-") return 'bg-gray-100 text-gray-500';

    const daysMatch = timeBenched.match(/^(\d+)/);
    if (!daysMatch) return 'bg-gray-100 text-gray-500';

    const days = parseInt(daysMatch[1]);

    if (days <= 3) return 'bg-green-100 text-green-700';
    if (days <= 6) return 'bg-yellow-100 text-yellow-700';
    if (days <= 10) return 'bg-orange-100 text-orange-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <ScreenLayout>
      {/* Encabezado con saludo */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Hello {userData ? `${userData.firstName} ${userData.lastName}` : 'Loading...'} 👋🏼
        </h2>
      </div>

      {/* Tarjeta de resumen de empleados */}
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
      
      {/* Tabla de empleados asignados */}
      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">All Employees - Assigned</h3>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
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
            {/* Dropdown ATC */}
              <select
                className="px-3 py-1 rounded-md border border-[#A100FF] text-sm text-[#A100FF] bg-white hover:cursor-pointer"
                value={filterATC}
                onChange={(e) => setFilterATC(e.target.value)}
              >
                <option value="">All ATCs</option>
                <option value="CDMX">CDMX</option>
                <option value="MTY">MTY</option>
                <option value="QRO">QRO</option>
              </select>

              {/* Dropdown Level */}
              <select
                className="px-3 py-1 rounded-md border border-[#A100FF] text-sm text-[#A100FF] bg-white hover:cursor-pointer"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
                <option value="6">Level 6</option>
                <option value="7">Level 7</option>
                <option value="8">Level 8</option>
                <option value="9">Level 9</option>
                <option value="10">Level 10</option>
                <option value="11">Level 11</option>
                <option value="12">Level 12</option>
                <option value="13">Level 13</option>
              </select>
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
              (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTermStaffed.toLowerCase()) ||
              emp.email?.toLowerCase().includes(searchTermStaffed.toLowerCase()))
              &&
              (filterATC ? emp.atc === filterATC : true)
              &&
              (filterLevel ? String(emp.careerLevel) === filterLevel : true)
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

      {/* Tabla de empleados en banco */}
      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg text-gray-800">All Employees - Benched</h3>
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md ">
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
            {/* Dropdown ATC */}
              <select
                className="px-3 py-1 rounded-md border border-[#A100FF] text-sm text-[#A100FF] bg-white hover:cursor-pointer"
                value={filterATC}
                onChange={(e) => setFilterATC(e.target.value)}
              >
                <option value="">All ATCs</option>
                <option value="CDMX">CDMX</option>
                <option value="MTY">MTY</option>
                <option value="QRO">QRO</option>
              </select>

              {/* Dropdown Level */}
              <select
                className="px-3 py-1 rounded-md border border-[#A100FF] text-sm text-[#A100FF] bg-white hover:cursor-pointer"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
              >
                <option value="">All Levels</option>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
                <option value="4">Level 4</option>
                <option value="5">Level 5</option>
                <option value="6">Level 6</option>
                <option value="7">Level 7</option>
                <option value="8">Level 8</option>
                <option value="9">Level 9</option>
                <option value="10">Level 10</option>
                <option value="11">Level 11</option>
                <option value="12">Level 12</option>
                <option value="13">Level 13</option>
              </select>
            </div>
          </div>
        <table className="w-full text-sm">
          <thead className="text-gray-500 text-left">
            <tr>
              <th>Employee Name</th>
              <th>Email</th>
              <th>ATC</th>
              <th>Level</th>
              <th>Recommended Project</th>
              <th>Recommended Role</th>
              <th>Percentage %</th>
              <th>Time Benched</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {benchedEmployees.filter(emp =>
              (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTermBenched.toLowerCase()) ||
              emp.email?.toLowerCase().includes(searchTermBenched.toLowerCase()))
              &&
              (filterATC ? emp.atc === filterATC : true)
              &&
              (filterLevel ? String(emp.careerLevel) === filterLevel : true)
            ).map((emp, idx) => (
              <tr key={idx} className="border-t">
                <td className="py-2">{emp.firstName} {emp.lastName}</td>
                <td>{emp.email}</td>
                <td>{emp.atc}</td>
                <td>{emp.careerLevel}</td>
                <td>{emp.recommendedProject}</td>
                <td>
                  <button 
                    onClick={() => {
                      navigate(`/assignments?project=${emp.recommendedProjectId}&role=${emp.recommendedRoleId}`);
                    }}
                    className="bg-transparent border-none p-0 m-0 font-medium text-gray-700 hover:text-[#A100FF] transition-colors duration-200 cursor-pointer focus:outline-none"
                  >
                    {emp.recommendedRole}
                  </button>
                </td>
                <td>
                  {emp.matchPercent != null
                    ? `${emp.matchPercent.toFixed(1)}%`
                    : '0%'}
                </td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    getTimeBenchedColorClass(emp.timeBenched)
                  }`}>
                    {emp.timeBenched}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </InfoCard>

      {/* Tabla de proyectos */}
      <InfoCard>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-800">All Projects</h3>
          </div>

          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
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
            {/* Dropdown Status (nuevo) */}
            <select
              className="px-3 py-1 rounded-md border border-[#A100FF] text-sm text-[#A100FF] bg-white hover:cursor-pointer"
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="ready">Ready</option>
              <option value="ongoing">Ongoing</option>
              <option value="finished">Finished</option>
              <option value="recruiting">Recruiting</option>
            </select>
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
              <th>Status</th>
              <th>Role Info</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {projects
              .filter(proj =>
                proj.Project_Name?.toLowerCase().includes(searchProjectTerm.toLowerCase()) ||
                proj.description?.toLowerCase().includes(searchProjectTerm.toLowerCase())
              )
              .filter(proj => 
                filterStatus ? proj.Status === filterStatus : true
              )
              .map((proj, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{proj.Project_Name}</td>
                  <td>{proj.description}</td>
                  <td>{proj.Members}</td>
                  <td>{proj.StartDate}</td>
                  <td>{proj.EndDate}</td>
                  <td>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        proj.Status?.toLowerCase() === 'ready'
                          ? 'bg-green-100 text-green-700'
                          : proj.Status?.toLowerCase() === 'ongoing'
                          ? 'bg-blue-100 text-blue-700'
                          : proj.Status?.toLowerCase() === 'finished'
                          ? 'bg-gray-200 text-gray-600'
                          : proj.Status?.toLowerCase() === 'recruiting'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {statusLabels[proj.Status?.toLowerCase()] || statusLabels.default}
                    </span>
                  </td>
                    <button
                      className="px-4 py-0.5 bg-gray-100 text-sm mt-1.5 rounded-md text-[#A100FF] hover:shadow"
                      onClick={() => {
                        const rolesForProject = allRoles.filter(r => r.project_id === proj.Project_ID);
                        const formattedRoles = rolesForProject.length
                          ? rolesForProject.map((r, i) => `🔹 ${r.role_description}`).join('\n\n')
                          : 'No roles assigned to this project.';
                        setRoleInfo(formattedRoles);
                      }}
                    >
                      View
                    </button>
                </tr>
              ))}
          </tbody>
        </table>
      </InfoCard>
      
      {/* Modal de información de roles */}
      {roleInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-7xl w-full shadow-lg relative">
            <button
              onClick={() => setRoleInfo(null)}
              className="absolute top-3 right-3 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:opacity-90"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold mb-2 text-gray-800">Role Info</h2>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{roleInfo}</p>
          </div>
        </div>
      )}
    </ScreenLayout>
  );
};
