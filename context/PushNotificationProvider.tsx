import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { pushNotificationService } from '../lib/pushNotifications';
import { usePushNotifications } from '../lib/hooks/usePushNotifications';

interface PushNotificationContextType {
  isInitialized: boolean;
  token: string | null;
  hasPermissions: boolean;
  initialize: () => Promise<boolean>;
  requestPermissions: () => Promise<boolean>;
}

const PushNotificationContext = createContext<PushNotificationContextType | undefined>(undefined);

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider: React.FC<PushNotificationProviderProps> = ({ children }) => {
  const {
    isInitialized,
    token,
    permissionStatus,
    initialize,
    requestPermissions: requestPerms,
  } = usePushNotifications();
  
  const [hasInitialized, setHasInitialized] = useState(false);

  const hasPermissions = permissionStatus?.status === 'granted';

  const requestPermissions = async (): Promise<boolean> => {
    const result = await requestPerms();
    return result.status === 'granted';
  };

  // Auto-initialize on mount
  useEffect(() => {
    if (!hasInitialized) {
      initialize().then(() => {
        setHasInitialized(true);
        console.log('Push notifications initialized');
      });
    }
  }, [initialize, hasInitialized]);

  const contextValue: PushNotificationContextType = {
    isInitialized,
    token,
    hasPermissions,
    initialize,
    requestPermissions,
  };

  return (
    <PushNotificationContext.Provider value={contextValue}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = (): PushNotificationContextType => {
  const context = useContext(PushNotificationContext);
  if (context === undefined) {
    throw new Error('usePushNotificationContext must be used within a PushNotificationProvider');
  }
  return context;
};