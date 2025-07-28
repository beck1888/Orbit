'use client';

import { useState } from 'react';
import PopUp from './PopUp';
import { Class, AssignmentDatabase } from '@/utils/database';
import Modal from './Modal';
import AddClassForm from './AddClassForm';

interface ClassManagementPanelProps {
  classes: Class[];
  setClasses: React.Dispatch<React.SetStateAction<Class[]>>;
  db: AssignmentDatabase | null;
  // Remove onDeleteClass from props, will handle locally
}

export default function ClassManagementPanel({ 
  classes, 
  setClasses, 
  db
}: Omit<ClassManagementPanelProps, 'onDeleteClass'>) {
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  
    // State for delete confirmation popup
    const [deletePopUpState, setDeletePopUpState] = useState<{ isOpen: boolean; classId?: number; className?: string }>({ isOpen: false });

  const handleAddClass = async (className: string, classEmoji: string) => {
    if (!db) return;

    try {
      await db.addClass(className, classEmoji);
      const updatedClasses = await db.getAllClasses();
      setClasses(updatedClasses);
      setIsAddClassModalOpen(false);
    } catch (error) {
      console.error('Failed to add class:', error);
      // Optionally, you can show a custom error PopUp here if desired
    }
  };

  return (
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
                        onClick={() => setDeletePopUpState({ isOpen: true, classId: classItem.id, className: classItem.name })}
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
      
        {/* PopUp for Delete Class action */}
        {deletePopUpState.isOpen && (
          <PopUp
            isOpen={deletePopUpState.isOpen}
            title={"Delete Class"}
            message={`Are you sure you want to delete the class "${deletePopUpState.className}"? This action cannot be undone.`}
            dismissButtonLabel="Cancel"
            primaryButtonLabel="Delete"
            onButtonClick={async (btn: string) => {
              if (btn === 'primary' && deletePopUpState.classId !== undefined && db) {
                try {
                  await db.deleteClass(deletePopUpState.classId);
                  const updatedClasses = await db.getAllClasses();
                  setClasses(updatedClasses);
                } catch (error) {
                  console.error('Failed to delete class:', error);
                  // Optionally show a custom error popup here
                }
              }
              setDeletePopUpState({ isOpen: false });
            }}
          />
        )}
    </>
  );
}