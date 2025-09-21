import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Gift, Calendar, Users } from 'lucide-react';

export const VouchersTab: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock voucher data
  const vouchers = [
    {
      id: '1',
      name: 'Free Coffee',
      code: 'COFFEE50',
      description: 'Redeem for a free regular coffee',
      expiry: '2024-12-31',
      usageLimit: 1,
      totalIssued: 150,
      totalRedeemed: 87,
      onRedeem: { consumeStamps: 5, awardPoints: 0 }
    },
    {
      id: '2',
      name: '20% Off Next Visit',
      code: 'SAVE20',
      description: '20% discount on your next purchase',
      expiry: '2024-06-30',
      usageLimit: 1,
      totalIssued: 200,
      totalRedeemed: 145,
      onRedeem: { consumePoints: 100, awardStamps: 1 }
    },
    {
      id: '3',
      name: 'Birthday Special',
      code: 'BIRTHDAY',
      description: 'Special birthday reward',
      expiry: null,
      usageLimit: 1,
      totalIssued: 45,
      totalRedeemed: 12,
      onRedeem: { awardStamps: 3, awardPoints: 50 }
    }
  ];

  return (
    <>
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vouchers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full sm:w-80"
            />
          </div>

          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Import CSV
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Voucher</span>
            </button>
          </div>
        </div>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {vouchers.map((voucher, index) => (
            <motion.div
              key={voucher.id}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <Gift className="w-5 h-5" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {voucher.totalRedeemed} / {voucher.totalIssued}
                  </p>
                  <p className="text-xs text-gray-600">Redeemed</p>
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                {voucher.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {voucher.description}
              </p>

              {voucher.code && (
                <div className="bg-gray-100 rounded-lg p-2 mb-3">
                  <p className="text-xs text-gray-600">Code</p>
                  <p className="font-mono text-sm font-medium">{voucher.code}</p>
                </div>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {voucher.expiry 
                      ? `Expires ${new Date(voucher.expiry).toLocaleDateString()}`
                      : 'No expiry'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {voucher.usageLimit === 1 ? 'Single use' : `${voucher.usageLimit} uses`}
                  </span>
                </div>
              </div>

              {/* Redemption Config */}
              <div className="bg-gray-50 rounded-lg p-3 mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-2">On Redeem:</h4>
                <div className="space-y-1">
                  {voucher.onRedeem.consumeStamps && (
                    <p className="text-xs text-red-600">
                      • Consume {voucher.onRedeem.consumeStamps} stamps
                    </p>
                  )}
                  {voucher.onRedeem.consumePoints && (
                    <p className="text-xs text-red-600">
                      • Consume {voucher.onRedeem.consumePoints} points
                    </p>
                  )}
                  {voucher.onRedeem.awardStamps && (
                    <p className="text-xs text-green-600">
                      • Award {voucher.onRedeem.awardStamps} stamps
                    </p>
                  )}
                  {voucher.onRedeem.awardPoints && (
                    <p className="text-xs text-green-600">
                      • Award {voucher.onRedeem.awardPoints} points
                    </p>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Edit
                </button>
                <button className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Issue
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Create Voucher Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Voucher
            </h3>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Voucher Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Free Coffee"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code (optional)
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Auto-generated if empty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe what this voucher offers..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consume Stamps
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Consume Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Stamps
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Award Points
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Voucher
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
};