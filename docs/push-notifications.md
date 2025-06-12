# Push Notifications Implementation Guide

This guide covers the complete push notification system implemented in your Expo React Native app.

## 🚀 Quick Start

### 1. Basic Usage in Components

```tsx
import React from 'react';
import { View, Button } from 'react-native';
import { usePushNotifications } from '~/lib/hooks/usePushNotifications';

export const MyComponent = () => {
  const { 
    isInitialized, 
    token, 
    scheduleNotification,
    requestPermissions 
  } = usePushNotifications();

  const handleSendNotification = async () => {
    await scheduleNotification({
      title: 'Hello!',
      body: 'This is a test notification',
      data: { screen: 'home' }
    });
  };

  return (
    <View>
      <Button 
        title="Send Test Notification" 
        onPress={handleSendNotification} 
      />
    </View>
  );
};
```

### 2. Using the Context

```tsx
import { usePushNotificationContext } from '~/context/PushNotificationProvider';

const { hasPermissions, token, requestPermissions } = usePushNotificationContext();
```

## 📱 Implementation Status

### ✅ Completed Features
- [x] **Push Notification Service** - Core service with full functionality
- [x] **React Hook** - `usePushNotifications` hook for easy component integration
- [x] **Context Provider** - App-level push notification state management
- [x] **Settings Component** - Complete UI for notification preferences
- [x] **App Configuration** - Updated `app.json` with notification plugins and permissions
- [x] **Permission Management** - Request and check notification permissions
- [x] **Local Notifications** - Schedule notifications within the app
- [x] **Push Token Generation** - Get Expo push tokens for remote notifications
- [x] **Android Channels** - Proper notification channels for Android
- [x] **Notification Handling** - Handle foreground and background notifications
- [x] **Backend API Helper** - Complete API integration for server communication
- [x] **Navigation Integration** - Added notification settings to home screen
- [x] **TypeScript Support** - Full type safety throughout the implementation
- [x] **User-Specific Notifications** - Send notifications to specific users by user ID
- [x] **Notification Templates** - Predefined templates for common notification types
- [x] **Bulk Notifications** - Send to multiple users at once
- [x] **Broadcast Notifications** - Send to all users

### ✅ Notification Types Implemented
- [x] **Instant Notifications** - Send immediately
- [x] **Daily Reminders** - Recurring daily notifications at specified time
- [x] **Weekly Digest** - Weekly summary notifications
- [x] **Scheduled Notifications** - Custom timing with various triggers
- [x] **Test Notifications** - Debug and testing functionality
- [x] **User-Targeted Notifications** - Send to specific users by ID
- [x] **Welcome Notifications** - Personalized welcome messages
- [x] **Message Notifications** - New message alerts
- [x] **Security Notifications** - Account and security alerts
- [x] **Promotional Notifications** - Marketing and promotional messages

### ✅ Platform Support
- [x] **iOS** - Full support with proper permissions and background modes
- [x] **Android** - Notification channels, permissions, and adaptive icons
- [x] **Web** - Graceful fallback (notifications not supported)

## 🚧 TODO: Still Need Implementation

### 🔲 Backend Requirements (Your Server)
- [ ] **Push Token Registration Endpoint** - `POST /api/push/register`
- [ ] **Push Token Unregistration** - `POST /api/push/unregister`
- [ ] **Send Push Notification Endpoint** - `POST /api/push/send`
- [ ] **Notification History API** - `GET /api/push/history/:userId`
- [ ] **User Preferences API** - `PUT /api/push/preferences`
- [ ] **Database Schema** - Tables for push tokens, notification history, user preferences

### 🔲 Advanced Features (Optional)
- [ ] **Rich Notifications** - Images, attachments, and media
- [ ] **Interactive Notifications** - Action buttons and quick replies
- [ ] **Notification Categories** - Different types with custom actions
- [ ] **Geofencing Notifications** - Location-based triggers
- [ ] **Silent Push Notifications** - Background data updates
- [ ] **Notification Analytics** - Track open rates and engagement
- [ ] **A/B Testing** - Test different notification strategies
- [ ] **Notification Templates** - Reusable notification formats

