'use client';

import { FaCheckCircle } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex flex-col items-center mb-8">
      <div className="flex items-center mb-2">
        <FaCheckCircle className="text-blue-500 text-3xl mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">Todo App</h1>
      </div>
      <p className="text-gray-600 text-center">
        Manage your tasks efficiently
      </p>
    </header>
  );
} 