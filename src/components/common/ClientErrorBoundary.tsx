'use client';

import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center">
      <h2 className="text-2xl font-bold mb-2 text-red-600">Something went wrong</h2>
      <p className="mb-4 max-w-lg text-gray-600 dark:text-gray-300">
        {error.message || 'An unexpected error occurred'}
      </p>
      <pre className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto max-w-full">
        {error.stack?.slice(0, 200) + '...'}
      </pre>
      <Button onClick={resetErrorBoundary} variant="outline">
        Try again
      </Button>
    </div>
  );
}

// Handle reset as a variable rather than an inline function
const handleReset = () => {
  window.location.reload();
};

export function ClientErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={handleReset}>
      {children}
    </ErrorBoundary>
  );
}