### 🔲 Production Considerations
- [ ] **Push Notification Icon** - Create proper notification icon asset
- [ ] **Error Handling** - Robust error handling and retry logic
- [ ] **Rate Limiting** - Prevent notification spam
- [ ] **User Segmentation** - Target specific user groups
- [ ] **Notification Scheduling** - Server-side scheduling system
- [ ] **Metrics Dashboard** - Monitor notification performance
- [ ] **GDPR Compliance** - Handle user consent and data privacy

### 🔲 Testing & Deployment
- [ ] **Unit Tests** - Test notification service and hooks
- [ ] **Integration Tests** - Test end-to-end notification flow
- [ ] **Production Testing** - Test with real push notifications
- [ ] **Performance Testing** - Ensure notifications don't impact app performance
- [ ] **Device Testing** - Test across different devices and OS versions

## 🛠 Configuration

### App Configuration (`app.json`)

```json
{
  "expo": {
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/images/notification-icon.png",
          "color": "#ffffff",
          "defaultChannel": "default"
        }
      ]
    ],
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["background-processing", "background-fetch"]
      }
    },
    "android": {
      "permissions": [
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE",
        "WAKE_LOCK"
      ]
    }
  }
}
```

## 🎯 Usage Examples

### Scheduling Different Types of Notifications

```tsx
import { 
  scheduleDailyReminder, 
  scheduleWeeklyReminder, 
  scheduleNotificationAfter 
} from '~/lib/pushNotifications';

// Daily reminder at 9 AM
await scheduleDailyReminder(
  'Daily Check-in',
  'Time for your daily check-in!',
  9, // hour
  0   // minute
);

// Weekly reminder on Monday at 10 AM
await scheduleWeeklyReminder(
  'Weekly Summary',
  'Your weekly summary is ready!',
  2,  // weekday (1=Sunday, 2=Monday, etc.)
  10, // hour
  0   // minute
);

// Notification after 30 seconds
await scheduleNotificationAfter(
  'Reminder',
  'This is a delayed notification',
  30 // seconds
);
```

### Custom Notification Handling

```tsx
import { pushNotificationService } from '~/lib/pushNotifications';

// Initialize with custom handling
await pushNotificationService.initialize();

// Schedule with custom trigger
await pushNotificationService.scheduleLocalNotification(
  {
    title: 'Custom Notification',
    body: 'This has custom settings',
    data: { customData: 'value' },
    sound: true,
    badge: 1
  },
  {
    type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
    seconds: 60,
    repeats: false
  }
);
```

### Backend Integration

```tsx
import { notificationAPI, registerDeviceForNotifications } from '~/lib/notificationApi';

// Register device with your backend
const success = await registerDeviceForNotifications(userId, token);

// Send notification via your backend
const result = await notificationAPI.sendNotification({
  to: userToken,
  title: 'Server Notification',
  body: 'This was sent from your server',
  data: { userId, timestamp: Date.now() }
});
```

## 👤 User-Specific Notifications

### Send Notification to Specific User

```tsx
import {
  sendNotificationToUser,
  sendWelcomeNotification,
  sendNewMessageNotification,
  sendBulkNotificationToUsers
} from '~/lib/notificationApi';

// Send to a single user by user ID
await sendNotificationToUser(
  'user123',
  'Hello!',
  'You have a new update',
  { screen: 'updates', priority: 'high' }
);

// Welcome notification with personalization
await sendWelcomeNotification('user123', 'John');

// Message notification
await sendNewMessageNotification(
  'user123',
  'Alice',
  'Hey, how are you doing?'
);

// Send to multiple users
await sendBulkNotificationToUsers(
  ['user1', 'user2', 'user3'],
  'System Update',
  'New features are now available!',
  { version: '2.0', screen: 'updates' }
);
```

