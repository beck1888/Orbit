'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Assignment, Class } from '@/utils/database';
import DashboardStats from './DashboardStats';
import TasksPanel from './TasksPanel';

interface DashboardProps {
  db: AssignmentDatabase | null;
}

interface DashboardStatsData {
  tasksToday: number;
  tasksTomorrow: number;
  totalTasks: number;
  overdueTasks: number;
  tasksListToday: Assignment[];
  tasksListTomorrow: Assignment[];
  tasksListNext7Days: Assignment[];
  tasksListAll: Assignment[];
  tasksListOverdue: Assignment[];
  tasksWithoutDates: Assignment[];
}

export default function Dashboard({ db }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStatsData>({
    tasksToday: 0,
    tasksTomorrow: 0,
    totalTasks: 0,
    overdueTasks: 0,
    tasksListToday: [],
    tasksListTomorrow: [],
    tasksListNext7Days: [],
    tasksListAll: [],
    tasksListOverdue: [],
    tasksWithoutDates: [],
  });
  const [classes, setClasses] = useState<Class[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'today' | 'tomorrow' | 'next7days' | 'all' | 'overdue' | 'noduedate'>('today');

  useEffect(() => {
    const loadDashboardData = async () => {
      if (!db) return;

      try {
        setIsLoading(true);
        
        const allClasses = await db.getAllClasses();
        setClasses(allClasses);

        const allIncompleteAssignments = await db.getAllIncompleteAssignments();
        
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        const tasksOverdue = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate < todayString;
        });
        
        const tasksToday = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate === todayString;
        });
        
        const tasksTomorrow = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate === tomorrowString;
        });

        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);
        const next7DaysString = next7Days.toISOString().split('T')[0];
        
        const tasksNext7Days = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate >= todayString && dueDate <= next7DaysString;
        });

        const tasksWithoutDates = allIncompleteAssignments.filter((assignment: Assignment) => !assignment.dueDate);

        setStats({
          tasksToday: tasksToday.length,
          tasksTomorrow: tasksTomorrow.length,
          totalTasks: allIncompleteAssignments.length,
          overdueTasks: tasksOverdue.length,
          tasksListToday: tasksToday,
          tasksListTomorrow: tasksTomorrow,
          tasksListNext7Days: tasksNext7Days,
          tasksListAll: allIncompleteAssignments,
          tasksListOverdue: tasksOverdue,
          tasksWithoutDates: tasksWithoutDates,
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, [db]);

  const getClassName = (classId: number): string => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.name : 'Unknown Class';
  };

  const getClassSlug = (classId: number): string => {
    const foundClass = classes.find(c => c.id === classId);
    return foundClass ? foundClass.slug : '';
  };

  const getCurrentTasks = (): Assignment[] => {
    switch (selectedView) {
      case 'overdue':
        return stats.tasksListOverdue;
      case 'today':
        return [...stats.tasksListOverdue, ...stats.tasksListToday];
      case 'tomorrow':
        return stats.tasksListTomorrow;
      case 'next7days':
        return stats.tasksListNext7Days;
      case 'all':
        return stats.tasksListAll;
      case 'noduedate':
        return stats.tasksWithoutDates;
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex flex-col flex-grow min-h-0">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
        
        <DashboardStats 
          stats={{
            tasksToday: stats.tasksToday,
            tasksTomorrow: stats.tasksTomorrow,
            totalTasks: stats.totalTasks,
            overdueTasks: stats.overdueTasks,
            tasksWithoutDates: stats.tasksWithoutDates.length,
          }}
        />

        <TasksPanel
          selectedView={selectedView}
          onViewChange={setSelectedView}
          tasks={getCurrentTasks()}
          getClassName={getClassName}
          getClassSlug={getClassSlug}
        />
      </div>
    </div>
  );
}