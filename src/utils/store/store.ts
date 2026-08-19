import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AnalysisResult {
  id: string;
  imageUri: string;
  title: string;
  description: string;
  priceMin: number;
  priceMax: number;
  priceRecommended: number;
  hashtags: string[];
  category: string;
  condition: string;
  platform: 'vinted' | 'leboncoin' | 'both';
  tips: string[];
  createdAt: string;
}

interface Subscription {
  isPremium: boolean;
  plan: 'free' | 'monthly' | 'yearly';
  expiresAt: string | null;
  freeScansUsed: number;
  freeScansLimit: number;
}

interface AppState {
  currentImage: string | null;
  currentResult: AnalysisResult | null;
  isAnalyzing: boolean;
  history: AnalysisResult[];
  subscription: Subscription;
  setCurrentImage: (uri: string | null) => void;
  setCurrentResult: (result: AnalysisResult | null) => void;
  setIsAnalyzing: (val: boolean) => void;
  addToHistory: (result: AnalysisResult) => Promise<void>;
  removeFromHistory: (id: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  loadHistory: () => Promise<void>;
  loadSubscription: () => Promise<void>;
  setPremium: (plan: 'monthly' | 'yearly', expiresAt: string) => Promise<void>;
  incrementFreeScans: () => Promise<void>;
  canScan: () => boolean;
}

export const useStore = create<AppState>((set, get) => ({
  currentImage: null,
  currentResult: null,
  isAnalyzing: false,
  history: [],
  subscription: {
    isPremium: false,
    plan: 'free',
    expiresAt: null,
    freeScansUsed: 0,
    freeScansLimit: 3,
  },

  setCurrentImage: (uri) => set({ currentImage: uri }),
  setCurrentResult: (result) => set({ currentResult: result }),
  setIsAnalyzing: (val) => set({ isAnalyzing: val }),

  addToHistory: async (result) => {
    const newHistory = [result, ...get().history].slice(0, 100);
    set({ history: newHistory });
    await AsyncStorage.setItem('scan_history', JSON.stringify(newHistory));
  },

  removeFromHistory: async (id) => {
    const newHistory = get().history.filter((h) => h.id !== id);
    set({ history: newHistory });
    await AsyncStorage.setItem('scan_history', JSON.stringify(newHistory));
  },

  clearHistory: async () => {
    set({ history: [] });
    await AsyncStorage.removeItem('scan_history');
  },

  loadHistory: async () => {
    const data = await AsyncStorage.getItem('scan_history');
    if (data) set({ history: JSON.parse(data) });
  },

  loadSubscription: async () => {
    const data = await AsyncStorage.getItem('subscription');
    if (data) {
      const sub = JSON.parse(data);
      const lastReset = await AsyncStorage.getItem('lastScanReset');
      const today = new Date().toDateString();
      if (lastReset !== today) {
        sub.freeScansUsed = 0;
        await AsyncStorage.setItem('lastScanReset', today);
      }
      set({ subscription: sub });
    }
  },

  setPremium: async (plan, expiresAt) => {
    const sub: Subscription = {
      isPremium: true, plan, expiresAt,
      freeScansUsed: 0, freeScansLimit: 3,
    };
    set({ subscription: sub });
    await AsyncStorage.setItem('subscription', JSON.stringify(sub));
  },

  incrementFreeScans: async () => {
    const sub = { ...get().subscription, freeScansUsed: get().subscription.freeScansUsed + 1 };
    set({ subscription: sub });
    await AsyncStorage.setItem('subscription', JSON.stringify(sub));
  },

  canScan: () => {
    const s = get().subscription;
    return s.isPremium || s.freeScansUsed < s.freeScansLimit;
  },
}));
