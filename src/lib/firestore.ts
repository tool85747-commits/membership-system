import { 
  doc, 
  collection, 
  onSnapshot, 
  query, 
  where, 
  orderBy, 
  limit,
  getDocs,
  Timestamp,
  DocumentData
} from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';

// Types
export interface User {
  id: string;
  firstName: string;
  phoneE164: string;
  token: string;
  createdAt: Timestamp;
}

export interface CustomerProfile {
  joined: boolean;
  onboardingSeen: boolean;
  preferences: {
    promos: boolean;
  };
  notes: string[];
  memos: string[];
  lastVisitAt?: Timestamp;
}

export interface CustomerLoyalty {
  userId: string;
  outletId: string;
  points: number;
  stamps: { [campaignId: string]: number };
  rewards: string[];
  lastActivity: Timestamp;
}

export interface Outlet {
  id: string;
  name: string;
  logo?: string;
  heroImage?: string;
  heroVideo?: string;
  contactEmail?: string;
  contactPhone?: string;
  timezone: string;
  accentColor: string;
  template: string;
  settings: {
    stampsRequired: number;
    pointsRequired: number;
    welcomeBonusStamps: number;
    welcomeBonusPoints: number;
    consumeOnRedeem: boolean;
  };
  published?: any;
  draft?: any;
}

export interface Content {
  id: string;
  outletId: string;
  type: 'event' | 'news' | 'ad';
  title: string;
  description: string;
  image?: string;
  video?: string;
  active: boolean;
  priority: number;
  startDate?: Timestamp;
  endDate?: Timestamp;
}

export interface Voucher {
  id: string;
  outletId: string;
  title: string;
  code?: string;
  expiryAt?: Timestamp;
  singleUse: boolean;
  perUserLimit: number;
  onRedeem: {
    consumeStamps?: number;
    consumePoints?: number;
    awardStamps?: number;
    awardPoints?: number;
  };
}

export interface Reward {
  id: string;
  userId: string;
  outletId: string;
  title: string;
  details?: string;
  issuedAt: Timestamp;
  redeemedAt?: Timestamp;
  redeemable: boolean;
  autoRedeem: boolean;
  voucherId?: string;
}

export interface ModalEvent {
  type: 'rewardIssued' | 'instantReward';
  rewardId: string;
  message?: string;
  ts: Timestamp;
  shownAt?: Timestamp;
}

// Cloud Functions
export const createUser = httpsCallable<
  { name: string; phoneE164: string },
  { userId: string; token: string }
>(functions, 'createUser');

export const staffAction = httpsCallable<
  { 
    token: string; 
    action: 'addStamp' | 'addPoints' | 'issueInstantReward'; 
    amount?: number; 
    campaignId?: string;
    rewardDetails?: any;
  },
  { success: boolean; loyalty: CustomerLoyalty; reward?: Reward }
>(functions, 'staffAction');

export const redeemReward = httpsCallable<
  { userToken: string; rewardId: string },
  { success: boolean; loyalty: CustomerLoyalty }
>(functions, 'redeemReward');

export const adminPublish = httpsCallable<
  { outletId: string; templateJson: any; content?: any; settings?: any },
  { success: boolean }
>(functions, 'adminPublish');

export const exportCsv = httpsCallable<
  { type: 'customers' | 'audit' | 'vouchers' },
  { url: string }
>(functions, 'exportCsv');

export const undoAction = httpsCallable<
  { actionId: string },
  { success: boolean }
>(functions, 'undoAction');

export const taskComplete = httpsCallable<
  { userToken: string; ruleId: string; clientEventToken?: string; lat?: number; lng?: number },
  { success: boolean; loyalty: CustomerLoyalty }
>(functions, 'taskComplete');

// Firestore subscriptions
export const subscribeToOutlet = (outletId: string, callback: (outlet: Outlet | null) => void) => {
  return onSnapshot(doc(db, 'outlets', outletId), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() } as Outlet);
    } else {
      callback(null);
    }
  });
};

export const subscribeToCustomerLoyalty = (userId: string, callback: (loyalty: CustomerLoyalty | null) => void) => {
  return onSnapshot(doc(db, 'customer_loyalty', userId), (doc) => {
    if (doc.exists()) {
      callback({ ...doc.data() } as CustomerLoyalty);
    } else {
      callback(null);
    }
  });
};

export const subscribeToModalEvents = (userId: string, callback: (events: ModalEvent[]) => void) => {
  const q = query(
    collection(db, 'modalEvents'),
    where('userId', '==', userId),
    where('shownAt', '==', null),
    orderBy('ts', 'desc'),
    limit(10)
  );
  
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ModalEvent));
    callback(events);
  });
};

export const subscribeToRewards = (userId: string, callback: (rewards: Reward[]) => void) => {
  const q = query(
    collection(db, 'rewards'),
    where('userId', '==', userId),
    orderBy('issuedAt', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reward));
    callback(rewards);
  });
};

export const subscribeToContent = (outletId: string, callback: (content: Content[]) => void) => {
  const q = query(
    collection(db, 'content'),
    where('outletId', '==', outletId),
    where('active', '==', true),
    orderBy('priority', 'desc'),
    orderBy('startDate', 'desc')
  );
  
  return onSnapshot(q, (snapshot) => {
    const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Content));
    callback(content);
  });
};

// Search functions
export const searchCustomers = async (searchTerm: string): Promise<User[]> => {
  const results: User[] = [];
  
  // Search by token
  if (searchTerm.length >= 3) {
    const tokenQuery = query(
      collection(db, 'users'),
      where('token', '>=', searchTerm.toUpperCase()),
      where('token', '<=', searchTerm.toUpperCase() + '\uf8ff'),
      limit(10)
    );
    const tokenSnapshot = await getDocs(tokenQuery);
    tokenSnapshot.docs.forEach(doc => {
      results.push({ id: doc.id, ...doc.data() } as User);
    });
  }
  
  // Search by phone
  if (searchTerm.startsWith('+')) {
    const phoneQuery = query(
      collection(db, 'users'),
      where('phoneE164', '>=', searchTerm),
      where('phoneE164', '<=', searchTerm + '\uf8ff'),
      limit(10)
    );
    const phoneSnapshot = await getDocs(phoneQuery);
    phoneSnapshot.docs.forEach(doc => {
      const user = { id: doc.id, ...doc.data() } as User;
      if (!results.find(r => r.id === user.id)) {
        results.push(user);
      }
    });
  }
  
  return results.slice(0, 10);
};