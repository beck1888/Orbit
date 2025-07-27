'use client';

import { useState } from 'react';
import { Class, AssignmentDatabase } from '@/utils/database';
import ClassItem from './ClassItem';
import SettingsManagementPanel from './SettingsManagementPanel';

interface ClassListProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  db: AssignmentDatabase | null;
  currentClassId: number | null;
  onSelectClass: (classId: number, className: string) => void;
  onDeleteClass: (classId: number, className: string) => void;
}

export default function ClassList({ classes, setClasses, db, currentClassId, onSelectClass, onDeleteClass }: ClassListProps) {
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-center h-full">
          <a href="" className="text-4xl font-bold mb-2 hover:underline">Orbit App</a>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {classes.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            <p>No classes yet. Add your first class to get started!</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <ClassItem
              key={classItem.id}
              classItem={classItem}
              isActive={currentClassId === classItem.id}
              onSelect={() => onSelectClass(classItem.id!, classItem.name)}
            />
          ))
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button
          className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          onClick={() => setIsManagePanelOpen(true)}
        >
          Manage
        </button>
      </div>

      <SettingsManagementPanel
        isOpen={isManagePanelOpen}
        onClose={() => setIsManagePanelOpen(false)}
        classes={classes}
        setClasses={setClasses}
        db={db}
        onDeleteClass={onDeleteClass}
      />
    </div>
  );
}
