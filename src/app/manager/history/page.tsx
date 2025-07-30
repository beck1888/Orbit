'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase } from '@/utils/database';
import HistoryView from '@/components/HistoryView';

export default function HistoryPage() {
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
      <div className="flex items-center justify-center flex-1">
        <div className="text-lg text-gray-600">Loading history...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <HistoryView db={db} />
    </div>
  );
}
