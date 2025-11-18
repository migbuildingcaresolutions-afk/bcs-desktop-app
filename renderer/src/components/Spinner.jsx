import React from 'react';

/**
 * Loading Spinner Component
 */
export const Spinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const colorClasses = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    white: 'border-white',
    green: 'border-green-600',
    red: 'border-red-600',
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
    />
  );
};

/**
 * Full Page Loading Spinner
 */
export const PageSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <Spinner size="xl" />
      {message && <p className="mt-4 text-lg text-gray-600">{message}</p>}
    </div>
  );
};

/**
 * Inline Loading Spinner
 */
export const InlineSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className="flex items-center gap-2">
      <Spinner size="sm" />
      {message && <span className="text-sm text-gray-600">{message}</span>}
    </div>
  );
};

export default Spinner;
