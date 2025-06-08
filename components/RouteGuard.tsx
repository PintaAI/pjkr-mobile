import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '~/context/AuthContext';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const currentPath = `/${segments.join('/')}`;
    const isLoginRoute = currentPath === '/login';

    if (!isAuthenticated && !isLoginRoute) {
      // Redirect to login if not authenticated and not already on login
      router.replace('/login');
    } else if (isAuthenticated && isLoginRoute) {
      // Redirect to home if authenticated and on login page
      router.replace('/');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-background">
        <ActivityIndicator size="large" />
        <Text className="text-foreground mt-4 text-lg">Loading...</Text>
      </View>
    );
  }

  return <>{children}</>;
}