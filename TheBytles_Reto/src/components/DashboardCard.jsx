export const DashboardCard = ({ title, value, color }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-start justify-center w-full h-full">
    <p className="text-sm text-gray-500 mb-1">{title}</p>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);