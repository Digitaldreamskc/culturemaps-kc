'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase';
import { Location, LocationCategory } from '@/types/database';
import LocationPopup from './LocationPopup';
import { createRoot } from 'react-dom/client';
import { useSearchParams } from 'next/navigation';

// Kansas City coordinates
const KC_CENTER = [-94.5786, 39.0997];
const INITIAL_ZOOM = 12;

// Initialize Mapbox
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
console.log('Mapbox token available:', !!mapboxToken);

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

export default function CultureMap() {
  console.log('CultureMap component rendering');
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const popupRootsRef = useRef<Map<string, ReturnType<typeof createRoot>>>(new Map());
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const searchParams = useSearchParams();
  const category = searchParams.get('category') as LocationCategory | null;

  // Fetch locations from Supabase
  useEffect(() => {
    console.log('Fetching locations...');
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
        console.log('Locations fetched:', data?.length || 0);
        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      }
    }

    fetchLocations();
  }, [category]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    console.log('Initializing map...');
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: KC_CENTER,
      zoom: INITIAL_ZOOM
    });

    map.current.on('load', () => {
      console.log('Map loaded');
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
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // Then, cleanup all popup roots in the next tick
    setTimeout(() => {
      popupRootsRef.current.forEach((root, id) => {
        try {
          root.unmount();
        } catch (err) {
          console.warn(`Error unmounting popup root for ${id}:`, err);
        }
      });
      popupRootsRef.current.clear();
    }, 0);
  };

  // Add markers when map is loaded and locations are available
  useEffect(() => {
    if (!mapLoaded || !map.current || locations.length === 0) {
      console.log('Skipping marker creation:', { mapLoaded, hasMap: !!map.current, locationCount: locations.length });
      return;
    }

    console.log('Adding markers...');
    // Clean up existing markers and popups
    cleanupMarkers();

    // Add new markers
    locations.forEach((location) => {
      // Create custom marker element
      const el = createCustomMarker(location);

      // Create popup content
      const popupContent = document.createElement('div');
      const root = document.createElement('div');
      popupContent.appendChild(root);
      
      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setDOMContent(popupContent);

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude])
        .setPopup(popup)
        .addTo(map.current);

      // Add click handler
      el.addEventListener('click', () => {
        setSelectedLocation(location);
      });

      // Create and store popup root
      const popupRoot = createRoot(root);
      popupRootsRef.current.set(location.id, popupRoot);
      popupRoot.render(<LocationPopup location={location} popup={popup} />);

      // Add cleanup handler for popup
      popup.on('close', () => {
        const root = popupRootsRef.current.get(location.id);
        if (root) {
          // Use setTimeout to ensure we're not unmounting during render
          setTimeout(() => {
            try {
              root.unmount();
              popupRootsRef.current.delete(location.id);
            } catch (err) {
              console.warn(`Error cleaning up popup for ${location.id}:`, err);
            }
          }, 0);
        }
      });

      markersRef.current.push(marker);
    });
    console.log('Markers added:', markersRef.current.length);

    // Cleanup function
    return () => {
      cleanupMarkers();
    };
  }, [mapLoaded, locations]);

  if (error) {
    console.log('Rendering error state:', error);
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