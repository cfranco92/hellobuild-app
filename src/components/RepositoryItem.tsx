import { Repository } from "@/types";
import { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";

interface RepositoryItemProps {
  repository: Repository;
  isFavorite: boolean;
  onToggleFavorite: (repository: Repository) => Promise<boolean>;
}

export default function RepositoryItem({
  repository,
  isFavorite,
  onToggleFavorite,
}: RepositoryItemProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    setIsLoading(true);
    await onToggleFavorite(repository);
    setIsLoading(false);
  };

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          <a
            href={repository.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {repository.name}
          </a>
        </h3>
        <button
          onClick={handleToggleFavorite}
          disabled={isLoading}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          className={`text-yellow-500 hover:text-yellow-600 transition-colors ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isFavorite ? <FaStar size={20} /> : <FaRegStar size={20} />}
        </button>
      </div>

      {repository.description && (
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
          {repository.description}
        </p>
      )}

      <div className="flex flex-wrap gap-2 mb-3">
        {repository.language && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {repository.language}
          </span>
        )}
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          ⭐ {repository.stars}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">
          🍴 {repository.forks_count}
        </span>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Updated: {repository.formattedDate}
      </div>
    </div>
  );
}
