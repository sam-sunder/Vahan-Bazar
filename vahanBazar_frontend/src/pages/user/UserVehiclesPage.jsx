import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import DealerVehicleCard from '../../components/DealerVehicleCard'; // We can reuse this
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const UserVehiclesPage = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicles/?type=USED`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        const userVehicles = response.data.filter(v => v.seller?.id === user.id);
        setVehicles(userVehicles);
      } catch (err) {
        setError('Failed to fetch vehicles.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  const handleEdit = (vehicle) => {
    navigate(`/account/vehicles/edit/${vehicle.id}`);
  };

  const handleDelete = async (vehicleId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await axios.delete(`${API_BASE_URL}/vehicles/${vehicleId}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setVehicles(prev => prev.filter(v => v.id !== vehicleId));
      } catch (err) {
        setError('Failed to delete vehicle.');
        console.error(err);
      }
    }
  };

  const handleView = (vehicle) => {
    navigate(`/vehicles/${vehicle.id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Your Listed Vehicles</h1>
        <Link 
          to="/account/vehicles/add" 
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
        >
          <Plus className="w-5 h-5 mr-2" />
          List a Vehicle
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="mt-2 text-sm font-medium text-gray-900">No vehicles listed yet.</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by listing your first used vehicle for sale.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-6">
          {vehicles.map(vehicle => (
            <DealerVehicleCard 
              key={vehicle.id} 
              vehicle={vehicle}
              onEdit={() => handleEdit(vehicle)}
              onDelete={() => handleDelete(vehicle.id)}
              onView={() => handleView(vehicle)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserVehiclesPage;
