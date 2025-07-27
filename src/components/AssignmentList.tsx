
'use client';

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
  // Separate incomplete assignments by type
  const incompleteHomework = assignments.filter(a => a.type?.toLowerCase() === 'homework' && !a.completed);
  const incompleteProjects = assignments.filter(a => a.type?.toLowerCase() === 'projects' && !a.completed);
  const incompleteExams = assignments.filter(a => a.type?.toLowerCase() === 'exams' && !a.completed);
  const incompleteOther = assignments.filter(a => !['homework', 'projects', 'exams'].includes(a.type?.toLowerCase() || '') && !a.completed);

  const renderColumn = (title: string, incompleteAssignments: Assignment[], bgColor: string, columnType: string) => (
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
      <div className="bg-gray-50 flex-1 p-4 rounded-b-lg border-l border-r border-b border-gray-200 space-y-3 overflow-y-auto">
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
    </div>
  );

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        {renderColumn('Homework', incompleteHomework, 'bg-blue-500', 'Homework')}
        {renderColumn('Projects', incompleteProjects, 'bg-orange-500', 'Projects')}
        {renderColumn('Exams', incompleteExams, 'bg-red-500', 'Exams')}
        {incompleteOther.length > 0 && renderColumn('Other', incompleteOther, 'bg-gray-500', 'Other')}
      </div>
    </div>
  );
}
