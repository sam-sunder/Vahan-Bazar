import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import VehicleCard from '../components/VehicleCard';
import axios from 'axios';
import { Range, getTrackBackground } from 'react-range';
import { FaFilter, FaTimes, FaSearch } from 'react-icons/fa';
import useDebounce from '../hooks/useDebounce';

const API_BASE_URL = 'http://localhost:8000/api';

// API functions
const fetchVehicles = async (type) => {
  let url = `${API_BASE_URL}/vehicles/`;
  if (type) {
    url += `?type=${type}`;
  }
  const response = await axios.get(url, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};

const fetchBrands = async () => {
  const response = await axios.get(`${API_BASE_URL}/brands/`, {
    headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  return response.data;
};

const fetchWishlist = async () => {
    const response = await axios.get(`${API_BASE_URL}/wishlist/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    });
    return response.data;
}

const VehicleListingPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const typeFromUrl = searchParams.get('type');

  const [vehicles, setVehicles] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: typeFromUrl || '',
    brand: [],
    priceRange: [25000, 300000],
    color: [],
    fuelType: [],
    sort: 'popular',
    category: ''
  });
  const [wishlist, setWishlist] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  useEffect(() => {
    setFilters(prev => ({ ...prev, searchTerm: debouncedSearchTerm }));
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [vehiclesData, brandsData, wishlistData] = await Promise.all([
            fetchVehicles(typeFromUrl), 
            fetchBrands(),
            fetchWishlist()
        ]);
        setVehicles(vehiclesData);
        setBrands(brandsData);
        setWishlist(wishlistData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [typeFromUrl]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeFromUrl = searchParams.get('type');
    setFilters(prev => ({ ...prev, type: typeFromUrl || '' }));
  }, [location.search]);

  const vehicleCategories = ['BIKE', 'SCOOTER', 'EV'];
  const fuelTypes = ['Petrol', 'Electric', 'Hybrid'];
  const colors = ['Black', 'Red', 'Blue', 'White', 'Silver', 'Green', 'Orange', 'Yellow'];
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' }
  ];

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (['brand', 'color', 'fuelType'].includes(type)) {
        const newValues = prev[type].includes(value)
          ? prev[type].filter(item => item !== value)
          : [...prev[type], value];
        return { ...prev, [type]: newValues };
      }
      return { ...prev, [type]: value };
    });
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      searchTerm: '',
      type: typeFromUrl || '',
      brand: [],
      priceRange: [25000, 300000],
      color: [],
      fuelType: [],
      sort: 'popular',
      category: ''
    });
  };

  const handleWishlistToggle = async (vehicleId) => {
    const wishlistItem = wishlist.find(item => item.vehicle.id === vehicleId);
    if (wishlistItem) {
      await axios.delete(`${API_BASE_URL}/wishlist/${wishlistItem.id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setWishlist(prev => prev.filter(item => item.id !== wishlistItem.id));
    } else {
      const response = await axios.post(`${API_BASE_URL}/wishlist/`, { vehicle_id: vehicleId }, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setWishlist(prev => [...prev, response.data]);
    }
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter((vehicle) => {
      const matchesSearch = !filters.searchTerm || vehicle.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesType = !filters.type || vehicle.type === filters.type;
      const matchesCategory = !filters.category || vehicle.category === filters.category;
      const matchesBrand = filters.brand.length === 0 || filters.brand.includes(vehicle.brand_detail?.id);
      const matchesFuel = filters.fuelType.length === 0 || filters.fuelType.includes(vehicle.specs?.['Fuel Type']);
      const matchesPrice = vehicle.price >= filters.priceRange[0] && vehicle.price <= filters.priceRange[1];
      const matchesColor = filters.color.length === 0 || filters.color.some(color => vehicle.colors?.includes(color));

      return matchesSearch && matchesType && matchesCategory && matchesBrand && matchesFuel && matchesPrice && matchesColor;
    });
  }, [vehicles, filters]);

  const sortedVehicles = useMemo(() => {
    return [...filteredVehicles].sort((a, b) => {
        switch (filters.sort) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'newest': return new Date(b.created_at) - new Date(a.created_at);
        default: return 0;
        }
    });
}, [filteredVehicles, filters.sort]);

  const FilterSidebar = () => (
    <aside className={`w-80 bg-white border-r border-gray-200 p-6 transition-transform duration-300 fixed lg:!sticky top-0 h-full lg:!h-auto z-20 ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'} lg:!translate-x-0`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Filters</h2>
        <button onClick={resetFilters} className="text-sm font-medium text-blue-600 hover:text-blue-800">Clear All</button>
        <button onClick={() => setIsFilterOpen(false)} className="lg:!hidden text-gray-500 hover:text-gray-800">
          <FaTimes />
        </button>
      </div>
      
      <div className="relative mb-6">
        <input 
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Brand</h3>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
            {brands.map(brand => (
              <label key={brand.id} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={filters.brand.includes(brand.id)} onChange={() => handleFilterChange('brand', brand.id)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">{brand.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Category</h3>
          <div className="flex flex-wrap gap-2">
            {vehicleCategories.map(category => (
              <button key={category} onClick={() => handleFilterChange('category', filters.category === category ? '' : category)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filters.category === category ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
                {category}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Price Range</h3>
          <div className="px-2">
            <Range
              values={filters.priceRange}
              step={5000}
              min={25000}
              max={300000}
              onChange={(values) => handleFilterChange('priceRange', values)}
              renderTrack={({ props, children }) => (
                <div
                  onMouseDown={props.onMouseDown}
                  onTouchStart={props.onTouchStart}
                  style={{
                    ...props.style,
                    height: '36px',
                    display: 'flex',
                    width: '100%'
                  }}
                >
                  <div
                    ref={props.ref}
                    style={{
                      height: '5px',
                      width: '100%',
                      borderRadius: '4px',
                      background: getTrackBackground({
                        values: filters.priceRange,
                        colors: ['#ccc', '#548BF4', '#ccc'],
                        min: 25000,
                        max: 300000
                      }),
                      alignSelf: 'center'
                    }}
                  >
                    {children}
                  </div>
                </div>
              )}
              renderThumb={({ props, isDragged }) => {
                const { key, ...thumbProps } = props;
                return (
                  <div
                    {...thumbProps}
                    key={key}
                    style={{
                      ...props.style,
                      height: '24px',
                      width: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#FFF',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      boxShadow: '0px 2px 6px #AAA'
                    }}
                  >
                    <div
                      style={{
                        height: '12px',
                        width: '5px',
                        backgroundColor: isDragged ? '#548BF4' : '#CCC'
                      }}
                    />
                  </div>
                );
              }}
            />
            <div className="flex justify-between text-sm text-gray-600 mt-2">
              <span>₹{filters.priceRange[0].toLocaleString()}</span>
              <span>₹{filters.priceRange[1].toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Fuel Type</h3>
          <div className="space-y-2">
            {fuelTypes.map(fuel => (
              <label key={fuel} className="flex items-center space-x-3 cursor-pointer">
                <input type="checkbox" checked={filters.fuelType.includes(fuel)} onChange={() => handleFilterChange('fuelType', fuel)} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">{fuel}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      <FilterSidebar />

      <main className="flex-1 ">
        <div className="px-6 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsFilterOpen(true)} className="lg:!hidden p-2 rounded-md bg-white shadow-sm">
                <FaFilter className="text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Explore Vehicles</h1>
                <p className="text-gray-500">{sortedVehicles.length} results found</p>
              </div>
            </div>
            <select value={filters.sort} onChange={(e) => handleFilterChange('sort', e.target.value)} className="border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500">
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : sortedVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:!grid-cols-2 xl:!grid-cols-3 gap-8">
              {sortedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} onWishlistToggle={handleWishlistToggle} isWishlisted={wishlist.some(item => item.vehicle.id === vehicle.id)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-700">No Vehicles Found</h2>
              <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
              <button onClick={resetFilters} className="mt-6 bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VehicleListingPage;