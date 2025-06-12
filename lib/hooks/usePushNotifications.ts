import { useEffect, useState, useCallback } from 'react';
import { pushNotificationService, NotificationData } from '../pushNotifications';
import * as Notifications from 'expo-notifications';

interface UsePushNotificationsReturn {
  isInitialized: boolean;
  token: string | null;
  permissionStatus: Notifications.NotificationPermissionsStatus | null;
  initialize: () => Promise<boolean>;
  scheduleNotification: (notification: NotificationData, trigger?: Notifications.NotificationTriggerInput) => Promise<string | null>;
  cancelNotification: (id: string) => Promise<void>;
  cancelAllNotifications: () => Promise<void>;
  requestPermissions: () => Promise<Notifications.NotificationPermissionsStatus>;
  registerWithBackend: (userId: string) => Promise<boolean>;
}

export const usePushNotifications = (): UsePushNotificationsReturn => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [permissionStatus, setPermissionStatus] = useState<Notifications.NotificationPermissionsStatus | null>(null);

  const initialize = useCallback(async (): Promise<boolean> => {
    try {
      const success = await pushNotificationService.initialize();
      setIsInitialized(success);
      
      if (success) {
        const currentToken = pushNotificationService.getToken();
        setToken(currentToken);
        
        const permissions = await pushNotificationService.getPermissionStatus();
        setPermissionStatus(permissions);
      }
      
      return success;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }, []);

  const scheduleNotification = useCallback(async (
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string | null> => {
    return await pushNotificationService.scheduleLocalNotification(notification, trigger);
  }, []);

  const cancelNotification = useCallback(async (id: string): Promise<void> => {
    await pushNotificationService.cancelNotification(id);
  }, []);

  const cancelAllNotifications = useCallback(async (): Promise<void> => {
    await pushNotificationService.cancelAllNotifications();
  }, []);

  const requestPermissions = useCallback(async (): Promise<Notifications.NotificationPermissionsStatus> => {
    const permissions = await pushNotificationService.requestPermissions();
    setPermissionStatus(permissions);
    return permissions;
  }, []);

  const registerWithBackend = useCallback(async (userId: string): Promise<boolean> => {
    return await pushNotificationService.registerTokenWithBackend(userId);
  }, []);

  // Auto-initialize on mount
  useEffect(() => {
    initialize();
    
    // Cleanup on unmount
    return () => {
      pushNotificationService.cleanup();
    };
  }, [initialize]);

  return {
    isInitialized,
    token,
    permissionStatus,
    initialize,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
    requestPermissions,
    registerWithBackend,
  };
};