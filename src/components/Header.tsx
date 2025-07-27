
'use client';

interface HeaderProps {
  currentClassName: string;
  currentClassId: number | null;
  onAddAssignment: () => void;
}

export default function Header({ currentClassName, currentClassId, onAddAssignment }: HeaderProps) {
  return (
    <div className="p-8 border-b border-gray-200 bg-white flex justify-between items-center">
      <h2 className="text-3xl font-semibold">
        {currentClassName || 'Select a class to view assignments'}
      </h2>
      {currentClassId && (
        <button
          onClick={onAddAssignment}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          + Add Assignment
        </button>
      )}
    </div>
  );
}
