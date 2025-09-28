import { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';

const API_BASE_URL = 'http://localhost:8000/api';

const VehicleComparePage = () => {
  const [allVehicles, setAllVehicles] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([null, null, null]);
  const [vehicleDetails, setVehicleDetails] = useState([null, null, null]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/vehicles/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        });
        const options = response.data.map(vehicle => ({
          value: vehicle.id,
          label: vehicle.name,
          category: vehicle.category,
          image: vehicle.images.length > 0 ? vehicle.images[0].image : null
        }));
        setAllVehicles(options);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };
    fetchVehicles();
  }, []);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      setLoading(true);
      try {
        const newVehicleDetails = await Promise.all(
          selectedVehicles.map(async (vehicle) => {
            if (vehicle) {
              const response = await axios.get(`${API_BASE_URL}/vehicles/${vehicle.value}/`, {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
                }
              });
              return response.data;
            }
            return null;
          })
        );
        setVehicleDetails(newVehicleDetails);
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedVehicles.some(v => v !== null)) {
      fetchVehicleDetails();
    } else {
      setVehicleDetails([null, null, null]);
    }
  }, [selectedVehicles]);

  const handleVehicleSelect = (selected, index) => {
    const newSelected = [...selectedVehicles];
    newSelected[index] = selected;
    setSelectedVehicles(newSelected);
  };

  const getAvailableOptions = (currentIndex) => {
    const selectedValues = selectedVehicles
      .map(v => v?.value)
      .filter(v => v !== null);

    return allVehicles.filter(option => 
      !selectedValues.includes(option.value) || selectedVehicles[currentIndex]?.value === option.value
    );
  };

  const getDisplayValue = (vehicle, key) => {
    if (!vehicle?.specs || !(key in vehicle.specs)) return '-';
    return vehicle.specs[key] || '-';
  };

  const getAllSpecKeys = () => {
    const allKeys = new Set();
    vehicleDetails.forEach(vehicle => {
      if (vehicle?.specs) {
        Object.keys(vehicle.specs).forEach(key => allKeys.add(key));
      }
    });
    return Array.from(allKeys);
  };

  const specKeys = getAllSpecKeys();

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Compare Vehicles</h1>

      <div className="grid grid-cols-1 md:!grid-cols-3 gap-8 mb-12">
        {[0, 1, 2].map((index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 flex flex-col items-center justify-between border border-gray-200">
            <div className="w-full">
              <Select
                value={selectedVehicles[index]}
                onChange={(selected) => handleVehicleSelect(selected, index)}
                options={getAvailableOptions(index)}
                isClearable
                placeholder="Select a vehicle..."
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({ ...base, marginBottom: '1rem', boxShadow: 'none', '&:hover': { borderColor: '#a0aec0' } }),
                  placeholder: (base) => ({ ...base, color: '#a0aec0' }),
                }}
              />
            </div>
            {selectedVehicles[index] ? (
              <div className="text-center">
                <img src={selectedVehicles[index].image || 'https://via.placeholder.com/150'} alt={selectedVehicles[index].label} className="w-48 h-48 object-contain mb-4 rounded-md"/>
                <h3 className="text-lg font-semibold text-gray-700">{selectedVehicles[index].label}</h3>
              </div>
            ) : (
              <div className="text-center flex-grow flex flex-col items-center justify-center">
                <div className="w-48 h-48 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-400">No vehicle selected</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-400 mt-4">Select a Vehicle</h3>
              </div>
            )}
          </div>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        </div>
      ) : selectedVehicles.some(v => v !== null) ? (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="border-b-2 border-gray-300 p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">Specification</th>
                {vehicleDetails.map((vehicle, index) => (
                  <th key={index} className="border-b-2 border-gray-300 p-4 text-left text-sm font-bold text-gray-600 uppercase tracking-wider min-w-[250px]">
                    {vehicle ? vehicle.name : 'Not Selected'}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Basic Information */}
              <tr className="bg-gray-100">
                <td className="p-4 font-bold text-gray-700" colSpan={4}>Basic Information</td>
              </tr>
              <tr>
                <td className="border-t p-4 text-gray-600">Price</td>
                {vehicleDetails.map((vehicle, index) => (
                  <td key={index} className="border-t p-4 font-mono text-gray-800">
                    {vehicle ? `₹${vehicle.price.toLocaleString()}` : '-'}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="border-t p-4 text-gray-600">Category</td>
                {vehicleDetails.map((vehicle, index) => (
                  <td key={index} className="border-t p-4 text-gray-800">
                    {vehicle ? vehicle.category : '-'}
                  </td>
                ))}
              </tr>

              {/* Specifications */}
              {specKeys.length > 0 && (
                <>
                  <tr className="bg-gray-100">
                    <td className="p-4 font-bold text-gray-700" colSpan={4}>Technical Specifications</td>
                  </tr>
                  {specKeys.map((key) => (
                    <tr key={key} className="hover:bg-gray-50">
                      <td className="border-t p-4 text-gray-600 capitalize">{key.replace(/_/g, ' ')}</td>
                      {vehicleDetails.map((vehicle, index) => (
                        <td key={index} className="border-t p-4 text-gray-800">
                          {getDisplayValue(vehicle, key)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center text-gray-500 mt-16 text-xl">
          Please select at least one vehicle to see a comparison.
        </div>
      )}
    </div>
  );
};

export default VehicleComparePage;
