import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, Gift, Star, Wifi } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useOutlet, useCustomerLoyalty, useRewards, useContent } from '../hooks/useFirestore';
import { GamifiedMap } from './ui/GamifiedMap';
import { RewardModal } from './ui/RewardModal';
import { RewardCard } from './ui/RewardCard';
import { HeroSection } from './ui/HeroSection';
import { AsyncButton } from './ui/AsyncButton';
import { taskComplete } from '../lib/firestore';

export const LoyaltyCard: React.FC = () => {
  const { user, outletId } = useApp();
  const { outlet } = useOutlet(outletId);
  const { loyalty } = useCustomerLoyalty(user?.id || null);
  const { rewards } = useRewards(user?.id || null);
  const { content } = useContent(outletId);
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
        // Award points for sharing if configured
        await taskComplete({
          userToken: user.token,
          ruleId: 'share-reward',
          clientEventToken: Date.now().toString()
        });
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
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            {outlet.logo && (
              <img 
                src={outlet.logo}
                alt={outlet.name}
                className="w-8 h-8 rounded-lg"
              />
            )}
            <h1 className="font-semibold text-gray-900 text-lg">
              {outlet.name}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <Wifi className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-600">Live</span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <HeroSection
        heroImage={outlet.heroImage}
        heroVideo={outlet.heroVideo}
        businessName={outlet.name}
        content={content}
      />

      {/* Welcome Section */}
      <motion.div 
        className="px-4 py-6 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Hi {user.firstName} 👋
        </h2>
        
        {/* Token & Share */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-full px-4 py-2">
            <span className="text-sm font-mono font-medium text-gray-700">
              Token: {user.token}
            </span>
            <button
              onClick={handleCopyToken}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
              aria-label="Copy token"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-600" />
              ) : (
                <Copy className="w-4 h-4 text-gray-500" />
              )}
            </button>
          </div>
          
          <AsyncButton
            asyncFn={handleShare}
            variant="secondary"
            size="sm"
            className="p-2 rounded-full"
            successMsg="Thanks for sharing!"
          >
            <Share2 className="w-4 h-4" />
          </AsyncButton>
        </div>
      </motion.div>

      <div className="px-4 py-6 space-y-6">
        {/* Gamified Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GamifiedMap
            stampsRequired={requiredStamps}
            currentStamps={currentStamps}
            points={loyalty.points}
            template={outlet.template}
            accentColor={outlet.accentColor}
          />
        </motion.div>

        {/* Earned Rewards */}
        {availableRewards.length > 0 && (
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center space-x-2">
              <Gift className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Your Rewards</h2>
            </div>
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

        {/* Quick Actions */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          
          <div className="grid grid-cols-2 gap-3">
            <AsyncButton
              asyncFn={handleShare}
              variant="secondary"
              className="p-4 flex flex-col items-center space-y-2"
              successMsg="Thanks for sharing!"
            >
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share & Earn</span>
            </AsyncButton>
            
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex flex-col items-center space-y-2">
              <Gift className="w-5 h-5" />
              <span className="text-sm">Show Rewards</span>
            </button>
          </div>
        </motion.div>

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
            <p className="text-xs mt-2">Template: {outlet.template}</p>
          </div>
        </motion.div>
      </div>

      {/* Reward Modal */}
      <RewardModal userId={user.id} userToken={user.token} />
    </div>
  );
};