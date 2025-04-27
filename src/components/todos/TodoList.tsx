'use client';

import { FaCheck, FaTrash } from 'react-icons/fa';
import { Todo } from '@/types';

const TodoList = ({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo 
}: { 
  todos: Todo[]; 
  onToggleTodo: (id: string) => void; 
  onDeleteTodo: (id: string) => void; 
}) => {
  if (todos.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-4">
        No tasks yet. Add some!
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {todos.map(todo => (
        <li key={todo.id} className="py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => onToggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border mr-3 flex items-center justify-center ${
                  todo.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300'
                }`}
              >
                {todo.completed && <FaCheck size={12} />}
              </button>
              <span 
                className={`${
                  todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
                }`}
              >
                {todo.text}
              </span>
            </div>
            <button
              onClick={() => onDeleteTodo(todo.id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash size={14} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList; 