'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Class } from '@/utils/database';
import DataPanel from '@/components/DataPanel';

export default function DataPage() {
  const [, setDb] = useState<AssignmentDatabase | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
        const classList = await database.getAllClasses();
        setClasses(classList);
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
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <DataPanel classes={classes} />
    </div>
  );
}