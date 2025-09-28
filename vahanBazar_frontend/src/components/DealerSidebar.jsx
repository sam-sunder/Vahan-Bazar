import React from 'react';
import { NavLink } from 'react-router-dom';
import { RxDashboard } from 'react-icons/rx';
import { FiPackage, FiUser, FiCalendar } from 'react-icons/fi';

const DealerSidebar = () => {
  const navLinkClasses = ({ isActive }) =>
    isActive
      ? 'flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg'
      : 'flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg';

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <div to="/" className="text-2xl font-bold font-sora text-gray-800 border-b border-gray-300 pl-8 py-4">
        Vahan<span className="text-primary">Bazar</span>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          <li>
            <NavLink to="/dealer/dashboard" className={navLinkClasses}>
              <RxDashboard className="mr-3" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/dealer/vehicles" className={navLinkClasses}>
              <FiPackage className="mr-3" />
              Vehicles
            </NavLink>
          </li>
          <li>
            <NavLink to="/dealer/branches" className={navLinkClasses}>
              <FiUser className="mr-3" />
              Branches
            </NavLink>
          </li>
          <li>
            <NavLink to="/dealer/bookings" className={navLinkClasses}>
              <FiCalendar className="mr-3" />
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to="/dealer/profile" className={navLinkClasses}>
              <FiUser className="mr-3" />
              Profile
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default DealerSidebar;
