import React from 'react';
import { motion } from 'framer-motion';

interface StampGridProps {
  count: number;
  filled: number;
  accentColor?: string;
}

export const StampGrid: React.FC<StampGridProps> = ({ 
  count, 
  filled, 
  accentColor = '#2B8AEF' 
}) => {
  const stamps = Array.from({ length: count }, (_, i) => i < filled);

  return (
    <div className="grid grid-cols-5 gap-3 max-w-xs mx-auto">
      {stamps.map((isStamped, index) => (
        <motion.div
          key={index}
          className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${
            isStamped 
              ? 'border-transparent text-white' 
              : 'border-gray-300 text-gray-400'
          }`}
          style={{ backgroundColor: isStamped ? accentColor : 'transparent' }}
          initial={{ scale: 1 }}
          animate={isStamped ? { 
            scale: [1, 1.12, 1],
            transition: { duration: 0.18 }
          } : { scale: 1 }}
        >
          <span className="text-sm font-semibold">
            {index + 1}
          </span>
        </motion.div>
      ))}
    </div>
  );
};