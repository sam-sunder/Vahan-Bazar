import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Star, 
  Calendar, 
  Gauge, 
  MapPin, 
  Fuel, 
  Zap, 
  Shield,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Share2
} from 'lucide-react';

const DealerVehicleDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${id}/`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch vehicle details');
        }

        const data = await response.json();
        setVehicle(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE':
        return 'bg-green-100 text-green-800';
      case 'SOLD':
        return 'bg-red-100 text-red-800';
      case 'HOLD':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800';
      case 'USED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFuelIcon = (fuelType) => {
    switch (fuelType) {
      case 'ELECTRIC':
        return <Zap className="w-5 h-5" />;
      case 'PETROL':
        return <Fuel className="w-5 h-5" />;
      default:
        return <Fuel className="w-5 h-5" />;
    }
  };

  const handleEdit = () => {
    navigate(`/dealer/vehicles/edit/${id}`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        const response = await fetch(`/api/vehicles/${id}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        
        if (response.ok) {
          navigate('/dealer/vehicles');
        } else {
          throw new Error('Failed to delete vehicle');
        }
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/dealer/vehicles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Vehicle Not Found</h2>
          <p className="text-gray-600 mb-4">The vehicle you're looking for doesn't exist.</p>
          <Link
            to="/dealer/vehicles"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:!px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link
                to="/dealer/vehicles"
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{vehicle.name}</h1>
                <p className="text-sm text-gray-500">
                  {vehicle.brand?.name} • {vehicle.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Vehicle
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:!px-8 py-8">
        <div className="grid grid-cols-1 lg:!grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden">
              {vehicle.images && vehicle.images.length > 0 ? (
                <img
                  src={vehicle.images[selectedImageIndex]?.image}
                  alt={vehicle.name}
                  className="w-full h-full object-cover border border-gray-200 rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <Eye className="w-16 h-16" />
                </div>
              )}
            </div>
            
            {vehicle.images && vehicle.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {vehicle.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`aspect-square rounded-xl overflow-hidden ${
                      selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <img
                      src={image.image}
                      alt={`${vehicle.name} ${index + 1}`}
                      className="w-full h-full object-cover border border-gray-200 rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            {/* Status and Type Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getTypeColor(vehicle.type)}`}>
                {vehicle.type}
              </span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
              {vehicle.is_featured && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800">
                  <Star className="w-4 h-4 mr-1" />
                  Featured
                </span>
              )}
            </div>

            {/* Price */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {formatPrice(vehicle.price)}
              </h2>
              {vehicle.discount_value && (
                <p className="text-lg text-green-600 font-medium">
                  {vehicle.discount_type === 'percentage' 
                    ? `${vehicle.discount_value}% off`
                    : `${formatPrice(vehicle.discount_value)} off`
                  }
                </p>
              )}
            </div>

            {/* Used Vehicle Details */}
            {vehicle.type === 'USED' && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  {vehicle.year && (
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Year:</span>
                      <span className="ml-2 font-medium">{vehicle.year}</span>
                    </div>
                  )}
                  {vehicle.km_driven && (
                    <div className="flex items-center">
                      <Gauge className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Mileage:</span>
                      <span className="ml-2 font-medium">{vehicle.km_driven.toLocaleString()} km</span>
                    </div>
                  )}
                  {vehicle.condition && (
                    <div className="flex items-center col-span-2">
                      <Shield className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-600">Condition:</span>
                      <span className="ml-2 font-medium">{vehicle.condition}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Specifications */}
            {vehicle.specs && Object.keys(vehicle.specs).length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Specifications</h3>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(vehicle.specs).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className="font-medium text-gray-900">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  {getFuelIcon(vehicle.fuel_type)}
                  <span className="ml-2 text-gray-600">Fuel Type:</span>
                  <span className="ml-2 font-medium capitalize">{vehicle.fuel_type?.toLowerCase()}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <span className="ml-2 text-gray-600">Added:</span>
                  <span className="ml-2 font-medium">{new Date(vehicle.created_at).toLocaleDateString()}</span>
                </div>
                {vehicle.branch && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="ml-2 text-gray-600">Branch:</span>
                    <span className="ml-2 font-medium">{vehicle.branch.name}</span>
                  </div>
                )}
                {/* <div className="flex items-center">
                  <span className="text-gray-600">Stock:</span>
                  <span className="ml-2 font-medium">{vehicle.stock}</span>
                </div> */}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link
                to={`/vehicles/${vehicle.id}`}
                className="flex-1 bg-blue-600 text-white text-center py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Eye className="w-5 h-5 mr-2" />
                View Public Listing
              </Link>
              <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerVehicleDetailPage;
