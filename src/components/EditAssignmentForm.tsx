'use client';

import AssignmentForm from './AssignmentForm';
import { Assignment } from '@/utils/database';

interface EditAssignmentFormProps {
  assignment: Assignment;
  onSubmit: (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
}

export default function EditAssignmentForm({ assignment, onSubmit, onCancel }: EditAssignmentFormProps) {
  return (
    <AssignmentForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      initialData={assignment}
      submitButtonText="Update Assignment"
    />
  );
}