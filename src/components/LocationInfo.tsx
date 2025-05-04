/* eslint-disable @next/next/no-img-element */
'use client';

import { Location } from '@/types/database';
import { MapPin, Clock, Phone, Globe, Info } from 'lucide-react';

interface LocationInfoProps {
  location: Location;
}

export default function LocationInfo({ location }: LocationInfoProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-900">{location.title}</h3>
        {location.description && (
          <p className="text-sm text-gray-600">{location.description}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
          <p className="text-sm text-gray-600">{location.address}</p>
        </div>

        {location.hours && (
          <div className="flex items-start space-x-2">
            <Clock className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600">{location.hours}</p>
          </div>
        )}

        {location.phone && (
          <div className="flex items-start space-x-2">
            <Phone className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600">{location.phone}</p>
          </div>
        )}

        {location.website && (
          <div className="flex items-start space-x-2">
            <Globe className="w-4 h-4 text-gray-500 mt-0.5" />
            <a 
              href={location.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              Visit Website
            </a>
          </div>
        )}

        {location.additional_info && (
          <div className="flex items-start space-x-2">
            <Info className="w-4 h-4 text-gray-500 mt-0.5" />
            <p className="text-sm text-gray-600">{location.additional_info}</p>
          </div>
        )}
      </div>

      {location.photo_url && (
        <img
          src={location.photo_url}
          alt={location.title}
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
      )}
    </div>
  );
} 