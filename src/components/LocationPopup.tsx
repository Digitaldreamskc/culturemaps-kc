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
    if (containerRef.current) {
      // Create root if it doesn't exist
      if (!rootRef.current) {
        rootRef.current = createRoot(containerRef.current);
      }
      
      // Render the component
      rootRef.current.render(<LocationInfo location={location} />);
    }

    // Cleanup function
    return () => {
      if (rootRef.current) {
        // Use setTimeout to ensure we're not unmounting during render
        setTimeout(() => {
          rootRef.current?.unmount();
          rootRef.current = null;
        }, 0);
      }
    };
  }, [location]);

  return <div ref={containerRef} />;
} 