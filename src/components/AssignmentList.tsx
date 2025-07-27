
'use client';

import { Assignment } from '@/utils/database';
import AssignmentCard from './AssignmentCard';

interface AssignmentListProps {
  assignments: Assignment[];
  currentClassName: string;
  onToggleAssignmentCompletion: (assignmentId: number, completed: boolean) => void;
  onDeleteAssignment: (assignmentId: number) => void;
  onEditAssignment: (assignment: Assignment) => void;
  onAddAssignment: () => void;
}

export default function AssignmentList({ assignments, currentClassName, onToggleAssignmentCompletion, onDeleteAssignment, onEditAssignment, onAddAssignment }: AssignmentListProps) {
  return (
    <div className="flex-1 p-8 overflow-y-auto">
      {assignments.length === 0 ? (
        <div className="text-center mt-24">
          <p className="text-lg text-gray-500 mb-5">
            No assignments yet for {currentClassName}.
          </p>
          <button
            onClick={onAddAssignment}
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
              onToggleComplete={onToggleAssignmentCompletion}
              onDelete={onDeleteAssignment}
              onEdit={onEditAssignment}
            />
          ))}
        </div>
      )}
    </div>
  );
}
