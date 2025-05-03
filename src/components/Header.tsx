'use client';

import SearchBar from './SearchBar';

interface HeaderProps {
  onSearch: (query: string) => void;
  onSelectLocation?: (location: { name: string; coordinates: [number, number] }) => void;
}

export default function Header({ onSearch, onSelectLocation }: HeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full max-w-7xl mx-auto px-4 flex items-center justify-between">
        <div className="flex-1 max-w-xl">
          <SearchBar 
            onSearch={onSearch}
            onSelectLocation={onSelectLocation}
          />
        </div>
      </div>
    </header>
  );
} 