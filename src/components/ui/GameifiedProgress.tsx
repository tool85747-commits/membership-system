import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Trophy, Zap } from 'lucide-react';

interface GameifiedProgressProps {
  count: number;
  filled: number;
  accentColor?: string;
  template?: string;
}

export const GameifiedProgress: React.FC<GameifiedProgressProps> = ({ 
  count, 
  filled, 
  accentColor = '#2B8AEF',
  template = 'classic-progress'
}) => {
  const stamps = Array.from({ length: count }, (_, i) => i < filled);

  if (template === 'map-journey') {
    return <MapJourney stamps={stamps} accentColor={accentColor} />;
  }

  if (template === 'wallet-card') {
    return <WalletCard stamps={stamps} accentColor={accentColor} />;
  }

  // Default: Classic grid
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

const MapJourney: React.FC<{ stamps: boolean[], accentColor: string }> = ({ stamps, accentColor }) => {
  return (
    <div className="relative">
      {/* Journey Path */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-600">Start</span>
        </div>
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-yellow-500" />
          <span className="text-sm text-gray-600">Reward</span>
        </div>
      </div>

      {/* Progress Path */}
      <div className="relative">
        <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-200 rounded-full transform -translate-y-1/2"></div>
        <motion.div
          className="absolute top-1/2 left-0 h-2 rounded-full transform -translate-y-1/2"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${(stamps.filter(Boolean).length / stamps.length) * 100}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        
        <div className="relative flex justify-between">
          {stamps.map((isStamped, index) => (
            <motion.div
              key={index}
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white ${
                isStamped 
                  ? 'border-transparent shadow-lg' 
                  : 'border-gray-300'
              }`}
              style={{ borderColor: isStamped ? accentColor : undefined }}
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={isStamped ? { 
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, delay: index * 0.1 }
              } : { scale: 0.8, opacity: 0.6 }}
            >
              {isStamped ? (
                <Star className="w-4 h-4" style={{ color: accentColor }} />
              ) : (
                <span className="text-xs text-gray-400">{index + 1}</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const WalletCard: React.FC<{ stamps: boolean[], accentColor: string }> = ({ stamps, accentColor }) => {
  const filledCount = stamps.filter(Boolean).length;
  const percentage = (filledCount / stamps.length) * 100;

  return (
    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Zap className="w-5 h-5" style={{ color: accentColor }} />
          <span className="font-medium text-gray-900">Loyalty Progress</span>
        </div>
        <span className="text-sm font-medium text-gray-600">
          {filledCount}/{stamps.length}
        </span>
      </div>

      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      <div className="flex justify-center space-x-1">
        {stamps.map((isStamped, index) => (
          <motion.div
            key={index}
            className={`w-3 h-3 rounded-full ${
              isStamped ? 'opacity-100' : 'opacity-30'
            }`}
            style={{ backgroundColor: accentColor }}
            initial={{ scale: 0 }}
            animate={{ scale: isStamped ? 1 : 0.7 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </div>
  );
};