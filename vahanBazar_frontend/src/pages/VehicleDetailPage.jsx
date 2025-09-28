import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import EMICalculator from '../components/EMICalculator';
import QualityBadge from '../components/QualityBadge';
import BenefitCard from '../components/BenefitCard';
import VehicleCard from '../components/VehicleCard';
import BookingModal from '../components/BookingModal';

const API_BASE_URL = 'http://localhost:8000/api';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [showEMICalculator, setShowEMICalculator] = useState(false);
  const [activeSpecTab, setActiveSpecTab] = useState('Engine & Transmission');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistItemId, setWishlistItemId] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingType, setBookingType] = useState('');

  useEffect(() => {
    const fetchVehicleAndWishlist = async () => {
      setLoading(true);
      try {
        const [vehicleResponse, wishlistResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/vehicles/${id}/`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          }),
          axios.get(`${API_BASE_URL}/wishlist/`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
          })
        ]);
        
        setVehicle(vehicleResponse.data);
        const wishlistItem = wishlistResponse.data.find(item => item.vehicle.id == id);
        if (wishlistItem) {
          setIsWishlisted(true);
          setWishlistItemId(wishlistItem.id);
        }

      } catch (err) {
        setError('Failed to fetch vehicle details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicleAndWishlist();
  }, [id]);

  const handleWishlistToggle = async () => {
    if (isWishlisted) {
      await axios.delete(`${API_BASE_URL}/wishlist/${wishlistItemId}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setIsWishlisted(false);
      setWishlistItemId(null);
    } else {
      const response = await axios.post(`${API_BASE_URL}/wishlist/`, { vehicle_id: id }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setIsWishlisted(true);
      setWishlistItemId(response.data.id);
    }
  };

  const handleBookNow = () => {
    setBookingType('INQUIRY');
    setIsBookingModalOpen(true);
  };

  const handleBookTestRide = () => {
    setBookingType('TEST_RIDE');
    setIsBookingModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  if (!vehicle) {
    return <div className="text-center py-10">Vehicle not found.</div>;
  }

  const { name, brand_detail, type, price, year, specs, images, similar_vehicles } = vehicle;
  const specTabs = specs ? Object.keys(specs) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:!px-8 py-8">
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/vehicles" className="hover:text-blue-600 transition-colors">Vehicles</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:!grid-cols-3 gap-8 items-start">
          <div className="lg:!col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative aspect-[4/3]">
                <img
                  src={images?.[currentImage]?.image || 'https://via.placeholder.com/800x600?text=No+Image'}
                  alt={`${name} - View ${currentImage + 1}`}
                  className="w-full h-full object-cover"
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setCurrentImage(curr => (curr - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => setCurrentImage(curr => (curr + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-2 rounded-full shadow-lg hover:bg-white transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                      {currentImage + 1}/{images.length}
                    </div>
                  </>
                )}
              </div>
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 p-4">
                  {images.map((img, index) => (
                    <button
                      key={img.id}
                      onClick={() => setCurrentImage(index)}
                      className={`relative aspect-[4/3] rounded-lg overflow-hidden ${currentImage === index ? 'ring-2 ring-blue-500' : 'hover:ring-2 hover:ring-blue-200'}`}>
                      <img
                        src={img.image}
                        alt={`${name} - Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {currentImage === index && <div className="absolute inset-0 bg-blue-500/10" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specifications */}
            {specs && specTabs.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-2xl font-bold mb-4">Specifications</h3>
                <div className="py-6">
                  <div className="grid grid-cols-1 md:!grid-cols-2 gap-x-8 gap-y-4">
                    {Object.entries(specs).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b last:border-0">
                        <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                        <span className="font-medium text-gray-800 text-right">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Details */}
          <div className="lg:!sticky lg:!top-14 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">{brand_detail?.name}</p>
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              <div className="flex items-center gap-2 mb-4 text-sm text-gray-500">
                <span>{year}</span>
                <span className="text-gray-400">•</span>
                <span className="capitalize">{type.toLowerCase()}</span>
                {specs?.['Engine & Transmission']?.['Fuel Type'] && (
                    <>
                        <span className="text-gray-400">•</span>
                        <span>{specs['Engine & Transmission']['Fuel Type']}</span>
                    </>
                )}
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center">
                  <p className="text-4xl font-bold text-gray-900">₹{price.toLocaleString()}</p>
                  <button onClick={handleWishlistToggle} className="text-gray-500 hover:text-red-500 transition-colors p-2 rounded-full bg-gray-100 hover:bg-red-100">
                    <Heart className={`w-6 h-6 ${isWishlisted ? 'text-red-500 fill-current' : ''}`} />
                  </button>
                </div>
                <p className="text-gray-500 text-sm">Ex-showroom Price</p>
              </div>

              <div className="mt-4 py-4 border-t border-gray-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">EMI starts at</span>
                  <span className="font-semibold">₹{Math.round(price / 36).toLocaleString()}/month</span>
                </div>
                <button
                  onClick={() => setShowEMICalculator(true)}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Calculate EMI
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <button onClick={handleBookTestRide} className="w-full bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                  Book Test Ride
                </button>
                <button onClick={handleBookNow} className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Vehicles */}
        {similar_vehicles && similar_vehicles.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Vehicles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:!grid-cols-3 xl:grid-cols-4 gap-6">
              {similar_vehicles.map((v) => (
                <VehicleCard key={v.id} vehicle={v} onWishlistToggle={() => {}} isWishlisted={false} />
              ))}
            </div>
          </div>
        )}
      </div>

      {showEMICalculator && (
        <EMICalculator vehiclePrice={price} onClose={() => setShowEMICalculator(false)} />
      )}
      <BookingModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
        vehicle={vehicle} 
        bookingType={bookingType} 
      />
    </div>
  );
};

export default VehicleDetailPage;
