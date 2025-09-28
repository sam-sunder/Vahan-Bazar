import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const UserBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/bookings/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setBookings(response.data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>
      {bookings.length === 0 ? (
        <p className="text-gray-500">You have no bookings yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map(booking => (
            <div key={booking.id} className="p-6 border rounded-lg flex items-center justify-between">
              <div>
                <p className="text-lg font-semibold">{booking.booking_type.replace(/_/g, ' ')}</p>
                <p className="text-gray-600">{booking.inventory_item || booking.branch}</p>
                <p className="text-sm text-gray-500">Booked on: {new Date(booking.created_at).toLocaleDateString()}</p>
                <p className="text-sm text-gray-500">Preferred Date: {new Date(booking.preferred_date).toLocaleDateString()}</p>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {booking.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBookingsPage;
