'use client';

interface TodoStatsProps {
  totalTasks: number;
  completedTasks: number;
}

export default function TodoStats({ totalTasks, completedTasks }: TodoStatsProps) {
  const percentComplete = totalTasks === 0 
    ? 0 
    : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="my-4 px-2">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{percentComplete}% complete</span>
        <span>{completedTasks}/{totalTasks} tasks done</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
          style={{ width: `${percentComplete}%` }}
        ></div>
      </div>
    </div>
  );
} 