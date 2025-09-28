import { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Phone, Save, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

const UserProfilePage = () => {
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/account/profile/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        setProfile(response.data);
      } catch (err) {
        setError('Failed to fetch profile. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE_URL}/account/profile/`, profile, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      alert('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please check your input and try again.');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-full">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Your Profile</h1>
          <p className="text-gray-500">Update your personal information.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <input type="text" name="first_name" value={profile.first_name} onChange={handleInputChange} placeholder="First Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                      </div>
                      <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <input type="text" name="last_name" value={profile.last_name} onChange={handleInputChange} placeholder="Last Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                      </div>
                      <div className="flex items-center space-x-3 col-span-2">
                          <Mail className="w-5 h-5 text-gray-400" />
                          <input type="email" name="email" value={profile.email} onChange={handleInputChange} placeholder="Email Address" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                      </div>
                      <div className="flex items-center space-x-3 col-span-2">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="Phone Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
                      </div>
                  </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                  <button type="button" className="px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium">
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                  </button>
                  <button type="submit" className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium">
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                  </button>
              </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;

