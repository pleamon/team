import { forwardRef } from 'react'
import type { ButtonProps } from './types'

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-[14px]',
  md: 'h-10 px-4 text-[16px]',
  lg: 'h-12 px-6 text-[18px]',
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-[var(--color-info)] text-white hover:bg-[var(--color-info-hover)] active:bg-[var(--color-info-active)]',
  secondary:
    'border border-[var(--color-border-primary)] bg-[var(--color-bg-container)] text-[var(--color-text-primary)] hover:border-[var(--color-info-hover)] hover:text-[var(--color-info)]',
  ghost:
    'bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-spotlight)] hover:text-[var(--color-text-primary)]',
  danger:
    'bg-[var(--color-error)] text-white hover:bg-[var(--color-error-hover)] active:bg-[var(--color-error-active)]',
  link:
    'bg-transparent text-[var(--color-info)] hover:text-[var(--color-info-hover)] underline-offset-4 hover:underline p-0 h-auto',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      fullWidth = false,
      disabled,
      children,
      className = '',
      ...rest
    },
    ref,
  ) => {
    const isDisabled = disabled || loading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={[
          'inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] font-medium transition-colors outline-none',
          'focus-visible:ring-2 focus-visible:ring-[var(--color-info-light)]',
          sizeStyles[size],
          variantStyles[variant],
          isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
          fullWidth ? 'w-full' : '',
          className,
        ].join(' ')}
        {...rest}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        )}
        {!loading && icon}
        {children}
      </button>
    )
  },
)
Button.displayName = 'Button'
export default Button
export type { ButtonProps, ButtonVariant, ButtonSize } from './types'
