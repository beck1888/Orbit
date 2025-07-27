'use client';

import AssignmentForm from './AssignmentForm';

interface AddAssignmentFormProps {
  onSubmit: (assignmentData: {
    title: string;
    description: string;
    type: string;
    dueDate?: string;
  }) => void;
  onCancel: () => void;
}

export default function AddAssignmentForm({ onSubmit, onCancel }: AddAssignmentFormProps) {
  return (
    <AssignmentForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitButtonText="Add Assignment"
    />
  );
}