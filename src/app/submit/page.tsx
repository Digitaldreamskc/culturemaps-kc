'use client';

import SubmitLocationForm from '@/components/SubmitLocationForm';

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Submit a Cultural Location</h1>
          <p className="mt-2 text-gray-600">
            Help us grow the map by adding new cultural sites in Kansas City
          </p>
        </div>
        <SubmitLocationForm />
      </div>
    </main>
  );
} 