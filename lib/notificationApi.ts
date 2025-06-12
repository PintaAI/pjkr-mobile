import Constants from 'expo-constants';
import { Platform } from 'react-native';

interface RegisterTokenRequest {
  userId: string;
  token: string;
  platform: string;
  deviceId?: string;
}

interface SendNotificationRequest {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  ttl?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

interface SendToUserRequest {
  userId: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
  ttl?: number;
  priority?: 'default' | 'normal' | 'high';
  channelId?: string;
}

interface NotificationResponse {
  success: boolean;
  message?: string;
  data?: any;
}

class NotificationAPI {
  private baseURL: string;
  private apiKey?: string;

  constructor() {
    // Get backend URL from your app config
    this.baseURL = Constants.expoConfig?.extra?.betterAuthUrl || 'https://your-backend.com';
    // You might want to store API key in secure storage
    this.apiKey = process.env.EXPO_PUBLIC_API_KEY;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}/api${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add existing headers if any
    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Register a push token with your backend
   */
  async registerPushToken(request: RegisterTokenRequest): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/register', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Failed to register push token:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Unregister a push token from your backend
   */
  async unregisterPushToken(userId: string, token: string): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/unregister', {
        method: 'POST',
        body: JSON.stringify({ userId, token }),
      });
    } catch (error) {
      console.error('Failed to unregister push token:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send a push notification via your backend using push tokens
   */
  async sendNotification(request: SendNotificationRequest): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/send', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Failed to send notification:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send a push notification to specific user(s) via your backend
   */
  async sendNotificationToUser(request: SendToUserRequest): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/send-to-user', {
        method: 'POST',
        body: JSON.stringify(request),
      });
    } catch (error) {
      console.error('Failed to send notification to user:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send notification to multiple users by user IDs
   */
  async sendBulkNotificationToUsers(
    userIds: string[],
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<NotificationResponse> {
    try {
      return await this.sendNotificationToUser({
        userId: userIds,
        title,
        body,
        data,
        priority: 'high',
      });
    } catch (error) {
      console.error('Failed to send bulk notification:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Send notification to all users (broadcast)
   */
  async sendBroadcastNotification(
    title: string,
    body: string,
    data?: Record<string, any>
  ): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/broadcast', {
        method: 'POST',
        body: JSON.stringify({ title, body, data }),
      });
    } catch (error) {
      console.error('Failed to send broadcast notification:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Get notification history for a user
   */
  async getNotificationHistory(userId: string, limit = 50): Promise<any[]> {
    try {
      const response = await this.makeRequest<{ notifications: any[] }>(`/push/history/${userId}?limit=${limit}`);
      return response.notifications || [];
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    userId: string,
    preferences: Record<string, boolean>
  ): Promise<NotificationResponse> {
    try {
      return await this.makeRequest<NotificationResponse>('/push/preferences', {
        method: 'PUT',
        body: JSON.stringify({ userId, preferences }),
      });
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
      return { success: false, message: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}

// Export singleton instance
export const notificationAPI = new NotificationAPI();

// Utility functions for common operations
export const registerDeviceForNotifications = async (
  userId: string,
  token: string
): Promise<boolean> => {
  const result = await notificationAPI.registerPushToken({
    userId,
    token,
    platform: Platform.OS,
    deviceId: Constants.deviceId,
  });
  return result.success;
};

export const sendTestNotification = async (token: string): Promise<boolean> => {
  const result = await notificationAPI.sendNotification({
    to: token,
    title: 'Test Notification',
    body: 'This is a test notification from your app!',
    data: { test: true, timestamp: Date.now() },
    sound: 'default',
    priority: 'high',
  });
  return result.success;
};

// User-specific notification utilities
export const sendNotificationToUser = async (
  userId: string,
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  const result = await notificationAPI.sendNotificationToUser({
    userId,
    title,
    body,
    data,
    sound: 'default',
    priority: 'high',
  });
  return result.success;
};

export const sendWelcomeNotification = async (userId: string, userName?: string): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    'Welcome to PJKR! 🎉',
    userName ? `Hi ${userName}, welcome to our app!` : 'Welcome! Let\'s get started.',
    { type: 'welcome', userId, screen: 'home' }
  );
};

export const sendReminderToUser = async (
  userId: string,
  reminderText: string,
  data?: Record<string, any>
): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    'Reminder 🔔',
    reminderText,
    { type: 'reminder', userId, ...data }
  );
};

export const sendUpdateNotificationToUser = async (
  userId: string,
  updateTitle: string,
  updateDetails: string,
  data?: Record<string, any>
): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    updateTitle,
    updateDetails,
    { type: 'update', userId, ...data }
  );
};

export const sendBulkNotificationToUsers = async (
  userIds: string[],
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  const result = await notificationAPI.sendBulkNotificationToUsers(userIds, title, body, data);
  return result.success;
};

export const sendBroadcastNotification = async (
  title: string,
  body: string,
  data?: Record<string, any>
): Promise<boolean> => {
  const result = await notificationAPI.sendBroadcastNotification(title, body, data);
  return result.success;
};

// Predefined notification templates
export const sendAccountVerificationReminder = async (userId: string): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    'Verify Your Account ✉️',
    'Please verify your email address to complete your account setup.',
    { type: 'verification', userId, screen: 'profile' }
  );
};

export const sendPasswordResetNotification = async (userId: string): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    'Password Reset 🔒',
    'Your password has been successfully reset.',
    { type: 'security', userId }
  );
};

export const sendNewMessageNotification = async (
  userId: string,
  senderName: string,
  messagePreview: string
): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    `New message from ${senderName} 💬`,
    messagePreview,
    { type: 'message', userId, screen: 'messages' }
  );
};

export const sendPromotionNotification = async (
  userId: string,
  promotionTitle: string,
  promotionDetails: string
): Promise<boolean> => {
  return await sendNotificationToUser(
    userId,
    `${promotionTitle} 🎁`,
    promotionDetails,
    { type: 'promotion', userId, screen: 'promotions' }
  );
};

// Example backend API routes you'll need to implement:
/*
POST /api/push/register
{
  "userId": "user123",
  "token": "ExponentPushToken[xxx]",
  "platform": "ios|android",
  "deviceId": "device123"
}

POST /api/push/unregister
{
  "userId": "user123",
  "token": "ExponentPushToken[xxx]"
}

POST /api/push/send
{
  "to": "ExponentPushToken[xxx]" | ["token1", "token2"],
  "title": "Notification Title",
  "body": "Notification Body",
  "data": { "key": "value" },
  "sound": "default",
  "badge": 1,
  "ttl": 3600,
  "priority": "high",
  "channelId": "default"
}

GET /api/push/history/:userId?limit=50

PUT /api/push/preferences
{
  "userId": "user123",
  "preferences": {
    "dailyReminders": true,
    "weeklyDigest": false,
    "instantNotifications": true
  }
}
*/