import { Link } from 'react-router-dom';
import { Gauge, Cog, Star, Shield, Calendar, Heart, Fuel, Zap } from 'lucide-react';
import { useState } from 'react';
import BookingModal from './BookingModal'; // Assuming BookingModal is in the same directory

const VehicleCard = ({ vehicle, onWishlistToggle, isWishlisted }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('');

  const placeholderImage = 'https://via.placeholder.com/400x300.png?text=No+Image';

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleBookNow = () => {
    setBookingType('INQUIRY');
    setIsBookingModalOpen(true);
  };

  const handleBookTestRide = () => {
    setBookingType('TEST_RIDE');
    setIsBookingModalOpen(true);
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

  const isElectric = vehicle.fuel_type === 'ELECTRIC';

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group border border-gray-200 flex flex-col">
        <div className="relative h-48 overflow-hidden">
          <Link to={`/vehicles/${vehicle.id}`} className="block">
            <img 
              src={vehicle.images?.[0]?.image || placeholderImage} 
              alt={vehicle.name}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            />
          </Link>
          
          <div 
            className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm rounded-full p-2 cursor-pointer transition-all duration-200 hover:bg-red-100 hover:scale-110"
            onClick={() => onWishlistToggle(vehicle.id)}
            title="Add to Wishlist"
          >
            <Heart className={`w-5 h-5 transition-all ${isWishlisted ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
          </div>

          <div className="absolute top-3 left-3 flex flex-col gap-2">
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${getTypeColor(vehicle.type)}`}>
                  {vehicle.type}
              </span>
              {vehicle.is_featured && (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
                      <Star className="w-3 h-3 mr-1" />
                      Featured
                  </span>
              )}
          </div>
        </div>

        <div className="p-5 flex-grow flex flex-col">
          <div className="flex-grow">
            <p className="text-sm text-gray-500 mb-1 capitalize">{vehicle.brand_detail?.name}</p>
            <h3 className="text-lg font-bold text-gray-900 truncate mb-3" title={vehicle.name}>{vehicle.name}</h3>
            
            <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 font-medium">{vehicle.category}</span>
              {vehicle.fuel_type && (
                <span className={`inline-flex items-center px-2 py-1 rounded-md font-medium ${isElectric ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                  {isElectric ? <Zap className="w-3 h-3 mr-1.5" /> : <Fuel className="w-3 h-3 mr-1.5" />}
                  {vehicle.fuel_type}
                </span>
              )}
            </div>

            {vehicle.type === 'USED' && (
              <div className="flex flex-wrap items-center gap-2 mb-3 text-xs text-gray-600">
                {vehicle.year && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100">
                    <Calendar className="w-3 h-3 mr-1.5" />
                    {vehicle.year}
                  </span>
                )}
                {vehicle.km_driven && (
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100">
                    <Gauge className="w-3 h-3 mr-1.5" />
                    {vehicle.km_driven.toLocaleString()} km
                  </span>
                )}
                {getConditionBadge(vehicle.condition)}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-center border-t border-b border-gray-100 py-3 mb-4">
              <div className="text-sm">
                <p className="text-gray-500 text-xs">{isElectric ? 'Range' : 'Mileage'}</p>
                <p className="font-semibold text-gray-800 mt-1">{isElectric ? vehicle.specs?.Range || '-' : vehicle.specs?.Mileage || '-'}</p>
              </div>
              <div className="text-sm">
                <p className="text-gray-500 text-xs">{isElectric ? 'Motor Power' : 'Engine'}</p>
                <p className="font-semibold text-gray-800 mt-1">{isElectric ? vehicle.specs?.['Motor Power'] : vehicle.specs?.Engine || '-'}</p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-extrabold text-gray-900">{formatPrice(vehicle.price)}</p>
                {vehicle.discount_value && (
                  <p className="text-sm text-green-600 font-semibold">
                    {vehicle.discount_type === 'PERCENTAGE' ? `${vehicle.discount_value}% off` : `Save ${formatPrice(vehicle.discount_value)}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <Link to={`/vehicles/${vehicle.id}`} className="w-full text-center bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 block">
              View Details
            </Link>
            {/* <button onClick={handleBookTestRide} className="w-full text-center bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors duration-300 block">
              Book Test Ride
            </button>
            <button onClick={handleBookNow} className="w-full text-center bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors duration-300 block">
              Buy Now
            </button> */}
          </div>
          
        </div>
      </div>
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        vehicle={vehicle} 
        bookingType={bookingType} 
      />
    </>
  );
}

export default VehicleCard;