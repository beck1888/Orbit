'use client';

import { useState } from 'react';
import { Class, AssignmentDatabase } from '@/utils/database';
import ClassList from './ClassList';
import SettingsManagementPanel from './SettingsManagementPanel';

interface SidebarProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  db: AssignmentDatabase | null;
  currentClassId: number | null;
  onSelectClass: (classId: number) => void;
  onDeleteClass: (classId: number) => void;
}

export default function Sidebar({ 
  classes, 
  setClasses, 
  db, 
  currentClassId, 
  onSelectClass, 
  onDeleteClass 
}: SidebarProps) {
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-center h-full">
          <a href="" className="text-4xl font-bold mb-2 hover:underline">Orbit App</a>
        </div>
      </div>
      
      <ClassList
        classes={classes}
        currentClassId={currentClassId}
        onSelectClass={onSelectClass}
      />
      
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