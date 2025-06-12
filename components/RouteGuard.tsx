import React, { useEffect, useState, createContext, useContext } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '~/context/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RouteGuardProps {
  children: React.ReactNode;
}

// Define which routes require authentication
const PROTECTED_ROUTES = [
  '/profile',
  '/settings',
  '/premium',
  '/dashboard'
];

const WELCOME_SEEN_KEY = 'hasSeenWelcome';

// Create context for welcome state
interface WelcomeContextType {
  hasSeenWelcome: boolean;
  markWelcomeSeen: () => void;
}

const WelcomeContext = createContext<WelcomeContextType | undefined>(undefined);

export const useWelcome = () => {
  const context = useContext(WelcomeContext);
  if (!context) {
    throw new Error('useWelcome must be used within RouteGuard');
  }
  return context;
};

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [hasSeenWelcome, setHasSeenWelcome] = useState<boolean>(false);
  const [isCheckingStorage, setIsCheckingStorage] = useState(true);

  // Load welcome state from storage on mount
  useEffect(() => {
    const loadWelcomeState = async () => {
      try {
        const seen = await AsyncStorage.getItem(WELCOME_SEEN_KEY);
        setHasSeenWelcome(seen === 'true');
      } catch (error) {
        console.error('Error loading welcome state:', error);
        setHasSeenWelcome(false);
      } finally {
        setIsCheckingStorage(false);
      }
    };

    loadWelcomeState();
  }, []);

  // Save welcome state to storage
  const markWelcomeSeen = async () => {
    try {
      await AsyncStorage.setItem(WELCOME_SEEN_KEY, 'true');
      setHasSeenWelcome(true);
    } catch (error) {
      console.error('Error saving welcome state:', error);
    }
  };

  useEffect(() => {
    if (isLoading || isCheckingStorage) return; // Don't redirect while loading

    const currentPath = `/${segments.join('/')}`;
    const isWelcomeRoute = currentPath === '/welcome';
    const isProtectedRoute = PROTECTED_ROUTES.some(route => currentPath.startsWith(route));
    const isHomeRoute = currentPath === '/' || currentPath === '/index' || currentPath === '';

    // Handle protected routes - require authentication
    if (isProtectedRoute && !isAuthenticated) {
      router.replace('/welcome');
      return;
    }

    // Handle first-time visitors to home route - show welcome if they haven't seen it
    if (isHomeRoute && !isAuthenticated && !hasSeenWelcome && !isWelcomeRoute) {
      router.replace('/welcome');
      return;
    }

    // If user is on welcome screen and becomes authenticated, go to home
    if (isWelcomeRoute && isAuthenticated) {
      markWelcomeSeen();
      router.replace('/');
      return;
    }

  }, [isAuthenticated, isLoading, isCheckingStorage, segments, router, hasSeenWelcome]);

  // Show loading screen while checking auth or storage
  if (isLoading || isCheckingStorage) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="text-foreground mt-4 text-lg">Loading...</Text>
      </View>
    );
  }

  const welcomeContextValue = {
    hasSeenWelcome,
    markWelcomeSeen,
  };

  return (
    <WelcomeContext.Provider value={welcomeContextValue}>
      {children}
    </WelcomeContext.Provider>
  );
}