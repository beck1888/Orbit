'use client';

import { useState, useEffect } from 'react';
import { AssignmentDatabase, Assignment, Class } from '@/utils/database';

interface DashboardProps {
  db: AssignmentDatabase | null;
}

interface DashboardStats {
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
  const [stats, setStats] = useState<DashboardStats>({
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
        
        // Get all classes for class name mapping
        const allClasses = await db.getAllClasses();
        setClasses(allClasses);

        // Get all incomplete assignments for total count
        const allIncompleteAssignments = await db.getAllIncompleteAssignments();
        
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        // Get tomorrow's date in ISO format
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowString = tomorrow.toISOString().split('T')[0];

        // Filter for overdue tasks
        const tasksOverdue = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate < todayString;
        });
        
        // Filter assignments for today from all incomplete assignments
        const tasksToday = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate === todayString;
        });
        
        // Filter assignments for tomorrow from all incomplete assignments
        const tasksTomorrow = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate === tomorrowString;
        });

        // Filter assignments for next 7 days from all incomplete assignments
        const next7Days = new Date(today);
        next7Days.setDate(next7Days.getDate() + 7);
        const next7DaysString = next7Days.toISOString().split('T')[0];
        
        const tasksNext7Days = allIncompleteAssignments.filter((assignment: Assignment) => {
          if (!assignment.dueDate) return false;
          const dueDate = new Date(assignment.dueDate).toISOString().split('T')[0];
          return dueDate >= todayString && dueDate <= next7DaysString;
        });

        // Filter assignments without due dates
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

  const formatDueDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
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
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-100">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overdueTasks}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-100">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksToday}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due Tomorrow</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksTomorrow}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total To-Dos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">No Due Date</p>
                <p className="text-2xl font-bold text-gray-900">{stats.tasksWithoutDates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* My Tasks */}
        <div className="bg-white rounded-lg shadow-md flex flex-col flex-grow min-h-0">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-800">My Tasks</h2>
            <select
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value as 'today' | 'tomorrow' | 'next7days' | 'all' | 'overdue' | 'noduedate')}
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
            {(() => {
              let currentTasks: Assignment[] = [];
              let viewLabel = '';
              let emptyMessage = '';
              let badgeColor = '';
              let badgeText = '';

              switch (selectedView) {
                case 'overdue':
                  currentTasks = stats.tasksListOverdue;
                  viewLabel = 'overdue';
                  emptyMessage = "You're all caught up!";
                  badgeColor = 'bg-orange-100 text-orange-800';
                  badgeText = 'Overdue';
                  break;
                case 'today':
                  currentTasks = [...stats.tasksListOverdue, ...stats.tasksListToday];
                  viewLabel = 'today';
                  emptyMessage = "Enjoy your day or get ahead on tomorrow&apos;s work.";
                  badgeColor = 'bg-red-100 text-red-800';
                  badgeText = 'Due Today';
                  break;
                case 'tomorrow':
                  currentTasks = stats.tasksListTomorrow;
                  viewLabel = 'tomorrow';
                  emptyMessage = 'Great! You have a free day tomorrow.';
                  badgeColor = 'bg-yellow-100 text-yellow-800';
                  badgeText = 'Due Tomorrow';
                  break;
                case 'next7days':
                  currentTasks = stats.tasksListNext7Days;
                  viewLabel = 'in the next 7 days';
                  emptyMessage = 'Looks like you have a relaxing week ahead!';
                  badgeColor = 'bg-blue-100 text-blue-800';
                  badgeText = 'Next 7 Days';
                  break;
                case 'all':
                  currentTasks = stats.tasksListAll;
                  viewLabel = '';
                  emptyMessage = 'No tasks at all! Time to add some assignments.';
                  badgeColor = 'bg-gray-100 text-gray-800';
                  badgeText = 'To-Do';
                  break;
                case 'noduedate':
                  currentTasks = stats.tasksWithoutDates;
                  viewLabel = 'without due dates';
                  emptyMessage = 'No tasks without due dates!';
                  badgeColor = 'bg-purple-100 text-purple-800';
                  badgeText = 'No Due Date';
                  break;
              }
              
              const today = new Date();
              const todayString = today.toISOString().split('T')[0];

              const overdueInView = currentTasks.filter(task => 
                task.dueDate && new Date(task.dueDate).toISOString().split('T')[0] < todayString
              );

              const otherTasksInView = currentTasks.filter(task => 
                !task.dueDate || new Date(task.dueDate).toISOString().split('T')[0] >= todayString
              );

              const renderTask = (task: Assignment, isOverdue: boolean) => (
                <div key={task.id} className={`border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors ${isOverdue ? 'border-red-500' : ''}`}>
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
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0a2 2 0 01-2-2v-1a2 2 0 00-2-2H9a2 2 0 00-2 2v1a2 2 0 01-2 2m14 0V9a2 2 0 00-2-2M5 21V9a2 2 0 012-2h4" />
                          </svg>
                          {getClassName(task.classId)}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

              return currentTasks.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500 text-lg">
                    {selectedView === 'all' ? 'No tasks found! 🎉' : 
                     selectedView === 'overdue' ? 'No overdue tasks! 👍' :
                     `No tasks due ${viewLabel}! 🎉`}
                  </p>
                  <p className="text-gray-400 text-sm mt-2">{emptyMessage}</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedView === 'overdue' 
                    ? overdueInView.map(task => renderTask(task, true))
                    : (
                      <>
                        {overdueInView.map(task => renderTask(task, true))}
                        {otherTasksInView.map(task => renderTask(task, false))}
                      </>
                    )
                  }
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}
