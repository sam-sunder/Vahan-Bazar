import React from 'react';
import { Outlet } from 'react-router-dom';
import DealerSidebar from '../components/DealerSidebar';

const DealerLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <DealerSidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DealerLayout;
