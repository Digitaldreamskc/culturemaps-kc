'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/lib/supabase';
import { Location } from '@/types/database';

// Kansas City coordinates
const KC_CENTER = [-94.5786, 39.0997];
const INITIAL_ZOOM = 12;

// Initialize Mapbox
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
if (!mapboxToken) {
  console.error('Mapbox token is missing. Please add NEXT_PUBLIC_MAPBOX_TOKEN to your .env.local file');
}
mapboxgl.accessToken = mapboxToken || '';

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  // Fetch locations from Supabase
  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data: locations, error } = await supabase
          .from('locations')
          .select('*');

        if (error) throw error;

        // Add markers for each location
        locations?.forEach((location: Location) => {
          if (map.current) {
            // Create popup
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <h3 class="font-bold text-lg">${location.title}</h3>
              <p class="text-sm text-gray-600">${location.category}</p>
              ${location.description ? `<p class="mt-2">${location.description}</p>` : ''}
            `);

            // Create marker
            const marker = new mapboxgl.Marker()
              .setLngLat([location.longitude, location.latitude])
              .setPopup(popup)
              .addTo(map.current);

            markersRef.current.push(marker);
          }
        });
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      }
    }

    if (mapLoaded) {
      fetchLocations();
    }
  }, [mapLoaded]);

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapboxToken) {
      setError('Mapbox token is missing');
      return;
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: KC_CENTER,
        zoom: INITIAL_ZOOM
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Handle map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });

      // Handle map errors
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        setError('Failed to load map');
      });

      // Cleanup
      return () => {
        /* eslint-disable react-hooks/exhaustive-deps */
        if (markersRef.current) {
          markersRef.current.forEach(marker => marker.remove());
        }
        /* eslint-enable react-hooks/exhaustive-deps */
        map.current?.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to initialize map');
    }
  }, []);

  if (error) {
    return (
      <div className="relative w-full h-[calc(100vh-4rem)] flex items-center justify-center bg-gray-100">
        <div className="text-red-600 font-semibold">{error}</div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-4rem)]">
      <div ref={mapContainer} className="absolute inset-0" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-lg font-semibold">Loading map...</div>
        </div>
      )}
    </div>
  );
} 