'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Class, AssignmentDatabase } from '@/utils/database';
import ClassManagementPanel from '@/components/ClassManagementPanel';

export default function MyClassesPage() {
  const router = useRouter();
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const initDb = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
        // Load classes
        const classList = await database.getAllClasses();
        setClasses(classList);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDb();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/')}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-800">My Classes</h1>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ClassManagementPanel
            classes={classes}
            onClassesChange={loadClasses}
            db={db}
          />
        </div>
      </div>
    </div>
  );
}