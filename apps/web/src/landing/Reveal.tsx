import { motion } from 'motion/react'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const
const tags = { div: motion.div, li: motion.li, span: motion.span } as const
const hidden = { opacity: 0, y: 14 }
const shown = { opacity: 1, y: 0 }

type Props = { children: ReactNode; delay?: number; className?: string; as?: keyof typeof tags; onMount?: boolean }

export const Reveal = ({ children, delay = 0, className, as = 'div', onMount = false }: Props) => {
  const Tag = tags[as]
  const transition = { duration: 0.56, delay, ease }
  return onMount ? (
    <Tag className={className} initial={hidden} animate={shown} transition={transition}>
      {children}
    </Tag>
  ) : (
    <Tag
      className={className}
      initial={hidden}
      whileInView={shown}
      viewport={{ once: true, amount: 0.2, margin: '0px 0px -10% 0px' }}
      transition={transition}
    >
      {children}
    </Tag>
  )
}
