import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobal } from '../context/GlobalContext';
import { Header } from './ui/Header';
import { SignupForm } from './customer/SignupForm';
import { LoyaltyCard } from './customer/LoyaltyCard';
import { HeroBlock } from './ui/HeroBlock';

export const CustomerPage: React.FC = () => {
  const { token } = useParams();
  const { user, outletConfig } = useGlobal();
  const [showSignup, setShowSignup] = useState(!user && !token);

  // If we have a token in URL but no user, we'd fetch user by token in real app
  const shouldShowLoyaltyCard = user && (token === user.token || !token);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
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
              {outletConfig.heroImage && (
                <HeroBlock
                  image={outletConfig.heroImage}
                  title={outletConfig.name}
                  subtitle="Earn rewards with every visit"
                />
              )}
              
              <div className="px-4 py-8">
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900 mb-4">
                      Join Our Rewards Program
                    </h1>
                    <p className="text-gray-600 leading-relaxed">
                      {outletConfig.introText}
                    </p>
                  </div>
                  
                  <SignupForm onComplete={() => setShowSignup(false)} />
                </div>
              </div>
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