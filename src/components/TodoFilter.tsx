'use client';

interface TodoFilterProps {
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

export default function TodoFilter({ filter, onFilterChange }: TodoFilterProps) {
  return (
    <div className="flex justify-center space-x-4 my-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-3 py-1 rounded ${
          filter === 'all' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        All
      </button>
      <button
        onClick={() => onFilterChange('active')}
        className={`px-3 py-1 rounded ${
          filter === 'active' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={`px-3 py-1 rounded ${
          filter === 'completed' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
        }`}
      >
        Completed
      </button>
    </div>
  );
} 