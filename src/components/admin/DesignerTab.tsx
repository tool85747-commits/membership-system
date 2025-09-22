import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Eye, Palette } from 'lucide-react';
import { useOutlet } from '../../hooks/useFirestore';
import { useApp } from '../../context/AppContext';
import { adminPublish } from '../../lib/firestore';

const templates = [
  { id: 'classic-progress', name: 'Classic Progress', description: 'Standard stamp grid or point bar' },
  { id: 'map-journey', name: 'Map Journey', description: 'Gamified path (treasure map / road / adventure)' },
  { id: 'hero-grid', name: 'Hero + Grid', description: 'Hero image/video at top, rewards grid below' },
  { id: 'event-focused', name: 'Event-Focused', description: 'Centered around events/promotions' },
  { id: 'wallet-card', name: 'Wallet Card', description: 'Digital membership card style' },
];
export const DesignerTab: React.FC = () => {
  const { outletId } = useApp();
  const { outlet } = useOutlet(outletId);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(outlet?.template || 'classic-progress');
  const [settings, setSettings] = useState({
    stampsRequired: 10,
    pointsRequired: 1000,
    welcomeBonusStamps: 0,
    welcomeBonusPoints: 10,
    heroImage: outlet?.heroImage || '',
  });

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      await adminPublish({
        outletId,
        settings: {
          template: selectedTemplate,
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

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    setIsDraft(true);
  };
  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-2 mb-4">
          <Palette className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Templates</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <motion.div
              key={template.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleTemplateChange(template.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
                <span className="text-xs text-gray-500">Preview</span>
              </div>
              
              <h4 className="font-medium text-gray-900 text-sm mb-1">
                {template.name}
              </h4>
              <p className="text-xs text-gray-600">
                {template.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
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

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hero Image URL
            </label>
            <input
              type="url"
              value={settings.heroImage}
              onChange={(e) => handleSettingChange('heroImage', e.target.value)}
              placeholder="https://example.com/hero-image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Enter a URL for the hero image that appears at the top of the customer page
            </p>
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