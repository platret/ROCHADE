import { gutter, spacing } from '@rochade/shared'
import { router } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useIdentity } from '@/data/IdentityProvider'
import { useTheme } from '@/theme/useTheme'
import { Button } from '@/ui/Button'
import { Dots } from './Dots'
import { IntroPage } from './IntroPage'
import { introPages } from './pages'
import { SkipBar } from './SkipBar'
import { useIntroPager } from './useIntroPager'

const pageCount = introPages.length

export const IntroScreen = () => {
  const { colors } = useTheme()
  const insets = useSafeAreaInsets()
  const { finishIntro } = useIdentity()
  const { width, scrollRef, page, onScroll, goTo } = useIntroPager(pageCount)
  const last = page === pageCount - 1

  const finish = () => {
    router.replace('/code')
    finishIntro()
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.paper,
        paddingTop: insets.top,
        paddingBottom: Math.max(insets.bottom, spacing.lg),
      }}
    >
      <SkipBar visible={!last} onSkip={finish} />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {introPages.map(({ title, body, Stage }, index) => (
          <IntroPage key={title} width={width} title={title} body={body}>
            <Stage active={page === index} />
          </IntroPage>
        ))}
      </ScrollView>
      <View style={{ paddingHorizontal: gutter, paddingTop: spacing.lg, gap: spacing.xl }}>
        <Dots count={pageCount} active={page} />
        <Button label={last ? 'Code eingeben' : 'Weiter'} onPress={last ? finish : () => goTo(page + 1)} />
      </View>
    </View>
  )
}
