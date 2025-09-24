import React from 'react';
import { motion } from 'framer-motion';
import { Users, Award, Zap, TrendingUp } from 'lucide-react';
import { QuickActionForm } from './QuickActionForm';
import { CustomerSearch } from './CustomerSearch';

export const DashboardTab: React.FC = () => {
  // Mock KPI data (would come from Firebase)
  const kpis = [
    { label: 'Total Members', value: '0', icon: Users, color: 'bg-blue-100 text-blue-600' },
    { label: 'Points Issued', value: '0', icon: Award, color: 'bg-green-100 text-green-600' },
    { label: 'Stamps Issued', value: '0', icon: Zap, color: 'bg-purple-100 text-purple-600' },
    { label: 'Redemption Rate', value: '0%', icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
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
        {/* Customer Search & Quick Actions */}
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <CustomerSearch />
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
          
          <div className="text-center py-8 text-gray-500">
            <p>No recent activity</p>
            <p className="text-sm mt-2">Activity will appear here when customers interact with the system</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};