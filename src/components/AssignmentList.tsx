
'use client';

import { useState } from 'react';
import { Assignment } from '@/utils/database';
import AssignmentCard from './AssignmentCard';

interface AssignmentListProps {
  assignments: Assignment[];
  onToggleAssignmentCompletion: (assignmentId: number, completed: boolean) => void;
  onDeleteAssignment: (assignmentId: number) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onAddAssignment: (type?: string) => void;
}

export default function AssignmentList({ assignments, onToggleAssignmentCompletion, onDeleteAssignment, onEditAssignment, onAddAssignment }: AssignmentListProps) {
  const [showCompleted, setShowCompleted] = useState({
    homework: false,
    projects: false,
    exams: false,
    other: false
  });

  // Separate completed and incomplete assignments by type
  const incompleteHomework = assignments.filter(a => a.type?.toLowerCase() === 'homework' && !a.completed);
  const completedHomework = assignments.filter(a => a.type?.toLowerCase() === 'homework' && a.completed)
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime());

  const incompleteProjects = assignments.filter(a => a.type?.toLowerCase() === 'projects' && !a.completed);
  const completedProjects = assignments.filter(a => a.type?.toLowerCase() === 'projects' && a.completed)
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime());

  const incompleteExams = assignments.filter(a => a.type?.toLowerCase() === 'exams' && !a.completed);
  const completedExams = assignments.filter(a => a.type?.toLowerCase() === 'exams' && a.completed)
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime());

  const incompleteOther = assignments.filter(a => !['homework', 'projects', 'exams'].includes(a.type?.toLowerCase() || '') && !a.completed);
  const completedOther = assignments.filter(a => !['homework', 'projects', 'exams'].includes(a.type?.toLowerCase() || '') && a.completed)
    .sort((a, b) => new Date(b.completedAt || '').getTime() - new Date(a.completedAt || '').getTime());

  const toggleShowCompleted = (type: string) => {
    setShowCompleted(prev => ({
      ...prev,
      [type]: !prev[type as keyof typeof prev]
    }));
  };

  const renderColumn = (title: string, incompleteAssignments: Assignment[], completedAssignments: Assignment[], bgColor: string, columnType: string, showCompletedKey: keyof typeof showCompleted) => (
    <div className="flex-1 min-w-0 flex flex-col h-full">
      <div className={`${bgColor} text-white px-4 py-3 rounded-t-lg flex-shrink-0 flex justify-between items-center`}>
        <h2 className="text-lg font-semibold">{title} ({incompleteAssignments.length})</h2>
        <button
          onClick={() => onAddAssignment(columnType)}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
          title={`Add ${title.slice(0, -1)}`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>
      <div className="bg-gray-50 flex-1 p-4 rounded-b-lg border-l border-r border-b border-gray-200 space-y-3 overflow-y-auto flex flex-col">
        <div className="space-y-3">
          {incompleteAssignments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} yet</p>
          ) : (
            incompleteAssignments.map((assignment) => (
              <AssignmentCard
                key={assignment.id}
                assignment={assignment}
                onToggleComplete={onToggleAssignmentCompletion}
                onDelete={onDeleteAssignment}
                onEdit={onEditAssignment}
              />
            ))
          )}
        </div>
        
        {completedAssignments.length > 0 && (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={() => toggleShowCompleted(showCompletedKey)}
              className="w-full text-xs text-gray-600 hover:text-gray-800 py-2 flex items-center justify-center space-x-1"
            >
              <span>({completedAssignments.length} completed)</span>
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
                className={`transform transition-transform ${showCompleted[showCompletedKey] ? 'rotate-180' : ''}`}
              >
                <polyline points="6,9 12,15 18,9"></polyline>
              </svg>
            </button>
            
            {showCompleted[showCompletedKey] && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {completedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onToggleComplete={onToggleAssignmentCompletion}
                    onDelete={onDeleteAssignment}
                    onEdit={onEditAssignment}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {renderColumn('Homework', incompleteHomework, completedHomework, 'bg-blue-500', 'Homework', 'homework')}
        {renderColumn('Projects', incompleteProjects, completedProjects, 'bg-orange-500', 'Projects', 'projects')}
        {renderColumn('Exams', incompleteExams, completedExams, 'bg-red-500', 'Exams', 'exams')}
        {(incompleteOther.length > 0 || completedOther.length > 0) && renderColumn('Other', incompleteOther, completedOther, 'bg-gray-500', 'Other', 'other')}
      </div>
    </div>
  );
}
