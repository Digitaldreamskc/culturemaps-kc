'use client';

import { LocationCategory } from '@/types/database';

const categories: { value: LocationCategory; label: string }[] = [
  { value: 'mural', label: 'Murals' },
  { value: 'music_venue', label: 'Music Venues' },
  { value: 'museum', label: 'Museums' },
  { value: 'historic_place', label: 'Historic Places' },
  { value: 'gallery', label: 'Galleries' },
  { value: 'theater', label: 'Theaters' },
  { value: 'other', label: 'Other' }
];

interface CategoryFilterProps {
  selectedCategory: LocationCategory | null;
  onCategoryChange: (category: LocationCategory | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange
}: CategoryFilterProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
      <div className="space-y-2">
        <button
          className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
            selectedCategory === null
              ? 'bg-blue-50 text-blue-700'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
          }`}
          onClick={() => onCategoryChange(null)}
        >
          All Categories
        </button>
        {Array.isArray(categories) && categories.map((category) => (
          <button
            key={category.value}
            className={`w-full px-4 py-2 text-left rounded-lg transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-50 text-blue-700'
                : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
            }`}
            onClick={() => onCategoryChange(category.value)}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  );
} 