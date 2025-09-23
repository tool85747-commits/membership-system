import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { staffAction } from '../../lib/firestore';
import { AsyncButton } from '../ui/AsyncButton';

export const QuickActionForm: React.FC = () => {
  const [token, setToken] = useState('');
  const [action, setAction] = useState<'addStamp' | 'addPoints' | 'issueInstantReward'>('addStamp');
  const [amount, setAmount] = useState(1);
  const [rewardTitle, setRewardTitle] = useState('');
  const [showUndo, setShowUndo] = useState(false);

  const handleSubmit = async () => {
    if (!token.trim()) {
      throw new Error('Please enter a customer token');
    }

    const payload: any = {
      token: token.trim().toUpperCase(),
      action,
    };

    if (action === 'addStamp' || action === 'addPoints') {
      payload.amount = amount;
    } else if (action === 'issueInstantReward') {
      payload.rewardDetails = { title: rewardTitle || 'Instant Reward' };
    }

    const result = await staffAction(payload);
    
    if (result.data?.success) {
      setShowUndo(true);
      setTimeout(() => setShowUndo(false), 5 * 60 * 1000); // 5 minutes
      
      // Reset form
      setToken('');
      setAmount(1);
      setRewardTitle('');
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo logic
    setShowUndo(false);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
            Customer Token
          </label>
          <input
            type="text"
            id="token"
            value={token}
            onChange={(e) => setToken(e.target.value.toUpperCase())}
            placeholder="Enter token (e.g., ABC123)"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <select
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value as any)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="addStamp">Add Stamps</option>
            <option value="addPoints">Add Points</option>
            <option value="issueInstantReward">Issue Instant Reward</option>
          </select>
        </div>

        {(action === 'addStamp' || action === 'addPoints') && (
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        {action === 'issueInstantReward' && (
          <div>
            <label htmlFor="rewardTitle" className="block text-sm font-medium text-gray-700 mb-1">
              Reward Title
            </label>
            <input
              type="text"
              id="rewardTitle"
              value={rewardTitle}
              onChange={(e) => setRewardTitle(e.target.value)}
              placeholder="e.g., Birthday Gift"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <AsyncButton
          asyncFn={handleSubmit}
          disabled={!token.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          successMsg="Action completed successfully!"
          errorMsg="Failed to execute action"
        >
          Execute Action
        </AsyncButton>
      </div>

      {showUndo && (
        <motion.div
          className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm text-yellow-800">
              Action completed successfully
            </p>
            <AsyncButton
              onClick={handleUndo}
              variant="secondary"
              size="sm"
              className="text-yellow-600 hover:text-yellow-700"
            >
              Undo
            </AsyncButton>
          </div>
        </motion.div>
      )}
    </div>
  );
};