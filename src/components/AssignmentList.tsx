
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
  // Group assignments by type
  const homeworkAssignments = assignments.filter(a => a.type?.toLowerCase() === 'homework');
  const projectAssignments = assignments.filter(a => a.type?.toLowerCase() === 'projects');
  const examAssignments = assignments.filter(a => a.type?.toLowerCase() === 'exams');
  const otherAssignments = assignments.filter(a => !['homework', 'projects', 'exams'].includes(a.type?.toLowerCase() || ''));

  const renderColumn = (title: string, columnAssignments: Assignment[], bgColor: string) => (
    <div className="flex-1 min-w-0">
      <div className={`${bgColor} text-white px-4 py-3 rounded-t-lg`}>
        <h2 className="text-lg font-semibold">{title} ({columnAssignments.length})</h2>
      </div>
      <div className="bg-gray-50 min-h-96 p-4 rounded-b-lg border-l border-r border-b border-gray-200 space-y-3">
        {columnAssignments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No {title.toLowerCase()} yet</p>
        ) : (
          columnAssignments.map((assignment) => (
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
    </div>
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto">
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderColumn('Homework', homeworkAssignments, 'bg-blue-500')}
          {renderColumn('Projects', projectAssignments, 'bg-orange-500')}
          {renderColumn('Exams', examAssignments, 'bg-red-500')}
          {otherAssignments.length > 0 && renderColumn('Other', otherAssignments, 'bg-gray-500')}
        </div>
      )}
    </div>
  );
}
