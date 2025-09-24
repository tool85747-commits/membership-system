import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { useModalEvents } from '../../hooks/useFirestore';
import { doc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface RewardModalProps {
  userId: string;
}

export const RewardModal: React.FC<RewardModalProps> = ({ userId }) => {
  const events = useModalEvents(userId);
  const [currentEvent, setCurrentEvent] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (events.length > 0 && !currentEvent) {
      const latestEvent = events[0];
      setCurrentEvent(latestEvent);
      setShowModal(true);
    }
  }, [events, currentEvent]);

  const handleClose = async () => {
    if (currentEvent) {
      // Mark event as shown
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

  const handleShowToStaff = () => {
    // Keep modal open for staff verification
    console.log('Showing reward to staff');
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
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="text-center">
            <motion.div
              className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Gift className="w-8 h-8 text-yellow-600" />
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

            <motion.div
              className="bg-gray-50 rounded-lg p-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-600 mb-2">Customer Token:</p>
              <p className="font-mono text-lg font-bold text-gray-900">
                {/* This would be the user's token from context */}
                TOKEN123
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Show this screen to staff to claim your reward
              </p>
            </motion.div>

            <div className="flex space-x-3">
              <motion.button
                onClick={handleShowToStaff}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Show to Staff
              </motion.button>
              
              <motion.button
                onClick={handleClose}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Save for Later
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};