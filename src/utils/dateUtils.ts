/**
 * Utility function to format dates in a user-friendly way
 * @param dateString - ISO date string to format
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  
  // Return formatted date: 'Jan 01, 2023'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
} 