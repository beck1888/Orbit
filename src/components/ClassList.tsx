
'use client';

import { Class } from '@/utils/database';
import ClassItem from './ClassItem';

interface ClassListProps {
  classes: Class[];
  currentClassId: number | null;
  onSelectClass: (classId: number, className: string) => void;
  onDeleteClass: (classId: number, className: string) => void;
}

export default function ClassList({ classes, currentClassId, onSelectClass, onDeleteClass }: ClassListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-200">
        <h1 className="text-2xl font-semibold mb-4">Classes</h1>
      </div>
      <div className="flex-1 overflow-y-auto">
        {classes.length === 0 ? (
          <div className="p-5 text-center text-gray-500">
            <p>No classes yet. Add your first class to get started!</p>
          </div>
        ) : (
          classes.map((classItem) => (
            <ClassItem
              key={classItem.id}
              classItem={classItem}
              isActive={currentClassId === classItem.id}
              onSelect={() => onSelectClass(classItem.id!, classItem.name)}
              onDelete={() => onDeleteClass(classItem.id!, classItem.name)}
            />
          ))
        )}
      </div>
    </div>
  );
}
