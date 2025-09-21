import { useState, useEffect } from 'react';
import { 
  subscribeToOutlet, 
  subscribeToCustomerLoyalty, 
  subscribeToModalEvents, 
  subscribeToRewards,
  Outlet,
  CustomerLoyalty,
  ModalEvent,
  Reward
} from '../lib/firestore';

export const useOutlet = (outletId: string) => {
  const [outlet, setOutlet] = useState<Outlet | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToOutlet(outletId, (data) => {
      setOutlet(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [outletId]);

  return { outlet, loading };
};

export const useCustomerLoyalty = (userId: string | null) => {
  const [loyalty, setLoyalty] = useState<CustomerLoyalty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToCustomerLoyalty(userId, (data) => {
      setLoyalty(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { loyalty, loading };
};

export const useModalEvents = (userId: string | null) => {
  const [events, setEvents] = useState<ModalEvent[]>([]);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToModalEvents(userId, setEvents);
    return unsubscribe;
  }, [userId]);

  return events;
};

export const useRewards = (userId: string | null) => {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const unsubscribe = subscribeToRewards(userId, (data) => {
      setRewards(data);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { rewards, loading };
};