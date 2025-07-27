'use client';

import { Assignment } from '@/utils/database';
import { getDueDateStatus } from '@/utils/dateTimeHelpers';
import { useEffect } from 'react';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
  onEdit: (assignment: Assignment) => void;
}

export default function AssignmentCard({ assignment, onToggleComplete, onDelete, onEdit }: AssignmentCardProps) {
  const dueDateStatus = assignment.dueDate ? getDueDateStatus(assignment.dueDate) : null;

  const getDueDateColor = (dueDateClass: string) => {
    switch (dueDateClass) {
      case 'overdue':
        return 'text-red-500';
      case 'due-today':
        return 'text-red-600 font-semibold';
      case 'due-soon':
        return 'text-orange-500';
      default:
        return 'text-blue-500';
    }
  };

  useEffect(() => {
    // Removed audio play logic
  }, [assignment.completed]);

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow ${
      assignment.completed ? 'opacity-70 bg-gray-50' : ''
    }`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center space-x-2 flex-1 min-w-0">
          <input
            type="checkbox"
            checked={assignment.completed}
            onChange={(e) => onToggleComplete(assignment.id!, e.target.checked)}
            className="transform scale-110 flex-shrink-0"
          />
          <h3 className={`text-sm font-semibold truncate ${
            assignment.completed ? 'line-through text-gray-500' : ''
          }`} title={assignment.title}>
            {assignment.title}
          </h3>
        </div>
        <div className="flex space-x-1 flex-shrink-0 ml-2">
          <button
            onClick={() => onEdit(assignment)}
            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(assignment.id!)}
            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
          >
            ×
          </button>
        </div>
      </div>

      {assignment.description && (
        <p className="text-gray-600 text-xs mb-2 line-clamp-2 leading-relaxed">
          {assignment.description}
        </p>
      )}

      <div className="flex justify-between items-center">
        <div className={`text-xs font-medium ${
          dueDateStatus ? getDueDateColor(dueDateStatus.class) : 'text-gray-400'
        }`}>
          {dueDateStatus ? dueDateStatus.text : 'No due date'}
        </div>
        
        {assignment.completed && assignment.completedAt && (
          <div className="text-xs text-gray-500">
            Completed {new Date(assignment.completedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>
    </div>
  );
}
