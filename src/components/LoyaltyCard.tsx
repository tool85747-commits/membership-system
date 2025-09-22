import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Calendar, Gift, Star, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useOutlet, useCustomerLoyalty, useRewards } from '../hooks/useFirestore';
import { GameifiedProgress } from './ui/GameifiedProgress';
import { PointsBar } from './ui/PointsBar';
import { RewardModal } from './ui/RewardModal';
import { RewardCard } from './ui/RewardCard';
import { HeroSection } from './ui/HeroSection';
import { EventsNews } from './ui/EventsNews';

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
  const template = outlet.template || 'classic-progress';

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section with Business Branding */}
      <HeroSection 
        outlet={outlet}
        user={user}
        onCopyToken={handleCopyToken}
        onShare={handleShare}
        copied={copied}
      />

      {/* Events & News Section */}
      <EventsNews outletId={outletId} />

      <div className="px-4 py-6 space-y-6">
        {/* Gamified Loyalty Progress */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium text-gray-600">
              {template === 'map-journey' ? 'Your Journey' : 'Progress'}
            </span>
            <span className="text-xs text-gray-400">Live</span>
          </div>

          <GameifiedProgress 
            count={requiredStamps}
            filled={currentStamps}
            accentColor={outlet.accentColor}
            template={template}
          />
          
          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              {currentStamps} of {requiredStamps} stamps
            </p>
            {currentStamps >= requiredStamps && (
              <motion.button
                className="mt-3 px-6 py-2 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                🎉 Redeem Reward!
              </motion.button>
            )}
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
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium text-gray-600">Points</span>
            </div>
            <span className="text-xs text-gray-400">Live</span>
          </div>

          <PointsBar 
            current={loyalty.points}
            max={outlet.settings.pointsRequired}
            accentColor={outlet.accentColor}
          />
        </motion.div>

        {/* Available Rewards Section */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center space-x-2 mb-4">
            <Gift className="w-5 h-5 text-purple-600" />
            <h2 className="text-lg font-semibold text-gray-900">Available Rewards</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Free Coffee</h3>
                  <p className="text-sm text-gray-600">Collect {requiredStamps} stamps</p>
                </div>
                <div className="text-right">
                  {currentStamps >= requiredStamps ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      Ready!
                    </span>
                  ) : (
                    <span className="text-sm text-gray-500">
                      {requiredStamps - currentStamps} more
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg opacity-60">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium text-gray-900">Free Pastry</h3>
                  <p className="text-sm text-gray-600">Collect {outlet.settings.pointsRequired} points</p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-500">
                    {Math.max(0, outlet.settings.pointsRequired - loyalty.points)} more
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Available Rewards */}
        {availableRewards.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-lg font-semibold text-gray-900">Your Earned Rewards</h2>
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
          transition={{ delay: 0.7 }}
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