import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Gauge, 
  MapPin, 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  Fuel,
  Zap,
  Shield,
  CheckCircle,
  Clock,
  MoreVertical
} from 'lucide-react';

const DealerVehicleCard = ({ vehicle, onEdit, onDelete, onView }) => {
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
        return <Zap className="w-4 h-4" />;
      case 'PETROL':
        return <Fuel className="w-4 h-4" />;
      default:
        return <Fuel className="w-4 h-4" />;
    }
  };

  const getConditionBadge = (condition) => {
    if (!condition) return null;
    
    const conditionColors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Fair': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${conditionColors[condition] || 'bg-gray-100 text-gray-800'}`}>
        <Shield className="w-3 h-3 mr-1" />
        {condition}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-gray-200">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.images?.[0]?.image || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={vehicle.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Overlay Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold w-fit ${getTypeColor(vehicle.type)}`}>
            {vehicle.type}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold w-fit ${getStatusColor(vehicle.status)}`}>
            {vehicle.status}
          </span>
          {vehicle.is_featured && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              <Star className="w-3 h-3 mr-1" />
              Featured
            </span>
          )}
        </div>

        {/* Action Menu */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg p-1 shadow-lg">
            <button
              onClick={() => onView?.(vehicle)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => onEdit?.(vehicle)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Edit Vehicle"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => onDelete?.(vehicle)}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
              title="Delete Vehicle"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        {/* Title and Brand */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 mb-1">
            {vehicle.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center">
            <span className="font-medium">{vehicle.brand_detail.name || 'Brand Not Available'}</span>
            {vehicle.category && (
              <>
                <span className="mx-2 text-gray-300">•</span>
                <span className="capitalize">{vehicle.category.toLowerCase()}</span>
              </>
            )}
          </p>
        </div>

        {/* Used Vehicle Specific Info */}
        {vehicle.type === 'USED' && (
          <div className="mb-3 flex flex-wrap gap-2">
            {vehicle.year && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                <Calendar className="w-3 h-3 mr-1" />
                {vehicle.year}
              </span>
            )}
            {vehicle.km_driven && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                <Gauge className="w-3 h-3 mr-1" />
                {vehicle.km_driven.toLocaleString()} km
              </span>
            )}
            {getConditionBadge(vehicle.condition)}
          </div>
        )}

        {/* Fuel Type */}
        {vehicle.fuel_type && (
          <div className="mb-3 flex items-center text-sm text-gray-600">
            {getFuelIcon(vehicle.fuel_type)}
            <span className="ml-2 capitalize">{vehicle.fuel_type.toLowerCase()}</span>
          </div>
        )}

        {/* Price Section */}
        <div className="mb-4">
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(vehicle.price)}
              </p>
              {vehicle.discount_value && (
                <p className="text-sm text-green-600 font-medium">
                  {vehicle.discount_type === 'percentage' 
                    ? `${vehicle.discount_value}% off`
                    : `${formatPrice(vehicle.discount_value)} off`
                  }
                </p>
              )}
            </div>
            {vehicle.stock !== undefined && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Stock</p>
                <p className="text-lg font-semibold text-gray-900">{vehicle.stock}</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/dealer/vehicles/${vehicle.id}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View
          </Link>
          <button
            onClick={() => onEdit?.(vehicle)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center"
          >
            <Edit3 className="w-4 h-4 mr-2" />
            Edit
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>Added {new Date(vehicle.created_at).toLocaleDateString()}</span>
            </div>
            {vehicle.branch && (
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate max-w-20">{vehicle.branch.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DealerVehicleCard;