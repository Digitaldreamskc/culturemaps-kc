'use client';

import { Location } from '@/types/location';

interface LocationPopupProps {
  location: Location;
}

export default function LocationPopup({ location }: LocationPopupProps) {
  return (
    <div className="p-4 max-w-sm">
      <h3 className="text-lg font-semibold mb-2">{location.name}</h3>
      <p className="text-gray-600 mb-2">{location.description}</p>
      {location.address && (
        <p className="text-sm text-gray-500 mb-2">{location.address}</p>
      )}
      {location.website && (
        <a
          href={location.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          Visit Website
        </a>
      )}
    </div>
  );
} 