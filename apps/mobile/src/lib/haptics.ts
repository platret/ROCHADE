import * as Haptics from 'expo-haptics'

const quietly = (feedback: Promise<void>) => {
  feedback.catch(() => undefined)
}

const impactStyles = { light: Haptics.ImpactFeedbackStyle.Light, medium: Haptics.ImpactFeedbackStyle.Medium } as const

export const haptics = {
  success: () => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => quietly(Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  impact: (style: keyof typeof impactStyles = 'light') => quietly(Haptics.impactAsync(impactStyles[style])),
  selection: () => quietly(Haptics.selectionAsync()),
}
