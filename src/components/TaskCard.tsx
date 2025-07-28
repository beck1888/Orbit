'use client';

import { useRouter } from 'next/navigation';
import { Assignment } from '@/utils/database';

interface TaskCardProps {
  task: Assignment;
  isOverdue: boolean;
  badgeColor: string;
  badgeText: string;
  getClassName: (classId: number) => string;
  getClassSlug: (classId: number) => string;
}

export default function TaskCard({ 
  task, 
  isOverdue, 
  badgeColor, 
  badgeText, 
  getClassName, 
  getClassSlug 
}: TaskCardProps) {
  const router = useRouter();

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${isOverdue ? 'border-red-500' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">{task.title}</h3>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {task.type}
            </span>
          </div>
          {task.description && (
            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <button 
              onClick={() => {
                const slug = getClassSlug(task.classId);
                if (slug) router.push(`/${slug}`);
              }}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0a2 2 0 01-2-2v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1a2 2 0 01-2 2m14 0V9a2 2 0 00-2-2M5 21V9a2 2 0 012-2h4" />
              </svg>
              {getClassName(task.classId)}
            </button>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {task.dueDate ? formatDueDate(task.dueDate) : 'No due date'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${isOverdue ? 'bg-orange-100 text-orange-800' : badgeColor}`}>
            {isOverdue ? 'Overdue' : badgeText}
          </span>
        </div>
      </div>
    </div>
  );
}