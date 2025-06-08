import { createAuthClient } from "better-auth/react"; // Assuming 'better-auth/react' is compatible or the primary client export
import Constants from "expo-constants";

// IMPORTANT: Replace this with your actual backend URL.
// For local development with Expo Go on Android emulator, this might be 'http://10.0.2.2:3000'
// For iOS simulator, 'http://localhost:3000'
// For production, your deployed web app URL (e.g., from web/.env.example NEXT_PUBLIC_BETTER_AUTH_URL)
const getBaseUrl = () => {
  // A common way to set this up for Expo:
  // const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
  // if (debuggerHost && process.env.NODE_ENV === 'development') {
  //   return `http://${debuggerHost}:3000`; // Assumes web server is on port 3000
  // }
  // return Constants.expoConfig?.extra?.betterAuthUrl || "http://localhost:3000"; // Fallback, configure in app.json extra
  
  // For now, using a placeholder. This MUST be configured correctly.
  // This should point to the `BETTER_AUTH_URL` of your web application.
  // const webAppBaseUrl = process.env.EXPO_PUBLIC_WEB_APP_URL || "http://localhost:3000"; 
  // Hardcoding for now as requested:
  const webAppBaseUrl = "http://192.168.15.34:3000";
  return webAppBaseUrl;
};

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
  // IMPORTANT FOR REACT NATIVE:
  // For React Native, you typically need to provide a custom storage adapter
  // to securely store authentication tokens (e.g., using expo-secure-store).
  // The default browser-based storage (localStorage) won't work.
  // Example (you'll need to implement this based on better-auth's API):
  // storage: {
  //   getItem: async (key) => await SecureStore.getItemAsync(key),
  //   setItem: async (key, value) => await SecureStore.setItemAsync(key, value),
  //   removeItem: async (key) => await SecureStore.removeItemAsync(key),
  // },
  // Check the `better-auth` documentation for how to integrate a custom storage adapter.
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

// Note on Social Logins for Mobile:
// The web's social login (`signIn.social({ provider: "google" })`) typically relies on browser redirects.
// For a native mobile app, you'd usually:
// 1. Use a native Google Sign-In library (e.g., @react-native-google-signin/google-signin or expo-auth-session/providers/google)
//    to perform the OAuth flow on the device.
// 2. Obtain an `id_token` or `access_token` from the native flow.
// 3. Send this token to a custom backend endpoint (e.g., /api/auth/mobile/google-signin) which then
//    validates the token with Google and uses `better-auth` server-side to sign in or sign up the user.
// This means the `signIn.social` from `better-auth/react-native` might not work out-of-the-box if it expects web-like redirects.
// You might need to adapt the `web/app/api/auth/[...all]/route.ts` or add a new route for mobile social auth.
