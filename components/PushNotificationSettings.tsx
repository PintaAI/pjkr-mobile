import React, { useState, useEffect } from 'react';
import { View, Text, Switch, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePushNotifications } from '../lib/hooks/usePushNotifications';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface NotificationSettings {
  enabled: boolean;
  dailyReminders: boolean;
  weeklyDigest: boolean;
  instantNotifications: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: true,
  dailyReminders: false,
  weeklyDigest: false,
  instantNotifications: true,
};

export const PushNotificationSettings: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    isInitialized, 
    token, 
    permissionStatus, 
    requestPermissions,
    scheduleNotification,
    cancelAllNotifications 
  } = usePushNotifications();

  // Load settings from storage
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const stored = await AsyncStorage.getItem('notificationSettings');
      if (stored) {
        setSettings(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSettings = async (newSettings: NotificationSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    }
  };

  const handleToggleSetting = async (
    key: keyof NotificationSettings,
    value: boolean
  ) => {
    const newSettings = { ...settings, [key]: value };
    await saveSettings(newSettings);

    // Handle specific setting changes
    if (key === 'dailyReminders' && value) {
      await scheduleDailyReminder();
    } else if (key === 'weeklyDigest' && value) {
      await scheduleWeeklyDigest();
    }
  };

  const scheduleDailyReminder = async () => {
    try {
      await scheduleNotification(
        {
          title: 'Daily Reminder',
          body: 'Don\'t forget to check your updates!',
        },
        {
          type: 'daily' as any,
          hour: 9,
          minute: 0,
        }
      );
      Alert.alert('Success', 'Daily reminder scheduled for 9:00 AM');
    } catch (error) {
      console.error('Failed to schedule daily reminder:', error);
      Alert.alert('Error', 'Failed to schedule daily reminder');
    }
  };

  const scheduleWeeklyDigest = async () => {
    try {
      await scheduleNotification(
        {
          title: 'Weekly Digest',
          body: 'Your weekly summary is ready!',
        },
        {
          type: 'weekly' as any,
          weekday: 2, // Monday
          hour: 10,
          minute: 0,
        }
      );
      Alert.alert('Success', 'Weekly digest scheduled for Monday 10:00 AM');
    } catch (error) {
      console.error('Failed to schedule weekly digest:', error);
      Alert.alert('Error', 'Failed to schedule weekly digest');
    }
  };

  const handleRequestPermissions = async () => {
    try {
      const result = await requestPermissions();
      if (result.status === 'granted') {
        Alert.alert('Success', 'Notification permissions granted!');
      } else {
        Alert.alert('Permission Denied', 'Notification permissions are required for this feature.');
      }
    } catch (error) {
      console.error('Failed to request permissions:', error);
      Alert.alert('Error', 'Failed to request permissions');
    }
  };

  const testNotification = async () => {
    try {
      await scheduleNotification({
        title: 'Test Notification',
        body: 'This is a test notification!',
        data: { test: true },
      });
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Failed to send test notification:', error);
      Alert.alert('Error', 'Failed to send test notification');
    }
  };

  const clearAllNotifications = async () => {
    Alert.alert(
      'Clear All Notifications',
      'Are you sure you want to cancel all scheduled notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await cancelAllNotifications();
            Alert.alert('Success', 'All scheduled notifications cleared');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading notification settings...</Text>
      </View>
    );
  }

  const hasPermissions = permissionStatus?.status === 'granted';

  return (
    <View className="flex-1 p-4 bg-background">
      <Text className="text-2xl font-bold mb-6 text-foreground">
        Push Notification Settings
      </Text>

      {/* Permission Status */}
      <Card className="p-4 mb-4">
        <Text className="text-lg font-semibold mb-2 text-foreground">
          Permission Status
        </Text>
        <Text className={`mb-3 ${hasPermissions ? 'text-green-600' : 'text-red-600'}`}>
          {hasPermissions ? 'Notifications Enabled' : 'Notifications Disabled'}
        </Text>
        {!hasPermissions && (
          <Button onPress={handleRequestPermissions}>
            <Text>Request Permissions</Text>
          </Button>
        )}
        {token && (
          <Text className="text-xs text-muted-foreground mt-2">
            Token: {token.substring(0, 20)}...
          </Text>
        )}
      </Card>

      {/* Notification Settings */}
      {hasPermissions && (
        <>
          <Card className="p-4 mb-4">
            <Text className="text-lg font-semibold mb-4 text-foreground">
              Notification Preferences
            </Text>

            {/* General Notifications */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-base text-foreground">Enable Notifications</Text>
                <Text className="text-sm text-muted-foreground">
                  Receive all app notifications
                </Text>
              </View>
              <Switch
                value={settings.enabled}
                onValueChange={(value) => handleToggleSetting('enabled', value)}
              />
            </View>

            {/* Daily Reminders */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-base text-foreground">Daily Reminders</Text>
                <Text className="text-sm text-muted-foreground">
                  Get reminded daily at 9:00 AM
                </Text>
              </View>
              <Switch
                value={settings.dailyReminders}
                onValueChange={(value) => handleToggleSetting('dailyReminders', value)}
                disabled={!settings.enabled}
              />
            </View>

            {/* Weekly Digest */}
            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-1">
                <Text className="text-base text-foreground">Weekly Digest</Text>
                <Text className="text-sm text-muted-foreground">
                  Weekly summary every Monday at 10:00 AM
                </Text>
              </View>
              <Switch
                value={settings.weeklyDigest}
                onValueChange={(value) => handleToggleSetting('weeklyDigest', value)}
                disabled={!settings.enabled}
              />
            </View>

            {/* Instant Notifications */}
            <View className="flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base text-foreground">Instant Notifications</Text>
                <Text className="text-sm text-muted-foreground">
                  Receive notifications immediately
                </Text>
              </View>
              <Switch
                value={settings.instantNotifications}
                onValueChange={(value) => handleToggleSetting('instantNotifications', value)}
                disabled={!settings.enabled}
              />
            </View>
          </Card>

          {/* Actions */}
          <Card className="p-4">
            <Text className="text-lg font-semibold mb-4 text-foreground">
              Test & Manage
            </Text>
            
            <View className="space-y-3">
              <Button onPress={testNotification} className="mb-3">
                <Text>Send Test Notification</Text>
              </Button>
              
              <Button 
                onPress={clearAllNotifications} 
                variant="outline"
                className="mb-3"
              >
                <Text>Clear All Scheduled</Text>
              </Button>
            </View>
          </Card>
        </>
      )}

      {/* Debug Info */}
      {__DEV__ && (
        <Card className="p-4 mt-4">
          <Text className="text-lg font-semibold mb-2 text-foreground">
            Debug Info
          </Text>
          <Text className="text-xs text-muted-foreground">
            Initialized: {isInitialized ? 'Yes' : 'No'}
          </Text>
          <Text className="text-xs text-muted-foreground">
            Permission: {permissionStatus?.status || 'Unknown'}
          </Text>
          <Text className="text-xs text-muted-foreground">
            Token Available: {token ? 'Yes' : 'No'}
          </Text>
        </Card>
      )}
    </View>
  );
};