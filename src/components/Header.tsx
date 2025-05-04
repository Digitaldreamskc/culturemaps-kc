'use client';

import SearchBar from './SearchBar';

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or title can go here */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-gray-900">CultureMap KC</h1>
          </div>
          
          {/* Search bar container */}
          <div className="flex-1 max-w-2xl mx-4">
            <SearchBar onSearch={onSearch} />
          </div>
          
          {/* Right side items can go here */}
          <div className="flex-shrink-0">
            {/* Add any additional header items here */}
          </div>
        </div>
      </div>
    </div>
  );
} 