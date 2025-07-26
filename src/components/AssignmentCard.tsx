'use client';

import { Assignment } from '@/utils/database';
import { getDueDateStatus } from '@/utils/dateTimeHelpers';

interface AssignmentCardProps {
  assignment: Assignment;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDelete: (id: number) => void;
}

export default function AssignmentCard({ assignment, onToggleComplete, onDelete }: AssignmentCardProps) {
  const dueDateStatus = assignment.dueDate ? getDueDateStatus(assignment.dueDate) : null;

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'homework':
        return 'bg-blue-500';
      case 'projects':
        return 'bg-orange-500';
      case 'exams':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

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

  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow ${
      assignment.completed ? 'opacity-70 bg-gray-50' : ''
    }`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={assignment.completed}
            onChange={(e) => onToggleComplete(assignment.id!, e.target.checked)}
            className="transform scale-125"
          />
          <h3 className={`text-lg font-semibold ${
            assignment.completed ? 'line-through text-gray-500' : ''
          }`}>
            {assignment.title}
          </h3>
        </div>
        <button
          onClick={() => onDelete(assignment.id!)}
          className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>

      {assignment.type && (
        <div className="mb-3">
          <span className={`inline-block px-2 py-1 text-xs font-medium text-white rounded-full uppercase tracking-wide ${getTypeColor(assignment.type)}`}>
            {assignment.type}
          </span>
        </div>
      )}

      {assignment.description && (
        <p className="text-gray-600 mb-4 leading-relaxed">
          {assignment.description}
        </p>
      )}

      <div className={`flex items-center font-medium ${
        dueDateStatus ? getDueDateColor(dueDateStatus.class) : 'text-gray-400'
      }`}>
        {dueDateStatus ? dueDateStatus.text : 'No due date'}
      </div>
    </div>
  );
}
