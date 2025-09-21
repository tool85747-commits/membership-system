import React from 'react';
import { motion } from 'framer-motion';

interface HeroBlockProps {
  image?: string;
  title?: string;
  subtitle?: string;
}

export const HeroBlock: React.FC<HeroBlockProps> = ({ image, title, subtitle }) => {
  if (!image) return null;

  return (
    <motion.div
      className="relative h-48 bg-gray-100 overflow-hidden"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
    >
      <img
        src={image}
        alt=""
        className="w-full h-full object-cover"
      />
      
      {(title || subtitle) && (
        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="text-center text-white px-4">
            {title && (
              <motion.h1
                className="text-2xl font-bold mb-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
              >
                {title}
              </motion.h1>
            )}
            {subtitle && (
              <motion.p
                className="text-lg opacity-90"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                {subtitle}
              </motion.p>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};