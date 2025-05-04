'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase';
import { Location, LocationCategory } from '@/types/database';
import { createRoot } from 'react-dom/client';
import { useSearchParams } from 'next/navigation';

// Kansas City coordinates
const KC_CENTER: [number, number] = [-94.5786, 39.0997];
const INITIAL_ZOOM = 12;

// Initialize Mapbox
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

if (!mapboxToken) {
  console.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file');
}

// Only set the access token if it exists
if (mapboxToken) {
  mapboxgl.accessToken = mapboxToken;
}

// Custom marker colors based on category
const categoryColors: Record<string, string> = {
  mural: '#FF6B6B',
  music_venue: '#4ECDC4',
  museum: '#45B7D1',
  historic_place: '#96CEB4',
  gallery: '#FFEEAD',
  theater: '#D4A5A5',
  other: '#9B9B9B'
};

interface CultureMapProps {
  locations: Location[];
  onLocationSelect: (location: Location) => void;
}

// Add custom marker creation function
const createCustomMarker = (location: Location) => {
  const el = document.createElement('div');
  el.className = 'marker';
  
  if (location.custom_icon_url) {
    // Create image marker
    const img = document.createElement('img');
    img.src = location.custom_icon_url;
    img.className = 'w-8 h-8 rounded-full object-cover border-2 border-white shadow-md';
    img.alt = `${location.title} icon`;
    el.appendChild(img);
  } else {
    // Create default colored marker
    el.style.backgroundColor = categoryColors[location.category] || categoryColors.other;
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
  }

  return el;
};

export default function CultureMap({ locations, onLocationSelect }: CultureMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popups = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as LocationCategory | null;

  // Fetch locations from Supabase
  useEffect(() => {
    async function fetchLocations() {
      try {
        let query = supabase
          .from('locations')
          .select('*')
          .order('created_at', { ascending: false });

        // Add category filter if specified
        if (category) {
          query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        onLocationSelect(data?.[0] || null);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      }
    }

    fetchLocations();
  }, [category, onLocationSelect]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: KC_CENTER,
      zoom: INITIAL_ZOOM
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Cleanup function for markers and popups
  const cleanupMarkers = () => {
    // First, remove all markers
    Object.values(markers.current).forEach(marker => {
      marker.remove();
    });
    markers.current = {};

    // Then, cleanup all popups
    Object.values(popups.current).forEach(popup => {
      popup.remove();
    });
    popups.current = {};
  };

  // Add markers when map is loaded and locations are available
  useEffect(() => {
    if (!mapLoaded || !map.current || locations.length === 0) return;

    // Clean up existing markers and popups
    cleanupMarkers();

    // Add new markers
    locations.forEach((location: Location) => {
      // Create custom marker element
      const el = createCustomMarker(location);

      // Create popup content with actual location data
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="padding: 16px; min-width: 300px; min-height: 200px; background: white;">
          ${location.custom_icon_url ? `
            <div style="width: 100%; height: 200px; margin-bottom: 16px; border-radius: 8px; overflow: hidden;">
              <img 
                src="${location.custom_icon_url}" 
                alt="${location.title}" 
                style="width: 100%; height: 100%; object-fit: cover;"
              />
            </div>
          ` : ''}
          <h3 style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: #1a1a1a;">
            ${location.title}
          </h3>
          ${location.description ? `
            <p style="font-size: 14px; color: #666; margin-bottom: 12px; line-height: 1.5;">
              ${location.description}
            </p>
          ` : ''}
          <div style="font-size: 14px; color: #666;">
            ${location.address ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Address:</strong> ${location.address}
              </div>
            ` : ''}
            ${location.website ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Website:</strong> 
                <a href="${location.website}" target="_blank" rel="noopener noreferrer" 
                   style="color: #2563eb; text-decoration: none; hover: underline;">
                  Visit Website
                </a>
              </div>
            ` : ''}
            ${location.phone ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Phone:</strong> ${location.phone}
              </div>
            ` : ''}
          </div>
        </div>
      `;

      // Create popup with improved configuration
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        anchor: 'bottom',
        className: 'custom-popup',
        focusAfterOpen: false
      });

      // Create marker and explicitly attach popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude]);

      // Set popup content and attach to marker
      popup.setDOMContent(popupContent);
      marker.setPopup(popup);
      
      // Add to map
      if (map.current) {
        marker.addTo(map.current);
      }

      markers.current[location.id] = marker;
    });

    // Cleanup function
    return () => {
      cleanupMarkers();
    };
  }, [mapLoaded, locations]);

  if (error) {
    return (
      <div className="relative w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 w-full h-full"
        style={{ minHeight: '100vh' }}
      />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-lg font-semibold">Loading map...</div>
        </div>
      )}
    </div>
  );
} 