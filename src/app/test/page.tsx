'use client';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function TestPage() {
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*');

  if (error) {
    console.error('Error fetching locations:', error);
    return <div>Error loading locations</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations?.map((location) => (
          <div key={location.id} className="border p-4 rounded-lg">
            <h2 className="text-xl font-semibold">{location.name}</h2>
            <p className="text-gray-600">{location.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 