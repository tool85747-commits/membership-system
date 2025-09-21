import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Zap, Gift, TrendingUp, Search } from 'lucide-react';
import { QuickActionForm } from './QuickActionForm';

export const DashboardTab: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock KPI data (would come from API)
  const kpis = [
    { label: 'Total Members', value: '2,847', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Points Issued', value: '45,692', icon: Award, color: 'bg-green-100 text-green-600' },
    { label: 'Stamps Issued', value: '12,403', icon: Zap, color: 'bg-purple-100 text-purple-600' },
    { label: 'Active Rewards', value: '156', icon: Gift, color: 'bg-orange-100 text-orange-600' },
    { label: 'Redemption Rate', value: '23.4%', icon: TrendingUp, color: 'bg-teal-100 text-teal-600' },
  ];

  const recentActivity = [
    { id: 1, type: 'stamp', user: 'John D.', token: 'ABC123', action: 'Added 1 stamp', time: '2 min ago' },
    { id: 2, type: 'redeem', user: 'Sarah M.', token: 'XYZ789', action: 'Redeemed Free Coffee', time: '5 min ago' },
    { id: 3, type: 'signup', user: 'Mike T.', token: 'DEF456', action: 'New member signup', time: '12 min ago' },
    { id: 4, type: 'points', user: 'Lisa K.', token: 'GHI012', action: 'Earned 50 points', time: '18 min ago' },
    { id: 5, type: 'share', user: 'Alex R.', token: 'JKL345', action: 'Shared loyalty card', time: '25 min ago' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${kpi.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</p>
                <p className="text-sm text-gray-600">{kpi.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Search & Quick Actions */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Customer Search */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Search</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by token, phone, or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {searchQuery && (
              <div className="mt-4 space-y-2">
                <div className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">John Doe</p>
                      <p className="text-sm text-gray-600">Token: ABC123 • +1 555 0123</p>
                    </div>
                    <button className="text-sm text-blue-600 hover:text-blue-700">
                      View
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <QuickActionForm />
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${
                  activity.type === 'stamp' ? 'bg-purple-100 text-purple-600' :
                  activity.type === 'redeem' ? 'bg-orange-100 text-orange-600' :
                  activity.type === 'signup' ? 'bg-green-100 text-green-600' :
                  activity.type === 'points' ? 'bg-blue-100 text-blue-600' :
                  'bg-teal-100 text-teal-600'
                }`}>
                  {activity.type === 'stamp' && <Zap className="w-4 h-4" />}
                  {activity.type === 'redeem' && <Gift className="w-4 h-4" />}
                  {activity.type === 'signup' && <Users className="w-4 h-4" />}
                  {activity.type === 'points' && <Award className="w-4 h-4" />}
                  {activity.type === 'share' && <TrendingUp className="w-4 h-4" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.user} ({activity.token})
                  </p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};