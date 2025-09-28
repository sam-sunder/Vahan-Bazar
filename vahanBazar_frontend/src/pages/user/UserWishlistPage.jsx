import { useState, useEffect } from 'react';
import axios from 'axios';
import VehicleCard from '../../components/VehicleCard';

const API_BASE_URL = 'http://localhost:8000/api';

const UserWishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/wishlist/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setWishlist(response.data);
      } catch (err) {
        setError('Failed to fetch wishlist. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchWishlist();
  }, []);

  const handleWishlistToggle = async (vehicleId) => {
    try {
      const isWishlisted = wishlist.some(item => item.vehicle.id === vehicleId);
      if (isWishlisted) {
        const wishlistItem = wishlist.find(item => item.vehicle.id === vehicleId);
        await axios.delete(`${API_BASE_URL}/wishlist/${wishlistItem.id}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setWishlist(prev => prev.filter(item => item.vehicle.id !== vehicleId));
      } else {
        const response = await axios.post(`${API_BASE_URL}/wishlist/`, { vehicle_id: vehicleId }, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setWishlist(prev => [...prev, response.data]);
      }
    } catch (err) {
      console.error('Failed to update wishlist', err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 md:!grid-cols-2 lg:!grid-cols-3 gap-8">
          {wishlist.map(item => (
            <VehicleCard 
              key={item.id} 
              vehicle={item.vehicle} 
              onWishlistToggle={handleWishlistToggle} 
              isWishlisted={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserWishlistPage;
