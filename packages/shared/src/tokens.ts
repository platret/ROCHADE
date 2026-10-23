const light = {
  paper: '#FAF8F5',
  surface: '#FFFFFF',
  surfaceSunken: '#F1EDE6',
  line: '#E3DDD4',
  lineStrong: '#8A8178',
  ink: '#1C2326',
  inkMuted: '#5B6468',
  orange: '#F26A1B',
  orangeStrong: '#B8460E',
  onOrange: '#FFFFFF',
  orangeSoft: '#FDEBDD',
  slate: '#24414A',
  slateSoft: '#E2ECEE',
  success: '#276B43',
  successSoft: '#E3F1E8',
  danger: '#B42318',
  dangerSoft: '#FBE6E3',
} as const

export type ColorName = keyof typeof light
export type Palette = Record<ColorName, string>

const dark: Palette = {
  paper: '#14191B',
  surface: '#1D2427',
  surfaceSunken: '#101416',
  line: '#2E373B',
  lineStrong: '#6B777B',
  ink: '#F2EEE8',
  inkMuted: '#A8B0B3',
  orange: '#FF7A2E',
  orangeStrong: '#FF8A42',
  onOrange: '#1A1208',
  orangeSoft: '#3A1E0C',
  slate: '#8CC0CC',
  slateSoft: '#1C3138',
  success: '#5CC28A',
  successSoft: '#16301F',
  danger: '#F4806F',
  dangerSoft: '#3A1714',
}

export const colors = { light, dark } as const
export type ColorScheme = keyof typeof colors
export const colorNames = Object.keys(light) as ColorName[]

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32, xxxl: 64 } as const
export const gutter = spacing.lg

export const radius = { sm: 6, md: 10, lg: 16 } as const

export const fontFamily = { sans: 'Manrope', mono: 'JetBrains Mono' } as const
export const fontWeight = { regular: 400, semibold: 600, bold: 700, extrabold: 800, mono: 500 } as const
export type FontWeight = (typeof fontWeight)[keyof typeof fontWeight]

export const typeScale = {
  display: { size: 48, lineHeight: 52, weight: 800 },
  h1: { size: 32, lineHeight: 38, weight: 700 },
  h2: { size: 24, lineHeight: 30, weight: 700 },
  h3: { size: 18, lineHeight: 24, weight: 600 },
  body: { size: 16, lineHeight: 24, weight: 400 },
  bodySm: { size: 14, lineHeight: 20, weight: 400 },
  label: { size: 13, lineHeight: 16, weight: 600 },
  caption: { size: 12, lineHeight: 16, weight: 400 },
} as const satisfies Record<string, { size: number; lineHeight: number; weight: FontWeight }>
export type TypeStyle = keyof typeof typeScale

export const wordmark = { text: 'ROCHADE', letterSpacingEm: 0.08, weight: fontWeight.extrabold } as const
export const tagline = 'Sanieren, ohne jemanden rauszuwerfen.'

export const timelineColors = {
  home: 'line',
  temp: 'slate',
  moveDay: 'orange',
  renovatedOutline: 'orange',
  conflictOutline: 'danger',
} as const satisfies Record<string, ColorName>

export const statusColors = {
  ok: { fg: 'success', bg: 'successSoft' },
  conflict: { fg: 'danger', bg: 'dangerSoft' },
  open: { fg: 'inkMuted', bg: 'surfaceSunken' },
} as const satisfies Record<string, { fg: ColorName; bg: ColorName }>
