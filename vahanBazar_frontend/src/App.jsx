import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import VehicleListingPage from './pages/VehicleListingPage';
import VehicleComparePage from './pages/VehicleComparePage.jsx';
import VehicleDetailPage from './pages/VehicleDetailPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

import DealerLayout from './layouts/DealerLayout';
import DealerDashboardPage from './pages/dealer/DealerDashboardPage';
import AddVehiclePage from './pages/dealer/AddVehiclePage.jsx';
import DealerVehicleListPage from './pages/dealer/DealerVehicleListPage';
import DealerVehicleEditPage from './pages/dealer/DealerVehicleEditPage';
import DealerProfilePage from './pages/dealer/DealerProfilePage';
import DealerVehicleDetailPage from './pages/dealer/DealerVehicleDetailPage';
import DealerBranchesPage from './pages/dealer/DealerBranchesPage.jsx';
import DealerBookingsPage from './pages/dealer/DealerBookingsPage.jsx';

import UserDashboardLayout from './layouts/UserDashboardLayout';
import UserProfilePage from './pages/user/UserProfilePage';
import UserBookingsPage from './pages/user/UserBookingsPage';
import UserWishlistPage from './pages/user/UserWishlistPage';
import UserVehiclesPage from './pages/user/UserVehiclesPage.jsx';
import UserAddVehiclePage from './pages/user/UserAddVehiclePage.jsx';
import UserEditVehiclePage from './pages/user/UserEditVehiclePage.jsx';
import UserVehicleDetailPage from './pages/user/UserVehicleDetailPage.jsx';

import './App.css'

// --- Mock Data ---
const brands = [
  { name: 'Honda', logo: '/src/assets/img/logos/honda.png' },
  { name: 'Bajaj', logo: '/src/assets/img/logos/bajaj.jpg' },
  { name: 'Hero', logo: '/src/assets/img/logos/hero.png' },
  { name: 'TVS', logo: '/src/assets/img/logos/tvs.jpg' },
  { name: 'Ather', logo: '/src/assets/img/logos/ather.png' },
  { name: 'Ola', logo: '/src/assets/img/logos/ola.webp' },
  { name: 'Yamaha', logo: '/src/assets/img/logos/yamaha.jpg' },
];

const featuredVehicles = [
  { id: 1, name: 'Ather 450X', type: 'Electric Scooter', price: '₹1,45,000', image: 'https://placehold.co/600x400/ffffff/000000?text=Ather+450X', tag: 'Best EV' },
  { id: 2, name: 'Yamaha R15 V4', type: 'Sports Bike', price: '₹1,82,000', image: 'https://placehold.co/600x400/ffffff/000000?text=Yamaha+R15', tag: 'Performance' },
  { id: 3, name: 'RE Hunter 350', type: 'Cruiser Bike', price: '₹1,50,000', image: 'https://placehold.co/600x400/ffffff/000000?text=Hunter+350', tag: 'Top Seller' },
  { id: 4, name: 'Ola S1 Pro', type: 'Electric Scooter', price: '₹1,30,000', image: 'https://placehold.co/600x400/ffffff/000000?text=Ola+S1+Pro', tag: 'New' },
];

const upcomingLaunches = [
  { id: 1, name: 'Quantum EV', brand: 'VahanBazar Motors', launch: 'August 2024', image: '/src/assets/img/quantum_ev.png' },
  { id: 2, name: 'Himalayan 450', brand: 'Royal Enfield', launch: 'September 2024', image: '/src/assets/img/h_450.png' },
];

const testimonials = [
  { id: 1, name: 'Rohan S.', quote: "The side-by-side comparison is a game-changer. Found the perfect bike in minutes!", avatar: 'https://i.pravatar.cc/150?u=rohan' },
  { id: 2, name: 'Priya K.', quote: "Selling my old scooter was unbelievably easy. Got a fair price and quick pickup. Highly recommend!", avatar: 'https://i.pravatar.cc/150?u=priya' },
  { id: 3, name: 'Ankit M.', quote: "VahanBazar's EMI calculator helped me budget perfectly for my new EV. The whole experience was seamless.", avatar: 'https://i.pravatar.cc/150?u=ankit' },
];

