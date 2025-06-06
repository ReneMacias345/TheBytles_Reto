import React, { useState, useEffect } from 'react';
import { ScreenLayout } from '../layouts/ScreenLayout';
import { DashboardCard } from '../components/DashboardCard';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import supabase from '../config/supabaseClient';

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
  const [completionType, setCompletionType] = useState('Certifications');
  const [recommendType, setRecommendType] = useState('RecommendedCertifications');
  const [showExpandedChart,setShowExpandedChart] = useState(false)
  const [showExpandedCompletion, setShowExpandedCompletion] = useState(false);
  const [showExpandedRecommended, setShowExpandedRecommended] = useState(false);

  const [projectStatusData, setProjectStatusData] = useState(null);
  useEffect(() => {
    const fetchProjectStatus = async () => {
      const { data, error } = await supabase
        .from('Project')
        .select('Status');

      if (error) {
        console.error('Error fetching project statuses:', error);
        return;
      }

      const statusCount = {
        Recruiting: 0,
        Ongoing: 0,
        Ready: 0,
        Finished: 0,
      };

      data.forEach(({ Status }) => {
        const formattedStatus = Status.charAt(0).toUpperCase() + Status.slice(1).toLowerCase();
        if (statusCount[formattedStatus] !== undefined) {
          statusCount[formattedStatus] += 1;
        }
      });

      setProjectStatusData({
        labels: Object.keys(statusCount),
        datasets: [
          {
            label: 'Projects',
            data: Object.values(statusCount),
            backgroundColor: ['#F59E0B', '#06B6D4', '#3B82F6', '#10B981'],
          },
        ],
      });
    };
    fetchProjectStatus();
  }, []);

  const [totalGoalsData, setTotalGoalsData] = useState(null);
  useEffect(() => {
    const fetchTotalGoals = async () => {
      const { count, error } = await supabase
        .from('Goal')
        .select('*', { count: 'exact', head: true })
        .eq('Status', 'completed');

      if (error) {
        console.error('Error fetching total goal data:', error);
        return;
      }
      setTotalGoalsData(count);
    };
    fetchTotalGoals();
  }, []);

  const [totalCoursesData, setTotalCoursesData] = useState(null);
  useEffect(() => {
    const fetchTotalCourses = async () => {
      const { count, error } = await supabase
        .from('Courses')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total course data:', error);
        return;
      }

      setTotalCoursesData(count);
    };
    fetchTotalCourses();
  }, []);

  const [totalCertData, setTotalCertData] = useState(null);
  useEffect(() => {
    const fetchTotalCerts = async () => {
      const { count, error } = await supabase
        .from('Certificates')
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.error('Error fetching total certificates data:', error);
        return;
      }

      setTotalCertData(count);
    };
    fetchTotalCerts();
  }, []);

    const [totalRecCourseData, setTotalRecCourseData] = useState(null);
  useEffect(() => {
    const fetchTotallRecCourses = async () => {
      const { count, error } = await supabase
        .from('Course_Cert_Completed')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'course');

      if (error) {
        console.error('Error fetching total recommended certificates data:', error);
        return;
      }
      setTotalRecCourseData(count);
    };
    fetchTotallRecCourses();
  }, []);

  const [totalRecCertData, setTotalRecCertData] = useState(null);
  useEffect(() => {
    const fetchTotalRecCerts = async () => {
      const { count, error } = await supabase
        .from('Course_Cert_Completed')
        .select('*', { count: 'exact', head: true })
        .eq('type', 'certification');

      if (error) {
        console.error('Error fetching total recommended certificates data:', error);
        return;
      }
      setTotalRecCertData(count);
    };
    fetchTotalRecCerts();
  }, []);

  const employeeStatusData = {
    labels: ['Assigned', 'Benched'],
    datasets: [
      {
        data: [85, 35],
        backgroundColor: ['#10B981', '#EF4444'],
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
          backgroundColor: '#EF4444',
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
          backgroundColor: '#EF4444',
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
          backgroundColor: '#EF4444',
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

  const lineChartData = {
    Certifications: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: [4, 8, 12, 10, 15, 20, 18, 14, 5, 9, 6, 4],
          borderColor: '#F97316',
          backgroundColor: '#FCD34D',
          tension: 0.3,
        },
        {
          label: '2025',
          data: [4, 23, 8, 10, 17, 7, 14, 12, 22, 20, 10, 5],
          borderColor: '#8B5CF6',
          backgroundColor: '#DDD6FE',
          tension: 0.3,
        },
      ]
    },
    Courses: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: [12, 20, 5, 17, 6, 12, 9, 18, 7, 22, 8, 6],
          borderColor: '#3B82F6',
          backgroundColor: '#DBEAFE',
          tension: 0.3,
        },
        {
          label: '2025',
          data: [10, 23, 18, 15, 21, 27, 25, 20, 16, 13, 10, 8],
          borderColor: '#10B981',
          backgroundColor: '#D1FAE5',
          tension: 0.3,
        },
      ]
    },
    RecommendedCertifications: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: [3, 6, 8, 5, 9, 13, 12, 8, 6, 7, 5, 3],
          borderColor: '#F97316',
          backgroundColor: '#FCD34D',
          tension: 0.3,
        },
        {
          label: '2025',
          data: [5, 9, 11, 7, 10, 14, 13, 10, 9, 8, 6, 5],
          borderColor: '#8B5CF6',
          backgroundColor: '#DDD6FE',
          tension: 0.3,
        },
      ]
    },
    RecommendedCourses: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: [8, 12, 14, 10, 15, 20, 18, 16, 12, 10, 7, 5],
          borderColor: '#3B82F6',
          backgroundColor: '#DBEAFE',
          tension: 0.3,
        },
        {
          label: '2025',
          data: [10, 14, 18, 12, 19, 23, 22, 20, 16, 15, 12, 10],
          borderColor: '#10B981',
          backgroundColor: '#D1FAE5',
          tension: 0.3,
        },
      ]
    }
  };
 const goalData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
        {
          label: '2024',
          data: [8, 12, 11, 10, 15, 22, 18, 16, 19, 10, 7, 5],
          borderColor: '#F97316',
          backgroundColor: '#FCD34D',
          tension: 0.3,
        },
        {
          label: '2025',
          data: [4, 11, 18, 12, 20, 23, 22, 20, 20, 15, 12, 10],
          borderColor: '#8B5CF6',
          backgroundColor: '#DDD6FE',
          tension: 0.3,
        },
      ]
  };

  return (
    <ScreenLayout>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Employees Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <DashboardCard title="Total Employees" value="120" color="text-gray-800" />
          <DashboardCard title="Benched Employees" value="35" color="text-red-500" />
          <DashboardCard title="Roles Available" value="43" color="text-emerald-500" />
          <DashboardCard title="Avg. Percentage of Compatibility with Roles" value="61.2%" color="text-blue-500" />
          <DashboardCard title="Avg. Time Spent in Benched" value="8 days" color="text-yellow-500" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-md font-semibold text-gray-800 mb-3">All Employee Status Distribution</h2>
            <Doughnut data={employeeStatusData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
          </div>

          <div className="bg-white rounded-2xl shadow p-6 col-span-2">
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
            <Bar data={timeDistributionData[filter]} options={timeDistributionOptions} />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1 mb-4">Projects Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          <DashboardCard title="Active Projects" value="12" color="text-purple-600" />
          <DashboardCard title="Projects Completed in 2025" value="16" color="text-green-600" />
          <DashboardCard title="Avg. Project Duration" value="7.4 months" color="text-cyan-600" />
          <DashboardCard title="Avg. Members per Project" value="11" color="text-cyan-600" />
          <DashboardCard title="Avg. Roles per Project" value="8" color="text-cyan-600" />
        </div>

        <div className="bg-white rounded-2xl shadow p-6 mb-6 h-[500px]">
          <h2 className="text-md font-semibold text-gray-800 mb-3">Project Status Overview</h2>
            <div className="h-[430px]">
              {projectStatusData ? (
                <Bar
                  data={projectStatusData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                  }}
                />
              ) : (
                <p className="text-sm text-gray-500">Loading project status data...</p>
              )}
            </div>
        </div>
        </div>

      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Learning Progress</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          <DashboardCard title="Total Completed Goals" value={totalGoalsData} color="text-purple-600" />
          <DashboardCard title="Total Completed Courses" value={totalCoursesData} color="text-blue-500" /> 
          <DashboardCard title="Total Completed Certifications" value={totalCertData} color="text-orange-500" /> 
          <DashboardCard title="Recommended Courses Completed" value={totalRecCourseData} color="text-cyan-600" /> 
          <DashboardCard title="Recommended Certifications Completed" value={totalRecCertData} color="text-purple-700" /> 
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold text-gray-800">
                Progress of Certifications & Courses Completion
              </h2>
              <button
                type="button"
                onClick={() => setShowExpandedCompletion(true)}
                className="p-2 rounded-full bg-white"
                title="Expand to View More"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="square"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center mb-3">
              <select
                className="text-sm px-2 py-1 rounded-md border border-gray-300 text-[#A100FF] bg-white"
                value={completionType}
                onChange={(e) => setCompletionType(e.target.value)}
              >
                <option value="Certifications">By Certifications</option>
                <option value="Courses">By Courses</option>
              </select>
            </div>

              <div className='mt-5'>
                <Line data={lineChartData[completionType]} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
              </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-md font-semibold text-gray-800">
                Progress of *Recommended* Certifications & Courses
              </h2>
              <button
                type="button"
                onClick={() => setShowExpandedRecommended(true)}
                className="p-2 rounded-full bg-white"
                title="Expand to View More"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="square"
                    strokeLinejoin="square"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
              </button>
            </div>
            <div className="flex justify-center mb-3">
              <select
                className="text-sm px-2 py-1 rounded-md border border-gray-300 text-[#A100FF] bg-white"
                value={recommendType}
                onChange={(e) => setRecommendType(e.target.value)}
              >
                <option value="RecommendedCertifications">By Certifications</option>
                <option value="RecommendedCourses">By Courses</option>
              </select>
            </div>
            <div className='mt-5'>
              <Line data={lineChartData[recommendType]}options={{responsive: true,plugins: { legend: { position: 'bottom' } },}}/>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-md font-semibold text-gray-800 ">Progress of Goals Compare to Last Year</h2>
              <button
                  type="button"
                  onClick={() => setShowExpandedChart(true)}
                  className="p-2 rounded-full bg-white"
                  title="Expand to View More"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="square"
                      strokeLinejoin="square"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                </button>
            </div>
            <div className='mt-5'>
            <Line data={goalData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      </div>

      {showExpandedChart && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-5xl p-6 rounded-2xl shadow-md relative ml-40">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Progress of Goals Compare to Last Year</h2>
              <button
                type="button"
                onClick={() => setShowExpandedChart(false)}
                className="p-2 rounded-full hover:bg-gray-100 bg-white"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              </button>
            </div>

            <div className="h-[500px]">
              <Line
                data={goalData}options={{responsive: true,maintainAspectRatio: false,plugins: { legend: { position: 'bottom' } },}}
              />
            </div>
          </div>
        </div>
      )}

      {showExpandedRecommended && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-5xl p-6 rounded-2xl shadow-md relative ml-40">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Progress of Recommended Certifications & Courses</h2>
              <button
                type="button"
                onClick={() => setShowExpandedRecommended(false)}
                className="p-2 rounded-full hover:bg-gray-100 bg-white"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              </button>
            </div>
            <div className="h-[500px]">
              <Line data={lineChartData[recommendType]} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      )}

      {showExpandedCompletion && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-[90%] max-w-5xl p-6 rounded-2xl shadow-md relative ml-40">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Progress of Certifications & Courses</h2>
              <button
                type="button"
                onClick={() => setShowExpandedCompletion(false)}
                className="p-2 rounded-full hover:bg-gray-100 bg-white"
                title="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
                </svg>
              </button>
            </div>
            <div className="h-[500px]">
              <Line data={lineChartData[completionType]} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
            </div>
          </div>
        </div>
      )}


    </ScreenLayout>
    
  );
};

