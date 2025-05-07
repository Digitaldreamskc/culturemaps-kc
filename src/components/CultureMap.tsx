'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from '@/lib/supabase';
import { Location, LocationCategory } from '@/types/database';
import { useSearchParams } from 'next/navigation';

// Kansas City coordinates
const KC_CENTER: [number, number] = [-94.5786, 39.0997];
const INITIAL_ZOOM = 12;

// Initialize Mapbox
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

console.log('Mapbox Token:', mapboxToken ? 'Token exists' : 'Token missing');

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
  onLocationSelect?: (location: Location) => void;
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

export default function CultureMap({ onLocationSelect }: CultureMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const popupsRef = useRef<{ [key: string]: mapboxgl.Popup }>({});
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as LocationCategory | null;

  // Fetch locations from Supabase
  useEffect(() => {
    async function fetchLocations() {
      try {
        console.log('Fetching locations...');
        setLoading(true);
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
        console.log('Locations fetched:', data?.length || 0);
        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [category]);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    console.log('Initializing map...');
    try {
      mapRef.current = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: KC_CENTER,
        zoom: INITIAL_ZOOM
      });

      mapRef.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });

      mapRef.current.on('error', (e) => {
        console.error('Map error:', e);
        setError('Failed to load map');
      });
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Cleanup function for markers and popups
  const cleanupMarkers = () => {
    // First, remove all markers
    Object.values(markersRef.current).forEach(marker => {
      marker.remove();
    });
    markersRef.current = {};

    // Then, cleanup all popups
    Object.values(popupsRef.current).forEach(popup => {
      popup.remove();
    });
    popupsRef.current = {};
  };

  // Add markers when map is loaded and locations are available
  useEffect(() => {
    if (!mapRef.current || !mapLoaded || loading || !Array.isArray(locations) || locations.length === 0) {
      console.log('Skipping marker creation:', {
        mapExists: !!mapRef.current,
        mapLoaded,
        loading,
        locationsLength: locations?.length
      });
      return;
    }

    console.log('Adding markers...');
    // Clean up existing markers and popups
    cleanupMarkers();

    // Add new markers
    locations.forEach((location: Location) => {
      if (!location.latitude || !location.longitude) {
        console.log('Skipping location due to missing coordinates:', location.title);
        return;
      }

      try {
        const marker = new mapboxgl.Marker()
          .setLngLat([location.longitude, location.latitude])
          .addTo(mapRef.current!);

        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '300px',
          anchor: 'bottom',
          className: 'custom-popup',
          focusAfterOpen: false
        }).setHTML(`
          <div style="padding: 16px; min-width: 300px; min-height: 200px; background: white;">
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
        `);

        marker.setPopup(popup);
        markersRef.current[location.id] = marker;
        popupsRef.current[location.id] = popup;

        marker.getElement().addEventListener('click', () => {
          if (onLocationSelect) {
            onLocationSelect(location);
          }
        });
      } catch (err) {
        console.error('Error adding marker for location:', location.title, err);
      }
    });
    console.log('Markers added successfully');
  }, [locations, loading, mapLoaded, onLocationSelect]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="text-red-600 text-lg font-semibold mb-2">Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (loading || !mapLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {loading ? 'Loading locations...' : 'Loading map...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={mapContainerRef} className="w-full h-screen" />
  );
} 