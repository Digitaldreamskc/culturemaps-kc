'use client';

import { Location } from '@/types/database';

interface LocationListProps {
  locations: Location[];
  selectedLocation: Location | null;
  onLocationSelect: (location: Location) => void;
  loading: boolean;
}

export default function LocationList({
  locations,
  selectedLocation,
  onLocationSelect,
  loading
}: LocationListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!Array.isArray(locations) || locations.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
        <p className="text-gray-500">No locations found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Locations</h2>
      <div className="space-y-4">
        {Array.isArray(locations) && locations.map((location) => (
          <div
            key={location.id}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedLocation?.id === location.id
                ? 'bg-blue-50 border border-blue-200'
                : 'bg-gray-50 hover:bg-gray-100'
            }`}
            onClick={() => onLocationSelect(location)}
          >
            <h3 className="font-medium text-gray-900">{location.title}</h3>
            {location.description && (
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                {location.description}
              </p>
            )}
            {location.address && (
              <p className="mt-1 text-sm text-gray-500">{location.address}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 