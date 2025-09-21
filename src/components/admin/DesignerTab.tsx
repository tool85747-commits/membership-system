import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Save, Upload } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';
import { TemplateSelector } from './TemplateSelector';
import { LivePreviewFrame } from './LivePreviewFrame';
import { RulesPanel } from './RulesPanel';

export const DesignerTab: React.FC = () => {
  const { outletConfig, updateOutletConfig } = useGlobal();
  const [isDraft, setIsDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsDraft(false);
    } catch (error) {
      console.error('Publish error:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleConfigChange = (key: string, value: any) => {
    updateOutletConfig({ [key]: value });
    setIsDraft(true);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Controls Panel */}
      <div className="xl:col-span-2 space-y-6">
        {/* Template Selector */}
        <TemplateSelector
          selectedTemplate={outletConfig.template}
          onSelect={(template) => handleConfigChange('template', template)}
        />

        {/* Design Controls */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hero Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={outletConfig.accentColor}
                  onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={outletConfig.accentColor}
                  onChange={(e) => handleConfigChange('accentColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Intro Text
            </label>
            <textarea
              value={outletConfig.introText}
              onChange={(e) => handleConfigChange('introText', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your welcome message..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              CTA Text
            </label>
            <input
              type="text"
              value={outletConfig.ctaText}
              onChange={(e) => handleConfigChange('ctaText', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Join Now, Get Started"
            />
          </div>

          <div className="mt-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={outletConfig.showTasks}
                onChange={(e) => handleConfigChange('showTasks', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Show task buttons
              </span>
            </label>
          </div>
        </div>

        {/* Rules Panel */}
        <RulesPanel />

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

      {/* Live Preview */}
      <div className="xl:col-span-1">
        <div className="sticky top-6">
          <LivePreviewFrame />
        </div>
      </div>
    </div>
  );
};