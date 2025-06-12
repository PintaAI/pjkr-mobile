import React from 'react';
import { Modal, KeyboardAvoidingView, Platform, ScrollView, View, Text } from 'react-native';
import { AuthCard } from '~/components/auth-card';
import { useAuth } from '~/context/AuthContext';

interface AuthModalProps {
  visible: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
  onSignupSuccess?: () => void;
  showCloseButton?: boolean;
}

export function AuthModal({
  visible,
  onClose,
  onLoginSuccess,
  onSignupSuccess,
  showCloseButton = true,
}: AuthModalProps) {
  const { signInWithEmailPassword, signUpWithEmailPassword } = useAuth();

  const handleLoginSuccess = () => {
    onLoginSuccess?.();
    onClose();
  };

  const handleSignupSuccess = () => {
    onSignupSuccess?.();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
      >
        <View className="flex-1 bg-background pt-2">
          <ScrollView
            className="flex-1"
            contentContainerClassName="p-6 justify-center flex-grow"
            keyboardShouldPersistTaps="handled"
          >
            <AuthCard
              onLoginSuccess={handleLoginSuccess}
              onSignupSuccess={handleSignupSuccess}
              signInWithEmailPassword={signInWithEmailPassword}
              signUpWithEmailPassword={signUpWithEmailPassword}
            />
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}