import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useOutlet, useCustomerLoyalty, useRewards } from '../hooks/useFirestore';
import { StampGrid } from './ui/StampGrid';
import { PointsBar } from './ui/PointsBar';
import { RewardModal } from './ui/RewardModal';
import { RewardCard } from './ui/RewardCard';

export const LoyaltyCard: React.FC = () => {
  const { user, outletId } = useApp();
  const { outlet } = useOutlet(outletId);
  const { loyalty } = useCustomerLoyalty(user?.id || null);
  const { rewards } = useRewards(user?.id || null);
  const [copied, setCopied] = useState(false);

  if (!user || !outlet || !loyalty) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(user.token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: outlet.name,
      text: `Check out ${outlet.name}'s loyalty program!`,
      url: `${window.location.origin}/card/${user.token}`
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareData.url);
    }
  };

  const currentStamps = loyalty.stamps['default'] || 0;
  const requiredStamps = outlet.settings.stampsRequired;
  const availableRewards = rewards.filter(r => r.redeemable && !r.redeemedAt);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 px-4 py-8">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            Hi {user.firstName} 👋
          </h1>
          <p className="text-gray-600">Welcome to {outlet.name}</p>
        </motion.div>

        {/* Token & Share */}
        <motion.div
          className="flex items-center justify-center space-x-4 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm font-mono font-medium text-gray-700">
              Token: {user.token}
            </span>
            <button
              onClick={handleCopyToken}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Copy token"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white hover:bg-gray-50 transition-colors shadow-sm"
            aria-label="Share"
          >
            <Share2 className="w-5 h-5 text-gray-600" />
          </button>
        </motion.div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Stamps Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Stamps</span>
            <span className="text-xs text-gray-400">Live</span>
          </div>

          <StampGrid 
            count={requiredStamps}
            filled={currentStamps}
            accentColor={outlet.accentColor}
          />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStamps} of {requiredStamps} stamps
            </p>
          </div>
        </motion.div>

        {/* Points Card */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">Points</span>
            <span className="text-xs text-gray-400">Live</span>
          </div>

          <PointsBar 
            current={loyalty.points}
            max={outlet.settings.pointsRequired}
            accentColor={outlet.accentColor}
          />
        </motion.div>

        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Available Rewards</h2>
            {availableRewards.map((reward, index) => (
              <RewardCard 
                key={reward.id}
                reward={reward}
                userToken={user.token}
                delay={index * 0.1}
              />
            ))}
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          className="text-center text-sm text-gray-500 pt-8 border-t border-gray-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="space-y-2">
            <p>{outlet.name}</p>
            {outlet.contactEmail && (
              <p>{outlet.contactEmail}</p>
            )}
            {outlet.contactPhone && (
              <p>{outlet.contactPhone}</p>
            )}
            <div className="space-x-4 mt-4">
              <button className="hover:text-gray-700 transition-colors">
                Change Preferences
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
          </div>
        </motion.div>
      </div>

      {/* Reward Modal */}
      <RewardModal userId={user.id} />
    </div>
  );
};