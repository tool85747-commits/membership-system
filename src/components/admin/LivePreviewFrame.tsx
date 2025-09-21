import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import { useGlobal } from '../../context/GlobalContext';
import { HeroBlock } from '../ui/HeroBlock';
import { TokenPill } from '../ui/TokenPill';
import { StampGrid } from '../ui/StampGrid';
import { TaskButton } from '../ui/TaskButton';

export const LivePreviewFrame: React.FC = () => {
  const { outletConfig } = useGlobal();

  // Mock preview user data
  const previewUser = {
    token: 'PREVIEW',
    firstName: 'John',
    loyaltyState: {
      stamps: 7,
      stampsRequired: 10,
      points: 150,
      vouchers: []
    }
  };

  return (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        </div>
        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
          Live
        </span>
      </div>

      {/* Phone Frame */}
      <div className="mx-auto max-w-xs">
        <div className="bg-black rounded-[2rem] p-2">
          <div className="bg-white rounded-[1.5rem] overflow-hidden">
            {/* Preview Header */}
            <div className="bg-white px-4 py-3 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900 text-sm">
                  {outletConfig.name}
                </h4>
                <div className="w-6 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>

            {/* Preview Content */}
            <div className="bg-white min-h-96">
              {outletConfig.heroImage && (
                <HeroBlock
                  image={outletConfig.heroImage}
                  title={`Welcome back, ${previewUser.firstName}!`}
                />
              )}

              <div className="p-4 space-y-4 text-xs">
                {/* Greeting */}
                <div className="text-center">
                  <h5 className="font-semibold text-gray-900">
                    Hi {previewUser.firstName} 👋
                  </h5>
                </div>

                {/* Token */}
                <div className="flex justify-center">
                  <div className="bg-gray-50 rounded-full px-3 py-1 flex items-center space-x-2">
                    <span className="text-xs font-mono">Token: {previewUser.token}</span>
                  </div>
                </div>

                {/* Loyalty Card */}
                <div className="bg-white rounded-lg border border-gray-100 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-medium text-gray-600">Stamps</span>
                    <span className="text-xs text-gray-400">Live</span>
                  </div>

                  <div className="grid grid-cols-5 gap-1">
                    {Array.from({ length: 10 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${
                          i < previewUser.loyaltyState.stamps
                            ? 'text-white border-transparent'
                            : 'border-gray-300 text-gray-400'
                        }`}
                        style={{
                          backgroundColor: i < previewUser.loyaltyState.stamps 
                            ? outletConfig.accentColor 
                            : 'transparent'
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tasks */}
                {outletConfig.showTasks && (
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2 text-xs">
                      Earn More Rewards
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 border border-gray-200 rounded-lg text-center">
                        <div className="text-xs">Share & Earn</div>
                      </div>
                      <div className="p-2 border border-gray-200 rounded-lg text-center">
                        <div className="text-xs">Check In</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};