import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaRegUserCircle } from "react-icons/fa";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    setIsProfileMenuOpen(false);
    navigate('/login');
  };

  const profileLink = user ? (user.is_dealer ? '/dealer/profile' : '/account/profile') : '#';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-3 px-4">
          <Link to="/" className="text-2xl font-bold font-sora text-gray-800">
            Vahan<span className="text-primary">Bazar</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:!flex items-center space-x-1">
            <Link to="/vehicles?type=NEW" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">New Vehicles</Link>
            <Link to="/vehicles?type=USED" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">Used Vehicles</Link>
            <Link to="/compare" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">Compare</Link>
            <Link to="/news" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">News</Link>
          </nav>
          
          <div className="hidden md:!flex items-center space-x-3">
            {user ? (
              <div className="relative">
                <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center space-x-2">
                  <FaRegUserCircle className="text-2xl text-gray-600" />
                </button>
                {isProfileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <Link to={profileLink} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-primary font-medium">Login</Link>
                <Link to="/signup" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-600 hover:text-primary"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
          <nav className="px-4 pt-2 pb-4 space-y-2 border-t border-gray-200">
            <Link to="/vehicles" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Explore Vehicles
            </Link>
            <Link to="/compare" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Compare
            </Link>
            <Link to="/sell" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Sell Vehicle
            </Link>
            <Link to="/tools" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              EMI Calculator
            </Link>
            <Link to="/upcoming" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              New Launches
            </Link>
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <Link to={profileLink} className="w-full py-2 px-4 text-gray-600 hover:text-primary font-medium text-left">
                    Profile
                  </Link>
                  <button onClick={handleLogout} className="w-full py-2 px-4 text-gray-600 hover:text-primary font-medium text-left">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="w-full py-2 px-4 text-gray-600 hover:text-primary font-medium text-left">
                    Login
                  </Link>
                  <Link to="/signup" className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-left">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;