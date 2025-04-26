'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import TodoForm from '@/components/TodoForm';
import TodoList from '@/components/TodoList';
import TodoFilter from '@/components/TodoFilter';
import TodoStats from '@/components/TodoStats';
import TodoClearButton from '@/components/TodoClearButton';
import { todoService } from '@/services/api';
import { Todo } from '@/types';

type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadTodos = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await todoService.getTodos(user.uid);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setTodos(response.data);
        }
      } catch (error) {
        console.error('Error loading todos:', error);
        setError('Error loading tasks');
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();
  }, [user]);

  const addTodo = async (text: string) => {
    if (!user || !text.trim()) return;

    try {
      setError(null);
      const response = await todoService.createTodo(user.uid, { text });
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setTodos([...todos, response.data]);
      }
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Error adding task');
    }
  };

  const toggleTodo = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const newCompletedState = !todoToUpdate.completed;
      
      setTodos(
        todos.map(todo => (todo.id === id ? { ...todo, completed: newCompletedState } : todo))
      );
      
      const response = await todoService.updateTodo(id, { completed: newCompletedState });
      
      if (response.error) {
        setTodos(todos);
        setError(response.error);
      }
    } catch (error) {
      setTodos(todos);
      console.error('Error updating todo:', error);
      setError('Error updating task');
    }
  };

  const deleteTodo = async (id: string) => {
    if (!user) return;

    try {
      setError(null);
      const currentTodos = [...todos];
      
      setTodos(todos.filter(todo => todo.id !== id));
      
      const response = await todoService.deleteTodo(id);
      
      if (response.error) {
        setTodos(currentTodos);
        setError(response.error);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Error deleting task');
    }
  };

  const clearCompleted = async () => {
    if (!user) return;

    try {
      setError(null);
      const currentTodos = [...todos];
      
      setTodos(todos.filter(todo => !todo.completed));
      
      const response = await todoService.clearCompleted(user.uid);
      
      if (response.error) {
        setTodos(currentTodos);
        setError(response.error);
      }
    } catch (error) {
      setTodos(todos);
      console.error('Error clearing completed todos:', error);
      setError('Error deleting completed tasks');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const completedCount = todos.filter(todo => todo.completed).length;
  const totalCount = todos.length;

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-lg">Login to manage your tasks</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      
      {error && (
        <div className="p-2 mb-4 bg-red-100 text-red-800 text-sm rounded-md">
          <p>{error}</p>
        </div>
      )}
      
      <TodoForm onAddTodo={addTodo} />
      
      <TodoList 
        todos={filteredTodos} 
        onToggleTodo={toggleTodo} 
        onDeleteTodo={deleteTodo} 
      />
      
      {totalCount > 0 && (
        <TodoStats totalTasks={totalCount} completedTasks={completedCount} />
      )}
      
      <TodoFilter filter={filter} onFilterChange={setFilter} />
      
      {completedCount > 0 && (
        <TodoClearButton 
          hasCompleted={completedCount > 0}
          onClearCompleted={clearCompleted}
        />
      )}
    </div>
  );
} 