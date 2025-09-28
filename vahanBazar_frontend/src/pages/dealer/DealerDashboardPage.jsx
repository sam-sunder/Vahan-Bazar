import React from 'react';
import useApi from '../../hooks/useApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaCar, FaPlus, FaWrench, FaCalendarCheck } from 'react-icons/fa';
import axios from 'axios';

const DealerDashboardPage = () => {
  const { response: metrics, loading, error } = useApi({
    method: 'get',
    url: 'http://localhost:8000/api/dealer/dashboard/',
    requester: axios
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const data = [
    { name: 'Total Vehicles', value: metrics?.total_vehicles, icon: <FaCar className="text-4xl text-blue-500" /> },
    { name: 'New Vehicles', value: metrics?.new_vehicles, icon: <FaPlus className="text-4xl text-green-500" /> },
    { name: 'Used Vehicles', value: metrics?.used_vehicles, icon: <FaWrench className="text-4xl text-yellow-500" /> },
    { name: 'Total Bookings', value: metrics?.total_bookings, icon: <FaCalendarCheck className="text-4xl text-red-500" /> },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md flex items-center">
            <div className="mr-4">{item.icon}</div>
            <div>
              <h2 className="text-xl font-semibold">{item.name}</h2>
              <p className="text-3xl">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Vehicles Added Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metrics?.vehicles_over_time}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DealerDashboardPage;
