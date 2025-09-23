import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Trophy, Zap } from 'lucide-react';

interface GamifiedMapProps {
  stampsRequired: number;
  currentStamps: number;
  points: number;
  template: string;
  accentColor: string;
  onRewardReady?: () => void;
}

export const GamifiedMap: React.FC<GamifiedMapProps> = ({
  stampsRequired,
  currentStamps,
  points,
  template,
  accentColor,
  onRewardReady
}) => {
  const progress = Math.min(currentStamps / stampsRequired, 1);
  const isRewardReady = currentStamps >= stampsRequired;

  if (template === 'map-journey') {
    return <MapJourney 
      stampsRequired={stampsRequired}
      currentStamps={currentStamps}
      points={points}
      accentColor={accentColor}
      isRewardReady={isRewardReady}
      onRewardReady={onRewardReady}
    />;
  }

  if (template === 'wallet-card') {
    return <WalletCard 
      stampsRequired={stampsRequired}
      currentStamps={currentStamps}
      points={points}
      accentColor={accentColor}
      progress={progress}
    />;
  }

  // Default: Classic Progress
  return <ClassicProgress 
    stampsRequired={stampsRequired}
    currentStamps={currentStamps}
    points={points}
    accentColor={accentColor}
    isRewardReady={isRewardReady}
    onRewardReady={onRewardReady}
  />;
};

const MapJourney: React.FC<{
  stampsRequired: number;
  currentStamps: number;
  points: number;
  accentColor: string;
  isRewardReady: boolean;
  onRewardReady?: () => void;
}> = ({ stampsRequired, currentStamps, points, accentColor, isRewardReady, onRewardReady }) => {
  const nodes = Array.from({ length: stampsRequired }, (_, i) => ({
    index: i,
    filled: i < currentStamps,
    isLast: i === stampsRequired - 1
  }));

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Your Journey</span>
        </div>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">{points} pts</span>
        </div>
      </div>

      {/* Journey Path */}
      <div className="relative mb-6">
        {/* Path Line */}
        <div className="absolute top-6 left-6 right-6 h-1 bg-gray-200 rounded-full" />
        <motion.div
          className="absolute top-6 left-6 h-1 rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, (currentStamps / stampsRequired) * 100 - 10)}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />

        {/* Journey Nodes */}
        <div className="relative flex justify-between">
          {nodes.map((node) => (
            <motion.div
              key={node.index}
              className={`relative w-12 h-12 rounded-full border-3 flex items-center justify-center ${
                node.filled 
                  ? 'border-transparent shadow-lg' 
                  : 'border-gray-300 bg-white'
              }`}
              style={{ 
                backgroundColor: node.filled ? accentColor : 'white',
                borderColor: node.filled ? accentColor : undefined
              }}
              initial={{ scale: 0.8, opacity: 0.6 }}
              animate={node.filled ? { 
                scale: [0.8, 1.2, 1],
                opacity: 1,
                transition: { 
                  duration: 0.6, 
                  delay: node.index * 0.1,
                  type: 'spring',
                  stiffness: 200
                }
              } : { scale: 0.8, opacity: 0.6 }}
            >
              {node.filled ? (
                node.isLast && isRewardReady ? (
                  <Trophy className="w-6 h-6 text-white" />
                ) : (
                  <Star className="w-5 h-5 text-white" />
                )
              ) : (
                <span className="text-xs font-medium text-gray-500">
                  {node.index + 1}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-2">
          {isRewardReady 
            ? "🎉 You did it — claim your reward!" 
            : `Keep going — ${stampsRequired - currentStamps} steps to your free coffee!`
          }
        </p>
        
        {isRewardReady && onRewardReady && (
          <motion.button
            onClick={onRewardReady}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Claim Reward
          </motion.button>
        )}
      </div>
    </div>
  );
};

const WalletCard: React.FC<{
  stampsRequired: number;
  currentStamps: number;
  points: number;
  accentColor: string;
  progress: number;
}> = ({ stampsRequired, currentStamps, points, accentColor, progress }) => {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white" />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Loyalty Card</h3>
            <p className="text-sm opacity-75">Member Since 2024</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{points}</div>
            <div className="text-xs opacity-75">POINTS</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke={accentColor}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 176" }}
                animate={{ strokeDasharray: `${progress * 176} 176` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold">{currentStamps}/{stampsRequired}</span>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Stamps Progress</p>
            <p className="text-xs opacity-75">
              {stampsRequired - currentStamps} more for reward
            </p>
          </div>
        </div>

        {/* Stamp Dots */}
        <div className="flex justify-center space-x-1">
          {Array.from({ length: stampsRequired }, (_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${
                i < currentStamps ? 'opacity-100' : 'opacity-30'
              }`}
              style={{ backgroundColor: accentColor }}
              initial={{ scale: 0 }}
              animate={{ scale: i < currentStamps ? 1 : 0.7 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const ClassicProgress: React.FC<{
  stampsRequired: number;
  currentStamps: number;
  points: number;
  accentColor: string;
  isRewardReady: boolean;
  onRewardReady?: () => void;
}> = ({ stampsRequired, currentStamps, points, accentColor, isRewardReady, onRewardReady }) => {
  const stamps = Array.from({ length: stampsRequired }, (_, i) => i < currentStamps);

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Loyalty Progress</h3>
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-medium text-gray-700">{points} pts</span>
        </div>
      </div>

      {/* Stamp Grid */}
      <div className="grid grid-cols-5 gap-3 mb-4">
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
              scale: [1, 1.2, 1],
              transition: { duration: 0.3, delay: index * 0.05 }
            } : { scale: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-sm font-semibold">
              {index + 1}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Progress Text */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">
          {isRewardReady 
            ? "🎉 You did it — claim your reward!" 
            : `Nice! +${currentStamps} stamps — you're ${stampsRequired - currentStamps} steps closer.`
          }
        </p>
        
        {isRewardReady && onRewardReady && (
          <motion.button
            onClick={onRewardReady}
            className="px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Claim Reward
          </motion.button>
        )}
      </div>
    </div>
  );
};