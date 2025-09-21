import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TokenPillProps {
  token: string;
}

export const TokenPill: React.FC<TokenPillProps> = ({ token }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
      <span className="text-sm font-mono font-medium text-gray-700">
        Token: {token}
      </span>
      <motion.button
        onClick={handleCopy}
        className="p-1 rounded-full hover:bg-gray-200 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Copy token"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-600" />
        ) : (
          <Copy className="w-4 h-4 text-gray-500" />
        )}
      </motion.button>
      
      {copied && (
        <motion.div
          className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          Copied!
        </motion.div>
      )}
    </div>
  );
};