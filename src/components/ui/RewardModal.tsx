import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, Copy, Check } from 'lucide-react';
import { useModalEvents } from '../../hooks/useFirestore';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { AsyncButton } from './AsyncButton';

interface RewardModalProps {
  userId: string;
  userToken: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({ userId, userToken }) => {
  const events = useModalEvents(userId);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (events.length > 0 && !currentEvent) {
      const latestEvent = events[0];
      setCurrentEvent(latestEvent);
      setShowModal(true);
    }
  }, [events, currentEvent]);

  const handleClose = async () => {
    if (currentEvent) {
      try {
        await updateDoc(doc(db, 'modalEvents', currentEvent.id), {
          shownAt: Timestamp.now()
        });
      } catch (error) {
        console.error('Failed to mark event as shown:', error);
      }
    }
    
    setShowModal(false);
    setCurrentEvent(null);
  };

  const handleCopyToken = async () => {
    try {
      await navigator.clipboard.writeText(userToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy token:', error);
    }
  };

  if (!showModal || !currentEvent) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <motion.div
          className="bg-white rounded-2xl p-6 max-w-sm w-full relative"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center">
            {/* Animated Gift Icon */}
            <motion.div
              className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                delay: 0.2, 
                type: 'spring', 
                stiffness: 200,
                damping: 10
              }}
            >
              <Gift className="w-10 h-10 text-white" />
            </motion.div>

            {/* Confetti Animation */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {Array.from({ length: 20 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, y: 0 }}
                  animate={{ 
                    scale: [0, 1, 0],
                    y: [0, -50, 100],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 2,
                    delay: 0.5 + i * 0.1,
                    ease: 'easeOut'
                  }}
                />
              ))}
            </motion.div>

            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              🎉 YOU'VE GOT A REWARD!
            </motion.h2>

            <motion.p
              className="text-gray-600 mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {currentEvent.message || 'Congratulations! You\'ve earned a reward.'}
            </motion.p>

            {/* Token Display */}
            <motion.div
              className="bg-gray-50 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-600 mb-2">Customer Token:</p>
              <div className="flex items-center justify-center space-x-2">
                <p className="font-mono text-lg font-bold text-gray-900">
                  {userToken}
                </p>
                <button
                  onClick={handleCopyToken}
                  className="p-1 rounded hover:bg-gray-200 transition-colors"
                  aria-label="Copy token"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-500" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Show this screen to staff to claim your reward
              </p>
            </motion.div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <AsyncButton
                  onClick={() => {
                    // Keep modal open for staff verification
                    console.log('Showing reward to staff');
                  }}
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  successMsg="Ready for staff!"
                >
                  Show to Staff
                </AsyncButton>
              </motion.div>
              
              <motion.div
                className="flex-1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <AsyncButton
                  onClick={handleClose}
                  variant="secondary"
                  className="w-full"
                >
                  Save for Later
                </AsyncButton>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};