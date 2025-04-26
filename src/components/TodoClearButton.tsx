'use client';

interface TodoClearButtonProps {
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export default function TodoClearButton({ hasCompleted, onClearCompleted }: TodoClearButtonProps) {
  if (!hasCompleted) return null;
  
  return (
    <div className="flex justify-end my-4">
      <button
        onClick={onClearCompleted}
        className="text-sm text-red-500 hover:text-red-700 py-1 px-2 rounded border border-red-300 hover:border-red-500 transition-colors"
      >
        Clear completed
      </button>
    </div>
  );
} 