import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AsyncButtonProps {
  onClick?: () => void;
  asyncFn?: () => Promise<any>;
  confirm?: boolean;
  confirmMessage?: string;
  successMsg?: string;
  errorMsg?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const AsyncButton: React.FC<AsyncButtonProps> = ({
  onClick,
  asyncFn,
  confirm = false,
  confirmMessage = 'Are you sure?',
  successMsg = 'Success!',
  errorMsg = 'Something went wrong',
  children,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const baseClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  const buttonClass = `
    ${baseClasses[variant]} 
    ${sizeClasses[size]} 
    rounded-lg font-medium transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${className}
  `.trim();

  const executeAction = async () => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      if (asyncFn) {
        await asyncFn();
      } else if (onClick) {
        onClick();
      }

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setRetryCount(0);
    } catch (err: any) {
      console.error('AsyncButton error:', err);
      setError(err.message || errorMsg);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = () => {
    if (confirm && !showConfirm) {
      setShowConfirm(true);
      return;
    }

    if (showConfirm) {
      setShowConfirm(false);
    }

    executeAction();
  };

  const handleRetry = () => {
    setError(null);
    executeAction();
  };

  return (
    <div className="relative">
      <motion.button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={buttonClass}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        aria-live="polite"
        aria-describedby={error ? 'button-error' : undefined}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span>Loading...</span>
          </div>
        ) : showSuccess ? (
          <div className="flex items-center space-x-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>{successMsg}</span>
          </div>
        ) : (
          children
        )}
      </motion.button>

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-lg p-6 max-w-sm w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold mb-4">Confirm Action</h3>
            <p className="text-gray-600 mb-6">{confirmMessage}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleClick}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <motion.div
          id="button-error"
          className="absolute top-full mt-2 left-0 right-0 p-3 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          role="alert"
        >
          <p className="text-sm text-red-600 mb-2">{error}</p>
          <button
            onClick={handleRetry}
            className="text-sm text-red-700 hover:text-red-800 font-medium"
          >
            Retry {retryCount > 1 && `(${retryCount})`}
          </button>
        </motion.div>
      )}

      {/* Success Toast */}
      {showSuccess && (
        <div
          className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
          role="status"
          aria-live="polite"
        >
          {successMsg}
        </div>
      )}
    </div>
  );
};