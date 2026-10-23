export const logoViewBox = '0 0 64 64'

export const logoShapes = [
  { kind: 'path', d: 'M32 4 L54 26 H10 Z M40 8 H46 V20 L40 14 Z' },
  { kind: 'rect', x: 13, y: 28, width: 38, height: 5, rx: 1 },
  { kind: 'path', d: 'M22 35 H42 L49 51 H15 Z M28 51 V44 A4 4 0 0 1 36 44 V51 Z', fillRule: 'evenodd' },
  { kind: 'rect', x: 11, y: 53, width: 42, height: 7, rx: 2 },
] as const

export type LogoShape = (typeof logoShapes)[number]

export const logoSvg = (fill: string, background?: string) => {
  const shapes = logoShapes
    .map((shape) =>
      shape.kind === 'path'
        ? `<path d="${shape.d}"${'fillRule' in shape ? ` fill-rule="${shape.fillRule}"` : ''}/>`
        : `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" rx="${shape.rx}"/>`,
    )
    .join('')
  const bg = background ? `<rect width="64" height="64" fill="${background}"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${logoViewBox}">${bg}<g fill="${fill}">${shapes}</g></svg>`
}
