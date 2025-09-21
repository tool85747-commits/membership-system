import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobal } from '../../context/GlobalContext';

export const Header: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { outletConfig, isAdmin, setIsAdmin } = useGlobal();

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            {outletConfig.logo && (
              <img 
                src={outletConfig.logo}
                alt={outletConfig.name}
                className="w-8 h-8 rounded-lg"
              />
            )}
            <h1 className="font-semibold text-gray-900 text-lg">
              {outletConfig.name}
            </h1>
          </div>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            {showMenu ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowMenu(false)}
          >
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-semibold">Menu</h2>
                  <button
                    onClick={() => setShowMenu(false)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <button
                    onClick={() => {
                      setIsAdmin(!isAdmin);
                      setShowMenu(false);
                      if (!isAdmin) {
                        window.location.href = '/admin';
                      }
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    {isAdmin ? 'Exit Admin' : 'Admin Login'}
                  </button>

                  <div className="pt-4 border-t border-gray-100 text-sm text-gray-500">
                    <p>Version 1.0</p>
                    <p>© 2025 {outletConfig.name}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};