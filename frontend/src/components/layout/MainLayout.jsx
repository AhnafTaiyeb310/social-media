import React from 'react';
import SidebarLeft from './SidebarLeft';
import SidebarRight from './SidebarRight';
import Navbar from '../navigation/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-background font-sans">
      <Navbar />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 px-4 pt-24 pb-12">
        {/* Left Sidebar - Navigation */}
        <aside className="hidden lg:block md:col-span-3 sticky top-24 h-fit">
          <SidebarLeft />
        </aside>

        {/* Main Feed */}
        <main className="col-span-12 lg:col-span-6 space-y-6">
          {children}
        </main>

        {/* Right Sidebar - Widgets */}
        <aside className="hidden lg:block md:col-span-3 sticky top-24 h-fit">
          <SidebarRight />
        </aside>
      </div>
    </div>
  );
}
