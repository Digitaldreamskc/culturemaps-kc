'use client';

import { useEffect, useRef } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Location } from '@/types/database';
import LocationInfo from './LocationInfo';

interface LocationPopupProps {
  location: Location;
  popup: mapboxgl.Popup;
}

export default function LocationPopup({ location, popup }: LocationPopupProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<Root | null>(null);

  useEffect(() => {
    console.log('LocationPopup useEffect triggered with location:', {
      id: location.id,
      title: location.title,
      hasData: !!location
    });

    if (containerRef.current) {
      console.log('Container ref exists, creating root');
      
      // Create root if it doesn't exist
      if (!rootRef.current) {
        rootRef.current = createRoot(containerRef.current);
        console.log('New root created');
      }
      
      // Render the component with explicit styling
      rootRef.current.render(
        <div className="w-full min-h-[200px] bg-white">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Test Title 2</h3>
            <p className="text-sm text-gray-600 mb-4">Test Description 2</p>
            <LocationInfo location={location} />
          </div>
        </div>
      );
      console.log('Content rendered to root');
    } else {
      console.warn('Container ref is null');
    }

    // Cleanup function
    return () => {
      if (rootRef.current) {
        console.log('Cleaning up root');
        setTimeout(() => {
          try {
            rootRef.current?.unmount();
            rootRef.current = null;
            console.log('Root cleanup complete');
          } catch (err) {
            console.warn('Error during root cleanup:', err);
          }
        }, 0);
      }
    };
  }, [location]);

  return (
    <div 
      ref={containerRef} 
      className="w-full min-h-[200px] bg-white"
      style={{ minWidth: '300px' }}
    />
  );
} 