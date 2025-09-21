import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Gift } from 'lucide-react';

export const VouchersTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl font-semibold text-gray-900">Vouchers</h2>
        
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Create Voucher</span>
        </button>
      </div>

      {/* Empty State */}
      <motion.div
        className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <Gift className="w-8 h-8 text-gray-400" />
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No vouchers created yet
        </h3>
        
        <p className="text-gray-600 mb-6">
          Create vouchers to offer special rewards to your customers.
        </p>
        
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Create Your First Voucher
        </button>
      </motion.div>
    </div>
  );
};