import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Download, Building, Users, Palette } from 'lucide-react';
import { useOutlet } from '../../hooks/useFirestore';
import { useApp } from '../../context/AppContext';
import { adminPublish, exportCustomers, exportAudit, exportVoucherUsage } from '../../lib/firestore';

export const SettingsTab: React.FC = () => {
  const { outletId } = useApp();
  const { outlet } = useOutlet(outletId);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [businessInfo, setBusinessInfo] = useState({
    name: outlet?.name || 'My Loyalty Program',
    contactEmail: outlet?.contactEmail || '',
    contactPhone: outlet?.contactPhone || '',
    timezone: outlet?.timezone || 'America/New_York',
    accentColor: outlet?.accentColor || '#2B8AEF',
  });

  const handleExport = async (type: 'customers' | 'audit' | 'vouchers') => {
    setIsExporting(type);
    try {
      let result;
      switch (type) {
        case 'customers':
          result = await exportCustomers();
          break;
        case 'audit':
          result = await exportAudit();
          break;
        case 'vouchers':
          result = await exportVoucherUsage();
          break;
      }
      
      if (result.data?.url) {
        // Trigger download
        const link = document.createElement('a');
        link.href = result.data.url;
        link.download = `${type}-export.csv`;
        link.click();
      }
    } catch (error) {
      console.error(`Export ${type} error:`, error);
    } finally {
      setIsExporting(null);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await adminPublish({
        outletId,
        settings: businessInfo
      });
    } catch (error) {
      console.error('Save settings error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Business Information */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Building className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Business Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Name
            </label>
            <input
              type="text"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email
            </label>
            <input
              type="email"
              value={businessInfo.contactEmail}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, contactEmail: e.target.value }))}
              placeholder="contact@business.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Phone
            </label>
            <input
              type="tel"
              value={businessInfo.contactPhone}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, contactPhone: e.target.value }))}
              placeholder="+1 555 123 4567"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select 
              value={businessInfo.timezone}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, timezone: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Logo
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">
              Click to upload logo or drag and drop
            </p>
            <p className="text-xs text-gray-500 mt-1">
              SVG, PNG, JPG up to 2MB
            </p>
          </div>
        </div>
      </motion.div>

      {/* Brand Settings */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Brand Settings</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Primary Accent Color
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={businessInfo.accentColor}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, accentColor: e.target.value }))}
              className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={businessInfo.accentColor}
              onChange={(e) => setBusinessInfo(prev => ({ ...prev, accentColor: e.target.value }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            This color will be used for buttons, progress bars, and accents throughout your loyalty program.
          </p>
        </div>
      </motion.div>

      {/* Admin Users */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Admin Users</h3>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Add Admin
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Admin User</p>
              <p className="text-sm text-gray-600">admin@business.com</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                Owner
              </span>
              <button className="text-sm text-gray-600 hover:text-gray-800">
                Edit
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Data Export */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center space-x-2 mb-4">
          <Download className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Data Export</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Export your customer data for backup or analysis purposes.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleExport('customers')}
            disabled={isExporting === 'customers'}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isExporting === 'customers' ? 'Exporting...' : 'Export Customers CSV'}
          </button>
          <button
            onClick={() => handleExport('audit')}
            disabled={isExporting === 'audit'}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isExporting === 'audit' ? 'Exporting...' : 'Export Activity Log CSV'}
          </button>
          <button
            onClick={() => handleExport('vouchers')}
            disabled={isExporting === 'vouchers'}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {isExporting === 'vouchers' ? 'Exporting...' : 'Export Voucher Usage CSV'}
          </button>
        </div>
      </motion.div>

      {/* Save Settings */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex justify-end">
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};