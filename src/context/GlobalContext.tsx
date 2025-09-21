import React, { createContext, useContext, useState, useEffect } from 'react';

interface LoyaltyState {
  stamps: number;
  stampsRequired: number;
  points: number;
  vouchers: Voucher[];
}

interface Voucher {
  id: string;
  name: string;
  description: string;
  code?: string;
  expiry?: string;
  isRedeemed: boolean;
  onRedeem: {
    consumeStamps?: number;
    consumePoints?: number;
    awardStamps?: number;
    awardPoints?: number;
  };
}

interface User {
  token: string;
  firstName: string;
  phone: string;
  loyaltyState: LoyaltyState;
}

interface OutletConfig {
  name: string;
  logo?: string;
  template: string;
  accentColor: string;
  heroImage?: string;
  introText: string;
  ctaText: string;
  showTasks: boolean;
  activeRules: string[];
}

interface GlobalContextType {
  user: User | null;
  outletConfig: OutletConfig;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
  updateOutletConfig: (config: Partial<OutletConfig>) => void;
  setIsAdmin: (isAdmin: boolean) => void;
  // Hooks for backend integration
  onTaskComplete: (taskId: string, userToken: string) => Promise<void>;
  onAdminPublish: (outletId: string, templateJson: any, ruleIds: string[]) => Promise<void>;
  onQuickAction: (token: string, action: string, amount: number) => Promise<void>;
  onSignup: (name: string, phone: string) => Promise<User>;
  onRedeemVoucher: (voucherId: string, userToken: string) => Promise<LoyaltyState>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobal must be used within GlobalProvider');
  }
  return context;
};

export const GlobalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [outletConfig, setOutletConfig] = useState<OutletConfig>({
    name: 'My Loyalty Program',
    template: 'classic-stamp',
    accentColor: '#2B8AEF',
    introText: 'Join our loyalty program and earn rewards with every visit!',
    ctaText: 'Join Now',
    showTasks: true,
    activeRules: ['visit-stamps', 'share-earn']
  });

  const updateOutletConfig = (config: Partial<OutletConfig>) => {
    setOutletConfig(prev => ({ ...prev, ...config }));
  };

  // Backend integration hooks (to be implemented)
  const onTaskComplete = async (taskId: string, userToken: string) => {
    console.log('Task complete:', { taskId, userToken });
    // Simulate task completion and reward
    if (user && taskId === 'share') {
      const updatedUser = {
        ...user,
        loyaltyState: {
          ...user.loyaltyState,
          stamps: Math.min(user.loyaltyState.stamps + 1, user.loyaltyState.stampsRequired)
        }
      };
      setUser(updatedUser);
    }
  };

  const onAdminPublish = async (outletId: string, templateJson: any, ruleIds: string[]) => {
    console.log('Admin publish:', { outletId, templateJson, ruleIds });
    // This would make API call to publish changes
  };

  const onQuickAction = async (token: string, action: string, amount: number) => {
    console.log('Quick action:', { token, action, amount });
    if (user && user.token === token) {
      const updatedLoyalty = { ...user.loyaltyState };
      if (action === 'add-stamp') {
        updatedLoyalty.stamps = Math.min(updatedLoyalty.stamps + amount, updatedLoyalty.stampsRequired);
      } else if (action === 'add-points') {
        updatedLoyalty.points += amount;
      }
      setUser({ ...user, loyaltyState: updatedLoyalty });
    }
  };

  const onSignup = async (name: string, phone: string): Promise<User> => {
    // Generate a token (in production, this would come from backend)
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const newUser: User = {
      token,
      firstName: name.split(' ')[0],
      phone,
      loyaltyState: {
        stamps: 0,
        stampsRequired: 10,
        points: 0,
        vouchers: []
      }
    };
    
    setUser(newUser);
    return newUser;
  };

  const onRedeemVoucher = async (voucherId: string, userToken: string): Promise<LoyaltyState> => {
    if (!user || user.token !== userToken) {
      throw new Error('Invalid user token');
    }

    const voucher = user.loyaltyState.vouchers.find(v => v.id === voucherId);
    if (!voucher || voucher.isRedeemed) {
      throw new Error('Voucher not found or already redeemed');
    }

    // Apply voucher effects
    let updatedLoyalty = { ...user.loyaltyState };
    
    if (voucher.onRedeem.consumeStamps) {
      updatedLoyalty.stamps = Math.max(0, updatedLoyalty.stamps - voucher.onRedeem.consumeStamps);
    }
    if (voucher.onRedeem.consumePoints) {
      updatedLoyalty.points = Math.max(0, updatedLoyalty.points - voucher.onRedeem.consumePoints);
    }
    if (voucher.onRedeem.awardStamps) {
      updatedLoyalty.stamps = Math.min(updatedLoyalty.stampsRequired, updatedLoyalty.stamps + voucher.onRedeem.awardStamps);
    }
    if (voucher.onRedeem.awardPoints) {
      updatedLoyalty.points += voucher.onRedeem.awardPoints;
    }

    // Mark voucher as redeemed
    updatedLoyalty.vouchers = updatedLoyalty.vouchers.map(v => 
      v.id === voucherId ? { ...v, isRedeemed: true } : v
    );

    setUser({ ...user, loyaltyState: updatedLoyalty });
    return updatedLoyalty;
  };

  return (
    <GlobalContext.Provider value={{
      user,
      outletConfig,
      isAdmin,
      setUser,
      updateOutletConfig,
      setIsAdmin,
      onTaskComplete,
      onAdminPublish,
      onQuickAction,
      onSignup,
      onRedeemVoucher
    }}>
      {children}
    </GlobalContext.Provider>
  );
};