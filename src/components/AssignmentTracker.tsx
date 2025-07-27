'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Class, Assignment } from '@/utils/database';
import Modal from '@/components/Modal';
import AddAssignmentForm from '@/components/AddAssignmentForm';
import EditAssignmentForm from '@/components/EditAssignmentForm';
import ClassList from './ClassList';
import AssignmentList from './AssignmentList';
import Dashboard from './Dashboard';

export default function AssignmentTracker() {
  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [classes, setClasses] = useState<Class[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [currentClassId, setCurrentClassId] = useState<number | null>(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [addingAssignmentType, setAddingAssignmentType] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
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


  const handleDeleteClass = async (classId: number, className: string) => {
    if (!db) return;

    if (confirm(`Are you sure you want to delete "${className}" and all its assignments?`)) {
      try {
        await db.deleteClass(classId);
        const classList = await db.getAllClasses();
        setClasses(classList);
        
        if (currentClassId === classId) {
          setCurrentClassId(null);
          setAssignments([]);
        }
      } catch (error) {
        console.error('Failed to delete class:', error);
        alert('Failed to delete class. Please try again.');
      }
    }
  };

  const handleSelectClass = (classId: number) => {
    setCurrentClassId(classId);
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
      const assignmentList = await db.getAssignmentsByClass(currentClassId);
      setAssignments(assignmentList);
      setIsAddAssignmentModalOpen(false);
      setAddingAssignmentType('');
    } catch (error) {
      console.error('Failed to add assignment:', error);
      alert('Failed to add assignment. Please try again.');
    }
  };

  const handleOpenAddAssignmentModal = (type?: string) => {
    setAddingAssignmentType(type || '');
    setIsAddAssignmentModalOpen(true);
  };

  const handleToggleAssignmentCompletion = async (assignmentId: number, completed: boolean) => {
    if (!db || !currentClassId) return;

    try {
      await db.updateAssignment(assignmentId, { completed });
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
      <ClassList 
        classes={classes} 
        setClasses={setClasses}
        db={db}
        currentClassId={currentClassId} 
        onSelectClass={handleSelectClass} 
        onDeleteClass={handleDeleteClass} 
      />

      <div className="flex-1 flex flex-col">
        {!currentClassId ? (
          <Dashboard db={db} />
        ) : (
          <>
            <AssignmentList 
              assignments={assignments} 
              onToggleAssignmentCompletion={handleToggleAssignmentCompletion} 
              onDeleteAssignment={handleDeleteAssignment} 
              onEditAssignment={handleEditAssignment} 
              onAddAssignment={handleOpenAddAssignmentModal}
            />
          </>
        )}
      </div>


      <Modal
        isOpen={isAddAssignmentModalOpen}
        onClose={() => {
          setIsAddAssignmentModalOpen(false);
          setAddingAssignmentType('');
        }}
        title="Add New Assignment"
      >
        <AddAssignmentForm
          onSubmit={handleAddAssignment}
          onCancel={() => {
            setIsAddAssignmentModalOpen(false);
            setAddingAssignmentType('');
          }}
          defaultType={addingAssignmentType}
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