### Predefined Notification Templates

```tsx
import {
  sendAccountVerificationReminder,
  sendPasswordResetNotification,
  sendPromotionNotification
} from '~/lib/notificationApi';

// Account verification
await sendAccountVerificationReminder('user123');

// Security notification
await sendPasswordResetNotification('user123');

// Promotional notification
await sendPromotionNotification(
  'user123',
  'Special Offer',
  '50% off premium features!'
);
```

## � Backend Implementation

You'll need to implement these API endpoints on your backend:

### Required Endpoints

```typescript
// POST /api/push/register - Register device token
interface RegisterRequest {
  userId: string;
  token: string;
  platform: 'ios' | 'android';
  deviceId?: string;
}

// POST /api/push/send - Send by push token
interface SendRequest {
  to: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
}

// POST /api/push/send-to-user - Send by user ID
interface SendToUserRequest {
  userId: string | string[];
  title: string;
  body: string;
  data?: Record<string, any>;
  sound?: string;
  badge?: number;
}

// POST /api/push/broadcast - Send to all users
interface BroadcastRequest {
  title: string;
  body: string;
  data?: Record<string, any>;
}

// GET /api/push/history/:userId - Get user notification history
// PUT /api/push/preferences - Update user notification preferences
```

### Example Node.js Implementation

```javascript
const { Expo } = require('expo-server-sdk');
const expo = new Expo();

app.post('/api/push/send', async (req, res) => {
  const { to, title, body, data } = req.body;
  
  if (!Expo.isExpoPushToken(to)) {
    return res.status(400).json({ error: 'Invalid push token' });
  }

  const message = {
    to,
    title,
    body,
    data,
    sound: 'default',
  };

  try {
    const ticket = await expo.sendPushNotificationsAsync([message]);
    res.json({ success: true, ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## 📋 Testing

### Testing Local Notifications

1. Open the app and navigate to notification settings
2. Enable notifications when prompted
3. Use the "Send Test Notification" button
4. Check that notifications appear correctly

### Testing Push Notifications

1. Get the push token from the app
2. Use Expo's push notification tool: https://expo.dev/notifications
3. Send a test notification using your token
4. Verify the notification is received

### Testing Scheduled Notifications

1. Enable daily/weekly reminders in settings
2. Wait for scheduled time or modify system time for testing
3. Verify notifications are triggered at correct times

## 🚨 Troubleshooting

### Common Issues

**Notifications not showing:**
- Check if permissions are granted
- Verify the device is physical (not simulator for push notifications)
- Check notification settings on the device

**Token not generated:**
- Ensure you have a valid Expo project ID
- Check network connectivity
- Verify app configuration

**Android notifications not working:**
- Check notification channels are properly set up
- Verify Android permissions in app.json
- Test on different Android versions

### Debug Information

Enable debug mode to see detailed logs:

```tsx
// In development, check debug info
if (__DEV__) {
  console.log('Push token:', token);
  console.log('Permissions:', permissionStatus);
  console.log('Initialized:', isInitialized);
}
```

## 🔐 Security Considerations

1. **Token Storage**: Push tokens are stored locally and should be sent to your secure backend
2. **API Keys**: Never expose API keys in client code
3. **User Privacy**: Always request permissions gracefully and explain why notifications are needed
4. **Data Validation**: Validate all notification data on your backend

## 📚 Additional Resources

- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Cloud Messaging](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service](https://developer.apple.com/documentation/usernotifications)
- [Android Notification Channels](https://developer.android.com/develop/ui/views/notifications/channels)

## 🎉 Next Steps

1. **Implement Backend**: Set up your server endpoints for push notifications
2. **Analytics**: Track notification engagement and effectiveness  
3. **Personalization**: Customize notifications based on user preferences
4. **Rich Notifications**: Add images, actions, and interactive elements
5. **Notification Categories**: Implement different types of notifications with custom actions