'use client';

import { Class } from '@/utils/database';

interface ClassItemProps {
  classItem: Class;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export default function ClassItem({ classItem, isActive, onSelect, onDelete }: ClassItemProps) {
  return (
    <div
      className={`flex justify-between items-center p-4 cursor-pointer border-b border-gray-100 transition-colors ${
        isActive 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <span className="font-medium">{classItem.name}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
          isActive
            ? 'text-white/80 hover:bg-white/10'
            : 'text-red-500 hover:bg-red-50'
        }`}
      >
        Delete
      </button>
    </div>
  );
}
