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

  const [totalEmployees, setTotalEmployees] = useState(null);
  const [benchedEmployees, setBenchedEmployees] = useState(0);
  const [rolesAvailable, setRolesAvailable] = useState([]);
  const [averageBenchDays, setAverageBenchDays] = useState(0);
  const [employeeStatus, setEmployeeStatus] = useState(null);
  const [avgMatch, setAvgMatch] = useState(null);
  



  const [activeProjects, setActiveProjects] = useState(0);
  const [finished2025, setFinished2025] = useState(0);
  const [avgDuration, setAvgDuration] = useState(0);
  const [avgMembers, setAvgMembers] = useState(0);
  const [avgRoles, setAvgRoles] = useState(0);
  

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

  useEffect(() => {
    const storedValue = localStorage.getItem("avgMatchPercent");
    if (storedValue) {
      setAvgMatch(JSON.parse(storedValue));
    }
  }, []);

  useEffect(() => {
    const fetchRolesAvailable = async () => {
    const { count, error } = await supabase
      .from('Role')
      .select('id_role', { count: 'exact', head: true });

    if (error) {
      console.error('Error counting roles:', error);
      return;
    }

    setRolesAvailable(count);
  };

    fetchRolesAvailable();
  }, []);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
    const { count, error } = await supabase
      .from('User')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error fetching total employees:', error);
      return;
    }

    setTotalEmployees(count);
  };

    fetchTotalEmployees();
  }, []);

  useEffect(() => {
    const fetchBenchedEmployees = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("Status")
      .eq("Status", "benched");

    if (error) {
      console.error("Error fetching benched employees:", error);
      return;
    }

    setBenchedEmployees(data.length);
  };

    fetchBenchedEmployees();
  }, []);

  useEffect(() => {
    const fetchAverageBenchDays = async () => {
    const { data, error } = await supabase
      .from('User')
      .select('AccumulatedBenchDays');

    if (error) {
      console.error('Error fetching bench days:', error);
      return;
    }

    const validValues = data
      .map(user => user.AccumulatedBenchDays)
      .filter(days => typeof days === 'number' && !isNaN(days));

    if (validValues.length === 0) {
      setAverageBenchDays(0);
      return;
    }

    const total = validValues.reduce((sum, days) => sum + days, 0);
    const avg = total / validValues.length;

    setAverageBenchDays(avg.toFixed(1)); 
  };

    fetchAverageBenchDays();
  }, []);

  useEffect(() => {
    const fetchEmployeeStatus = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("Status");

    if (error) {
      console.error("Error fetching employee status:", error);
      return;
    }

    const counts = {
      staffed: 0,
      benched: 0,
    };

    data.forEach(user => {
      if (user.Status === 'staffed') counts.staffed++;
      else if (user.Status === 'benched') counts.benched++;
    });

    setEmployeeStatus({
      labels: ['Assigned', 'Benched'],
      datasets: [
        {
          data: [counts.staffed, counts.benched],
          backgroundColor: ['#10B981', '#EF4444'],
          borderWidth: 0,
        },
      ],
    });
  };

    fetchEmployeeStatus();
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

  const [certificationsChart, setCertificationsChart] = useState(null);
  useEffect(() => {
    const fetchCertificationsByMonth = async () => {
      const { data, error } = await supabase
        .from('Certificates')
        .select('Date_of_realization');

      if (error) {
        console.error('Error fetching monthly certifications:', error);
        return;
      }

      const monthly2024 = Array(12).fill(0);
      const monthly2025 = Array(12).fill(0);

      data.forEach(({ Date_of_realization }) => {
        const date = new Date(Date_of_realization);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (year === 2024) monthly2024[month]++;
        if (year === 2025) monthly2025[month]++;
      });

      setCertificationsChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2024',
            data: monthly2024,
            borderColor: '#F97316',
            backgroundColor: '#FCD34D',
            tension: 0.3,
          },
          {
            label: '2025',
            data: monthly2025,
            borderColor: '#8B5CF6',
            backgroundColor: '#DDD6FE',
            tension: 0.3,
          },
        ]
      });
    };

    fetchCertificationsByMonth();
  }, []);

  const [employeeStatusData, setEmployeeStatusData] = useState({
    labels: ["Staffed", "Benched"],
    datasets: [
      {
      data: [0, 0],
      backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  });

  useEffect(() => {
    const fetchEmployeeStatus = async () => {
    const { data, error } = await supabase.from("User").select("Status");

    if (error) {
      console.error("Error fetching employee statuses:", error);
      return;
    }

    const staffed = data.filter((user) => user.Status === "staffed").length;
    const benched = data.filter((user) => user.Status === "benched").length;

    setEmployeeStatusData({
      labels: ["Staffed", "Benched"],
      datasets: [
        {
          data: [staffed, benched],
          backgroundColor: ["#36A2EB", "#FF6384"],
        },
      ],
    });
  };

    fetchEmployeeStatus();
  }, []);

  const timeDistributionOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const [timeDistributionData, setTimeDistributionData] = useState({
    ATC: { labels: [], datasets: [] },
    Capability: { labels: [], datasets: [] },
    Level: { labels: [], datasets: [] },
  });

  useEffect(() => {
    const fetchAndFormatData = async () => {
    const { data, error } = await supabase
      .from("User")
      .select("Status, atc, capability, careerLevel");

    if (error) {
      console.error("Error fetching data from Supabase:", error);
      return;
    }

    const groupBy = (key) => {
      const grouped = {};

      data.forEach((user) => {
        const groupKey = user[key] || "Unknown";
        if (!grouped[groupKey]) {
          grouped[groupKey] = { benched: 0, staffed: 0 };
        }

        if (user.Status === "benched") grouped[groupKey].benched++;
        if (user.Status === "staffed") grouped[groupKey].staffed++;
      });

      const labels = Object.keys(grouped);
      const benchedData = labels.map((label) => grouped[label].benched);
      const staffedData = labels.map((label) => grouped[label].staffed);

      return {
        labels,
        datasets: [
          {
            label: "Benched",
            backgroundColor: "#EF4444",
            data: benchedData,
          },
          {
            label: "Assigned",
            backgroundColor: "#10B981",
            data: staffedData,
          },
        ],
      };
    };

    const updatedData = {
      ATC: groupBy("atc"),
      Capability: groupBy("capability"),
      Level: groupBy("careerLevel"),
    };

    setTimeDistributionData(updatedData);
  };

    fetchAndFormatData();
  }, []);

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

const [coursesChart, setCoursesChart] = useState(null);
const [certsChart, setCertsChart] = useState(null);
useEffect(() => {
  const fetchMonthlyCounts = async () => {
    const { data: courseData, error: courseError } = await supabase
      .from('Courses')
      .select('Started');

    if (courseError) {
      console.error('Error fetching courses:', courseError);
      return;
    }

    const courseMonthly2024 = Array(12).fill(0);
    const courseMonthly2025 = Array(12).fill(0);

    courseData.forEach(({ Started }) => {
      const date = new Date(Started);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (year === 2024) courseMonthly2024[month]++;
      if (year === 2025) courseMonthly2025[month]++;
    });

    setCoursesChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: courseMonthly2024,
          borderColor: '#3B82F6',
          backgroundColor: '#DBEAFE',
          tension: 0.3,
        },
        {
          label: '2025',
          data: courseMonthly2025,
          borderColor: '#10B981',
          backgroundColor: '#D1FAE5',
          tension: 0.3,
        },
      ],
    });

    const { data: certData, error: certError } = await supabase
      .from('Certificates')
      .select('Date_of_realization');

    if (certError) {
      console.error('Error fetching certifications:', certError);
      return;
    }

    const certMonthly2024 = Array(12).fill(0);
    const certMonthly2025 = Array(12).fill(0);

    certData.forEach(({ Date_of_realization }) => {
      const date = new Date(Date_of_realization);
      const year = date.getFullYear();
      const month = date.getMonth();
      if (year === 2024) certMonthly2024[month]++;
      if (year === 2025) certMonthly2025[month]++;
    });

    setCertsChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: '2024',
          data: certMonthly2024,
          borderColor: '#F97316',
          backgroundColor: '#FCD34D',
          tension: 0.3,
        },
        {
          label: '2025',
          data: certMonthly2025,
          borderColor: '#8B5CF6',
          backgroundColor: '#DDD6FE',
          tension: 0.3,
        },
      ],
    });
  };

  fetchMonthlyCounts();
}, []);

  const [recommendedCoursesChart, setRecommendedCoursesChart] = useState(null);
  const [recommendedCertificationsChart, setRecommendedCertificationsChart] = useState(null);
  useEffect(() => {
    const fetchMonthlyCounts = async () => {
      const { data, error } = await supabase
        .from('Course_Cert_Completed')
        .select('created_at')
        .eq('type', 'course');

      if (error) {
        console.error('Error fetching recommended courses:', error);
        return;
      }

      const monthly2024 = Array(12).fill(0);
      const monthly2025 = Array(12).fill(0);

      data.forEach(({ created_at }) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth(); 

        if (year === 2024) monthly2024[month]++;
        if (year === 2025) monthly2025[month]++;
      });

      setRecommendedCoursesChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2024',
            data: monthly2024,
            borderColor: '#3B82F6',
            backgroundColor: '#DBEAFE',
            tension: 0.3,
          },
          {
            label: '2025',
            data: monthly2025,
            borderColor: '#10B981',
            backgroundColor: '#D1FAE5',
            tension: 0.3,
          },
        ]
      });
    };

    fetchMonthlyCounts();
  }, []);

  useEffect(() => {
    const fetchRecommendedCertifications = async () => {
      const { data, error } = await supabase
        .from('Course_Cert_Completed')
        .select('created_at')
        .eq('type', 'certification');

      if (error) {
        console.error('Error fetching recommended certifications:', error);
        return;
      }

      const monthly2024 = Array(12).fill(0);
      const monthly2025 = Array(12).fill(0);

      data.forEach(({ created_at }) => {
        const date = new Date(created_at);
        const year = date.getFullYear();
        const month = date.getMonth();
        if (year === 2024) monthly2024[month]++;
        if (year === 2025) monthly2025[month]++;
      });

      setRecommendedCertificationsChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2024',
            data: monthly2024,
            borderColor: '#F97316',
            backgroundColor: '#FCD34D',
            tension: 0.3,
          },
          {
            label: '2025',
            data: monthly2025,
            borderColor: '#8B5CF6',
            backgroundColor: '#DDD6FE',
            tension: 0.3,
          },
        ]
      });
    };

    fetchRecommendedCertifications();
  }, []);

  const [goalsChart, setGoalsChart] = useState(null);
  useEffect(() => {
    const fetchMonthlyCounts = async () => {
      const { data, error } = await supabase
        .from('Goal')
        .select('Completed_Abandoned_At')
        .eq('Status', 'completed');

      if (error) {
        console.error('Error fetching goals:', error);
        return;
      }

      const monthly2024 = Array(12).fill(0);
      const monthly2025 = Array(12).fill(0);

      data.forEach(({Completed_Abandoned_At}) => {
        const date = new Date(Completed_Abandoned_At);
        const year = date.getFullYear();
        const month = date.getMonth(); 

        if (year === 2024) monthly2024[month]++;
        if (year === 2025) monthly2025[month]++;
      });

      setGoalsChart({
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: '2024',
            data: monthly2024,
            borderColor: '#F97316',
            backgroundColor: '#FCD34D',
            tension: 0.3,
          },
          {
            label: '2025',
            data: monthly2025,
            borderColor: '#8B5CF6',
            backgroundColor: '#DDD6FE',
            tension: 0.3,
          },
        ]
      });
    };
    fetchMonthlyCounts();
  }, []);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      const { data: projects, error: projectError } = await supabase
        .from('Project')
        .select('Status, StartDate, EndDate, Members');

      const { data: roles, error: roleError } = await supabase
        .from('Role')
        .select('project_id');

      if (projectError || roleError) {
        console.error('Error fetching project stats', projectError || roleError);
        return;
      }

      const activeCount = projects.filter(p => p.Status?.toLowerCase() === 'ongoing').length;
      setActiveProjects(activeCount);

      const finished2025Count = projects.filter(p => {
        const end = new Date(p.EndDate);
        return p.Status?.toLowerCase() === 'finished' && end.getFullYear() === 2025;
      }).length;
      setFinished2025(finished2025Count);

      const durations = projects.map(p => {
        const start = new Date(p.StartDate);
        const end = new Date(p.EndDate);
        return (end - start) / (1000 * 60 * 60 * 24 * 30);
      });
      const avgDur = durations.reduce((a, b) => a + b, 0) / durations.length;
      setAvgDuration(avgDur.toFixed(1));

      const memberCounts = projects.map(p => {
        return p.Members ? p.Members.split(',').filter(Boolean).length : 0;
      });
      const avgMemb = memberCounts.reduce((a, b) => a + b, 0) / memberCounts.length;
      setAvgMembers(Math.round(avgMemb));

      const roleCountMap = {};
      roles.forEach(r => {
        if (!r.project_id) return;
        roleCountMap[r.project_id] = (roleCountMap[r.project_id] || 0) + 1;
      });
      const roleCounts = Object.values(roleCountMap);
      const avgRol = roleCounts.reduce((a, b) => a + b, 0) / roleCounts.length;
      setAvgRoles(Math.round(avgRol));
    };

    fetchDashboardStats();
  }, []);

  return (
    <ScreenLayout>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-4">Employees Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
          <DashboardCard title="Total Employees" value={totalEmployees} color="text-gray-800" />
          <DashboardCard title="Benched Employees" value={benchedEmployees} color="text-red-500" />
          <DashboardCard title="Roles Available" value={rolesAvailable} color="text-emerald-500" />
          <DashboardCard title="Avg. Percentage of Compatibility with Roles" value={avgMatch !== null ? `${avgMatch.toFixed(1)}%` : 'Loading...'} color="text-blue-500"/>
          <DashboardCard title="Avg. Time Spent in Benched" value={averageBenchDays} color="text-yellow-500" />
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
            <Bar data={timeDistributionData[filter]} options={timeDistributionOptions}/>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-800 border-b pb-1 mb-4">Projects Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-5 mb-6">
          <DashboardCard title="Active Projects" value={activeProjects} color="text-purple-600" />
          <DashboardCard title="Projects Completed in 2025" value={finished2025} color="text-green-600" />
          <DashboardCard title="Avg. Project Duration" value={`${avgDuration} months`} color="text-cyan-600" />
          <DashboardCard title="Avg. Members per Project" value={avgMembers} color="text-cyan-600" />
          <DashboardCard title="Avg. Roles per Project" value={avgRoles} color="text-cyan-600" />
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
                {completionType === 'Certifications' && certsChart && (
                  <Line data={certsChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                )}
                {completionType === 'Courses' && coursesChart && (
                  <Line data={coursesChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
                )}
              </div>
          </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-md font-semibold text-gray-800">
              Progress of Recommended Certifications & Courses
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
            {recommendType === 'RecommendedCourses' && recommendedCoursesChart && (
              <Line
                data={recommendedCoursesChart}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            )}
            {recommendType === 'RecommendedCertifications' && recommendedCertificationsChart && (
              <Line
                data={recommendedCertificationsChart}
                options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }}
              />
            )}
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
            {goalsChart && (
            <Line data={goalsChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />)
            }</div>
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
            {goalsChart && (
            <Line data={goalsChart} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />)
            }</div>
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
              {recommendType === 'RecommendedCourses' && recommendedCoursesChart && (
                <Line
                  data={recommendedCoursesChart}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                />
              )}
              {recommendType === 'RecommendedCertifications' && recommendedCertificationsChart && (
                <Line
                  data={recommendedCertificationsChart}
                  options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }}
                />
              )}
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
              {completionType === 'Certifications' && certsChart && (
                <Line data={certsChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              )}
              {completionType === 'Courses' && coursesChart && (
                <Line data={coursesChart} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
              )}
            </div>
          </div>
        </div>
      )}


    </ScreenLayout>
    
  );
};