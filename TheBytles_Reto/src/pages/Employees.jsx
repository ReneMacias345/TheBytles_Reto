import React, { useState } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { InfoCard } from '../layouts/InfoCard';

export const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchProjectTerm, setSearchProjectTerm] = useState('');

  const userData = {
    firstName: 'Pedro',
    lastName: 'Gomez',
    atc: 'Monterrey, Nuevo León'
  };

  const assignedEmpTotal = 5423;
  const staffedTotal = 1893;

  const employees = [
    {
      firstName: 'Jane',
      lastName: 'Cooper',
      email: 'jane@accenture.com',
      atc: 'CDMX',
      level: '8',
      role: 'SCRUM Master',
      project: 'Microsoft',
      status: 'June 9'
    },
    {
      firstName: 'Floyd',
      lastName: 'Miles',
      email: 'floyd@accenture.com',
      atc: 'GDL',
      level: '7',
      role: 'QA Automation Test Lead',
      project: 'N/A',
      status: 'Staffed'
    }
  ];

  const projects = [
    {
      projectName: 'Mobile Application for Starbucks',
      projectDescription: 'Mobile app for placing Starbucks orders online',
      members: 8,
      startDate: '13/05/2025',
      endDate: '13/08/2025'
    },
    {
      projectName: 'E-Commerce Platform for Nike',
      projectDescription: 'Online store for Nike products and accessories',
      members: 10,
      startDate: '01/06/2025',
      endDate: '01/11/2025'
    }
  ];

  return (
    <ScreenLayout>
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800">
          Hello {userData.firstName} {userData.lastName} 👋🏼,
        </h2>
      </div>

      <InfoCard>
        <div className="grid grid-cols-2 gap-6 text-center">
          <div>
            <div className="text-sm text-gray-500">Assigned Employees</div>
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
            <p className="text-sm text-[#38B2AC]">{userData.atc}</p>
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
              <th>Role</th>
              <th>Project</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 font-medium">
            {employees
              .filter(emp =>
                `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                emp.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((emp, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{emp.firstName} {emp.lastName}</td>
                  <td>{emp.email}</td>
                  <td>{emp.atc}</td>
                  <td>{emp.level}</td>
                  <td>{emp.role}</td>
                  <td>{emp.project}</td>
                  <td>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${emp.status === 'Staffed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.status}
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
            <p className="text-sm text-[#38B2AC]">{userData.atc}</p>
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
                proj.projectName.toLowerCase().includes(searchProjectTerm.toLowerCase()) ||
                proj.projectDescription.toLowerCase().includes(searchProjectTerm.toLowerCase())
              )
              .map((proj, idx) => (
                <tr key={idx} className="border-t">
                  <td className="py-2">{proj.projectName}</td>
                  <td>{proj.projectDescription}</td>
                  <td>{proj.members}</td>
                  <td>{proj.startDate}</td>
                  <td>{proj.endDate}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </InfoCard>
    </ScreenLayout>
  );
};