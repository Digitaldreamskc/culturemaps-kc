'use client';

import { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { supabase } from '@/lib/supabase';
import { Location, LocationCategory } from '@/types/database';
import { useSearchParams } from 'next/navigation';
import { CultureMap, LocationList, CategoryFilter } from '@/components';

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-red-600 text-xl font-semibold mb-2">Something went wrong</h2>
          <pre className="mt-2 text-sm text-gray-600">{error.message}</pre>
        </div>
      </div>
    </div>
  );
}

export default function HomeClient() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Optionally, you can sync selectedCategory with searchParams here
    // const categoryParam = searchParams.get('category') as LocationCategory | null;
    // setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true);
        let query = supabase
          .from('locations')
          .select('*')
          .order('created_at', { ascending: false });

        if (selectedCategory) {
          query = query.eq('category', selectedCategory);
        }

        const { data, error } = await query;

        if (error) throw error;
        setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError('Failed to load locations');
      } finally {
        setLoading(false);
      }
    }

    fetchLocations();
  }, [selectedCategory]);

  const handleLocationSelect = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCategoryChange = (category: LocationCategory | null) => {
    setSelectedCategory(category);
    setSelectedLocation(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-red-600 text-xl font-semibold mb-2">Error</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <CultureMap 
                  onLocationSelect={handleLocationSelect}
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <CategoryFilter
                  selectedCategory={selectedCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <LocationList
                  locations={locations}
                  selectedLocation={selectedLocation}
                  onLocationSelect={handleLocationSelect}
                  loading={loading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 