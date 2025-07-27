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
  defaultType?: string;
}

export default function AddAssignmentForm({ onSubmit, onCancel, defaultType }: AddAssignmentFormProps) {
  return (
    <AssignmentForm
      onSubmit={onSubmit}
      onCancel={onCancel}
      submitButtonText="Add Assignment"
      defaultType={defaultType}
    />
  );
}