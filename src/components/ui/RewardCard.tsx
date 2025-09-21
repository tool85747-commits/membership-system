import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';

interface Voucher {
  id: string;
  name: string;
  description: string;
  code?: string;
  expiry?: string;
  isRedeemed: boolean;
  onRedeem: {
    consumeStamps?: number;
    consumePoints?: number;
    awardStamps?: number;
    awardPoints?: number;
  };
}

interface RewardCardProps {
  voucher: Voucher;
  userToken: string;
  delay?: number;
}

export const RewardCard: React.FC<RewardCardProps> = ({ 
  voucher, 
  userToken, 
  delay = 0 
}) => {
  const [showModal, setShowModal] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const { onRedeemVoucher, outletConfig } = useGlobal();

  const handleRedeem = async () => {
    if (voucher.isRedeemed || isRedeeming) return;
    
    setIsRedeeming(true);
    try {
      await onRedeemVoucher(voucher.id, userToken);
      setShowModal(false);
    } catch (error) {
      console.error('Redeem error:', error);
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
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${outletConfig.accentColor}20` }}
          >
            <Gift 
              className="w-5 h-5"
              style={{ color: outletConfig.accentColor }}
            />
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">
              {voucher.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {voucher.description}
            </p>
            
            {voucher.code && (
              <div className="text-xs font-mono bg-gray-100 px-2 py-1 rounded mb-2 inline-block">
                {voucher.code}
              </div>
            )}
            
            {voucher.expiry && (
              <p className="text-xs text-gray-500 mb-3">
                Expires: {new Date(voucher.expiry).toLocaleDateString()}
              </p>
            )}
            
            <button
              onClick={() => setShowModal(true)}
              disabled={voucher.isRedeemed}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                voucher.isRedeemed
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
              style={!voucher.isRedeemed ? { backgroundColor: outletConfig.accentColor } : {}}
            >
              {voucher.isRedeemed ? 'Redeemed' : 'Redeem'}
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
              <p className="text-gray-700">{voucher.name}</p>
              
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Transaction Summary:</h4>
                
                {voucher.onRedeem.consumeStamps && (
                  <p className="text-sm text-red-600">
                    • Use {voucher.onRedeem.consumeStamps} stamp{voucher.onRedeem.consumeStamps !== 1 ? 's' : ''}
                  </p>
                )}
                
                {voucher.onRedeem.consumePoints && (
                  <p className="text-sm text-red-600">
                    • Use {voucher.onRedeem.consumePoints} point{voucher.onRedeem.consumePoints !== 1 ? 's' : ''}
                  </p>
                )}
                
                {voucher.onRedeem.awardStamps && (
                  <p className="text-sm text-green-600">
                    • Earn {voucher.onRedeem.awardStamps} stamp{voucher.onRedeem.awardStamps !== 1 ? 's' : ''}
                  </p>
                )}
                
                {voucher.onRedeem.awardPoints && (
                  <p className="text-sm text-green-600">
                    • Earn {voucher.onRedeem.awardPoints} point{voucher.onRedeem.awardPoints !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={isRedeeming}
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-colors"
                style={{ backgroundColor: outletConfig.accentColor }}
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