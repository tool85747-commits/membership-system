import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, MapPin, ClipboardList, Users, Check } from 'lucide-react';

interface TaskButtonProps {
  id: string;
  label: string;
  icon: 'share' | 'map-pin' | 'clipboard-list' | 'users';
  onClick: () => void;
  disabled?: boolean;
}

const iconMap = {
  share: Share2,
  'map-pin': MapPin,
  'clipboard-list': ClipboardList,
  users: Users,
};

export const TaskButton: React.FC<TaskButtonProps> = ({
  id,
  label,
  icon,
  onClick,
  disabled = false
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const Icon = iconMap[icon];

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    setIsLoading(true);
    try {
      await onClick();
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2000);
    } catch (error) {
      console.error('Task error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled || isLoading}
      className={`w-full p-4 rounded-xl border transition-all duration-200 ${
        disabled
          ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
          : isSuccess
          ? 'bg-green-50 border-green-200 text-green-700'
          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'
      }`}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center justify-center">
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
          ) : isSuccess ? (
            <Check className="w-5 h-5" />
          ) : (
            <Icon className="w-5 h-5" />
          )}
        </div>
        <span className="text-sm font-medium">
          {isSuccess ? 'Completed!' : label}
        </span>
      </div>
    </motion.button>
  );
};