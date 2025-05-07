import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import MapLayout with no SSR
const MapLayout = dynamic(() => import('@/components/MapLayout'), {
  ssr: false,
  loading: () => <div>Loading map layout...</div>
});

// Dynamically import MapContainer with no SSR
const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
  loading: () => <div>Loading map...</div>
});

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MapLayout>
        <MapContainer />
      </MapLayout>
    </Suspense>
  );
} 