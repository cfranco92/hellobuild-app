'use client';

import { FaGithub } from 'react-icons/fa';

export default function Header() {
  return (
    <header className="flex flex-col items-center mb-8">
      <div className="flex items-center mb-2">
        <FaGithub className="text-blue-500 text-3xl mr-2" />
        <h1 className="text-3xl font-bold text-gray-800">GitHub Explorer</h1>
      </div>
      <p className="text-gray-600 text-center">
        Explora y guarda tus repositorios favoritos de GitHub
      </p>
    </header>
  );
} 