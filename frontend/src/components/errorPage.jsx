import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

const ErrorPage = ({
  statusCode = 404,
  title = "Page Not Found",
  message = "Sorry, we couldn't find the page you're looking for.",
  onRetry,
  showHomeButton = true
}) => {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700/50 p-8 text-center shadow-lg">
        {/* Error Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-900/50 to-red-800/50 border border-red-700/30 flex items-center justify-center">
            <AlertCircle className="w-12 h-12 text-red-400" />
          </div>
        </div>
        
        {/* Error Status */}
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
          {statusCode}
        </h1>
        
        {/* Error Title */}
        <h2 className="text-2xl font-semibold text-gray-200 mb-4">
          {title}
        </h2>
        
        {/* Error Message */}
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          {message}
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-blue-900 to-cyan-900 text-white hover:from-blue-800 hover:to-cyan-800 border border-cyan-800/30 transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          )}
          
          {showHomeButton && (
            <a
              href="/"
              className="flex items-center px-6 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800/50 transition-all duration-300"
            >
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </a>
          )}
        </div>

        {/* Background Decoration */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_rgba(24,24,27,0)_0%,_rgba(24,24,27,0.8)_100%)] -z-10" />
      </div>
    </div>
  );
};

export default ErrorPage;