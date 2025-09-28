import { NavLink, Outlet } from 'react-router-dom';
import { User, Heart, ShoppingCart, LogOut, Car } from 'lucide-react';

const UserDashboardLayout = () => {
  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div to="/" className="text-2xl font-bold font-sora text-gray-800 border-b border-gray-300 pl-8 py-4">
          Vahan<span className="text-primary">Bazar</span>
        </div>
        <nav className="flex-grow p-4">
          <NavLink to="/account/profile" className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <User className="w-5 h-5 mr-3" />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/account/bookings" className={({ isActive }) => `flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <ShoppingCart className="w-5 h-5 mr-3" />
            <span>My Bookings</span>
          </NavLink>
          <NavLink to="/account/wishlist" className={({ isActive }) => `flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Heart className="w-5 h-5 mr-3" />
            <span>Wishlist</span>
          </NavLink>
          <NavLink to="/account/vehicles" className={({ isActive }) => `flex items-center px-4 py-3 mt-2 rounded-lg transition-colors ${isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}>
            <Car className="w-5 h-5 mr-3" />
            <span>My Vehicles</span>
          </NavLink>
        </nav>
        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-red-100 hover:text-red-600 transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
