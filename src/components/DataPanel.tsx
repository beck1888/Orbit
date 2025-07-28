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
                onClick={async () => {
                  const db = new AssignmentDatabase();
                  await db.init();
                  // Get all classes and assignments
                  const allClasses = await db.getAllClasses();
                  const allAssignments = await db.getAllIncompleteAssignments();
                  const completedAssignments = await db.getAllCompletedAssignments();
                  // Combine all assignments
                  const allAssignmentsCombined = [...allAssignments, ...completedAssignments];
                  // Prepare export object
                  const exportData = {
                    classes: allClasses,
                    assignments: allAssignmentsCombined
                  };
                  // Create blob and trigger download
                  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `orbit-assignment-data-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                }}
              >
                Download Data
              </button>
              <button
                className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm"
                onClick={() => setPopUpState({ type: 'upload', isOpen: true })}
              >
                Upload Data
              </button>
              {/* Hidden file input for upload */}
              <input
                type="file"
                id="orbit-upload-input"
                accept="application/json"
                style={{ display: 'none' }}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    if (!data.classes || !data.assignments) throw new Error('Invalid file format');
                    const db = new AssignmentDatabase();
                    await db.init();
                    // Delete all classes and assignments
                    const existingClasses = await db.getAllClasses();
                    for (const cls of existingClasses) {
                      if (cls.id !== undefined) await db.deleteClass(cls.id);
                    }
                    // Add new classes
                    for (const cls of data.classes) {
                      await db.addClass(cls.name, cls.emoji);
                    }
                    // Add new assignments
                    for (const assignment of data.assignments) {
                      // Remove completed, completedAt for addAssignment
                      const { completed, completedAt, ...rest } = assignment;
                      await db.addAssignment(rest);
                      // If assignment was completed, update it after adding
                      if (completed) {
                        // Find the last assignment added (not ideal, but works for now)
                        const allAssignments = await db.getAllIncompleteAssignments();
                        const last = allAssignments[allAssignments.length - 1];
                        if (last && last.id !== undefined) {
                          await db.updateAssignment(last.id, { completed: true, completedAt });
                        }
                      }
                    }
                    // Refresh assignments state
                    const allAssignments = await db.getAllIncompleteAssignments();
                    const completedAssignments = await db.getAllCompletedAssignments();
                    setAssignments([...allAssignments, ...completedAssignments]);
                    alert('Data uploaded and replaced successfully.');
                  } catch (err) {
                    alert('Failed to upload data: ' + (err instanceof Error ? err.message : String(err)));
                  }
                  // Reset file input value so it can be reused
                  (e.target as HTMLInputElement).value = '';
                }}
              />
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
                // Trigger file input for upload
                const input = document.getElementById('orbit-upload-input') as HTMLInputElement;
                if (input) input.click();
              } else if (popUpState.type === 'delete') {
                // Delete all classes and assignments
                (async () => {
                  try {
                    const db = new AssignmentDatabase();
                    await db.init();
                    const existingClasses = await db.getAllClasses();
                    for (const cls of existingClasses) {
                      if (cls.id !== undefined) await db.deleteClass(cls.id);
                    }
                    setAssignments([]);
                    alert('All data deleted successfully.');
                  } catch (err) {
                    alert('Failed to delete data: ' + (err instanceof Error ? err.message : String(err)));
                  }
                })();
              }
            }
            setPopUpState(null);
          }}
        />
      )}
    </>
  );
}