'use client';

import { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  // Focus input when clicking the search icon
  const handleSearchClick = () => {
    inputRef.current?.focus();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative w-full"
    >
      <div className={`
        relative flex items-center w-full
        bg-white rounded-lg
        border border-gray-200
        shadow-sm
        transition-all duration-200
        ${isFocused ? 'ring-2 ring-blue-500 ring-opacity-50 border-blue-500' : 'hover:border-gray-300'}
      `}>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search locations..."
          className="
            w-full h-10
            pl-4 pr-10
            text-sm text-gray-900
            placeholder-gray-500
            bg-transparent
            border-0
            focus:outline-none
            focus:ring-0
          "
        />
        <button
          type="submit"
          onClick={handleSearchClick}
          className="
            absolute right-0
            h-10 w-10
            flex items-center justify-center
            text-gray-500
            hover:text-gray-700
            transition-colors duration-200
          "
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
} 