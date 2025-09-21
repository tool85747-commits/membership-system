import React from 'react';
import { motion } from 'framer-motion';

interface PointsBarProps {
  current: number;
  max: number;
  accentColor?: string;
}

export const PointsBar: React.FC<PointsBarProps> = ({ 
  current, 
  max, 
  accentColor = '#2B8AEF' 
}) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">
          {current.toLocaleString()} pts
        </span>
        <span className="text-sm text-gray-500">
          of {max.toLocaleString()} pts
        </span>
      </div>
      
      <div className="relative w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};