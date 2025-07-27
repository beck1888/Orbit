
'use client';

import { Class } from '@/utils/database';
import ClassItem from './ClassItem';

interface ClassListProps {
  classes: Class[];
  currentClassId: number | null;
  onSelectClass: (classId: number, className: string) => void;
  onDeleteClass: (classId: number, className: string) => void;
}

import { useState } from 'react';

export default function ClassList({ classes, currentClassId, onSelectClass, onDeleteClass }: ClassListProps) {
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold mb-4">Classes</h1>
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
              onDelete={() => onDeleteClass(classItem.id!, classItem.name)}
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

      {/* Settings/Manage Panel Modal */}
      {isManagePanelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl"
              onClick={() => setIsManagePanelOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Manage</h2>
            <p className="text-gray-600 mb-2">Settings and class management will go here.</p>
            {/* Add settings and class management UI here */}
          </div>
        </div>
      )}
    </div>
  );
}
