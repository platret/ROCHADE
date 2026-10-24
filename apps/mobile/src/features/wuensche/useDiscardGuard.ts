import { usePreventRemove } from 'expo-router'
import { useState } from 'react'
import { ActionSheetIOS } from 'react-native'

export const useDiscardGuard = (active: boolean, silent: boolean) => {
  const [discarded, setDiscarded] = useState(false)
  usePreventRemove(active && !discarded, ({ repeat }) => {
    if (silent) return
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: 'Änderungen verwerfen?',
        message: 'Deine Eingaben sind noch nicht gespeichert.',
        options: ['Verwerfen', 'Weiter bearbeiten'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (index) => {
        if (index !== 0) return
        setDiscarded(true)
        repeat()
      },
    )
  })
}
