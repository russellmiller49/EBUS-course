import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import * as SystemUI from 'expo-system-ui';

import { colors, navigationTheme } from '@/constants/theme';
import { LearnerProgressProvider } from '@/store/learner-progress';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.canvas).catch(() => {
      // Ignore platform-specific failures.
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return (
    <LearnerProgressProvider>
      <ThemeProvider value={navigationTheme}>
        <Stack
          screenOptions={{
            contentStyle: {
              backgroundColor: colors.canvas,
            },
            headerShadowVisible: false,
            headerStyle: {
              backgroundColor: colors.canvas,
            },
            headerTitleStyle: {
              color: colors.ink,
              fontFamily: 'SpaceMono',
            },
          }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modules/[slug]" options={{ title: 'Module' }} />
        </Stack>
      </ThemeProvider>
    </LearnerProgressProvider>
  );
}
