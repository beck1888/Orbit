'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Class } from '@/utils/database';
import ClassManagementPanel from '@/components/ClassManagementPanel';

export default function MyClassesPage() {
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
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

  const loadClasses = async () => {
    if (!db) return;
    
    try {
      const classList = await db.getAllClasses();
      setClasses(classList);
    } catch (error) {
      console.error('Failed to load classes:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading classes...</div>
      </div>
    );
  }

  return (
    <div>
      <ClassManagementPanel
        db={db}
        classes={classes}
        onClassesChange={loadClasses}
      />
    </div>
  );
}