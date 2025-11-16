import React from 'react';

export type Language = 'en' | 'es' | 'fr' | 'bn' | 'ja' | 'de' | 'it' | 'pt' | 'ko' | 'zh' | 'hi' | 'ar';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  subscriptionStatus: 'none' | 'pending' | 'active';
  premiumSince?: string | null;
  premiumRenewalDate?: string | null;
}

export interface Recipe {
  id: string;
  title: string;
  englishTitle: string;
  description: string;
  calories: number;
  cookingTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  ingredients: string[];
  instructions: string[];
  image: string | null;
  isSaved: boolean;
  protein: number;
  carbs: number;
  fat: number;
  sourceType?: 'ai-generated' | 'external';
  sourceUrl?: string | null;
}

export interface Meal {
  title: string;
  description: string;
  calories: number;
}

export interface MealPlanDay {
  day: string;
  breakfast: Meal;
  lunch: Meal;
  dinner: Meal;
}

export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: string;
  category: string;
  checked: boolean;
}

export interface PantryItem {
  id: string;
  name: string;
  quantity: string;
  expiryDate: string;
  notes?: string;
}

export interface HistoryItem {
  id: string;
  query: string;
  timestamp: string;
  recipeCount: number;
}

export interface PendingPayment {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  paymentMethod: string;
  transactionId: string;
  senderNumber: string;
  timestamp: string;
}

export interface AppContextType {
  user: UserProfile | null;
  isInitialLoading: boolean;
  signInUser: (email: string, password: string) => Promise<boolean>;
  signUpUser: (name: string, email: string, password: string) => Promise<boolean>;
  signOutUser: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  generatedRecipes: Recipe[];
  // FIX: Added import for React to resolve namespace errors.
  setGeneratedRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
  history: HistoryItem[];
  addToHistory: (query: string, recipeCount: number) => void;
  shoppingList: ShoppingListItem[];
  addToShoppingList: (items: { name: string; quantity: string; category: string }[]) => void;
  updateShoppingListItem: (id: string, updates: Partial<ShoppingListItem>) => void;
  removeShoppingListItem: (id: string) => void;
  toggleAllShoppingListItems: () => void;
  pantry: PantryItem[];
  addToPantry: (item: Omit<PantryItem, 'id'>) => void;
  updatePantryItem: (id: string, updates: Partial<PantryItem>) => void;
  removePantryItem: (id: string) => void;
  savedRecipes: Recipe[];
  toggleSaveRecipe: (recipe: Recipe) => void;
  globalTimer: TimerState;
  startGlobalTimer: (recipeId: string, recipeTitle: string, durationSeconds: number) => void;
  togglePauseGlobalTimer: () => void;
  stopGlobalTimer: () => void;
  submitForPremium: (paymentDetails: Omit<PendingPayment, 'id' | 'userId' | 'userName' | 'userEmail' | 'timestamp'>) => Promise<boolean>;
  pendingPayments: PendingPayment[];
  approvePayment: (paymentId: string) => void;
  rejectPayment: (paymentId: string) => void;
  allUsers: UserProfile[];
  updateUserSubscriptionStatusByAdmin: (userId: string, newStatus: UserProfile['subscriptionStatus']) => void;
}

export interface TimerState {
  isActive: boolean;
  isPaused: boolean;
  remainingSeconds: number;
  recipeId: string | null;
  recipeTitle: string | null;
}