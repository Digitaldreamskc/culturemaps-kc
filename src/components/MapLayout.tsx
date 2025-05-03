'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MapLayoutProps {
  children: React.ReactNode;
}

export default function MapLayout({ children }: MapLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSearch = (query: string) => {
    // TODO: Implement search functionality
    console.log('Searching for:', query);
  };

  const handleSelectLocation = (location: { name: string; coordinates: [number, number] }) => {
    // TODO: Implement location selection
    console.log('Selected location:', location);
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col">
        {/* Header with Search */}
        <Header 
          onSearch={handleSearch}
          onSelectLocation={handleSelectLocation}
        />

        {/* Main content */}
        <div className="flex-1 relative">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <main className="h-full">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 