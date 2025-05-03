'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testConnection() {
      try {
        // Test database access by trying to fetch profiles
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (profilesError) throw profilesError;

        setStatus('success');
      } catch (err) {
        setStatus('error');
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }

    testConnection();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
        
        {status === 'loading' && (
          <div className="text-blue-600">Testing connection...</div>
        )}
        
        {status === 'success' && (
          <div className="text-green-600">
            ✅ Connection successful! Database is ready to use.
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600">
            ❌ Connection failed: {error}
          </div>
        )}
      </div>
    </div>
  );
} 