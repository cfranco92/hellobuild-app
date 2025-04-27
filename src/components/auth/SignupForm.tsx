'use client';

import { useState } from 'react';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

interface SignupFormProps {
  onSignup: (name: string, email: string, password: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function SignupForm({ onSignup, isLoading, error }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!name.trim()) {
      setFormError('Name is required');
      return;
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      setFormError('Please enter a valid email address');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    onSignup(name, email, password);
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>
        
        {(error || formError) && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
            {error || formError}
          </div>
        )}
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <div className="flex items-center border rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FaUser />
            </span>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="flex items-center border rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <div className="flex items-center border rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FaLock />
            </span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm Password
          </label>
          <div className="flex items-center border rounded-md border-gray-300 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <span className="px-3 text-gray-500">
              <FaLock />
            </span>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full p-2 outline-none"
              required
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
} 