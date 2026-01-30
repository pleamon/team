import type { ReactNode } from 'react'

export type BadgeVariant = 'success' | 'info' | 'error' | 'warning'

export interface BadgeProps {
  variant?: BadgeVariant
  children: ReactNode
  dot?: boolean
  className?: string
}

const variantStyles: Record<string, string> = {
  success: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
  info: 'bg-[var(--color-info-light)] text-[var(--color-info)]',
  error: 'bg-[var(--color-error-light)] text-[var(--color-error)]',
  warning: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
}
const dotColors: Record<string, string> = {
  success: 'bg-[var(--color-success)]',
  info: 'bg-[var(--color-info)]',
  error: 'bg-[var(--color-error)]',
  warning: 'bg-[var(--color-warning)]',
}

export function Badge({ variant = 'info', children, dot = true, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[12px] font-medium h-6',
        variantStyles[variant],
        className,
      ].join(' ')}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  )
}
export default Badge
