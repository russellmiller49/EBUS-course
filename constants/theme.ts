import { Platform } from 'react-native';
import type { Theme } from '@react-navigation/native';

export const colors = {
  canvas: '#F4EEE4',
  surface: '#FFF9F2',
  surfaceMuted: '#EFE4D5',
  ink: '#173245',
  inkSoft: '#5E6E78',
  border: '#D6C8B8',
  accent: '#C65D32',
  accentSoft: '#F4D8CA',
  teal: '#0F6F68',
  tealSoft: '#D8EEE9',
  gold: '#B7862D',
  goldSoft: '#F5E8C5',
  navy: '#12384A',
  white: '#FFFFFF',
  danger: '#A63D40',
  dangerSoft: '#F2D6D7',
} as const;

export const navigationTheme: Theme = {
  dark: false,
  colors: {
    primary: colors.accent,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    border: colors.border,
    notification: colors.gold,
  },
  fonts: {
    regular: {
      fontFamily: 'System',
      fontWeight: '400',
    },
    medium: {
      fontFamily: 'System',
      fontWeight: '500',
    },
    bold: {
      fontFamily: 'SpaceMono',
      fontWeight: '700',
    },
    heavy: {
      fontFamily: 'SpaceMono',
      fontWeight: '800',
    },
  },
};

export const shadows = Platform.select({
  ios: {
    shadowColor: '#10252F',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 10,
    },
  },
  android: {
    elevation: 3,
  },
  default: {},
});
