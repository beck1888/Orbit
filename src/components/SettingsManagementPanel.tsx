'use client';

import { useState } from 'react';
import { Class, AssignmentDatabase } from '@/utils/database';
import SettingsManagerMenu from './SettingsManagerMenu';
import ClassManagementPanel from './ClassManagementPanel';
import PreferencesPanel from './PreferencesPanel';
import DataPanel from './DataPanel';
import HistoryView from './HistoryView';

interface SettingsManagementPanelProps {
  isOpen: boolean;
  onClose: () => void;
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  db: AssignmentDatabase | null;
  onDeleteClass: (classId: number, className: string) => void;
}

export default function SettingsManagementPanel({ 
  isOpen, 
  onClose, 
  classes, 
  setClasses, 
  db, 
  onDeleteClass 
}: SettingsManagementPanelProps) {
  const [selectedSection, setSelectedSection] = useState('history');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black bg-opacity-40">
      <div className="bg-gray-50 w-full h-full flex">
        <SettingsManagerMenu
          selectedSection={selectedSection}
          onSelectSection={setSelectedSection}
          onClose={onClose}
        />

        <div className="flex-1 flex flex-col">
          {selectedSection === 'class-management' && (
            <ClassManagementPanel
              classes={classes}
              setClasses={setClasses}
              db={db}
              onDeleteClass={onDeleteClass}
            />
          )}

          {selectedSection === 'preferences' && (
            <PreferencesPanel />
          )}

          {selectedSection === 'history' && (
            <>
              <div className="bg-white border-b border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800">Task History</h2>
                <p className="text-gray-600 mt-1">View and manage your completed assignments</p>
              </div>
              
              <div className="flex-1 p-6 overflow-y-auto">
                <HistoryView db={db} />
              </div>
            </>
          )}

          {selectedSection === 'data' && (
            <DataPanel classes={classes} />
          )}
        </div>
      </div>
    </div>
  );
}