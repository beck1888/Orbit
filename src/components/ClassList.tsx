'use client';

import { Class, AssignmentDatabase } from '@/utils/database';
import ClassItem from './ClassItem';
import Modal from './Modal';
import AddClassForm from './AddClassForm';

interface ClassListProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  db: AssignmentDatabase | null;
  currentClassId: number | null;
  onSelectClass: (classId: number, className: string) => void;
  onDeleteClass: (classId: number, className: string) => void;
}

import { useState } from 'react';

export default function ClassList({ classes, setClasses, db, currentClassId, onSelectClass, onDeleteClass }: ClassListProps) {
  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);
  const [selectedManageSection, setSelectedManageSection] = useState('class-management');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);

  const handleAddClass = async (className: string, classEmoji: string) => {
    if (!db) return;

    try {
      await db.addClass(className, classEmoji);
      const updatedClasses = await db.getAllClasses();
      setClasses(updatedClasses);
      setIsAddClassModalOpen(false);
    } catch (error) {
      console.error('Failed to add class:', error);
      alert('Failed to add class. Please try again.');
    }
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-5 border-b border-gray-200">
        {/* Logo */}
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

      {/* Settings/Manage Panel Modal */}
      {isManagePanelOpen && (
        <div className="fixed inset-0 z-50 flex bg-black bg-opacity-40">
          <div className="bg-gray-50 w-full h-full flex">
            {/* Sidebar for manage panel */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
              <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Manage</h1>
                <button
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                  onClick={() => setIsManagePanelOpen(false)}
                  aria-label="Close"
                >
                  &times;
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-3">
                  <div className="mb-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedManageSection === 'class-management' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedManageSection('class-management')}
                    >
                      Class Management
                    </button>
                  </div>
                  <div className="mb-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedManageSection === 'preferences' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedManageSection('preferences')}
                    >
                      Preferences
                    </button>
                  </div>
                  <div className="mb-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedManageSection === 'data-storage' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedManageSection('data-storage')}
                    >
                      Data & Storage
                    </button>
                  </div>
                  <div className="mb-2">
                    <button 
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedManageSection === 'import-export' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                      onClick={() => setSelectedManageSection('import-export')}
                    >
                      Import/Export
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {selectedManageSection === 'class-management' && (
                <>
                  <div className="bg-white border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800">Class Management</h2>
                    <p className="text-gray-600 mt-1">Add, edit, or remove classes from your tracker</p>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Add Class Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Add New Class</h3>
                        <button
                          className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                          onClick={() => setIsAddClassModalOpen(true)}
                        >
                          + Add Class
                        </button>
                      </div>

                      {/* Existing Classes Section */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Existing Classes</h3>
                        <div className="space-y-2">
                          {classes.length === 0 ? (
                            <p className="text-gray-500 text-sm">No classes added yet</p>
                          ) : (
                            classes.map((classItem) => (
                              <div key={classItem.id} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                                <span className="text-gray-700 flex items-center">
                                  <span className="mr-2">{classItem.emoji}</span>
                                  {classItem.name}
                                </span>
                                <button
                                  className="text-red-500 hover:text-red-700 text-sm"
                                  onClick={() => onDeleteClass(classItem.id!, classItem.name)}
                                >
                                  Delete
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedManageSection === 'preferences' && (
                <>
                  <div className="bg-white border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
                    <p className="text-gray-600 mt-1">Customize your experience</p>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Display Settings */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Display Settings</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-gray-700">Show completed assignments</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-gray-700">Dark mode</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-gray-700">Compact view</span>
                          </label>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Notifications</h3>
                        <div className="space-y-3">
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-gray-700">Assignment due reminders</span>
                          </label>
                          <label className="flex items-center">
                            <input type="checkbox" className="mr-2" />
                            <span className="text-gray-700">Daily summary</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {selectedManageSection === 'data-storage' && (
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
              )}

              {selectedManageSection === 'import-export' && (
                <>
                  <div className="bg-white border-b border-gray-200 p-6">
                    <h2 className="text-xl font-semibold text-gray-800">Import/Export</h2>
                    <p className="text-gray-600 mt-1">Backup and restore your data</p>
                  </div>
                  
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Export Options */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Export Data</h3>
                        <div className="space-y-2">
                          <button className="w-full bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors text-sm">
                            Export as JSON
                          </button>
                          <button className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors text-sm">
                            Export as CSV
                          </button>
                        </div>
                      </div>

                      {/* Import Options */}
                      <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h3 className="text-lg font-medium text-gray-800 mb-4">Import Data</h3>
                        <div className="space-y-2">
                          <button className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors text-sm">
                            Import from JSON
                          </button>
                          <button className="w-full bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors text-sm">
                            Import from CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {isAddClassModalOpen && (
        <Modal
          isOpen={isAddClassModalOpen}
          onClose={() => setIsAddClassModalOpen(false)}
          title="Add New Class"
        >
          <AddClassForm
            onSubmit={(className, classEmoji) => {
              handleAddClass(className, classEmoji);
              setIsAddClassModalOpen(false);
            }}
            onCancel={() => setIsAddClassModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
