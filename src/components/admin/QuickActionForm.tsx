import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { staffAction } from '../../lib/firestore';

export const QuickActionForm: React.FC = () => {
  const [token, setToken] = useState('');
  const [action, setAction] = useState<'addStamp' | 'addPoints' | 'issueRewardInstant'>('addStamp');
  const [amount, setAmount] = useState(1);
  const [rewardTitle, setRewardTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showUndo, setShowUndo] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const payload: any = {
        token: token.trim().toUpperCase(),
        action,
      };

      if (action === 'addStamp' || action === 'addPoints') {
        payload.amount = amount;
      } else if (action === 'issueRewardInstant') {
        payload.details = { title: rewardTitle || 'Instant Reward' };
      }

      const result = await staffAction(payload);
      
      if (result.data?.success) {
        setSuccess(`Action completed successfully!`);
        setShowUndo(true);
        setTimeout(() => setShowUndo(false), 5 * 60 * 1000); // 5 minutes
        
        // Reset form
        setToken('');
        setAmount(1);
        setRewardTitle('');
      }
    } catch (error: any) {
      console.error('Quick action error:', error);
      setError(error.message || 'Failed to complete action');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUndo = () => {
    // TODO: Implement undo logic
    setShowUndo(false);
    setSuccess('');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center space-x-2 mb-4">
        <Zap className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading}
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
            disabled={isLoading}
          >
            <option value="addStamp">Add Stamps</option>
            <option value="addPoints">Add Points</option>
            <option value="issueRewardInstant">Issue Instant Reward</option>
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
              disabled={isLoading}
            />
          </div>
        )}

        {action === 'issueRewardInstant' && (
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
              disabled={isLoading}
            />
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !token.trim()}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Processing...' : 'Execute Action'}
        </button>
      </form>

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
            <button
              onClick={handleUndo}
              className="text-sm text-yellow-600 hover:text-yellow-700 font-medium"
            >
              Undo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};