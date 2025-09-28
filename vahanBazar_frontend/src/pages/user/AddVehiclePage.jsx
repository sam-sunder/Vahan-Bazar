import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, Upload, X, ChevronLeft, ChevronRight, Trash2, CheckCircle } from 'lucide-react';
import axios from 'axios';
 
const API_BASE_URL = 'http://localhost:8000/api';

// API functions
const fetchBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/brands/`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response.data;
};

const fetchModels = async (brandId) => {
  const response = await axios.get(`${API_BASE_URL}/models/?brand=${brandId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response.data;
};

const fetchBranches = async () => {
  const response = await axios.get(`${API_BASE_URL}/dealer/branches`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response.data;
}

const fetchVariants = async (modelId) => {
  const response = await axios.get(`${API_BASE_URL}/variants/?model=${modelId}`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response.data;
};

const createVehicle = async (vehicleData) => {
  const response = await axios.post(`${API_BASE_URL}/vehicles/`, vehicleData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await axios.post(`${API_BASE_URL}/upload-image/`, formData, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
    }
  });
  return response.data.url;
};



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

const defaultFeatures = {
            "BIKE": ["Analog Speedometer", "Halogen Headlamp", "Electric Start"],
            "SCOOTER": ["Under-seat Storage", "Automatic Start/Stop", "USB Charging Port"],
            "EV": ["Regenerative Braking", "Digital Speedometer", "Mobile App Connectivity"],
        }

const requiredSpecFields = {
    "BIKE": ["engine", "fuel_type", "transmission", "brakes", "mileage"],
    "SCOOTER": ["engine", "fuel_type", "transmission", "brakes", "mileage"],
    "EV": ["motor_power", "battery", "range", "charging_time", "top_speed"],
}

const Breadcrumb = () => (
    <nav className="mb-8 text-sm font-medium text-gray-500" aria-label="Breadcrumb">
        <ol className="list-none p-0 inline-flex">
            <li className="flex items-center"><Link to="/dealer/dashboard" className="hover:text-blue-600">Customer</Link><ChevronRight size={16} className="mx-2" /></li>
            <li className="flex items-center"><Link to="/dealer/vehicles" className="hover:text-blue-600">Vehicles</Link><ChevronRight size={16} className="mx-2" /></li>
            <li className="text-gray-700 font-semibold">Add New Vehicle</li>
        </ol>
    </nav>
);

const FormField = ({ label, children, required }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {children}
    </div>
);

const PhotoGallery = ({ images, onUpload, onRemove, errors }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (images.length > 0 && selectedIndex >= images.length) {
            setSelectedIndex(images.length - 1);
        }
    }, [images, selectedIndex]);

    const handlePrev = () => setSelectedIndex(i => (i - 1 + images.length) % images.length);
    const handleNext = () => setSelectedIndex(i => (i + 1) % images.length);

    return (
        <div className="bg-white p-8 rounded-xl shadow-md sticky top-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Photos & Media</h2>
            <div className="space-y-4">
                {errors.images && <div className="text-red-500 text-sm mb-2">{errors.images}</div>}
                <div className="relative aspect-video bg-gray-100 rounded-lg">
                    {images.length > 0 ? (
                        <img src={images[selectedIndex]?.url} alt="Main vehicle view" className="w-full h-full object-contain rounded-lg" />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Upload size={40}/>
                            <span className="mt-2">Upload images</span>
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

const AddCustomerVehiclePage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [availableBrands, setAvailableBrands] = useState([]);

    // Unified vehicle name computation function
  const computeVehicleName = (data = formData) => {
    const parts = [];
    
    // Add brand name
    if (data.brand === 'add-new') {
      const brandName = (data.newBrandName || '').trim();
      if (brandName) parts.push(brandName);
    } else if (data.brand) {
      const brand = availableBrands.find(b => b.id == data.brand);
      if (brand) parts.push(brand.name);
    }
    
    // Add model name
    if (data.model === 'add-new') {
      const modelName = (data.newModelName || '').trim();
      if (modelName) parts.push(modelName);
    } else if (data.model) {
      const model = availableModels.find(m => m.id == data.model);
      if (model) parts.push(model.name);
    }
    
    // Add variant name
    if (data.variant === 'add-new') {
      const variantName = (data.newVariantName || '').trim();
      if (variantName) parts.push(variantName);
    } else if (data.variant) {
      const variant = availableVariants.find(v => v.id == data.variant);
      if (variant) parts.push(variant.name);
    }
    
    if (parts.length === 0) return '';
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return `${parts[0]} ${parts[1]}`;
    return `${parts[0]} ${parts[1]} | ${parts[2]}`;
  };


  const [availableBranches, setAvailableBranches] = useState([]);

  const validateTab = (tabName) => {
    const newErrors = {};
    
    if (tabName === 'details') {
      if (!formData.brand) newErrors.brand = 'Brand is required';
      if (formData.brand === 'add-new' && !newBrandName) newErrors.newBrandName = 'Brand name is required';
      if (!formData.model) newErrors.model = 'Model is required';
      if (formData.model === 'add-new' && !newModelName) newErrors.newModelName = 'Model name is required';
    //   if (!formData.variant) newErrors.variant = 'Variant is required';
      if (formData.variant === 'add-new' && !newVariantName) newErrors.newVariantName = 'Variant name is required';
      if (!formData.price) newErrors.price = 'Price is required';
      if (!formData.fuel_type) newErrors.fuel_type = 'Fuel type is required';
      if (!formData.type) newErrors.type = 'Vehicle type is required';
      
      // Used vehicle specific validation
      if (formData.type === 'USED') {
        if (!formData.year) newErrors.year = 'Year is required for used vehicles';
        if (!formData.km_driven) newErrors.km_driven = 'Kilometers driven is required for used vehicles';
        if (!formData.condition) newErrors.condition = 'Condition is required for used vehicles';
      }
      
      // Extra validation for interdependent fields
      if (formData.brand && formData.brand !== 'add-new') {
        if (!formData.model) newErrors.model = 'Model is required for selected brand';
        // if (formData.model && formData.model !== 'add-new' && !formData.variant) {
        //   newErrors.variant = 'Variant is required for selected model';
        // }
      }
    } else if (tabName === 'specifications') {
      // Get the spec fields that should be required based on the vehicle type
      // if (categorization.type) {
      //   const requiredFields = requiredSpecFields[categorization.type] || [];
      //   requiredFields.forEach(field => {
      //     // Convert the field name to match the display name format
      //     const displayField = field.replace(/_/g, ' ').replace(/\\b\\w/g, l => l.toUpperCase());
      //     if (!customSpecs[field] && !displayedSpecs[displayField] && !inheritedSpecs[displayField]) {
      //       newErrors[field] = `${displayField} is required`;
      //     }
      //   });
      // }
      if (categorization.type) {
        const vehicleSpecs = defaultSpecs[categorization.type] || {};
        Object.entries(vehicleSpecs).forEach(([key, defaultValue]) => {
          const value = customSpecs[key] || inheritedSpecs[key] || defaultValue;
          if (!value || value.trim() === '') {
            newErrors[`spec_${key}`] = `${key} is required`;
          }
        });
        }
    } else if (tabName === 'categorization') {
      if (!formData.status) newErrors.status = 'Status is required';
      if (!formData.branch) newErrors.branch = 'Branch is required';
    }

    return newErrors;
  };

  const handleTabChange = (newTab) => {
    const currentTabErrors = validateTab(activeTab);
    console.log(currentTabErrors);
    if (activeTab == "details" && newTab == "specifications" || activeTab == "specifications" && newTab == "categorization") {
      if (Object.keys(currentTabErrors).length > 0) {
        setErrors(currentTabErrors);
        return;
      } 
      setErrors({});
      setActiveTab(newTab);
    }
    setActiveTab(newTab);

    // const nextTabErrors = validateTab(newTab);
    // setErrors(nextTabErrors);
    // if (Object.keys(nextTabErrors).length === 0) {
    //   setActiveTab(newTab);
    // }
  };

  const validateFields = () => {
    // First check if minimum images are uploaded
    if (images.length < 3) {
      setErrors({ images: 'At least 3 images are required' });
      return false;
    }

    const detailsErrors = validateTab('details', true);
    if (Object.keys(detailsErrors).length > 0) {
      setErrors(detailsErrors);
      setActiveTab('details');
      return false;
    }

    const specsErrors = validateTab('specifications', true);
    if (Object.keys(specsErrors).length > 0) {
      setErrors(specsErrors);
      setActiveTab('specifications');
      return false;
    }

    const settingsErrors = validateTab('categorization', true);
    if (Object.keys(settingsErrors).length > 0) {
      setErrors(settingsErrors);
      setActiveTab('categorization');
      return false;
    }

    return true;
  };
  const [formData, setFormData] = useState({ 
    name: '',
    brand: '', 
    model: '', 
    variant: '', 
    price: '',
    fuel_type: '',
    status: 'AVAILABLE', 
    branch: '', 
    featured: false,
    discountType: '',
    discountValue: '',
    discountDescription: '',
    type: '',
    // Used vehicle fields
    year: '',
    km_driven: '',
    condition: '',
    exchange_offer: false,
    loan_option: false,
    approved: false,
  });
  const [newBrandName, setNewBrandName] = useState('');
  const [newModelName, setNewModelName] = useState('');
  const [newVariantName, setNewVariantName] = useState('');
  const [availableModels, setAvailableModels] = useState([]);
  const [availableVariants, setAvailableVariants] = useState([]);
  const [baseSpecs, setBaseSpecs] = useState({});
  const [variantSpecs, setVariantSpecs] = useState({});
  const [inheritedSpecs, setInheritedSpecs] = useState({});
  const [customSpecs, setCustomSpecs] = useState({});
  const [newSpec, setNewSpec] = useState({ key: '', value: '' });
  const [images, setImages] = useState([]);
  const [categorization, setCategorization] = useState({ type: '', category: '', features: [] });

  const inputStyle = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md";
  const selectStyle = "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out shadow-sm hover:shadow-md relative";



  const handleFormChange = (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === 'checkbox' ? checked : value;
      
      // Build new form data
      const newFormData = { ...formData, [name]: newValue };
      
      // Reset dependent fields when parent field changes
      if (name === 'brand') {
          if (value === 'add-new') {
              newFormData.model = '';
              newFormData.variant = '';
              setAvailableModels([]);
              setAvailableVariants([]);
          } else {
              setNewBrandName('');
          }
          setNewModelName('');
          setNewVariantName('');
      } else if (name === 'model') {
          if (value === 'add-new') {
              newFormData.variant = '';
              setAvailableVariants([]);
          } else {
              setNewModelName('');
          }
          setNewVariantName('');
      } else if (name === 'variant' && value !== 'add-new') {
          setNewVariantName('');
      }
      
      // Make sure we include newBrandName/newModelName/newVariantName in computation
      newFormData.name = computeVehicleName({
        ...newFormData,
        newBrandName,
        newModelName,
        newVariantName
      });
      setFormData(newFormData);

      // Clear related error when field changes
      setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          if (name === 'brand') {
              delete newErrors.newBrandName;
              delete newErrors.model;
              delete newErrors.variant;
          } else if (name === 'model') {
              delete newErrors.newModelName;
              delete newErrors.variant;
          } else if (name === 'variant') {
              delete newErrors.newVariantName;
          }
          return newErrors;
      });
  }

  // Fetch initial data
  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brands = await fetchBrands();
        setAvailableBrands(brands);
      } catch (error) {
        console.error('Error fetching brands:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBrands();
  }, []);

  useEffect(() => {
    const loadBranches = async () => {
      try {
        const branches = await fetchBranches();
        setAvailableBranches(branches);
      } catch (error) {
        console.error('Error fetching branches:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBranches();
  }, []);

  useEffect(() => {
    const loadModels = async () => {
      if (formData.brand && formData.brand !== 'add-new') {
        try {
          const models = await fetchModels(formData.brand);
          setAvailableModels(models);
          // Update baseSpecs from the models
          const specsMap = {};
          models.forEach(model => {
            if (model.base_specs) {
              specsMap[model.id] = model.base_specs;
            }
          });
          setBaseSpecs(specsMap);
        } catch (error) {
          console.error('Error fetching models:', error);
          setAvailableModels([]);
          setBaseSpecs({});
        }
      } else {
        setAvailableModels([]);
        setBaseSpecs({});
      }
      setFormData(f => ({ ...f, model: '' }));
    };
    loadModels();
  }, [formData.brand]);

  useEffect(() => {
    const loadVariants = async () => {
      if (formData.model && formData.model !== 'add-new') {
        try {
          const variants = await fetchVariants(formData.model);
          setAvailableVariants(variants);
          // Update variantSpecs from the variants
          const specsMap = {};
          variants.forEach(variant => {
            if (variant.specs) {
              specsMap[variant.id] = variant.specs;
            }
          });
          setVariantSpecs(specsMap);
          if (variants.length > 0) {
            setInheritedSpecs(variants[0].vehicle_model.base_specs || {});
          }
        } catch (error) {
          console.error('Error fetching variants:', error);
          setAvailableVariants([]);
          setVariantSpecs({});
          setInheritedSpecs({});
        }
      } else if (formData.model === 'add-new') {
        setAvailableVariants([]);
        setInheritedSpecs(defaultSpecs[categorization.type] || {});
      } else {
        setAvailableVariants([]);
        setInheritedSpecs({});
      }
      setFormData(f => ({ ...f, variant: '' }));
      setNewVariantName('');
    };
    loadVariants();
  }, [formData.model, categorization.type]);
    

//   useEffect(() => {
//     if (formData.variant === 'add-new') {
//       // For new variant, use default specs based on vehicle type
//       setInheritedSpecs(defaultSpecs[categorization.type] || {});
//     } else if (formData.variant) {
//       setNewVariantName('');
//       const newInherited = { ...(baseSpecs[formData.model] || {}), ...(variantSpecs[formData.variant] || {}) };
//       setInheritedSpecs(newInherited);
//     } else {
//       setInheritedSpecs(baseSpecs[formData.model] || {});
//     }
//   }, [formData.variant, formData.model, categorization.type, baseSpecs, variantSpecs]);

  useEffect(() => {
    if (categorization.type) {
        console.log(categorization.type)
        setCategorization(c => ({ ...c, features: defaultFeatures[c.type] || [] }));
        setInheritedSpecs(defaultSpecs[categorization.type] || {});
    } else {
        setCategorization(c => ({ ...c, features: [] }));
        setInheritedSpecs({});
    }
}, [categorization.type]);


  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => ({ url: URL.createObjectURL(file), name: file.name, file }));
    setImages(prev => [...prev, ...newImages].slice(0, 8)); // Limit to 8 images
  };

  const removeImage = (index) => setImages(prev => prev.filter((_, i) => i !== index));

  const handleAddSpec = () => {
    if (!newSpec.key || !newSpec.value) return;
    setCustomSpecs(prev => ({ ...prev, [newSpec.key]: newSpec.value }));
    setNewSpec({ key: '', value: '' });
  };

  const handleRemoveSpec = (key) => {
      const newSpecs = {...customSpecs};
      delete newSpecs[key];
      setCustomSpecs(newSpecs);
  }
  
  const displayedSpecs = {...inheritedSpecs, ...customSpecs};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      // Validate minimum images requirement
      if (images.length < 3) {
        setErrors(prev => ({ ...prev, images: 'At least 3 images are required' }));
        return;
      }

      // Upload images first
      // const uploadedUrls = await Promise.all(
      //   images.map(image => uploadImage(image.file))
      // );

      // Create vehicle with all the collected data
      const vehicleData = {
        name: formData.name,
        category: categorization.type,
        type: formData.type,
        brand: formData.brand === 'add-new' ? { name: newBrandName } : formData.brand,
        model_name: formData.model === 'add-new' ? newModelName : '',
        variant: formData.variant === 'add-new' ? {
          name: newVariantName,
        } : formData.variant,
        price: parseFloat(formData.price),
        fuel_type: formData.fuel_type,
        status: formData.status,
        branch: formData.type === 'NEW' ? formData.branch : null,
        is_featured: formData.featured,
        specs: { ...inheritedSpecs, ...customSpecs },
        discount_type: formData.discountType || null,
        discount_value: formData.discountValue ? parseFloat(formData.discountValue) : null,
        discount_description: formData.discountDescription || null,
        // Used vehicle specific fields
        year: formData.type === 'USED' ? parseInt(formData.year) : null,
        km_driven: formData.type === 'USED' ? parseInt(formData.km_driven) : null,
        condition: formData.type === 'USED' ? formData.condition : null,
        exchange_offer: formData.type === 'USED' ? formData.exchange_offer : false,
        loan_option: formData.type === 'USED' ? formData.loan_option : false,
        approved: formData.type === 'USED' ? formData.approved : false,
      };
      const finalFormData = new FormData();
      finalFormData.append('data', JSON.stringify(vehicleData));
      images.forEach((image, index) => {
        finalFormData.append('images', image.file);
      });
      await createVehicle(finalFormData);
      navigate('/dealer/vehicles');
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({ ...prev, submit: 'Failed to submit. Please try again.' }));
    }
  };

  const renderTabContent = () => {
      switch(activeTab) {
          case 'specifications':
              return (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Specification</h2>
                        <p className="text-sm text-gray-500 mb-6">Inherited features are based on the selected model/variant. You can add custom specs or override inherited ones.</p>
                        <div className="space-y-4">
                            {Object.entries(displayedSpecs).map(([key, value]) => (
                                <div key={key} className="flex flex-col gap-2">
                                    <div className="flex items-center bg-gray-50 p-3 rounded-lg gap-4">
                                        <span className="font-semibold text-gray-700 w-1/4">{key}</span>
                                        <input 
                                            type="text" 
                                            value={customSpecs[key] || value} 
                                            onChange={(e) => {
                                                setCustomSpecs(prev => ({ ...prev, [key]: e.target.value }));
                                                if (errors[`spec_${key}`]) {
                                                    setErrors(prev => {
                                                        const newErrors = { ...prev };
                                                        delete newErrors[`spec_${key}`];
                                                        return newErrors;
                                                    });
                                                }
                                            }}
                                            className={`text-gray-800 flex-1 px-3 py-1 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors[`spec_${key}`] ? 'border-red-500' : ''}`}
                                            placeholder={`Enter ${key.toLowerCase()}`}
                                        />
                                        {Object.prototype.hasOwnProperty.call(customSpecs, key) && (
                                            <button 
                                                onClick={() => handleRemoveSpec(key)} 
                                                className="text-red-500 hover:text-red-700 flex-shrink-0"
                                                title="Reset to default"
                                            >
                                                <Trash2 size={16}/>
                                            </button>
                                        )}
                                    </div>
                                    {errors[`spec_${key}`] && (
                                        <div className="text-red-500 text-sm mt-1">{errors[`spec_${key}`]}</div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t">
                            <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Specification</h3>
                            <div className="flex items-center gap-4">
                                <input type="text" placeholder="Feature (e.g., ABS)" value={newSpec.key} onChange={e => setNewSpec({...newSpec, key: e.target.value})} className={inputStyle} />
                                <input type="text" placeholder="Value (e.g., Dual Channel)" value={newSpec.value} onChange={e => setNewSpec({...newSpec, value: e.target.value})} className={inputStyle} />
                                <button onClick={handleAddSpec} className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex-shrink-0">
                                    <PlusCircle size={20}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
              );
          case 'categorization':
              return (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Settings & Features</h2>
                    
                    {/* Listing Settings */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Listing Settings</h3>
                        <div className="grid grid-cols-1 md:!grid-cols-2 gap-x-6 gap-y-8">
                            <FormField label="Status" required>
                                <div className="relative">
                                    <select 
                                        name="status" 
                                        value={formData.status} 
                                        onChange={handleFormChange} 
                                        className={`${selectStyle} ${errors.status ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    >
                                        <option value="AVAILABLE">Available</option>
                                        <option value="SOLD">Sold</option>
                                        <option value="HOLD">On Hold</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </FormField>
                            <FormField label="Branch" required>
                                <div className="relative">
                                    <select 
                                        name="branch" 
                                        value={formData.branch} 
                                        onChange={handleFormChange} 
                                        className={`${selectStyle} ${errors.branch ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    >
                                        <option value="">Select Branch</option>
                                        {availableBranches.map(branch => 
                                            <option key={branch.id} value={branch.id}>{branch.name} - {branch.city}</option>
                                        )}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </FormField>
                            <div className="flex items-center col-span-2">
                                <div className="flex items-center h-5">
                                    <input 
                                        id="is-featured" 
                                        name="featured" 
                                        type="checkbox" 
                                        checked={formData.featured} 
                                        onChange={handleFormChange}
                                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                                    />
                                </div>
                                <label htmlFor="is-featured" className="ml-3 text-sm font-medium text-gray-700">
                                    Mark as Featured Listing
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Discount Options */}
                    <div className="mt-8 border-t pt-8">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">Discount Options</h3>
                        <div className="grid grid-cols-1 md:!grid-cols-2 gap-x-6 gap-y-8">
                            <FormField label="Discount Type">
                                <div className="relative">
                                    <select 
                                        name="discountType" 
                                        value={formData.discountType || ''} 
                                        onChange={handleFormChange} 
                                        className={selectStyle}
                                    >
                                        <option value="">No Discount</option>
                                        <option value="percentage">Percentage Off</option>
                                        <option value="fixed">Fixed Amount Off</option>
                                        <option value="cashback">Cashback</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                        </svg>
                                    </div>
                                </div>
                            </FormField>
                            {formData.discountType && (
                                <FormField label={formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}>
                                    <div className="relative">
                                        <input 
                                            name="discountValue" 
                                            type="number" 
                                            value={formData.discountValue || ''} 
                                            onChange={handleFormChange} 
                                            placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 5000'} 
                                            className={inputStyle}
                                            min="0"
                                            max={formData.discountType === 'percentage' ? '100' : undefined}
                                            step={formData.discountType === 'percentage' ? '1' : '100'}
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-gray-500">{formData.discountType === 'percentage' ? '%' : '₹'}</span>
                                        </div>
                                    </div>
                                </FormField>
                            )}
                            {formData.discountType && (
                                <div className="col-span-2">
                                    <FormField label="Discount Description">
                                        <input 
                                            name="discountDescription" 
                                            type="text" 
                                            value={formData.discountDescription || ''} 
                                            onChange={handleFormChange} 
                                            placeholder="e.g., Limited time offer - Valid till stocks last" 
                                            className={inputStyle}
                                        />
                                    </FormField>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
              );
          case 'details':
          default:
              return (
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">Vehicle Details</h2>
                    <div className="grid grid-cols-1 md:!grid-cols-2 gap-x-6 gap-y-8">
                        <FormField label="Vehicle Name" required>
                            <input 
                                type="text" 
                                value={formData.name} 
                                className={`${inputStyle} bg-gray-50`}
                                placeholder="Vehicle name will be generated automatically"
                                disabled
                                name="name"
                            />
                        </FormField>
                        <FormField label="Vehicle Type" required>
                            <div className="relative">
                                <select 
                                    name="type" 
                                    value={categorization.type} 
                                    onChange={e => {
                                        setCategorization(c => ({
                                            ...c,
                                            type: e.target.value,
                                        }));
                                    }} 
                                    className={selectStyle}
                                >
                                    <option value="">Select Type</option>
                                    <option value="BIKE">Bike</option>
                                    <option value="SCOOTER">Scooter</option>
                                    <option value="EV">EV</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.type && <div className="text-red-500 text-sm mt-1">{errors.type}</div>}
                            </div>
                        </FormField>
                        <FormField label="Listing Type" required>
                            <div className="relative">
                                <select 
                                    name="type" 
                                    value={formData.type} 
                                    onChange={handleFormChange} 
                                    className={selectStyle}
                                >
                                    <option value="">Select Category</option>
                                    <option value="NEW">New Vehicle</option>
                                    <option value="USED">Used Vehicle</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.category && <div className="text-red-500 text-sm mt-1">{errors.category}</div>}
                            </div>
                        </FormField>
                        <FormField label="Brand" required>
                            <div className="relative">
                                <select 
                                    name="brand" 
                                    value={formData.brand} 
                                    onChange={handleFormChange}
                                    className={`${selectStyle} ${errors.brand ? 'border-red-500 focus:ring-red-500' : ''}`}
                                >
                                    <option value="">Select Brand</option>
                                    {availableBrands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                    <option value="add-new">+ Add New Brand</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.brand && <div className="text-red-500 text-sm mt-1">{errors.brand}</div>}
                            </div>
                        </FormField>
                        {formData.brand === 'add-new' && (
                            <FormField label="New Brand Name" required>
                                <input 
                                    type="text" 
                                    value={newBrandName || ''}
                                    onChange={e => {
                                        const value = e.target.value;
                                        setNewBrandName(value);
                                        setFormData(prev => ({
                                            ...prev,
                                            name: computeVehicleName({ 
                                                ...prev, 
                                                brand: 'add-new',
                                                newBrandName: value,
                                                newModelName,
                                                newVariantName
                                            })
                                        }));
                                    }} 
                                    className={`${inputStyle} ${errors.newBrandName ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Enter brand name"
                                />
                                {errors.newBrandName && <div className="text-red-500 text-sm mt-1">{errors.newBrandName}</div>}
                            </FormField>
                        )}
                        <FormField label="Model" required>
                            <div className="relative">
                                <select 
                                    name="model" 
                                    value={formData.model} 
                                    onChange={handleFormChange} 
                                    className={`${selectStyle} ${errors.model ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={!formData.brand || formData.brand === 'add-new'}
                                >
                                    <option value="">Select Model</option>
                                    {availableModels.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                    <option value="add-new">+ Add New Model</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.model && <div className="text-red-500 text-sm mt-1">{errors.model}</div>}
                            </div>
                        </FormField>
                        {formData.model === 'add-new' && (
                            <FormField label="New Model Name" required>
                                <input 
                                    type="text" 
                                    value={newModelName} 
                                    onChange={e => {
                                        const value = e.target.value;
                                        setNewModelName(value);
                                        setFormData(prev => ({
                                            ...prev,
                                            name: computeVehicleName({ 
                                                ...prev, 
                                                model: 'add-new',
                                                newBrandName,
                                                newModelName: value,
                                                newVariantName
                                            })
                                        }));
                                    }} 
                                    className={`${inputStyle} ${errors.newModelName ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    placeholder="Enter model name"
                                />
                                {errors.newModelName && <div className="text-red-500 text-sm mt-1">{errors.newModelName}</div>}
                            </FormField>
                        )}
                        <FormField label="Variant" >
                            <div className="relative">
                                <select 
                                    name="variant" 
                                    value={formData.variant} 
                                    onChange={handleFormChange} 
                                    className={`${selectStyle} ${errors.variant ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    disabled={!formData.model}
                                >
                                    <option value="">Select Variant</option>
                                    {formData.model === 'add-new' ? [] : availableVariants.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                    <option value="add-new">+ Add New Variant</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.variant && <div className="text-red-500 text-sm mt-1">{errors.variant}</div>}
                            </div>
                        </FormField>
                        {formData.variant === 'add-new' && (
                            <FormField label="New Variant Name" required>
                                <input 
                                    type="text" 
                                    value={newVariantName} 
                                    onChange={e => {
                                        const value = e.target.value;
                                        setNewVariantName(value);
                                        setFormData(prev => ({
                                            ...prev,
                                            name: computeVehicleName({ 
                                                ...prev, 
                                                variant: 'add-new',
                                                newBrandName,
                                                newModelName,
                                                newVariantName: value
                                            })
                                        }));
                                    }} 
                                    className={inputStyle} 
                                    placeholder="Enter name for new variant"
                                />
                            </FormField>
                        )}
                        <FormField label="Price (INR)" required>
                            <div className="relative">
                                <input 
                                    name="price" 
                                    type="number" 
                                    value={formData.price} 
                                    onChange={handleFormChange} 
                                    placeholder="e.g., 85000" 
                                    className={`${inputStyle} ${errors.price ? 'border-red-500 focus:ring-red-500' : ''}`}
                                    min="0"
                                    step="1000"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500">₹</span>
                                </div>
                                {errors.price && <div className="text-red-500 text-sm mt-1">{errors.price}</div>}
                            </div>
                        </FormField>
                        <FormField label="Fuel Type" required>
                            <div className="relative">
                                <select
                                    name="fuel_type" 
                                    value={formData.fuel_type} 
                                    onChange={handleFormChange} 
                                    className={`${selectStyle} ${errors.fuel_type ? 'border-red-500 focus:ring-red-500' : ''}`}
                                >
                                    <option value="">Select Fuel Type</option>
                                    <option value="PETROL">Petrol</option>
                                    <option value="ELECTRIC">Electric</option>
                                    <option value="HYBRID">Hybrid</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                    </svg>
                                </div>
                                {errors.fuel_type && <div className="text-red-500 text-sm mt-1">{errors.fuel_type}</div>}
                            </div>
                        </FormField>
                        {/* Used Vehicle Specific Fields */}
                        {formData.type === 'USED' && (
                            <>
                                <FormField label="Year" required>
                                    <input 
                                        name="year" 
                                        type="number" 
                                        value={formData.year} 
                                        onChange={handleFormChange} 
                                        placeholder="e.g., 2020" 
                                        className={inputStyle}
                                        min="1990"
                                        max={new Date().getFullYear()}
                                    />
                                </FormField>
                                <FormField label="Kilometers Driven" required>
                                    <input 
                                        name="km_driven" 
                                        type="number" 
                                        value={formData.km_driven} 
                                        onChange={handleFormChange} 
                                        placeholder="e.g., 15000" 
                                        className={inputStyle}
                                        min="0"
                                    />
                                </FormField>
                                <FormField label="Condition" required>
                                    <div className="relative">
                                        <select 
                                            name="condition" 
                                            value={formData.condition} 
                                            onChange={handleFormChange} 
                                            className={selectStyle}
                                        >
                                            <option value="">Select Condition</option>
                                            <option value="Excellent">Excellent</option>
                                            <option value="Good">Good</option>
                                            <option value="Fair">Fair</option>
                                            <option value="Poor">Poor</option>
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                                            </svg>
                                        </div>
                                    </div>
                                </FormField>
                                {/* <div className="col-span-2 grid grid-cols-2 gap-4">
                                    <div className="flex items-center">
                                        <input 
                                            id="exchange_offer" 
                                            name="exchange_offer" 
                                            type="checkbox" 
                                            checked={formData.exchange_offer} 
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                                        />
                                        <label htmlFor="exchange_offer" className="ml-3 text-sm font-medium text-gray-700">
                                            Exchange Offer Available
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input 
                                            id="loan_option" 
                                            name="loan_option" 
                                            type="checkbox" 
                                            checked={formData.loan_option} 
                                            onChange={handleFormChange}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                                        />
                                        <label htmlFor="loan_option" className="ml-3 text-sm font-medium text-gray-700">
                                            Loan Option Available
                                        </label>
                                    </div>
                                </div> */}
                            </>
                        )}

                    </div>
                </div>
              );
      }
  }

  return (
    <div className="space-y-8 mb-8">
        <Breadcrumb />
        <div className="flex justify-between items-start">
            <h1 className="text-4xl font-bold text-gray-800">Add New Vehicle</h1>
            <div className="flex space-x-4 flex-shrink-0">
                 <button 
                    type="button" 
                    className="px-6 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                    Cancel
                </button>
                <button 
                    type="submit"
                    onClick={handleSubmit} 
                    className="px-6 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                    Save Vehicle
                </button>
            </div>
        </div>

        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                <button onClick={() => handleTabChange('details')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Details</button>
                <button onClick={() => handleTabChange('specifications')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'specifications' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Specifications</button>
                <button onClick={() => handleTabChange('categorization')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'categorization' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Settings</button>
            </nav>
        </div>

        <div className="grid grid-cols-1 lg:!grid-cols-3 gap-8 items-start">
            <div className="lg:!col-span-2 space-y-8">
                {renderTabContent()}
            </div>
            <div className="lg:!col-span-1">
                <PhotoGallery images={images} onUpload={handleImageUpload} onRemove={removeImage} errors={errors} />
            </div>
        </div>
    </div>
  );
};

export default AddCustomerVehiclePage;
