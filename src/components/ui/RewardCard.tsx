import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { redeemReward, Reward } from '../../lib/firestore';

interface RewardCardProps {
  reward: Reward;
  userToken: string;
  delay?: number;
}

export const RewardCard: React.FC<RewardCardProps> = ({ 
  reward, 
  userToken, 
  delay = 0 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [error, setError] = useState('');

  const handleRedeem = async () => {
    if (reward.redeemedAt || isRedeeming) return;
    
    setIsRedeeming(true);
    setError('');
    
    try {
      if (reward.id) {
        await redeemReward({ 
          userToken, 
          rewardId: reward.id 
        });
      }
      setShowModal(false);
    } catch (error: any) {
      console.error('Redeem error:', error);
      setError(error.message || 'Failed to redeem reward');
    } finally {
      setIsRedeeming(false);
    }
  };

  return (
    <>
      <motion.div
        className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.3 }}
      >
        <div className="flex items-start space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Gift className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {reward.title}
            </h3>
            
            {reward.details && (
              <p className="text-sm text-gray-600 mb-3">
                {reward.details}
              </p>
            )}
            
            <button
              onClick={() => setShowModal(true)}
              disabled={!!reward.redeemedAt}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                reward.redeemedAt
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {reward.redeemedAt ? 'Redeemed' : 'Redeem'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Redeem Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Redeem Reward
            </h3>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-700">{reward.title}</p>
              
              {reward.details && (
                <p className="text-sm text-gray-600">{reward.details}</p>
              )}
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600">
                  Are you sure you want to redeem this reward?
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isRedeeming}
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isRedeeming ? 'Redeeming...' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};