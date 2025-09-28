import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash } from 'lucide-react';
import Modal from '../../components/Modal';

const API_BASE_URL = 'http://localhost:8000/api';

const DealerBranchesPage = () => {
  const [branches, setBranches] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/dealer/branches/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setBranches(response.data);
    } catch (err) {
      setError('Failed to fetch branches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const handleAddBranch = () => {
    setEditingBranch(null);
    setIsModalOpen(true);
  };

  const handleEditBranch = (branch) => {
    setEditingBranch(branch);
    setIsModalOpen(true);
  };

  const handleDeleteBranch = async (id) => {
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await axios.delete(`${API_BASE_URL}/dealer/branches/${id}/`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        });
        fetchBranches();
      } catch (err) {
        console.error('Failed to delete branch', err);
      }
    }
  };

  const handleFormSubmit = async (branchData) => {
    const url = editingBranch
      ? `${API_BASE_URL}/dealer/branches/${editingBranch.id}/`
      : `${API_BASE_URL}/dealer/branches/`;
    const method = editingBranch ? 'put' : 'post';

    try {
      await axios[method](url, branchData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      fetchBranches();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save branch', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Branches</h1>
        <button onClick={handleAddBranch} className="bg-primary text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-primary-dark">
          <Plus className="w-5 h-5" />
          <span>Add Branch</span>
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">City</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches.map(branch => (
              <tr key={branch.id}>
                <td className="px-6 py-4 whitespace-nowrap">{branch.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{branch.city}</td>
                <td className="px-6 py-4 whitespace-nowrap">{branch.state}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <button onClick={() => handleEditBranch(branch)} className="text-primary hover:text-primary-dark">
                    <Edit className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDeleteBranch(branch.id)} className="text-red-600 hover:text-red-800">
                    <Trash className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <BranchFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        branch={editingBranch}
      />
    </div>
  );
};

const BranchFormModal = ({ isOpen, onClose, onSubmit, branch }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipcode: '',
    contact_number: ''
  });

  useEffect(() => {
    if (branch) {
      setFormData(branch);
    } else {
      setFormData({ name: '', address: '', city: '', state: '', zipcode: '', contact_number: '' });
    }
  }, [branch, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">{branch ? 'Edit Branch' : 'Add Branch'}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Branch Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
        <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Address" rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required></textarea>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="City" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
          <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="State" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="zipcode" value={formData.zipcode} onChange={handleChange} placeholder="Zip Code" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
          <input type="tel" name="contact_number" value={formData.contact_number} onChange={handleChange} placeholder="Contact Number" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium">
            {branch ? 'Save Changes' : 'Add Branch'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default DealerBranchesPage;
