import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

interface HeroSectionProps {
  heroImage?: string;
  heroVideo?: string;
  businessName: string;
  content: Array<{
    id: string;
    type: 'event' | 'news' | 'ad';
    title: string;
    description: string;
    image?: string;
    video?: string;
  }>;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  heroImage,
  heroVideo,
  businessName,
  content
}) => {
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Auto-rotate content every 5 seconds
  useEffect(() => {
    if (content.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentContentIndex((prev) => (prev + 1) % content.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [content.length]);

  const currentContent = content[currentContentIndex];

  return (
    <div className="relative">
      {/* Main Hero */}
      <motion.div
        className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background Media */}
        {heroVideo ? (
          <div className="absolute inset-0">
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        ) : heroImage ? (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30" />
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600" />
        )}

        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center text-white px-4">
          <div>
            <motion.h1
              className="text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Welcome to {businessName}
            </motion.h1>
            <motion.p
              className="text-lg opacity-90"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Earn rewards with every visit
            </motion.p>
          </div>
        </div>

        {/* Video Controls */}
        {heroVideo && (
          <button
            className="absolute bottom-4 right-4 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
            onClick={() => {
              const video = document.querySelector('video');
              if (video) {
                if (isVideoPlaying) {
                  video.pause();
                } else {
                  video.play();
                }
              }
            }}
          >
            {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
        )}
      </motion.div>

      {/* Content Ticker */}
      {content.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-3 overflow-hidden"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentContent?.id}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex-shrink-0">
                {currentContent?.type === 'event' && '🎉'}
                {currentContent?.type === 'news' && '📰'}
                {currentContent?.type === 'ad' && '✨'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{currentContent?.title}</p>
                <p className="text-sm opacity-90 truncate">{currentContent?.description}</p>
              </div>
              {content.length > 1 && (
                <div className="flex space-x-1">
                  {content.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-opacity ${
                        index === currentContentIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};