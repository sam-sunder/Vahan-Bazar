import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal';

const API_BASE_URL = 'http://localhost:8000/api';

const BookingModal = ({ isOpen, onClose, vehicle, bookingType }) => {
  const [formData, setFormData] = useState({
    preferred_date: '',
    preferred_time: '',
    branch: '',
    user_id: localStorage.getItem('user').id
  });
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    if (vehicle) {
      if (vehicle.branch) {
        setBranches([vehicle.branch]);
        setFormData(prev => ({ ...prev, branch: vehicle.branch.id }));
      } else if (vehicle.dealer) {
        const fetchBranches = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/dealer/branches/?dealership=${vehicle.dealer.id}`);
            setBranches(response.data);
          } catch (err) {
            console.error('Failed to fetch branches', err);
          }
        };
        fetchBranches();
      }
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/bookings/`, {
        ...formData,
        booking_type: bookingType,
        inventory_item: vehicle.id
      }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Booking successful!');
      onClose();
    } catch (err) {
      console.error('Failed to create booking', err);
      alert('Failed to create booking. Please try again.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">{bookingType === 'TEST_RIDE' ? 'Book a Test Ride' : 'Book Now'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700">Branch</label>
          {branches.length > 1 ? (
            <select id="branch" name="branch" value={formData.branch} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required>
              <option value="">Select a branch</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </select>
          ) : (
            <input type="text" value={branches[0]?.name || ''} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-gray-100" disabled />
          )}
        </div>
        <div>
          <label htmlFor="preferred_date" className="block text-sm font-medium text-gray-700">Preferred Date</label>
          <input type="date" id="preferred_date" name="preferred_date" value={formData.preferred_date} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
        </div>
        <div>
          <label htmlFor="preferred_time" className="block text-sm font-medium text-gray-700">Preferred Time</label>
          <input type="time" id="preferred_time" name="preferred_time" value={formData.preferred_time} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium">
            Submit
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BookingModal;