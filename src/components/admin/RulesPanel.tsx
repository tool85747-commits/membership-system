import React from 'react';
import { motion } from 'framer-motion';
import { ToggleLeft as Toggle, Settings } from 'lucide-react';

const loyaltyRules = [
  {
    id: 'visit-stamps',
    name: 'Stamps by Visit',
    description: 'Award stamps per staff-marked visit or check-in',
    active: true,
    config: { stampsPerVisit: 1, maxPerDay: 5, cooldownDays: 0 }
  },
  {
    id: 'points-spend',
    name: 'Points by Spend',
    description: 'Award points based on purchase amount',
    active: false,
    config: { ratio: 10, minSpend: 5, maxPerTx: 1000 }
  },
  {
    id: 'share-earn',
    name: 'Share to Earn',
    description: 'Reward users for sharing via Web Share API',
    active: true,
    config: { amount: 1, cooldownDays: 1, maxPerUser: 5 }
  },
  {
    id: 'referral-signup',
    name: 'Referral Sign-up',
    description: 'Reward successful referrals',
    active: false,
    config: { rewardForReferrer: 5, rewardForNewUser: 1 }
  },
  {
    id: 'survey-reward',
    name: 'Survey / Review Reward',
    description: 'Award for completing surveys or reviews',
    active: false,
    config: { amount: 2, maxPerUser: 3, verifyManual: true }
  },
  {
    id: 'checkin-geo',
    name: 'Check-In (Geo)',
    description: 'Location-based check-in rewards',
    active: false,
    config: { radiusMeters: 100, amount: 1, cooldownDays: 1 }
  },
  {
    id: 'welcome-bonus',
    name: 'Welcome / First Signup Bonus',
    description: 'One-time reward for new members',
    active: true,
    config: { awardStamps: 0, awardPoints: 10 }
  }
];

export const RulesPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Loyalty Rules</h3>
        <span className="text-sm text-gray-600">
          {loyaltyRules.filter(r => r.active).length} of 7 active
        </span>
      </div>

      <div className="space-y-4">
        {loyaltyRules.map((rule, index) => (
          <motion.div
            key={rule.id}
            className={`border rounded-lg p-4 transition-all ${
              rule.active ? 'border-blue-200 bg-blue-50' : 'border-gray-200'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    {rule.name}
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={rule.active}
                      onChange={() => {}}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {rule.description}
                </p>

                {rule.active && (
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                    {Object.entries(rule.config).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <label className="text-xs text-gray-600 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </label>
                        <input
                          type={typeof value === 'number' ? 'number' : 'text'}
                          value={value}
                          onChange={() => {}}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {rule.active && (
                <button className="p-1 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};