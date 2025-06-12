import React, { useState } from 'react';
import { View } from 'react-native';
import { Text } from '~/components/ui/text';
import { useWelcome } from '~/components/RouteGuard'; // Import useWelcome
import { Button } from '~/components/ui/button';
import { useRouter } from 'expo-router';
import { AuthModal } from '~/components/auth-modal';

export default function WelcomeScreen() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const router = useRouter();
  const { markWelcomeSeen } = useWelcome(); // Get markWelcomeSeen from context

  const handleLoginSuccess = async () => {
    // Assuming login also implies welcome has been seen or is handled by RouteGuard
    await markWelcomeSeen();
    router.replace('/');
  };

  const handleSignupSuccess = async () => {
    await markWelcomeSeen();
    router.replace('/');
  };



  const handleSkip = async () => { // Make handleSkip async
    // Navigate to app without authentication
    await markWelcomeSeen();      // Await for markWelcomeSeen to complete
    router.replace('/');
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Welcome Screen Content */}
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-4xl font-bold text-foreground text-center mb-4">
          Welcome to PJKR
        </Text>
        <Text className="text-lg text-muted-foreground text-center mb-8 max-w-sm">
          Discover amazing features and connect with our community
        </Text>
        
        <View className="w-full max-w-sm gap-y-4">
          <Button
            variant="default"
            size="lg"
            onPress={() => setShowAuthModal(true)}
            className="w-full"
          >
            <Text>Get Started</Text>
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            onPress={handleSkip}
            className="w-full"
          >
            <Text>Skip for now</Text>
          </Button>
        </View>

        <Text className="text-sm text-muted-foreground text-center mt-6">
          You can always sign in later to access premium features
        </Text>
      </View>

      
      <AuthModal
        visible={showAuthModal}
        onClose={handleCloseModal}
        onLoginSuccess={handleLoginSuccess}
        onSignupSuccess={handleSignupSuccess}
      />
    </View>
  );
}
