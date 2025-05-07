import dynamic from 'next/dynamic';

// Dynamically import MapLayout with no SSR
const MapLayout = dynamic(() => import('@/components/MapLayout'), {
  ssr: false,
});

// Dynamically import MapContainer with no SSR
const MapContainer = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
});

export default function Home() {
  return (
    <MapLayout>
      <MapContainer />
    </MapLayout>
  );
}
