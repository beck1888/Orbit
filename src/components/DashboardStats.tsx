'use client';

import StatsCard from './StatsCard';

interface DashboardStatsData {
  tasksToday: number;
  tasksTomorrow: number;
  totalTasks: number;
  overdueTasks: number;
  tasksWithoutDates: number;
}

interface DashboardStatsProps {
  stats: DashboardStatsData;
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
      <StatsCard
        icon="/icons/alert.svg"
        iconAlt="Alert Icon"
        title="Overdue"
        count={stats.overdueTasks}
        bgColor="bg-red-100"
        textColor="text-red-700"
      />
      
      <StatsCard
        icon="/icons/sun.svg"
        iconAlt="Sun Icon"
        title="Today"
        count={stats.tasksToday}
        bgColor="bg-green-100"
        textColor="text-green-700"
      />
      
      <StatsCard
        icon="/icons/clock.svg"
        iconAlt="Clock Icon"
        title="Tomorrow"
        count={stats.tasksTomorrow}
        bgColor="bg-yellow-100"
        textColor="text-yellow-700"
      />
      
      <StatsCard
        icon="/icons/question.svg"
        iconAlt="Question Icon"
        title="No Date"
        count={stats.tasksWithoutDates}
        bgColor="bg-purple-100"
        textColor="text-purple-700"
      />
      
      <StatsCard
        icon="/icons/check.svg"
        iconAlt="Check Icon"
        title="To-Do"
        count={stats.totalTasks}
        bgColor="bg-blue-100"
        textColor="text-blue-700"
      />
    </div>
  );
}