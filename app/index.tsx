import React from 'react';
import { View, Text } from 'react-native';
import { useAuth } from '~/context/AuthContext';
import { Button } from '~/components/ui/button';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
      // Consider showing an alert to the user
    }
  };

  // RouteGuard ensures we only reach here if authenticated
  return (
    <View className="flex-1 justify-center items-center bg-background p-5 gap-y-6">
      <Text className="text-3xl font-bold text-foreground text-center">Welcome Back!</Text>
      {user && (
        <View className="items-center gap-y-4 w-full px-4">
          <View className="p-4 bg-card border border-border rounded-lg w-full items-start gap-y-1">
            <Text className="text-lg text-foreground font-semibold">User Details:</Text>
            <Text className="text-base text-muted-foreground">ID: {user.id}</Text>
            <Text className="text-base text-muted-foreground">Email: {user.email}</Text>
            {user.name && <Text className="text-base text-muted-foreground">Name: {user.name}</Text>}
            {/* 
              Accessing custom fields. These might not be in the base User type from better-auth inference.
              You might need to cast (e.g., user.role as string) or extend the User type in mobile/lib/auth.ts
              if you want stricter type checking for these custom fields.
              The User type from `mobile/lib/auth.ts` is `Session['user']`.
            */}
            {'role' in user && <Text className="text-base text-muted-foreground">Role: {String((user as any).role)}</Text>}
            {'plan' in user && <Text className="text-base text-muted-foreground">Plan: {String((user as any).plan)}</Text>}
            {'xp' in user && <Text className="text-base text-muted-foreground">XP: {String((user as any).xp)}</Text>}
            {'level' in user && <Text className="text-base text-muted-foreground">Level: {String((user as any).level)}</Text>}
          </View>

          <View className="p-2 bg-muted border border-border rounded-lg w-full mt-4">
            <Text className="text-sm text-muted-foreground font-semibold mb-1">Full User Object (for debugging):</Text>
            <Text className="text-xs text-muted-foreground">{JSON.stringify(user, null, 2)}</Text>
          </View>
        </View>
      )}
      <Button variant="destructive" size="lg" onPress={handleLogout} className="mt-6">
        <Text>Logout</Text>
      </Button>
    </View>
  );
}
