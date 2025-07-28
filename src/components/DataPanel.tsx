'use client';

import { Class } from '@/utils/database';
import { useEffect, useState } from 'react';
import { AssignmentDatabase, Assignment } from '@/utils/database';

interface DataPanelProps {
  classes: Class[];
}

export default function DataPanel({ classes }: DataPanelProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);

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
  const dbSizeMB = assignments.length > 0 ? (JSON.stringify(assignments).length / 1024 / 1024).toFixed(2) : '0.00';

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
              <p className="text-gray-600">Database size: {dbSizeMB} MB</p>
            </div>
          </div>

          {/* Data Actions */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Data Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition-colors text-sm">
                Clear All Data
              </button>
              <button className="w-full bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors text-sm">
                Reset Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}