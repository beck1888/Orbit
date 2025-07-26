'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Class, Assignment } from '@/utils/database';
import Modal from '@/components/Modal';
import ClassItem from '@/components/ClassItem';
import AssignmentCard from '@/components/AssignmentCard';
import AddClassForm from '@/components/AddClassForm';
import AddAssignmentForm from '@/components/AddAssignmentForm';
import EditAssignmentForm from '@/components/EditAssignmentForm';

export default function AssignmentTracker() {
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentClassId, setCurrentClassId] = useState<number | null>(null);
  const [currentClassName, setCurrentClassName] = useState('');
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
        // Load classes directly here to avoid dependency issues
        try {
          const classList = await database.getAllClasses();
          setClasses(classList);
        } catch (error) {
          console.error('Failed to load classes:', error);
        }
      } catch (error) {
        console.error('Failed to initialize database:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, []);

  useEffect(() => {
    const loadAssignmentsForClass = async () => {
      if (!db || !currentClassId) return;

      try {
        const assignmentList = await db.getAssignmentsByClass(currentClassId);
        setAssignments(assignmentList);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      }
    };

    loadAssignmentsForClass();
  }, [currentClassId, db]);

  useEffect(() => {
    const loadAssignmentsForClass = async () => {
      if (!db || !currentClassId) return;

      try {
        const assignmentList = await db.getAssignmentsByClass(currentClassId);
        setAssignments(assignmentList);
      } catch (error) {
        console.error('Failed to load assignments:', error);
      }
    };

    loadAssignmentsForClass();
  }, [currentClassId, db]);

  const handleAddClass = async (className: string) => {
    if (!db) return;

    try {
      await db.addClass(className);
      // Reload classes directly
      const classList = await db.getAllClasses();
      setClasses(classList);
      setIsAddClassModalOpen(false);
    } catch (error) {
      console.error('Failed to add class:', error);
      alert('Failed to add class. Please try again.');
    }
  };

  const handleDeleteClass = async (classId: number, className: string) => {
    if (!db) return;

    if (confirm(`Are you sure you want to delete "${className}" and all its assignments?`)) {
      try {
        await db.deleteClass(classId);
        // Reload classes directly
        const classList = await db.getAllClasses();
        setClasses(classList);
        
        if (currentClassId === classId) {
          setCurrentClassId(null);
          setCurrentClassName('');
          setAssignments([]);
        }
      } catch (error) {
        console.error('Failed to delete class:', error);
        alert('Failed to delete class. Please try again.');
      }
    }
  };

  const handleSelectClass = (classId: number, className: string) => {
    setCurrentClassId(classId);
    setCurrentClassName(className);
  };

  const handleAddAssignment = async (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => {
    if (!db || !currentClassId) return;

    try {
      await db.addAssignment({
        classId: currentClassId,
        ...assignmentData
      });
      // Reload assignments directly
      const assignmentList = await db.getAssignmentsByClass(currentClassId);
      setAssignments(assignmentList);
      setIsAddAssignmentModalOpen(false);
    } catch (error) {
      console.error('Failed to add assignment:', error);
      alert('Failed to add assignment. Please try again.');
    }
  };

  const handleToggleAssignmentCompletion = async (assignmentId: number, completed: boolean) => {
    if (!db || !currentClassId) return;

    try {
      await db.updateAssignment(assignmentId, { completed });
      // Reload assignments directly
      const assignmentList = await db.getAssignmentsByClass(currentClassId);
      setAssignments(assignmentList);
    } catch (error) {
      console.error('Failed to update assignment:', error);
      alert('Failed to update assignment. Please try again.');
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!db || !currentClassId) return;

    if (confirm('Are you sure you want to delete this assignment?')) {
      try {
        await db.deleteAssignment(assignmentId);
        // Reload assignments directly
        const assignmentList = await db.getAssignmentsByClass(currentClassId);
        setAssignments(assignmentList);
      } catch (error) {
        console.error('Failed to delete assignment:', error);
        alert('Failed to delete assignment. Please try again.');
      }
    }
  };

  const handleEditAssignment = (assignment: Assignment) => {
    setEditingAssignment(assignment);
    setIsEditAssignmentModalOpen(true);
  };

  const handleUpdateAssignment = async (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => {
    if (!db || !currentClassId || !editingAssignment) return;

    try {
      await db.updateAssignment(editingAssignment.id!, assignmentData);
      // Reload assignments directly
      const assignmentList = await db.getAssignmentsByClass(currentClassId);
      setAssignments(assignmentList);
      setIsEditAssignmentModalOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Failed to update assignment:', error);
      alert('Failed to update assignment. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading Assignment Tracker...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-2xl font-semibold mb-4">Classes</h1>
          <button
            onClick={() => setIsAddClassModalOpen(true)}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            + Add Class
          </button>
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
                onSelect={() => handleSelectClass(classItem.id!, classItem.name)}
                onDelete={() => handleDeleteClass(classItem.id!, classItem.name)}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="p-8 border-b border-gray-200 bg-white flex justify-between items-center">
          <h2 className="text-3xl font-semibold">
            {currentClassName || 'Select a class to view assignments'}
          </h2>
          {currentClassId && (
            <button
              onClick={() => setIsAddAssignmentModalOpen(true)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              + Add Assignment
            </button>
          )}
        </div>

        <div className="flex-1 p-8 overflow-y-auto">
          {!currentClassId ? (
            <div className="text-center mt-24">
              <p className="text-lg text-gray-500">
                Select a class from the sidebar to view assignments, or add a new class to get started.
              </p>
            </div>
          ) : assignments.length === 0 ? (
            <div className="text-center mt-24">
              <p className="text-lg text-gray-500 mb-5">
                No assignments yet for {currentClassName}.
              </p>
              <button
                onClick={() => setIsAddAssignmentModalOpen(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                Add Your First Assignment
              </button>
            </div>
          ) : (
            <div className="max-w-4xl">
              {assignments.map((assignment) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  onToggleComplete={handleToggleAssignmentCompletion}
                  onDelete={handleDeleteAssignment}
                  onEdit={handleEditAssignment}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isAddClassModalOpen}
        onClose={() => setIsAddClassModalOpen(false)}
        title="Add New Class"
      >
        <AddClassForm
          onSubmit={handleAddClass}
          onCancel={() => setIsAddClassModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => setIsAddAssignmentModalOpen(false)}
        title="Add New Assignment"
      >
        <AddAssignmentForm
          onSubmit={handleAddAssignment}
          onCancel={() => setIsAddAssignmentModalOpen(false)}
        />
      </Modal>

      <Modal
        isOpen={isEditAssignmentModalOpen}
        onClose={() => {
          setIsEditAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        title="Edit Assignment"
      >
        {editingAssignment && (
          <EditAssignmentForm
            assignment={editingAssignment}
            onSubmit={handleUpdateAssignment}
            onCancel={() => {
              setIsEditAssignmentModalOpen(false);
              setEditingAssignment(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
