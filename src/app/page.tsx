'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase } from '@/utils/database';
import AppLayout from '@/components/AppLayout';
import Dashboard from '@/components/Dashboard';

export default function Home() {
  const [db, setDb] = useState<AssignmentDatabase | null>(null);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <AppLayout>
      <Dashboard db={db} />
    </AppLayout>
  );
}