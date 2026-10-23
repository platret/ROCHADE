import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { colorNames, colors, fontFamily, radius, typeScale, wordmark, type Palette } from '@rochade/shared'

const kebab = (name: string) => name.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

const block = (selector: string, lines: string[]) =>
  [`${selector} {`, ...lines.flatMap((line) => line.split('\n')).map((line) => `  ${line}`), '}'].join('\n')

const paletteLines = (palette: Palette) => colorNames.map((name) => `--${kebab(name)}: ${palette[name]};`)

const bridgeLines = ['--color-*: initial;', ...colorNames.map((name) => `--color-${kebab(name)}: var(--${kebab(name)});`)]

const themeLines = [
  `--font-sans: '${fontFamily.sans}', ui-sans-serif, system-ui, sans-serif;`,
  `--font-mono: '${fontFamily.mono}', ui-monospace, monospace;`,
  `--tracking-wordmark: ${wordmark.letterSpacingEm}em;`,
  ...Object.entries(radius).map(([name, px]) => `--radius-${name}: ${px}px;`),
  ...Object.entries(typeScale).flatMap(([name, style]) => [
    `--text-${kebab(name)}: ${style.size}px;`,
    `--text-${kebab(name)}--line-height: ${style.lineHeight}px;`,
    `--text-${kebab(name)}--font-weight: ${style.weight};`,
  ]),
]

const css = [
  block(':root', paletteLines(colors.light)),
  block('@media (prefers-color-scheme: dark)', [block(':root', paletteLines(colors.dark))]),
  block('@theme inline', bridgeLines),
  block('@theme', themeLines),
].join('\n\n')

const target = fileURLToPath(new URL('../src/styles/tokens.css', import.meta.url))
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, `${css}\n`)
console.log(`tokens.css geschrieben: ${target}`)
