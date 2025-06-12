import { useColorScheme as useNativewindColorScheme } from 'nativewind';
import { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ColorScheme = 'light' | 'dark' | 'system';

const COLOR_SCHEME_KEY = 'user-color-scheme';

export function useColorScheme() {
  const {
    colorScheme: effectiveColorScheme,
    setColorScheme: setNativewindColorScheme,
  } = useNativewindColorScheme();

  const [userPreference, setUserPreference] = useState<ColorScheme>('system');
  const [isLoaded, setIsLoaded] = useState(false);

  const setAppTheme = useCallback(
    (preference: ColorScheme) => {
      const themeToSet = preference === 'system' ? null : preference;
      setNativewindColorScheme(themeToSet as any);
    },
    [setNativewindColorScheme]
  );

  useEffect(() => {
    const loadAndSetPreference = async () => {
      try {
        const storedPreference = await AsyncStorage.getItem(COLOR_SCHEME_KEY);
        const pref =
          storedPreference &&
          ['light', 'dark', 'system'].includes(storedPreference)
            ? (storedPreference as ColorScheme)
            : 'system';
        setUserPreference(pref);
        setAppTheme(pref);
      } catch (e) {
        console.error('Failed to load color scheme preference', e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadAndSetPreference();
  }, [setAppTheme]);

  const setColorScheme = async (preference: ColorScheme) => {
    setUserPreference(preference);
    setAppTheme(preference);
    try {
      await AsyncStorage.setItem(COLOR_SCHEME_KEY, preference);
    } catch (e) {
      console.error('Failed to save color scheme preference', e);
    }
  };

  return {
    colorScheme: userPreference,
    isDarkColorScheme: effectiveColorScheme === 'dark',
    isLoaded,
    setColorScheme,
    effectiveColorScheme: effectiveColorScheme ?? 'light',
  };
}
