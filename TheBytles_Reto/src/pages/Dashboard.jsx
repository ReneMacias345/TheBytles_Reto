import React, { useState } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { DashboardCard } from '../components/DashboardCard';
import { Bar, Doughnut, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export const Dashboard = () => {
  const [filter, setFilter] = useState('Level');

  const projectStatusData = {
    labels: ['Staffing', 'Ongoing', 'Finished'],
    datasets: [
      {
        label: 'Projects',
        data: [4, 5, 3],
        backgroundColor: ['#A100FF', '#06B6D4', '#10B981'],
      },
    ],
  };

  const employeeStatusData = {
    labels: ['Assigned', 'Benched'],
    datasets: [
      {
        data: [85, 35],
        backgroundColor: ['#10B981', '#FB7185'],
        borderWidth: 0,
      },
    ],
  };

  const timeDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const timeDistributionData = {
    ATC: {
      labels: ['MTY', 'CDMX', 'QRO'],
      datasets: [
        {
          label: 'Benched',
          backgroundColor: '#FB7185',
          data: [12, 10, 13],
        },
        {
          label: 'Assigned',
          backgroundColor: '#10B981',
          data: [25, 28, 20],
        },
      ],
    },
    Capability: {
      labels: ['Cybersecurity', 'Software Dev', 'Video Game Dev'],
      datasets: [
        {
          label: 'Benched',
          backgroundColor: '#FB7185',
          data: [6, 12, 7],
        },
        {
          label: 'Assigned',
          backgroundColor: '#10B981',
          data: [20, 35, 25],
        },
      ],
    },
    Level: {
      labels: ['13', '12', '11', '10', '9', '8'],
      datasets: [
        {
          label: 'Benched',
          backgroundColor: '#FB7185',
          data: [5, 6, 4, 3, 2, 1],
        },
        {
          label: 'Assigned',
          backgroundColor: '#10B981',
          data: [8, 10, 9, 7, 5, 4],
        },
      ],
    },
  };

  return (
    <ScreenLayout>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-3">
        <DashboardCard title="Total Employees" value="120" color="text-gray-800" />
        <DashboardCard title="Benched Employees" value="35" color="text-red-500" />
        <DashboardCard title="Roles to be covered" value="43" color="text-orange-400" />
        <DashboardCard title="Active Projects" value="12" color="text-purple-600" />
      </div>
    
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Employee Status Distribution</h2>
          <Doughnut data={employeeStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 col-span-2">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Project Status Overview</h2>
          <Bar data={projectStatusData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md font-semibold text-gray-800">Employees Benched vs Assigned</h2>
          <select
            className="text-sm px-2 py-1 rounded-md border border-gray-300 text-[#A100FF] bg-white"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="Level">By Level</option>
            <option value="Capability">By Capability</option>
            <option value="ATC">By ATC</option>
          </select>
        </div>
        <Bar
          data={timeDistributionData[filter]}
          options={timeDistributionOptions}
        />
        
      </div>
    </ScreenLayout>
  );
};
