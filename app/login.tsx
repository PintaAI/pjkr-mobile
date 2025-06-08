import React, { useState } from 'react';
import { View, TextInput, Text, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '~/context/AuthContext';
import { useRouter } from 'expo-router';
import { Button } from '~/components/ui/button'; // Use the custom Button

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For signup
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signInWithEmailPassword, signUpWithEmailPassword } = useAuth();
  const router = useRouter();

  const handleAuthAction = async () => {
    setLoading(true);
    setError(null);
    try {
      if (isSigningUp) {
        if (!name.trim()) {
          Alert.alert("Signup Error", "Name is required for signup.");
          setLoading(false);
          return;
        }
        await signUpWithEmailPassword(email, password, name);
        Alert.alert("Signup Successful", "You can now log in.");
        setIsSigningUp(false); // Switch to login form
      } else {
        await signInWithEmailPassword(email, password);
        // Navigate back or to a protected route on successful login
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/'); // Go to home screen
        }
      }
    } catch (e: any) {
      setError(e.message || 'An unexpected error occurred.');
      Alert.alert("Authentication Error", e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-background p-6 gap-y-6">
      <Text className="text-3xl font-bold text-foreground text-center mb-4">
        {isSigningUp ? 'Create Account' : 'Welcome Back'}
      </Text>
      {error && <Text className="text-destructive text-center mb-3">{error}</Text>}
      
      {isSigningUp && (
        <TextInput
          className="h-12 border border-border rounded-md px-4 text-foreground bg-input"
          placeholder="Name"
          placeholderTextColor="text-muted-foreground"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      )}
      <TextInput
        className="h-12 border border-border rounded-md px-4 text-foreground bg-input"
        placeholder="Email"
        placeholderTextColor="text-muted-foreground"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-border rounded-md px-4 text-foreground bg-input"
        placeholder="Password"
        placeholderTextColor="text-muted-foreground"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        variant="default"
        size="lg"
        onPress={handleAuthAction}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="text-primary-foreground" />
        ) : (
          <Text>{isSigningUp ? 'Sign Up' : 'Login'}</Text>
        )}
      </Button>
      <Button
        variant="ghost"
        size="lg"
        onPress={() => {
          setIsSigningUp(!isSigningUp);
          setError(null); 
        }}
        disabled={loading}
      >
        <Text className="text-primary">
          {isSigningUp ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </Text>
      </Button>
    </View>
  );
}
