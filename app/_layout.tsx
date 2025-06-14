import '~/global.css';

import { DarkTheme, DefaultTheme, Theme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Platform } from 'react-native';
import { NAV_THEME } from '~/lib/constants';
import { useColorScheme } from '~/lib/useColorScheme';
import { PortalHost } from '@rn-primitives/portal';
import { ThemeToggle } from '~/components/ThemeToggle';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { AuthProvider } from '~/context/AuthContext';
import { RouteGuard } from '~/components/RouteGuard';
import { PushNotificationProvider } from '~/context/PushNotificationProvider';

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const hasMounted = React.useRef(false);
  const { effectiveColorScheme, isDarkColorScheme, isLoaded } = useColorScheme();

  useIsomorphicLayoutEffect(() => {
    if (hasMounted.current || !isLoaded) {
      return;
    }

    if (Platform.OS === 'web') {
      // Adds the background color to the html element to prevent white background on overscroll.
      document.documentElement.classList.add('bg-background');
    }
    setAndroidNavigationBar(effectiveColorScheme);
    hasMounted.current = true;
  }, [effectiveColorScheme, isLoaded]);

  if (!isLoaded) {
    return null;
  }

  return (
    <AuthProvider>
      <PushNotificationProvider>
        <RouteGuard>
          <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack>
              <Stack.Screen
                name='index'
                options={{
                  title: 'Home',
                  headerRight: () => <ThemeToggle />,
                }}
              />
              <Stack.Screen
                name='welcome'
                options={{
                  title: 'Welcome',
                  headerShown: false, // Hide header on welcome screen
                }}
              />
              <Stack.Screen
                name='notifications'
                options={{
                  title: 'Notifications',
                  presentation: 'modal',
                }}
              />
            </Stack>
            <PortalHost />
          </ThemeProvider>
        </RouteGuard>
      </PushNotificationProvider>
    </AuthProvider>
  );
}

const useIsomorphicLayoutEffect =
  Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;
