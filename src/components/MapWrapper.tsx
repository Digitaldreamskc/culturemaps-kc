'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the CultureMap component
const CultureMap = dynamic(() => import('@/components/CultureMap'), {
  loading: () => {
    console.log('MapWrapper: Loading state');
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-lg font-semibold">Loading map...</div>
      </div>
    );
  },
});

export default function MapWrapper() {
  console.log('MapWrapper: Component rendering');
  
  return (
    <div className="w-full h-screen">
      <Suspense fallback={
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="text-lg font-semibold">Loading map...</div>
        </div>
      }>
        <CultureMap />
      </Suspense>
    </div>
  );
} 