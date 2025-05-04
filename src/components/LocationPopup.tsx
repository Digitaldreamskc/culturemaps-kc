'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import LocationInfo from './LocationInfo';
import { Location } from '@/types/database';

interface LocationPopupProps {
  location: Location;
  container: HTMLElement;
}

export default function LocationPopup({ location, container }: LocationPopupProps) {
  const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

  useEffect(() => {
    if (!container) return;

    // Create a new root for this popup
    rootRef.current = createRoot(container);

    // Render the content
    rootRef.current.render(
      <div className="min-w-[300px] min-h-[200px]">
        <LocationInfo location={location} />
      </div>
    );

    // Cleanup
    return () => {
      if (rootRef.current) {
        rootRef.current.unmount();
      }
    };
  }, [container, location]);

  return null;
} 