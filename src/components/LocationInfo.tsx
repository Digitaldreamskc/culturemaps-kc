'use client';

import { useState } from 'react';
import { Location } from '@/types/database';

interface LocationInfoProps {
  location: Location;
}

export default function LocationInfo({ location }: LocationInfoProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getDirectionsUrl = (lat: number, lng: number) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  };

  // Format website URL to ensure it has http/https
  const formatWebsiteUrl = (url: string) => {
    if (!url) return '';
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      return `https://${url}`;
    }
    return url;
  };

  // Format phone number for tel: link
  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Remove all non-numeric characters and ensure it starts with +1 for US numbers
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.startsWith('1') ? `+${cleaned}` : `+1${cleaned}`;
  };

  return (
    <div className="p-4 max-w-sm">
      <div className="flex items-start justify-between">
        <h3 className="font-bold text-lg">{location.title}</h3>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-gray-500 hover:text-gray-700"
        >
          {isExpanded ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>
      
      <p className="text-sm text-gray-600 capitalize mb-2">{location.category.replace('_', ' ')}</p>
      
      {isExpanded && (
        <div className="mt-2 space-y-3">
          {location.photo_url && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden">
              <img
                src={location.photo_url}
                alt={`${location.title} photo`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {location.description && (
            <p className="text-sm">{location.description}</p>
          )}
          {location.address && (
            <p className="text-sm">{location.address}</p>
          )}
          {location.website && (
            <a
              href={formatWebsiteUrl(location.website)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 hover:underline"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit Website
            </a>
          )}
          {location.phone && (
            <a
              href={`tel:${formatPhoneNumber(location.phone)}`}
              className="inline-flex items-center text-sm text-blue-600 hover:underline block"
              aria-label={`Call ${location.title} at ${location.phone}`}
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {location.phone}
            </a>
          )}
          <a
            href={getDirectionsUrl(location.latitude, location.longitude)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-blue-600 hover:underline mt-2"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Get Directions
          </a>
        </div>
      )}
    </div>
  );
} 