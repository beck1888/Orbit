'use client';

import { Class } from '@/utils/database';
import PopUp from './PopUp';
import { useEffect, useState } from 'react';
import { AssignmentDatabase, Assignment } from '@/utils/database';

interface DataPanelProps {
  classes: Class[];
}

export default function DataPanel({ classes }: DataPanelProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [popUpState, setPopUpState] = useState<null | {
    type: 'upload' | 'delete',
    isOpen: boolean
  }>(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      const db = new AssignmentDatabase();
      await db.init();
      // Get all assignments from the assignments store
      const allAssignments = await db.getAllIncompleteAssignments();
      const completedAssignments = await db.getAllCompletedAssignments();
      setAssignments([...allAssignments, ...completedAssignments]);
    };
    fetchAssignments();
  }, []);

  const dbItems = assignments.length;
  const dbSizeBytes = assignments.length > 0 ? JSON.stringify(assignments).length : 0;
  let dbSizeDisplay = '0.00 MB';
  if (dbSizeBytes < 10240) {
    dbSizeDisplay = (dbSizeBytes / 1024).toFixed(2) + ' KB';
  } else {
    dbSizeDisplay = (dbSizeBytes / 1024 / 1024).toFixed(2) + ' MB';
  }

  return (
    <>
      <div className="bg-white border-b border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-800">Data & Storage</h2>
        <p className="text-gray-600 mt-1">Manage your data and storage settings</p>
      </div>
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Storage Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Storage Information</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Classes: {classes.length}</p>
              <p className="text-gray-600">DB Items: {dbItems}</p>
              <p className="text-gray-600">Database size: {dbSizeDisplay}</p>
            </div>
          </div>
          {/* Data Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Data Actions</h3>
            <div className="space-y-2">
              <button
                className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm"
              >
                Download Data
              </button>
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                onClick={() => setPopUpState({ type: 'upload', isOpen: true })}
              >
                Upload Data
              </button>
              <button
                className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm"
                onClick={() => setPopUpState({ type: 'delete', isOpen: true })}
              >
                Delete Data
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* PopUp for Upload and Delete actions */}
      {popUpState?.isOpen && (
        <PopUp
          isOpen={popUpState.isOpen}
          title={popUpState.type === 'upload' ? 'Upload Data' : 'Delete All Data'}
          message={popUpState.type === 'upload'
            ? 'Warning: Uploading will remove all current data and overwrite it with the uploaded file. This action cannot be undone.'
            : 'Warning: All data will be deleted. Please download your data first if you want to keep a backup. This action cannot be undone.'}
          dismissButtonLabel={popUpState.type === 'upload' ? 'Cancel' : 'Cancel'}
          primaryButtonLabel={popUpState.type === 'upload' ? 'Upload & Overwrite' : 'Delete All'}
          onButtonClick={(btn) => {
            if (btn === 'primary') {
              if (popUpState.type === 'upload') {
                // TODO: Implement upload logic here
                alert('Upload logic not implemented.');
              } else if (popUpState.type === 'delete') {
                // TODO: Implement delete logic here
                alert('Delete logic not implemented.');
              }
            }
            setPopUpState(null);
          }}
        />
      )}
    </>
  );
}