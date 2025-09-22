import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Gift, Megaphone, ChevronRight } from 'lucide-react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface Event {
  id: string;
  type: 'promotion' | 'news' | 'event';
  title: string;
  description: string;
  startDate?: string;
  endDate?: string;
  active: boolean;
  priority: number;
}

interface EventsNewsProps {
  outletId: string;
}

export const EventsNews: React.FC<EventsNewsProps> = ({ outletId }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const q = query(
      collection(db, 'events'),
      where('outletId', '==', outletId),
      where('active', '==', true),
      orderBy('priority', 'desc'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Event));
      setEvents(eventsList);
    });

    return unsubscribe;
  }, [outletId]);

  // Auto-rotate events every 5 seconds
  useEffect(() => {
    if (events.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length]);

  if (events.length === 0) {
    // Show default promotional content
    return (
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center space-x-3">
          <Gift className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-medium">Welcome to our loyalty program!</p>
            <p className="text-sm opacity-90">Earn stamps with every visit and unlock rewards</p>
          </div>
        </div>
      </motion.div>
    );
  }

  const currentEvent = events[currentIndex];

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'promotion':
        return <Gift className="w-5 h-5" />;
      case 'event':
        return <Calendar className="w-5 h-5" />;
      default:
        return <Megaphone className="w-5 h-5" />;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'promotion':
        return 'from-green-500 to-emerald-600';
      case 'event':
        return 'from-purple-500 to-indigo-600';
      default:
        return 'from-blue-500 to-cyan-600';
    }
  };

  return (
    <motion.div
      className={`bg-gradient-to-r ${getEventColor(currentEvent.type)} text-white px-4 py-3 relative overflow-hidden`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentEvent.id}
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {getEventIcon(currentEvent.type)}
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{currentEvent.title}</p>
            <p className="text-sm opacity-90 truncate">{currentEvent.description}</p>
          </div>
          {events.length > 1 && (
            <div className="flex items-center space-x-1">
              {events.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-opacity ${
                    index === currentIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20 animate-pulse" />
        <div className="absolute -left-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
    </motion.div>
  );
};