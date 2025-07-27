'use client';

import { Class } from '@/utils/database';

interface ClassItemProps {
  classItem: Class;
  isActive: boolean;
  onSelect: () => void;
}

export default function ClassItem({ classItem, isActive, onSelect }: ClassItemProps) {
  return (
    <div
      className={`flex justify-between items-center p-4 cursor-pointer border-b border-gray-100 transition-colors ${
        isActive 
          ? 'bg-blue-500 text-white hover:bg-blue-600' 
          : 'hover:bg-gray-50'
      }`}
      onClick={onSelect}
    >
      <span className="text-gray-700 flex items-center">
        <span className="mr-2">{classItem.emoji}</span>
        {classItem.name}
      </span>
    </div>
  );
}
