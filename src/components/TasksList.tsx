'use client';

import { Assignment } from '@/utils/database';
import TaskCard from './TaskCard';

interface TasksListProps {
  tasks: Assignment[];
  selectedView: 'today' | 'tomorrow' | 'next7days' | 'all' | 'overdue' | 'noduedate';
  badgeColor: string;
  badgeText: string;
  getClassName: (classId: number) => string;
  getClassSlug: (classId: number) => string;
}

export default function TasksList({ 
  tasks, 
  selectedView, 
  badgeColor, 
  badgeText, 
  getClassName, 
  getClassSlug 
}: TasksListProps) {
  if (tasks.length === 0) {
    const getEmptyMessage = () => {
      switch (selectedView) {
        case 'overdue':
          return { main: 'No overdue tasks! 👍', sub: "You're all caught up!" };
        case 'today':
          return { main: 'No tasks due today! 🎉', sub: "Enjoy your day or get ahead on tomorrow's work." };
        case 'tomorrow':
          return { main: 'No tasks due tomorrow! 🎉', sub: 'Great! You have a free day tomorrow.' };
        case 'next7days':
          return { main: 'No tasks in the next 7 days! 🎉', sub: 'Looks like you have a relaxing week ahead!' };
        case 'all':
          return { main: 'No tasks found! 🎉', sub: 'No tasks at all! Time to add some assignments.' };
        case 'noduedate':
          return { main: 'No tasks without due dates! 🎉', sub: 'No tasks without due dates!' };
        default:
          return { main: 'No tasks found! 🎉', sub: 'All clear!' };
      }
    };

    const message = getEmptyMessage();

    return (
      <div className="text-center py-8">
        <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-500 text-lg">{message.main}</p>
        <p className="text-gray-400 text-sm mt-2">{message.sub}</p>
      </div>
    );
  }

  const today = new Date();
  const todayString = today.toISOString().split('T')[0];

  const overdueInView = tasks.filter(task => 
    task.dueDate && new Date(task.dueDate).toISOString().split('T')[0] < todayString
  );

  const otherTasksInView = tasks.filter(task => 
    !task.dueDate || new Date(task.dueDate).toISOString().split('T')[0] >= todayString
  );

  return (
    <div className="space-y-4">
      {selectedView === 'overdue' 
        ? overdueInView.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              isOverdue={true}
              badgeColor={badgeColor}
              badgeText={badgeText}
              getClassName={getClassName}
              getClassSlug={getClassSlug}
            />
          ))
        : (
          <>
            {overdueInView.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={true}
                badgeColor={badgeColor}
                badgeText={badgeText}
                getClassName={getClassName}
                getClassSlug={getClassSlug}
              />
            ))}
            {otherTasksInView.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                isOverdue={false}
                badgeColor={badgeColor}
                badgeText={badgeText}
                getClassName={getClassName}
                getClassSlug={getClassSlug}
              />
            ))}
          </>
        )
      }
    </div>
  );
}