// --- Components ---

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center py-3 px-4">
          <div className="text-2xl font-bold font-sora text-gray-800">Vahan<span className="text-primary">Bazar</span></div>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:!flex items-center space-x-1">
            <a href="#new" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">New Vehicles</a>
            <a href="#used" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">Used Vehicles</a>
            {/* <a href="#reviews" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]"></a> */}
            <a href="#compare" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">Compare</a>
            <a href="#news" className="px-4 py-2 text-gray-800 hover:text-primary hover:bg-gray-50 rounded-md font-medium transition-all duration-200 text-[15px]">News</a>
          </nav>
          
          <div className="hidden md:!flex items-center space-x-3">
            <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-primary font-medium">Login</Link>
            <Link to="/signup" className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium">Sign Up</Link>
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
            <a href="#explore" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Explore Vehicles
            </a>
            <a href="#features" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Compare
            </a>
            <a href="#sell" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              Sell Vehicle
            </a>
            <a href="#tools" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              EMI Calculator
            </a>
            <a href="#upcoming" className="block py-2 px-4 text-gray-600 hover:text-primary font-medium hover:bg-gray-50 rounded-lg">
              New Launches
            </a>
            <div className="pt-2 space-y-2">
              <Link to="/login" className="w-full block py-2 px-4 text-gray-600 hover:text-primary font-medium text-left">
                Login
              </Link>
              <Link to="/signup" className="w-full block py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium text-left">
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="min-h-screen pt-20 overflow-hidden">
      {/* Hero Background Video */}
      <div className="absolute inset-0 bg-bg-light">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover -scale-x-100"
          poster="/src/assets/img/hero_fallback.png"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
        >
          <source src="/src/assets/videos/hero_vid.mp4" type="video/mp4" />
        </video>
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" 
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 90%)' }}
        ></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-[2] pb-10">
        <div className="grid lg:grid-cols-5 gap-8 items-center">
          {/* Content Area - Left Side */}
          <div className="text-left max-w-xl col-span-2">
            <div className="shiny-border hover:scale-[1.01] transition-transform duration-300">
              <div className="relative bg-white/95 backdrop-blur-lg rounded-xl p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Find your right vehicle</h1>
                <p className="text-gray-500 mb-8">Compare prices, features, and more to make the right choice</p>
                
                {/* Vehicle Type Toggle */}
                <div className="flex mb-8 border rounded-xl overflow-hidden bg-gray-50 p-1">
                  <button className="flex-1 py-3 px-4 bg-primary text-white font-medium rounded-lg shadow-sm">New Vehicle</button>
                  <button className="flex-1 py-3 px-4 text-gray-600 hover:bg-gray-100 font-medium rounded-lg transition-colors">Used Vehicle</button>
                </div>

                {/* Search Type Toggle */}
                <div className="flex gap-8 mb-8">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="searchType" className="w-5 h-5 text-primary accent-primary" defaultChecked />
                    <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">By Budget</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="searchType" className="w-5 h-5 text-primary accent-primary" />
                    <span className="text-gray-700 font-medium group-hover:text-primary transition-colors">By Brand</span>
                  </label>
                </div>

                {/* Search Filters */}
                <div className="space-y-4">
                  <div className="relative">
                    <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none hover:bg-gray-100">
                      <option value="">Select Budget</option>
                      <option value="1-2">₹1-2 Lakh</option>
                      <option value="2-3">₹2-3 Lakh</option>
                      <option value="3-4">₹3-4 Lakh</option>
                      <option value="4+">₹4+ Lakh</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative">
                    <select className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none hover:bg-gray-100">
                      <option value="">All Vehicle Types</option>
                      <option value="bike">Bikes</option>
                      <option value="scooter">Scooters</option>
                      <option value="electric">Electric</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  <button className="w-full py-4 bg-primary text-white font-medium rounded-xl hover:bg-primary-dark transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-lg active:translate-y-[1px]">
                    Search Vehicles
                  </button>
                </div>

                <div className="mt-6 text-center">
                  <a href="#advanced" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
                    Advanced Search
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area - Right Side */}
          <div className={`relative transition-all duration-1000 delay-[1200ms] col-span-3 ${
            mounted ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
            }`}>
            <div className="text-white flex justify-center flex-col items-center text-center">
              <h2 className="text-6xl font-bold mb-6 leading-tight">Discover your perfect<br />Two-Wheeler</h2>
              <p className="text-xl text-white/90 mb-8">From electric scooters to performance bikes,<br />find your ideal ride that matches your style.</p>
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">20+</div>
                  <div className="text-white/80 text-sm">Brands</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <div className="text-white/80 text-sm">Models</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-white/80 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Brands = () => (
  <section className="py-12 bg-bg-light">
    <div className="container mx-auto px-4">
      <h3 className="text-center text-text-muted font-medium mb-6">Models from Popular brands with Affordable prices</h3>
      <div className="flex flex-wrap justify-center items-center max-w-6xl mx-auto gap-x-8 md:gap-x-16 gap-y-6">
        {brands.map(brand => (
          <div key={brand.name} className="flex items-center justify-center">
            <img 
              src={brand.logo} 
              alt={brand.name} 
              className="w-[100px] h-[100px] object-contain" 
            />
          </div>
        ))}
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="features" className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">How It Works</span>
        <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark">Your Journey to the Perfect Ride in 3 Steps</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 relative text-center">
          <div className="absolute top-4 right-4 text-7xl font-extrabold text-gray-100">01</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Discover & Filter</h3>
          <p className="text-text-muted">Effortlessly browse our vast collection. Filter by brand, price, and fuel type to find exactly what you're looking for.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 relative text-center">
          <div className="absolute top-4 right-4 text-7xl font-extrabold text-gray-100">02</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Compare & Decide</h3>
          <p className="text-text-muted">Analyze specs side-by-side. Use our smart EMI and Fuel Cost calculators to make a financially sound decision.</p>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 relative text-center">
          <div className="absolute top-4 right-4 text-7xl font-extrabold text-gray-100">03</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Connect & Own</h3>
          <p className="text-text-muted">Book a test ride directly from the app or connect with verified showrooms to complete your purchase.</p>
        </div>
      </div>
    </div>
  </section>
);

