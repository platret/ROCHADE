import { radius, typeScale, type Palette } from '@rochade/shared'
import type { NativeStackNavigationOptions } from 'expo-router'
import { fontFamilyFor } from './fonts'

export const headerOptions = (colors: Palette): NativeStackNavigationOptions => ({
  headerShadowVisible: false,
  headerStyle: { backgroundColor: colors.paper },
  headerLargeStyle: { backgroundColor: colors.paper },
  headerTintColor: colors.ink,
  headerTitleStyle: { fontFamily: fontFamilyFor(700), color: colors.ink },
  headerLargeTitleStyle: { fontFamily: fontFamilyFor(700), fontSize: typeScale.h1.size, color: colors.ink },
  contentStyle: { backgroundColor: colors.paper },
})

export const largeTitleOptions = (colors: Palette): NativeStackNavigationOptions => ({
  ...headerOptions(colors),
  headerLargeTitleEnabled: true,
})

export const formSheetOptions = (colors: Palette, title: string): NativeStackNavigationOptions => ({
  ...headerOptions(colors),
  title,
  headerShown: true,
  presentation: 'formSheet',
  sheetAllowedDetents: [0.8, 1],
  sheetInitialDetentIndex: 0,
  sheetGrabberVisible: true,
  sheetCornerRadius: radius.lg,
})
