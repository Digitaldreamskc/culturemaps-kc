'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { 
  Map, 
  Grid, 
  Star, 
  Bookmark, 
  PlusCircle, 
  Info,
  ImageIcon,
  Building2,
  Music,
  Clock,
  Palette,
  Theater,
  ChevronDown,
  ChevronRight,
  X
} from 'lucide-react';
import { Location } from '@/types/location';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

export default function Sidebar({ isOpen, onClose, locations, onLocationSelect }: SidebarProps) {
  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="p-4">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold mb-4">Locations</h2>
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onLocationSelect(location)}
            >
              <h3 className="font-semibold">{location.name}</h3>
              <p className="text-sm text-gray-600">{location.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 