const FeaturedVehicles = () => (
  <section id="explore" className="py-20 bg-bg-light">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">Explore</span>
        <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark">New & Noteworthy Rides</h2>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {featuredVehicles.map(v => (
          <div key={v.id} className="bg-white rounded-3xl overflow-hidden hover:shadow-lg transition-all duration-300 p-4 border border-gray-300 shadow-[0_2px_20px_rgb(0,0,0,0.05)]">
            <div className="relative aspect-[4/3] mb-4">
              <img src={v.image.replace('14142b', 'ffffff')} alt={v.name} className="w-full h-full object-cover rounded-2xl bg-gray-50" />
              {v.tag === 'Best EV' && (
                <button className="absolute top-4 right-4 p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                  </svg>
                </button>
              )}
              {v.tag && (
                <span className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                  {v.tag}
                </span>
              )}
            </div>
            
            {/* Image Indicators */}
            <div className="flex justify-center gap-1.5 mb-4">
              <button className="w-1.5 h-1.5 rounded-full bg-primary"></button>
              <button className="w-1.5 h-1.5 rounded-full bg-gray-200"></button>
              <button className="w-1.5 h-1.5 rounded-full bg-gray-200"></button>
            </div>

            <div className="px-2">
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-900">{v.name}</h3>
                <span className="text-sm font-medium text-gray-500">{v.type}</span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold">{v.price}</span>
              </div>
              <button className="w-full py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-black transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SmartTools = () => {
  const [emi, setEmi] = useState({ amount: 150000, interest: 9.5, tenure: 36, result: 0 });

  useEffect(() => {
    const p = emi.amount;
    const r = emi.interest / 12 / 100;
    const n = emi.tenure;
    const emiValue = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setEmi(e => ({ ...e, result: p > 0 && r > 0 && n > 0 ? Math.round(emiValue) : 0 }));
  }, [emi.amount, emi.interest, emi.tenure]);

  return (
    <section id="tools" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">Smart Tools</span>
          <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark">Plan Your Purchase with Confidence</h2>
        </div>
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
            <h4 className="text-xl font-bold text-text-dark mb-6">EMI Calculator</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Vehicle Price (₹)</label>
                <input type="range" min="50000" max="500000" step="1000" value={emi.amount} onChange={e => setEmi({...e, amount: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                <span className="block text-right font-semibold text-text-dark mt-2">{Number(emi.amount).toLocaleString('en-IN')}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Tenure (Months)</label>
                <input type="range" min="6" max="60" step="6" value={emi.tenure} onChange={e => setEmi({...e, tenure: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                <span className="block text-right font-semibold text-text-dark mt-2">{emi.tenure}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-muted mb-2">Interest Rate (%)</label>
                <input type="range" min="6" max="15" step="0.1" value={emi.interest} onChange={e => setEmi({...e, interest: +e.target.value})} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary" />
                <span className="block text-right font-semibold text-text-dark mt-2">{emi.interest.toFixed(1)}</span>
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-gray-200 text-center">
              <p className="text-text-muted">Your Monthly EMI</p>
              <h3 className="text-4xl font-bold text-primary">₹{emi.result.toLocaleString('en-IN')}</h3>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-secondary rounded-lg p-8 text-white h-full flex flex-col justify-center items-start">
            <h4 className="font-bold opacity-80">Can't Decide?</h4>
            <h3 className="text-2xl font-bold font-sora mt-2 mb-4">Compare Models Side-by-Side</h3>
            <p className="opacity-80 mb-6">Select up to 3 vehicles and get a detailed comparison of specs, features, and price.</p>
            <Link to="/compare" className="px-6 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100">Start Comparing</Link>
          </div>
        </div>
      </div>
    </section>
  );
};

const SellBike = () => (
  <section id="sell" className="py-20 bg-bg-light">
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark mb-4">Got a Bike to Sell?</h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto md:mx-0">Get an instant, fair-market valuation and sell your bike hassle-free. The best price is just a few clicks away.</p>
          <button className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark">Get Free Valuation</button>
        </div>
        {/* <div className="md:w-1/2">
          <img src={"https://placehold.co/500x400/ffffff/000000?text=Sell+Your+Bike+Here"} alt="Sell your bike" className="rounded-lg shadow-lg w-full" />
        </div> */}
      </div>
    </div>
  </section>
);

const UpcomingLaunches = () => (
  <section className="py-20 bg-white">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">Coming Soon</span>
        <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark">Stay Ahead of the Curve</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {upcomingLaunches.map(v => (
          <div key={v.id} className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img src={v.image.replace('0a0a1a', 'f9fafb')} alt={v.name} className="w-full h-64 object-contain" />
            </div>
            <div className="p-6">
              <p className="text-sm text-text-muted mb-1">{v.brand}</p>
              <h3 className="text-xl font-bold text-text-dark mb-4">{v.name}</h3>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-text-muted">Expected: {v.launch}</span>
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">Notify Me</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-20 bg-bg-light">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="inline-block bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">Testimonials</span>
        <h2 className="text-3xl md:text-4xl font-bold font-sora text-text-dark">Loved by Riders Across India</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map(t => (
          <div key={t.id} className="bg-white border border-gray-200 rounded-lg p-8">
            <p className="text-text-muted italic mb-6">"{t.quote}"</p>
            <div className="flex items-center">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
              <div>
                <p className="font-semibold text-text-dark">{t.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white pt-20 pb-8">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-8 mb-12">
        <div className="footer-section">
          <div className="text-2xl font-bold font-sora">Vahan<span className="text-primary">Bazar</span></div>
          <p className="text-text-muted mt-4">The future of two-wheeler mobility.</p>
          <div className="flex space-x-4 mt-6">
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">FB</a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">IN</a>
            <a href="#" className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-primary">TW</a>
          </div>
        </div>
        <div className="footer-section">
          <h4 className="font-semibold text-lg mb-4">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-text-muted hover:text-primary">Bikes</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Scooters</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Electric Vehicles</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Compare</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-text-muted hover:text-primary">About Us</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Contact</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Careers</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Press</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="font-semibold text-lg mb-4">Legal</h4>
          <ul className="space-y-2">
            <li><a href="#" className="text-text-muted hover:text-primary">Terms of Service</a></li>
            <li><a href="#" className="text-text-muted hover:text-primary">Privacy Policy</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 pt-8 text-center text-text-muted">
        <p>&copy; {new Date().getFullYear()} VahanBazar. A hackathon project built with ❤️.</p>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <Router>
      <div className="bg-bg-light font-sans">
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={
              <main>
                <Hero />
                <Brands />
                <HowItWorks />
                <FeaturedVehicles />
                <SmartTools />
                <SellBike />
                <UpcomingLaunches />
                <Testimonials />
              </main>
            } />
            <Route path="vehicles" element={<VehicleListingPage />} />
            <Route path="vehicles/:id" element={<VehicleDetailPage />} />
            <Route path="compare" element={<VehicleComparePage />} />
          </Route>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/dealer" element={<DealerLayout />}>
            <Route path="dashboard" element={<DealerDashboardPage />} />
            <Route path="vehicles" element={<DealerVehicleListPage />} />
            <Route path="vehicles/add" element={<AddVehiclePage />} />
            <Route path="vehicles/:id" element={<DealerVehicleDetailPage />} />
            <Route path="vehicles/:type/:id" element={<DealerVehicleEditPage />} />
            <Route path="profile" element={<DealerProfilePage />} />
            <Route path="branches" element={<DealerBranchesPage />} />
            <Route path="bookings" element={<DealerBookingsPage />} />
          </Route>
          <Route path="/account" element={<UserDashboardLayout />}>
            <Route path="profile" element={<UserProfilePage />} />
            <Route path="bookings" element={<UserBookingsPage />} />
            <Route path="wishlist" element={<UserWishlistPage />} />
            <Route path="vehicles" element={<UserVehiclesPage />} />
            <Route path="vehicles/add" element={<UserAddVehiclePage />} />
                          <Route path="vehicles/edit/:id" element={<UserEditVehiclePage />} />
                          <Route path="vehicles/:id" element={<UserVehicleDetailPage />} />          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App
