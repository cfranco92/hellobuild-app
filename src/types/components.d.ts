declare module '@/components/TodoForm' {
  interface TodoFormProps {
    onAddTodo: (text: string) => void;
  }
  
  const TodoForm: React.FC<TodoFormProps>;
  export default TodoForm;
}

declare module '@/components/TodoFilter' {
  interface TodoFilterProps {
    filter: 'all' | 'active' | 'completed';
    onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  }
  
  const TodoFilter: React.FC<TodoFilterProps>;
  export default TodoFilter;
}

declare module '@/components/TodoStats' {
  interface TodoStatsProps {
    totalTasks: number;
    completedTasks: number;
  }
  
  const TodoStats: React.FC<TodoStatsProps>;
  export default TodoStats;
}

declare module '@/components/TodoClearButton' {
  interface TodoClearButtonProps {
    hasCompleted: boolean;
    onClearCompleted: () => void;
  }
  
  const TodoClearButton: React.FC<TodoClearButtonProps>;
  export default TodoClearButton;
} 