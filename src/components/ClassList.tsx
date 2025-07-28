'use client';

import { Class } from '@/utils/database';
import ClassItem from './ClassItem';

interface ClassListProps {
  classes: Class[];
  currentClassId: number | null;
  onSelectClass: (classId: number) => void;
}

export default function ClassList({ classes, currentClassId, onSelectClass }: ClassListProps) {
  return (
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
            onSelect={() => onSelectClass(classItem.id!)}
          />
        ))
      )}
    </div>
  );
}
