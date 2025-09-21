import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { SignupForm } from '../components/SignupForm';
import { LoyaltyCard } from '../components/LoyaltyCard';

export const CustomerPage: React.FC = () => {
  const { token } = useParams();
  const { user } = useApp();
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    // Check if user should see signup
    const shouldShowSignup = !user && !localStorage.getItem('onboardingSeen');
    setShowSignup(shouldShowSignup);
  }, [user]);

  // If we have a token in URL but no user, we'd fetch user by token in real app
  const shouldShowLoyaltyCard = user && (token === user.token || !token);

  return (
    <div className="min-h-screen bg-white">
      <main className="pb-16">
        <AnimatePresence mode="wait">
          {showSignup && !shouldShowLoyaltyCard ? (
            <motion.div
              key="signup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.28 }}
            >
              <SignupForm onComplete={() => {
                setShowSignup(false);
                localStorage.setItem('onboardingSeen', 'true');
              }} />
            </motion.div>
          ) : shouldShowLoyaltyCard ? (
            <motion.div
              key="loyalty-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28 }}
            >
              <LoyaltyCard />
            </motion.div>
          ) : (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center min-h-screen"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};