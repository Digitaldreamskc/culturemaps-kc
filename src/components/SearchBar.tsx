'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onSelectLocation?: (location: { name: string; coordinates: [number, number] }) => void;
}

export default function SearchBar({ onSearch, onSelectLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search locations or addresses..."
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-300 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        </div>
        
        {/* Suggestions dropdown */}
        {isFocused && query && (
          <div className="absolute w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-50">
            {/* Example suggestions - replace with actual search results */}
            <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
              <div className="font-medium">Kansas City Museum</div>
              <div className="text-sm text-gray-500">3218 Gladstone Blvd, Kansas City, MO</div>
            </div>
            <div className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg">
              <div className="font-medium">Nelson-Atkins Museum of Art</div>
              <div className="text-sm text-gray-500">4525 Oak St, Kansas City, MO</div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
} 