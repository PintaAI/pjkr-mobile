import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text } from '~/components/ui/text';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { useAuth } from '~/context/AuthContext';
import { useRouter } from 'expo-router';
import { AuthModal } from '~/components/auth-modal';
import { usePushNotificationContext } from '~/context/PushNotificationProvider';

export default function HomeScreen() {
  const { user, signOut, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { hasPermissions, token } = usePushNotificationContext();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleLoginSuccess = () => {
    setShowAuthModal(false);
  };

  const handleSignupSuccess = () => {
    console.log('Signup completed successfully');
    setShowAuthModal(false);
  };

  const handleResetAsyncStorage = async () => {
    if (__DEV__) {
      try {
        await AsyncStorage.removeItem('hasSeenWelcome');
        // You could also clear all storage if needed for broader testing:
        // await AsyncStorage.clear();
        // console.log('AsyncStorage cleared for development.');
        Alert.alert(
          'AsyncStorage Reset',
          "'hasSeenWelcome' has been cleared. Please reload the app to see changes.",
          [{ text: 'OK' }]
        );
      } catch (error) {
        console.error('Error resetting AsyncStorage:', error);
        Alert.alert('Error', 'Failed to reset AsyncStorage.');
      }
    }
  };

  // Content for authenticated users
  const AuthenticatedContent = () => (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 gap-y-6">
        <Text className="text-3xl font-bold text-foreground text-center">Welcome Back!</Text>
        
        {user && (
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <View className="gap-y-2">
                <Text className="text-base text-muted-foreground">ID: {user.id}</Text>
                <Text className="text-base text-muted-foreground">Email: {user.email}</Text>
                {user.name && <Text className="text-base text-muted-foreground">Name: {user.name}</Text>}
                {'role' in user && <Text className="text-base text-muted-foreground">Role: {String((user as any).role)}</Text>}
                {'accessTier' in user && <Text className="text-base text-muted-foreground">Plan: {String((user as any).accessTier)}</Text>}
              </View>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Premium Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground mb-4">
              Access exclusive content and advanced features
            </Text>
            <Button variant="default" className="w-full">
              <Text>Explore Premium</Text>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground mb-4">
              {hasPermissions
                ? 'Manage your notification preferences'
                : 'Enable push notifications to stay updated'}
            </Text>
            <Button
              variant="outline"
              className="w-full mb-2"
              onPress={() => router.push('/notifications')}
            >
              <Text>Notification Settings</Text>
            </Button>
            {token && (
              <Text className="text-xs text-muted-foreground text-center">
                Notifications: {hasPermissions ? 'Enabled' : 'Disabled'}
              </Text>
            )}
          </CardContent>
        </Card>

        <Button variant="destructive" size="lg" onPress={handleLogout} className="mt-4">
          <Text>Logout</Text>
        </Button>

        {__DEV__ && (
          <View className="mt-6 p-4 border border-destructive rounded-lg">
            <Text className="text-lg font-semibold text-destructive mb-2 text-center">Developer Tools</Text>
            <Button variant="destructive" onPress={handleResetAsyncStorage} className="w-full">
              <Text>Reset Welcome State (Dev)</Text>
            </Button>
            <Text className="text-xs text-muted-foreground mt-2 text-center">
              This button is visible in development mode only. It clears the 'hasSeenWelcome' flag.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  // Content for non-authenticated users
  const GuestContent = () => (
    <ScrollView className="flex-1 bg-background">
      <View className="p-6 gap-y-6">
        <Text className="text-3xl font-bold text-foreground text-center">
          Welcome to PJKR
        </Text>
        <Text className="text-lg text-muted-foreground text-center">
          Explore our features and discover what we have to offer
        </Text>

        <Card>
          <CardHeader>
            <CardTitle>Public Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground mb-4">
              Try out these features without signing up
            </Text>
            <Button variant="outline" className="w-full">
              <Text>Browse Content</Text>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Premium Features</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-muted-foreground mb-4">
              Sign up to unlock exclusive content and advanced features
            </Text>
            <Button
              variant="default"
              className="w-full"
              onPress={() => setShowAuthModal(true)}
            >
              <Text>Sign Up Now</Text>
            </Button>
          </CardContent>
        </Card>

        <View className="items-center mt-4">
          <Text className="text-sm text-muted-foreground mb-2">
            Already have an account?
          </Text>
          <Button
            variant="ghost"
            onPress={() => setShowAuthModal(true)}
          >
            <Text>Sign In</Text>
          </Button>
        </View>

        {__DEV__ && (
           <View className="mt-6 p-4 border border-destructive rounded-lg items-center">
            <Text className="text-lg font-semibold text-destructive mb-2 text-center">Developer Tools</Text>
            <Button variant="destructive" onPress={handleResetAsyncStorage} className="w-full max-w-sm">
              <Text>Reset Welcome State (Dev)</Text>
            </Button>
            <Text className="text-xs text-muted-foreground mt-2 text-center">
              This button is visible in development mode only. It clears the 'hasSeenWelcome' flag.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <>
      {isAuthenticated ? <AuthenticatedContent /> : <GuestContent />}
      
      {/* Auth Modal for guest users */}
      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />
    </>
  );
}
