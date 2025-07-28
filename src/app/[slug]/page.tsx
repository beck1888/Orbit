'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AssignmentDatabase, Class, Assignment } from '@/utils/database';
import AppLayout from '@/components/AppLayout';
import AssignmentList from '@/components/AssignmentList';
import Modal from '@/components/Modal';
import AssignmentForm from '@/components/AssignmentForm';
import PopUp from '@/components/PopUp';

export default function ClassPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [db, setDb] = useState<AssignmentDatabase | null>(null);
  const [classData, setClassData] = useState<Class | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddAssignmentModalOpen, setIsAddAssignmentModalOpen] = useState(false);
  const [isEditAssignmentModalOpen, setIsEditAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);
  const [addingAssignmentType, setAddingAssignmentType] = useState<string>('');
  const [deletePopUpState, setDeletePopUpState] = useState<{ 
    isOpen: boolean; 
    type?: 'assignment'; 
    assignmentId?: number; 
  }>({ isOpen: false });

  useEffect(() => {
    const initDatabase = async () => {
      try {
        const database = new AssignmentDatabase();
        await database.init();
        setDb(database);
        
        // Get class by slug
        const foundClass = await database.getClassBySlug(slug);
        if (!foundClass) {
          setError('Class not found');
          return;
        }
        
        setClassData(foundClass);
        
        // Load assignments for this class
        const classAssignments = await database.getAssignmentsByClass(foundClass.id!);
        setAssignments(classAssignments);
      } catch (error) {
        console.error('Failed to initialize database or load class:', error);
        setError('Failed to load class data');
      } finally {
        setIsLoading(false);
      }
    };

    initDatabase();
  }, [slug]);

  const loadAssignments = async () => {
    if (!db || !classData) return;
    
    try {
      const classAssignments = await db.getAssignmentsByClass(classData.id!);
      setAssignments(classAssignments);
    } catch (error) {
      console.error('Failed to load assignments:', error);
    }
  };

  const handleAddAssignment = async (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => {
    if (!db || !classData) return;

    try {
      await db.addAssignment({
        classId: classData.id!,
        ...assignmentData
      });
      await loadAssignments();
      setIsAddAssignmentModalOpen(false);
      setAddingAssignmentType('');
    } catch (error) {
      console.error('Failed to add assignment:', error);
    }
  };

  const handleEditAssignment = async (assignmentId: number, updates: Partial<Assignment>) => {
    if (!db) return;

    try {
      await db.updateAssignment(assignmentId, updates);
      await loadAssignments();
      setIsEditAssignmentModalOpen(false);
      setEditingAssignment(null);
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  const handleDeleteAssignment = async (assignmentId: number) => {
    if (!db) return;

    try {
      await db.deleteAssignment(assignmentId);
      await loadAssignments();
      setDeletePopUpState({ isOpen: false });
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  const handleAssignmentComplete = async (assignmentId: number, completed: boolean) => {
    if (!db) return;

    try {
      await db.updateAssignment(assignmentId, { completed });
      await loadAssignments();
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center flex-1">
          <div className="text-lg text-gray-600">Loading class...</div>
        </div>
      </AppLayout>
    );
  }

  if (error || !classData) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="text-xl text-red-600 mb-4">
            {error || 'Class not found'}
          </div>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <AssignmentList
        assignments={assignments}
        onAddAssignment={(type) => {
          setAddingAssignmentType(type || '');
          setIsAddAssignmentModalOpen(true);
        }}
        onEditAssignment={(assignment) => {
          setEditingAssignment(assignment);
          setIsEditAssignmentModalOpen(true);
        }}
        onDeleteAssignment={(assignmentId) => {
          setDeletePopUpState({ 
            isOpen: true, 
            type: 'assignment', 
            assignmentId 
          });
        }}
        onToggleAssignmentCompletion={handleAssignmentComplete}
      />

      {/* Add Assignment Modal */}
      <Modal 
        isOpen={isAddAssignmentModalOpen} 
        onClose={() => {
          setIsAddAssignmentModalOpen(false);
          setAddingAssignmentType('');
        }}
        title="Add New Assignment"
      >
        <AssignmentForm
          defaultType={addingAssignmentType}
          onSubmit={handleAddAssignment}
          onCancel={() => {
            setIsAddAssignmentModalOpen(false);
            setAddingAssignmentType('');
          }}
        />
      </Modal>

      {/* Edit Assignment Modal */}
      <Modal 
        isOpen={isEditAssignmentModalOpen} 
        onClose={() => {
          setIsEditAssignmentModalOpen(false);
          setEditingAssignment(null);
        }}
        title="Edit Assignment"
      >
        {editingAssignment && (
          <AssignmentForm
            initialData={editingAssignment}
            submitButtonText="Update Assignment"
            onSubmit={(updates) => handleEditAssignment(editingAssignment.id!, updates)}
            onCancel={() => {
              setIsEditAssignmentModalOpen(false);
              setEditingAssignment(null);
            }}
          />
        )}
      </Modal>

      {/* Delete Assignment PopUp */}
      <PopUp
        isOpen={deletePopUpState.isOpen}
        title="Delete Assignment"
        message="Are you sure you want to delete this assignment? This action cannot be undone."
        dismissButtonLabel="Cancel"
        primaryButtonLabel="Delete"
        onButtonClick={(buttonType) => {
          if (buttonType === 'primary' && deletePopUpState.assignmentId) {
            handleDeleteAssignment(deletePopUpState.assignmentId);
          }
          setDeletePopUpState({ isOpen: false });
        }}
      />
    </AppLayout>
  );
}