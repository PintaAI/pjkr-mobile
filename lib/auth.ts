import { createAuthClient } from "better-auth/react";
import Constants from 'expo-constants';

const getBaseUrl = () => {
  // For development, use localhost
  if (__DEV__) {
    return "http://192.168.15.34:3000";
  }
  
  // For production/preview, use the production URL
  return Constants.expoConfig?.extra?.betterAuthUrl || "https://pjkr-web.vercel.app";
};

// TODO: Custom storage adapter using Expo SecureStore
// This would need to be configured based on Better Auth's storage API
// For now, using default storage while we implement OAuth via web browser
export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  // storage: secureStorage, // Will be added once Better Auth storage API is confirmed
});

export const {
  signIn,
  signOut,
  signUp,
  useSession, // This will be the base hook
  getSession,
} = authClient;

// Infer and export Session type from the client instance
export type Session = typeof authClient.$Infer.Session;
export type User = Session['user']; // User type is derived from the Session type

// Social login functions - these will interact with the web backend's OAuth flow.
// For mobile, Google Sign-In might require native configuration (e.g., expo-auth-session or react-native-google-signin)
// to get an id_token or access_token, which is then sent to your backend.
// The current `better-auth` setup on the web uses web-based redirects for Google OAuth.
// This part needs careful consideration for mobile UX.

// Example: Email and Password (should work directly with the backend API)
export const signInWithEmailPassword = async (email: string, password: string) => {
  const data = await signIn.email({
    email,
    password,
  });
  return data;
};

export const signUpWithEmailPassword = async (email: string, password: string, name: string) => {
  // name is required, consistent with web implementation and better-auth types
  const data = await signUp.email({
    email,
    password,
    name,
  });
  return data;
};

// Mobile authentication uses email/password only
// OAuth complexity has been removed for simpler implementation
