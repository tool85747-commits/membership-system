import React from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';
import { HeroBlock } from '../ui/HeroBlock';
import { TokenPill } from '../ui/TokenPill';
import { StampGrid } from '../ui/StampGrid';
import { PointsBar } from '../ui/PointsBar';
import { RewardCard } from '../ui/RewardCard';
import { TaskButton } from '../ui/TaskButton';

export const LoyaltyCard: React.FC = () => {
  const { user, outletConfig, onTaskComplete } = useGlobal();

  if (!user) return null;

  const handleTaskClick = (taskId: string) => {
    onTaskComplete(taskId, user.token);
  };

  const handleShare = async () => {
    const shareData = {
      title: outletConfig.name,
      text: `Check out ${outletConfig.name}'s loyalty program!`,
      url: `${window.location.origin}/card/${user.token}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        handleTaskClick('share');
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
      handleTaskClick('share');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {outletConfig.heroImage && (
        <HeroBlock
          image={outletConfig.heroImage}
          title={`Welcome back, ${user.firstName}!`}
        />
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Greeting */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl font-semibold text-gray-900">
            Hi {user.firstName} 👋
          </h1>
        </motion.div>

        {/* Token & Share */}
        <motion.div
          className="flex items-center justify-center space-x-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TokenPill token={user.token} />
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>

        {/* Primary Loyalty Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              {user.loyaltyState.stampsRequired > 0 ? 'Stamps' : 'Points'}
            </span>
            <span className="text-xs text-gray-400">Live</span>
          </div>

          {user.loyaltyState.stampsRequired > 0 ? (
            <StampGrid 
              count={user.loyaltyState.stampsRequired}
              filled={user.loyaltyState.stamps}
              accentColor={outletConfig.accentColor}
            />
          ) : (
            <PointsBar 
              current={user.loyaltyState.points}
              max={1000}
              accentColor={outletConfig.accentColor}
            />
          )}
        </motion.div>

        {/* Available Rewards */}
        {user.loyaltyState.vouchers.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Available Rewards</h2>
            {user.loyaltyState.vouchers
              .filter(voucher => !voucher.isRedeemed)
              .map((voucher, index) => (
                <RewardCard 
                  key={voucher.id}
                  voucher={voucher}
                  userToken={user.token}
                  delay={index * 0.1}
                />
              ))
            }
          </motion.div>
        )}

        {/* Task Buttons */}
        {outletConfig.showTasks && (
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Earn More Rewards</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <TaskButton 
                id="share"
                label="Share & Earn"
                icon="share"
                onClick={() => handleShare()}
              />
              <TaskButton 
                id="checkin"
                label="Check In"
                icon="map-pin"
                onClick={() => handleTaskClick('checkin')}
              />
              <TaskButton 
                id="survey"
                label="Quick Survey"
                icon="clipboard-list"
                onClick={() => handleTaskClick('survey')}
              />
              <TaskButton 
                id="refer"
                label="Refer Friend"
                icon="users"
                onClick={() => handleTaskClick('refer')}
              />
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center text-sm text-gray-500 pt-8 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-x-4">
            <button className="hover:text-gray-700 transition-colors">
              Unsubscribe
            </button>
            <span>•</span>
            <button className="hover:text-gray-700 transition-colors">
              Privacy
            </button>
            <span>•</span>
            <button className="hover:text-gray-700 transition-colors">
              Contact
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};