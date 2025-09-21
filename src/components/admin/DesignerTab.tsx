import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye } from 'lucide-react';
import { useOutlet } from '../../hooks/useFirestore';
import { useApp } from '../../context/AppContext';
import { adminPublish } from '../../lib/firestore';

export const DesignerTab: React.FC = () => {
  const { outletId } = useApp();
  const { outlet } = useOutlet(outletId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [settings, setSettings] = useState({
    stampsRequired: 10,
    pointsRequired: 1000,
    welcomeBonusStamps: 0,
    welcomeBonusPoints: 10,
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await adminPublish({
        outletId,
        settings: {
          settings,
        }
      });
      setIsDraft(false);
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSettingChange = (key: string, value: number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setIsDraft(true);
  };

  return (
    <div className="space-y-6">
      {/* Loyalty Settings */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loyalty Settings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stamps Required for Reward
            </label>
            <input
              type="number"
              value={settings.stampsRequired}
              onChange={(e) => handleSettingChange('stampsRequired', parseInt(e.target.value) || 10)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Points Required for Reward
            </label>
            <input
              type="number"
              value={settings.pointsRequired}
              onChange={(e) => handleSettingChange('pointsRequired', parseInt(e.target.value) || 1000)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Bonus Stamps
            </label>
            <input
              type="number"
              value={settings.welcomeBonusStamps}
              onChange={(e) => handleSettingChange('welcomeBonusStamps', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Welcome Bonus Points
            </label>
            <input
              type="number"
              value={settings.welcomeBonusPoints}
              onChange={(e) => handleSettingChange('welcomeBonusPoints', parseInt(e.target.value) || 0)}
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Publish Controls */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Publication Status
            </h3>
            <p className="text-sm text-gray-600">
              {isDraft ? 'You have unsaved changes' : 'All changes are published'}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setIsDraft(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={!isDraft}
            >
              <Save className="w-4 h-4 inline mr-2" />
              Save Draft
            </button>
            
            <motion.button
              onClick={handlePublish}
              disabled={isPublishing}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isPublishing ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Publishing...</span>
                </div>
              ) : (
                <>
                  <Eye className="w-4 h-4 inline mr-2" />
                  Publish Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};