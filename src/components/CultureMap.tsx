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

export default function CultureMap({ locations, onLocationSelect }: CultureMapProps) {
  console.log('CultureMap component rendering');
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
        locations(data || []);
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
    if (!mapLoaded || !map.current || locations.length === 0) {
      console.log('Skipping marker creation:', { mapLoaded, hasMap: !!map.current, locationCount: locations.length });
      return;
    }

    console.log('Adding markers...');
    // Clean up existing markers and popups
    cleanupMarkers();

    // Add new markers
    locations.forEach((location) => {
      console.log('Creating marker for location:', location.title);
      
      // Create custom marker element
      const el = createCustomMarker(location);
      console.log('Marker element created:', el);

      // Create popup content with actual location data
      const popupContent = document.createElement('div');
      popupContent.innerHTML = `
        <div style="padding: 16px; min-width: 300px; min-height: 200px; background: white;">
          ${location.photo_url ? `
            <div style="width: 100%; height: 200px; margin-bottom: 16px; border-radius: 8px; overflow: hidden;">
              <img 
                src="${location.photo_url}" 
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
            ${location.hours ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Hours:</strong> ${location.hours}
              </div>
            ` : ''}
            ${location.phone ? `
              <div style="margin-bottom: 8px;">
                <strong style="color: #333;">Phone:</strong> ${location.phone}
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
            ${location.additional_info ? `
              <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #eee;">
                <strong style="color: #333;">Additional Info:</strong>
                <p style="margin-top: 4px; color: #666;">${location.additional_info}</p>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      console.log('Popup content created:', {
        hasContent: !!popupContent.innerHTML,
        contentLength: popupContent.innerHTML.length,
        content: popupContent.innerHTML
      });

      // Create popup with improved configuration
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '300px',
        anchor: 'bottom',
        className: 'custom-popup',
        focusAfterOpen: false,
        autoPan: true,
        autoPanSpeed: 10,
        autoPanPadding: { top: 50, bottom: 50, left: 50, right: 50 }
      });

      // Create marker and explicitly attach popup
      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.longitude, location.latitude]);

      // Set popup content and attach to marker
      popup.setDOMContent(popupContent);
      marker.setPopup(popup);
      
      // Add to map
      marker.addTo(map.current);

      // Add click handler to verify popup content
      marker.getElement().addEventListener('click', () => {
        console.log('Marker clicked, popup content:', {
          hasContent: !!popupContent.innerHTML,
          contentLength: popupContent.innerHTML.length,
          content: popupContent.innerHTML
        });
      });

      markers.current[location.id] = marker;
    });
    console.log('All markers added:', Object.keys(markers.current).length);

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