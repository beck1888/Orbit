'use client';

import { Class } from '@/utils/database';

interface DataPanelProps {
  classes: Class[];
}

export default function DataPanel({ classes }: DataPanelProps) {
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
              <p className="text-gray-600">Total assignments: Coming soon</p>
              <p className="text-gray-600">Database size: Coming soon</p>
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