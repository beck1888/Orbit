'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AssignmentDatabase, Class } from '@/utils/database';
import ClassList from './ClassList';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [currentClassId, setCurrentClassId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
        const classList = await database.getAllClasses();
        setClasses(classList);
        
        // If we're on a class page, find the corresponding class ID
        if (pathname !== '/' && pathname !== '/manager' && !pathname.startsWith('/manager/')) {
          const classSlug = pathname.substring(1); // Remove leading slash
          const foundClass = classList.find(c => c.slug === classSlug);
          if (foundClass) {
            setCurrentClassId(foundClass.id!);
          }
        } else {
          setCurrentClassId(null);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, [pathname]);

  const handleSelectClass = (classId: number) => {
    const selectedClass = classes.find(c => c.id === classId);
    if (selectedClass?.slug) {
      setCurrentClassId(classId);
      router.push(`/${selectedClass.slug}`);
    }
  };

  const handleDeleteClass = async (classId: number) => {
    if (!db) return;
    try {
      await db.deleteClass(classId);
      const classList = await db.getAllClasses();
      setClasses(classList);
      
      // If we deleted the currently selected class, navigate to dashboard
      if (currentClassId === classId) {
        setCurrentClassId(null);
        router.push('/');
      }
    } catch (error) {
      console.error('Failed to delete class:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <ClassList 
        classes={classes} 
        setClasses={setClasses}
        db={db}
        currentClassId={currentClassId} 
        onSelectClass={handleSelectClass} 
        onDeleteClass={handleDeleteClass}
      />

      <div className="flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}