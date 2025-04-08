
import React, { useEffect, useState } from "react";
import { initDatabase } from "@/services/storage/indexedDBService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

interface DatabaseInitializerProps {
  children: React.ReactNode;
}

const DatabaseInitializer: React.FC<DatabaseInitializerProps> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initDatabase();
        setIsInitialized(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
        setError("Failed to initialize the local database. Please check your browser settings and try again.");
      }
    };

    initialize();
  }, []);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 max-w-md">
          <div className="flex items-center">
            <div className="flex-shrink-0 text-red-500">
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <button
                className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
        <p className="ml-2 text-gray-600">Initializing database...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default DatabaseInitializer;
