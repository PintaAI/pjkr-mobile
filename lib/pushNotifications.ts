import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface PushNotificationToken {
  token: string;
  type: 'expo' | 'apns' | 'fcm';
}

export interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: boolean;
  badge?: number;
  categoryId?: string;
}

class PushNotificationService {
  private token: string | null = null;
  private listeners: Array<() => void> = [];

  /**
   * Initialize push notifications and request permissions
   */
  async initialize(): Promise<boolean> {
    try {
      // Check if device supports push notifications
      if (!Device.isDevice) {
        console.warn('Push notifications only work on physical devices');
        return false;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('Push notification permissions not granted');
        return false;
      }

      // Get push token
      await this.getExpoPushToken();

      // Set up notification channels for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      // Set up notification listeners
      this.setupListeners();

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  /**
   * Get Expo push token
   */
  async getExpoPushToken(): Promise<string | null> {
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
      
      if (!projectId) {
        console.warn('No project ID found for push notifications');
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      this.token = tokenData.data;
      
      // Store token locally
      await AsyncStorage.setItem('pushToken', this.token);
      
      return this.token;
    } catch (error) {
      console.error('Failed to get push token:', error);
      return null;
    }
  }

  /**
   * Get current push token
   */
  getToken(): string | null {
    return this.token;
  }

  /**
   * Setup Android notification channels
   */
  private async setupAndroidChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;

    // Default channel
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
    });

    // High priority channel
    await Notifications.setNotificationChannelAsync('high-priority', {
      name: 'High Priority',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
    });

    // Chat/messaging channel
    await Notifications.setNotificationChannelAsync('chat', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
      enableVibrate: true,
    });
  }

  /**
   * Setup notification event listeners
   */
  private setupListeners(): void {
    // Listener for notifications received while app is foregrounded
    const foregroundListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received in foreground:', notification);
        // Handle foreground notification here
        this.handleForegroundNotification(notification);
      }
    );

    // Listener for when user taps on notification
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification response:', response);
        // Handle notification tap here
        this.handleNotificationResponse(response);
      }
    );

    this.listeners.push(
      () => foregroundListener.remove(),
      () => responseListener.remove()
    );
  }

  /**
   * Handle notification received while app is in foreground
   */
  private handleForegroundNotification(notification: Notifications.Notification): void {
    // You can customize this behavior
    // For example, show an in-app notification banner
    console.log('Handling foreground notification:', notification.request.content);
  }

  /**
   * Handle notification tap/response
   */
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    
    // Navigate based on notification data
    if (data?.screen) {
      // You can integrate with your navigation system here
      console.log('Navigate to screen:', data.screen);
    }
  }

  /**
   * Schedule a local notification
   */
  async scheduleLocalNotification(
    notification: NotificationData,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string | null> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          badge: notification.badge,
          categoryIdentifier: notification.categoryId,
        },
        trigger: trigger || null, // null means immediate
      });

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      return null;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  /**
   * Get notification permissions status
   */
  async getPermissionStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.getPermissionsAsync();
  }

  /**
   * Request notification permissions
   */
  async requestPermissions(): Promise<Notifications.NotificationPermissionsStatus> {
    return await Notifications.requestPermissionsAsync();
  }

  /**
   * Clean up listeners
   */
  cleanup(): void {
    this.listeners.forEach(remove => remove());
    this.listeners = [];
  }

  /**
   * Send push token to your backend
   */
  async registerTokenWithBackend(userId: string): Promise<boolean> {
    if (!this.token) {
      console.warn('No push token available');
      return false;
    }

    try {
      // Replace with your actual backend endpoint
      const response = await fetch('https://your-backend.com/api/push-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          token: this.token,
          platform: Platform.OS,
          deviceId: Constants.deviceId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Failed to register token with backend:', error);
      return false;
    }
  }
}

// Export singleton instance
export const pushNotificationService = new PushNotificationService();

// Utility functions
export const scheduleDailyReminder = async (
  title: string,
  body: string,
  hour: number = 9,
  minute: number = 0
): Promise<string | null> => {
  return await pushNotificationService.scheduleLocalNotification(
    { title, body },
    {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    }
  );
};

export const scheduleWeeklyReminder = async (
  title: string,
  body: string,
  weekday: number = 1, // 1 = Sunday, 2 = Monday, etc.
  hour: number = 9,
  minute: number = 0
): Promise<string | null> => {
  return await pushNotificationService.scheduleLocalNotification(
    { title, body },
    {
      type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
      weekday,
      hour,
      minute,
    }
  );
};

export const scheduleNotificationAfter = async (
  title: string,
  body: string,
  seconds: number
): Promise<string | null> => {
  return await pushNotificationService.scheduleLocalNotification(
    { title, body },
    {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      repeats: false,
    }
  );
};