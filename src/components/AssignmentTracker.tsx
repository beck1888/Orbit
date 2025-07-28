'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AssignmentDatabase } from '@/utils/database';
import Dashboard from './Dashboard';

export default function AssignmentTracker() {
  const router = useRouter();
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Orbit</h1>
          <button
            onClick={() => router.push('/manager/my-classes')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Manage Classes
          </button>
        </div>
        
        <Dashboard db={db} />
      </div>
    </div>
  );
}