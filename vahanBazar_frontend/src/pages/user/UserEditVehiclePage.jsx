import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, X, ChevronLeft, ChevronRight, PlusCircle, Trash2 } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const defaultSpecs = {
    "BIKE": {
        "Engine": "",
        "Displacement (cc)": "",
        "Power": "",
        "Torque": "",
        "Fuel Type": "Petrol",
        "Fuel Tank Capacity": "",
        "Transmission": "Manual",
        "Gears": "5",
        "Clutch": "Wet Multi-plate",
        "Brakes Front": "Disc",
        "Brakes Rear": "Disc/Drum",
        "ABS": "Single/Dual Channel",
        "Suspension Front": "Telescopic",
        "Suspension Rear": "Mono Shock",
        "Tyre Front": "",
        "Tyre Rear": "",
        "Mileage": "",
        "Max Speed": "",
        "Seat Height": "",
        "Ground Clearance": "",
        "Kerb Weight": "",
        "Wheelbase": ""
    },
    "SCOOTER": {
        "Engine": "",
        "Displacement (cc)": "",
        "Power": "",
        "Torque": "",
        "Fuel Type": "Petrol",
        "Fuel Tank Capacity": "",
        "Transmission": "Automatic",
        "Drive Type": "CVT",
        "Brakes Front": "Disc/Drum",
        "Brakes Rear": "Drum",
        "Brake System": "CBS/IBS",
        "Suspension Front": "Telescopic",
        "Suspension Rear": "Hydraulic",
        "Tyre Front": "",
        "Tyre Rear": "",
        "Mileage": "",
        "Max Speed": "",
        "Seat Height": "",
        "Ground Clearance": "",
        "Kerb Weight": "",
        "Boot Space": "",
        "Wheelbase": ""
    },
    "EV": {
        "Motor Type": "BLDC",
        "Motor Power": "",
        "Battery Type": "Lithium-ion",
        "Battery Capacity": "",
        "Battery Warranty": "",
        "Controller": "",
        "Charger Type": "",
        "Charging Time": "",
        "Range": "",
        "Drive Type": "Hub/Chain Drive",
        "Top Speed": "",
        "Brakes Front": "Disc/Drum",
        "Brakes Rear": "Drum",
        "Brake System": "CBS",
        "Suspension Front": "Telescopic",
        "Suspension Rear": "Dual Shock",
        "Tyre Front": "",
        "Tyre Rear": "",
        "Ground Clearance": "",
        "Loading Capacity": "",
        "Kerb Weight": "",
        "IP Rating": "",
        "Smart Features": "App Connectivity"
    },
}

const fetchBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/brands/`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
  });
  return response.data;
};

const fetchVehicle = async (id) => {
    const response = await axios.get(`${API_BASE_URL}/vehicles/${id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
    });
    return response.data;
}

