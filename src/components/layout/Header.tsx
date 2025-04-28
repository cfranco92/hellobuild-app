'use client';

export default function Header() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          GitHub Repository Explorer
        </h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto">
          Explore and save your favorite GitHub repositories
        </p>
      </div>
    </div>
  );
} 