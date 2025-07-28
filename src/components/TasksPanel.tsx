'use client';

import { Assignment } from '@/utils/database';
import TasksList from './TasksList';

interface TasksPanelProps {
  selectedView: 'today' | 'tomorrow' | 'next7days' | 'all' | 'overdue' | 'noduedate';
  onViewChange: (view: 'today' | 'tomorrow' | 'next7days' | 'all' | 'overdue' | 'noduedate') => void;
  tasks: Assignment[];
  getClassName: (classId: number) => string;
  getClassSlug: (classId: number) => string;
}

export default function TasksPanel({ 
  selectedView, 
  onViewChange, 
  tasks, 
  getClassName, 
  getClassSlug 
}: TasksPanelProps) {
  const getViewConfig = (view: typeof selectedView) => {
    switch (view) {
      case 'overdue':
        return { badgeColor: 'bg-orange-100 text-orange-800', badgeText: 'Overdue' };
      case 'today':
        return { badgeColor: 'bg-red-100 text-red-800', badgeText: 'Due Today' };
      case 'tomorrow':
        return { badgeColor: 'bg-yellow-100 text-yellow-800', badgeText: 'Due Tomorrow' };
      case 'next7days':
        return { badgeColor: 'bg-blue-100 text-blue-800', badgeText: 'Next 7 Days' };
      case 'all':
        return { badgeColor: 'bg-gray-100 text-gray-800', badgeText: 'To-Do' };
      case 'noduedate':
        return { badgeColor: 'bg-purple-100 text-purple-800', badgeText: 'No Due Date' };
      default:
        return { badgeColor: 'bg-gray-100 text-gray-800', badgeText: 'Task' };
    }
  };

  const viewConfig = getViewConfig(selectedView);

  return (
    <div className="bg-white rounded-lg shadow-md flex flex-col flex-grow min-h-0">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
        <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
        <select
          value={selectedView}
          onChange={(e) => onViewChange(e.target.value as typeof selectedView)}
          className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="overdue">Overdue</option>
          <option value="today">Today</option>
          <option value="tomorrow">Tomorrow</option>
          <option value="next7days">7 Days</option>
          <option value="all">All</option>
          <option value="noduedate">No Due Date</option>
        </select>
      </div>
      <div className="p-6 overflow-y-auto">
        <TasksList
          tasks={tasks}
          selectedView={selectedView}
          badgeColor={viewConfig.badgeColor}
          badgeText={viewConfig.badgeText}
          getClassName={getClassName}
          getClassSlug={getClassSlug}
        />
      </div>
    </div>
  );
}