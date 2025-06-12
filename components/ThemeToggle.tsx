import { Pressable, View, Appearance } from 'react-native';
import { setAndroidNavigationBar } from '~/lib/android-navigation-bar';
import { MoonStar } from '~/lib/icons/MoonStar';
import { Sun } from '~/lib/icons/Sun';
import { System } from '~/lib/icons/System';
import { useColorScheme, type ColorScheme } from '~/lib/useColorScheme';
import { cn } from '~/lib/utils';
import * as React from 'react';

const THEME_CYCLE: ColorScheme[] = ['system', 'light', 'dark'];

const ICONS: Record<ColorScheme, React.ReactNode> = {
  system: <System className='text-foreground' size={23} strokeWidth={1.25} />,
  light: <Sun className='text-foreground' size={24} strokeWidth={1.25} />,
  dark: <MoonStar className='text-foreground' size={23} strokeWidth={1.25} />,
};

export function ThemeToggle() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const toggleColorScheme = async () => {
    const nextIndex = (THEME_CYCLE.indexOf(colorScheme) + 1) % THEME_CYCLE.length;
    const nextTheme = THEME_CYCLE[nextIndex];
    await setColorScheme(nextTheme);

    const effectiveTheme =
      nextTheme === 'system'
        ? Appearance.getColorScheme() ?? 'light'
        : nextTheme;
    setAndroidNavigationBar(effectiveTheme);
  };

  return (
    <Pressable
      onPress={toggleColorScheme}
      className='web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2'
    >
      {({ pressed }) => (
        <View
          className={cn(
            'flex-1 aspect-square pt-0.5 justify-center items-start web:px-5',
            pressed && 'opacity-70'
          )}
        >
          {ICONS[colorScheme]}
        </View>
      )}
    </Pressable>
  );
}
