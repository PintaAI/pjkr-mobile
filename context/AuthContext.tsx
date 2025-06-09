import React, { createContext, useContext, ReactNode } from 'react';
import {
  useSession as useBetterAuthSession,
  signInWithEmailPassword as signInEmailPwd,
  signUpWithEmailPassword as signUpEmailPwd,
  signOut as performSignOut,
} from '../lib/auth'; // Adjust path as necessary
// Import Session and User types from our local auth.ts where they are correctly inferred
import type { Session, User } from '../lib/auth';

interface AuthContextType {
  session: Session | null;
  user: User | null; // Use the imported User type for clarity
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithEmailPassword: typeof signInEmailPwd;
  signUpWithEmailPassword: typeof signUpEmailPwd;
  signOut: typeof performSignOut;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, isPending, error } = useBetterAuthSession();

  const isAuthenticated = !!session;
  const user = session?.user || null;

  // You might want to log errors or handle them globally here
  if (error) {
    console.error("Auth session error:", error);
  }

  const value = {
    session,
    user,
    isLoading: isPending,
    isAuthenticated,
    signInWithEmailPassword: signInEmailPwd,
    signUpWithEmailPassword: signUpEmailPwd,
    signOut: performSignOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