const PhotoGallery = ({ images, onUpload, onRemove, error }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (images.length > 0 && selectedIndex >= images.length) {
            setSelectedIndex(images.length - 1);
        }
    }, [images, selectedIndex]);

    const handlePrev = () => setSelectedIndex(i => (i - 1 + images.length) % images.length);
    const handleNext = () => setSelectedIndex(i => (i + 1) % images.length);

    return (
        <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Upload Photos</h2>
            <div className="space-y-4">
                {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
                <div className="relative aspect-video bg-gray-100 rounded-lg">
                    {images.length > 0 ? (
                        <img src={images[selectedIndex]?.url} alt="Main vehicle view" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Upload size={40}/>
                            <span className="mt-2">Upload at least 3 images</span>
                        </div>
                    )}
                    {images.length > 1 && (
                        <>
                            <button onClick={handlePrev} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"><ChevronLeft size={20}/></button>
                            <button onClick={handleNext} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white p-1 rounded-full hover:bg-black/50 transition"><ChevronRight size={20}/></button>
                        </>
                    )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {images.map((image, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={image.url} alt={image.name} onClick={() => setSelectedIndex(index)} className={`h-full w-full object-cover rounded-md cursor-pointer transition ${selectedIndex === index ? 'ring-2 ring-blue-500' : ''}`} />
                            <button onClick={() => onRemove(index)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                        </div>
                    ))}
                    {images.length < 8 && (
                        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full aspect-square border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                            <Upload className="h-6 w-6 text-gray-400" />
                            <span className="mt-1 text-xs text-gray-500">Upload</span>
                            <input id="file-upload" type="file" className="sr-only" multiple onChange={onUpload} accept="image/*" />
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}

const UserEditVehiclePage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model_name: '',
    price: '',
    fuel_type: '',
    year: '',
    km_driven: '',
    condition: '',
    specs: {},
    category: 'BIKE'
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const brands = await fetchBrands();
        setAvailableBrands(brands);
        if (id) {
          const vehicle = await fetchVehicle(id);
          setFormData({
            name: vehicle.name,
            brand: vehicle.brand.id,
            model_name: vehicle.model_name,
            price: vehicle.price,
            fuel_type: vehicle.fuel_type,
            year: vehicle.year,
            km_driven: vehicle.km_driven,
            condition: vehicle.condition,
            specs: vehicle.specs,
            category: vehicle.category
          });
          setImages(vehicle.images.map(img => ({ url: img.image, name: '' })));
        } else {
            setFormData(prev => ({...prev, specs: defaultSpecs[prev.category]}))
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadInitialData();
  }, [id]);

  useEffect(() => {
    const brand = availableBrands.find(b => b.id == formData.brand);
    const brandName = brand ? brand.name : '';
    const modelName = formData.model_name || '';
    setFormData(prev => ({ ...prev, name: `${brandName} ${modelName}`.trim() }));
  }, [formData.brand, formData.model_name, availableBrands]);

  useEffect(() => {
      if(formData.category) {
          setFormData(prev => ({...prev, specs: defaultSpecs[formData.category]}))
      }
  }, [formData.category]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ url: URL.createObjectURL(file), name: file.name, file }));
    setImages(prev => [...prev, ...newImages].slice(0, 8));
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const validateSpecs = () => {
      const specErrors = {};
      for(const key in formData.specs) {
          if(!formData.specs[key]) {
              specErrors[key] = `${key} is required`;
          }
      }
      return specErrors;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const specErrors = validateSpecs();
    if(Object.keys(specErrors).length > 0) {
        setErrors(specErrors);
        setActiveTab('specifications');
        return;
    }

    if (images.length < 3) {
      setErrors({ images: 'At least 3 images are required' });
      setActiveTab('photos');
      return;
    }

    const vehicleData = {
      ...formData,
      type: 'USED',
      status: 'AVAILABLE',
      price: parseFloat(formData.price),
      year: parseInt(formData.year),
      km_driven: parseInt(formData.km_driven),
    };

    const finalFormData = new FormData();
    finalFormData.append('data', JSON.stringify(vehicleData));
    images.forEach((image) => {
        if(image.file) finalFormData.append('images', image.file);
    });

    try {
        if (id) {
            await axios.put(`${API_BASE_URL}/vehicles/${id}/`, finalFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Content-Type': 'multipart/form-data' }
            });
        } else {
            await axios.post(`${API_BASE_URL}/vehicles/`, finalFormData, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}`, 'Content-Type': 'multipart/form-data' }
            });
        }
      navigate('/account/vehicles');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to submit. Please try again.' });
    }
  };

  const renderTabContent = () => {
      switch(activeTab) {
          case 'specifications':
              return (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Specifications</h2>
                        <p className="text-sm text-gray-500 mb-6">Fill in the specifications for your vehicle.</p>
                        <div className="space-y-4">
                            {Object.entries(formData.specs).map(([key, value]) => (
                                <div key={key}>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">{key}</label>
                                    <input 
                                        type="text" 
                                        value={value} 
                                        onChange={(e) => {
                                            setFormData(prev => ({...prev, specs: {...prev.specs, [key]: e.target.value}}));
                                        }}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all ${errors[key] ? 'border-red-500' : ''}`}
                                        placeholder={`Enter ${key.toLowerCase()}`}
                                        required
                                    />
                                    {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
              );
            case 'photos':
                return <PhotoGallery images={images} onUpload={handleImageUpload} onRemove={removeImage} error={errors.images} />;
            case 'details':
            default:
              return (
                <div className="bg-white p-8 rounded-xl shadow-md space-y-6">
                    <input type="text" name="name" value={formData.name} placeholder="Vehicle Name (auto-generated)" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-gray-100" readOnly />
                    <select name="brand" value={formData.brand} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required>
                        <option value="">Select Brand</option>
                        {availableBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                    <input type="text" name="model_name" value={formData.model_name} onChange={handleFormChange} placeholder="Model Name" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
                    <select name="category" value={formData.category} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required>
                        <option value="BIKE">Bike</option>
                        <option value="SCOOTER">Scooter</option>
                        <option value="EV">EV</option>
                    </select>
                    <input type="number" name="price" value={formData.price} onChange={handleFormChange} placeholder="Price (INR)" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
                    <select name="fuel_type" value={formData.fuel_type} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required>
                        <option value="">Select Fuel Type</option>
                        <option value="PETROL">Petrol</option>
                        <option value="ELECTRIC">Electric</option>
                        <option value="HYBRID">Hybrid</option>
                    </select>
                    <input type="number" name="year" value={formData.year} onChange={handleFormChange} placeholder="Year of Manufacture" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
                    <input type="number" name="km_driven" value={formData.km_driven} onChange={handleFormChange} placeholder="Kilometers Driven" className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required />
                    <select name="condition" value={formData.condition} onChange={handleFormChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" required>
                        <option value="">Select Condition</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
                    </select>
                </div>
              );
      }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">{id ? 'Edit Your Used Bike' : 'List Your Used Bike'}</h1>
      <p className="text-gray-500 mb-6">Fill in the details below to list your vehicle for sale.</p>
      
      <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
              <button onClick={() => setActiveTab('details')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Details</button>
              <button onClick={() => setActiveTab('specifications')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specifications' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Specifications</button>
              <button onClick={() => setActiveTab('photos')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'photos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Photos</button>
          </nav>
      </div>

      <form onSubmit={handleSubmit}>
        {renderTabContent()}
        <div className="mt-8 flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/account/vehicles')} className="px-6 py-3 rounded-lg text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors flex items-center space-x-2 font-medium">
            Cancel
          </button>
          <button type="submit" className="px-6 py-3 rounded-lg text-white bg-primary hover:bg-primary-dark transition-colors flex items-center space-x-2 font-medium">
            {id ? 'Save Changes' : 'List My Vehicle'}
          </button>
        </div>
        {errors.submit && <div className="mt-4 text-red-500 text-sm text-center">{errors.submit}</div>}
      </form>
    </div>
  );
};

export default UserEditVehiclePage;
