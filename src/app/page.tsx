'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div role="alert" className="p-4 bg-red-50 text-red-900 rounded">
      <p>Something went wrong:</p>
      <pre className="mt-2 text-sm">{error.message}</pre>
    </div>
  );
}

export default function Home() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<div>Loading...</div>}>
        <MapLayout>
          <MapContainer />
        </MapLayout>
      </Suspense>
    </ErrorBoundary>
  );
}
