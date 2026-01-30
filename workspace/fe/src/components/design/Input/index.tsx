import { forwardRef, useId } from 'react'
import type { InputProps, TextareaProps } from './types'

/* ── Size mappings (per spec: sm=32px, md=40px, lg=48px) ── */
const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-2 text-[14px]',
  md: 'h-10 px-3 text-[16px]',
  lg: 'h-12 px-4 text-[18px]',
}

/**
 * Input — 文本输入框 (T1-05)
 *
 * Supports 6 variants × 7 states × 3 sizes.
 * Uses design token CSS variables for all colors/radius.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      errorMessage,
      iconLeft,
      iconRight,
      prefix,
      suffix,
      fullWidth = false,
      label,
      disabled,
      readOnly,
      className = '',
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId = externalId ?? autoId
    const errorId = `${inputId}-error`

    const base = [
      'rounded-[var(--radius-md)]',
      'border outline-none transition-colors',
      'bg-[var(--color-bg-container)] text-[var(--color-text-primary)]',
      'placeholder:text-[var(--color-text-tertiary)]',
    ].join(' ')

    const stateStyles = disabled
      ? 'border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)] text-[var(--color-text-disabled)] cursor-not-allowed'
      : readOnly
        ? 'border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)] text-[var(--color-text-secondary)]'
        : error
          ? [
              'border-[var(--color-error)]',
              'focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error-light)]',
            ].join(' ')
          : [
              'border-[var(--color-border-primary)]',
              'hover:border-[var(--color-info-hover)]',
              'focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info-light)]',
            ].join(' ')

    const widthCls = fullWidth ? 'w-full' : ''

    return (
      <div className={`inline-flex flex-col gap-1 ${widthCls}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}

        <div className={`relative inline-flex items-center ${widthCls}`}>
          {/* prefix text (e.g. https://) */}
          {prefix && (
            <span className="flex items-center rounded-l-[var(--radius-md)] border border-r-0 border-[var(--color-border-primary)] bg-[var(--color-bg-spotlight)] px-3 text-[var(--color-text-secondary)] text-[14px] h-full select-none">
              {prefix}
            </span>
          )}

          {/* left icon */}
          {iconLeft && (
            <span className="pointer-events-none absolute left-2 flex items-center text-[var(--color-text-tertiary)]">
              {iconLeft}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={error || undefined}
            aria-describedby={error && errorMessage ? errorId : undefined}
            className={[
              base,
              sizeStyles[size],
              stateStyles,
              iconLeft ? 'pl-8' : '',
              iconRight ? 'pr-8' : '',
              prefix ? 'rounded-l-none' : '',
              suffix ? 'rounded-r-none' : '',
              widthCls,
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...rest}
          />

          {/* right icon */}
          {iconRight && (
            <span className="pointer-events-none absolute right-2 flex items-center text-[var(--color-text-tertiary)]">
              {iconRight}
            </span>
          )}

          {/* suffix text (e.g. .com) */}
          {suffix && (
            <span className="flex items-center rounded-r-[var(--radius-md)] border border-l-0 border-[var(--color-border-primary)] bg-[var(--color-bg-spotlight)] px-3 text-[var(--color-text-secondary)] text-[14px] h-full select-none">
              {suffix}
            </span>
          )}
        </div>

        {error && errorMessage && (
          <span
            id={errorId}
            className="text-[12px] text-[var(--color-error)]"
            role="alert"
          >
            {errorMessage}
          </span>
        )}
      </div>
    )
  },
)
Input.displayName = 'Input'

/**
 * Textarea — 多行文本域 (T1-05 textarea variant)
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      size = 'md',
      error = false,
      errorMessage,
      fullWidth = false,
      label,
      disabled,
      className = '',
      id: externalId,
      ...rest
    },
    ref,
  ) => {
    const autoId = useId()
    const inputId = externalId ?? autoId
    const errorId = `${inputId}-error`

    const fontSizes: Record<string, string> = {
      sm: 'text-[14px]',
      md: 'text-[16px]',
      lg: 'text-[18px]',
    }

    const base = [
      'rounded-[var(--radius-md)] border outline-none transition-colors p-3',
      'bg-[var(--color-bg-container)] text-[var(--color-text-primary)]',
      'placeholder:text-[var(--color-text-tertiary)] resize-y min-h-[80px]',
    ].join(' ')

    const stateStyles = disabled
      ? 'border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)] text-[var(--color-text-disabled)] cursor-not-allowed'
      : error
        ? 'border-[var(--color-error)] focus:border-[var(--color-error)] focus:ring-2 focus:ring-[var(--color-error-light)]'
        : 'border-[var(--color-border-primary)] hover:border-[var(--color-info-hover)] focus:border-[var(--color-info)] focus:ring-2 focus:ring-[var(--color-info-light)]'

    const widthCls = fullWidth ? 'w-full' : ''

    return (
      <div className={`inline-flex flex-col gap-1 ${widthCls}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-[14px] text-[var(--color-text-primary)]"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? errorId : undefined}
          className={[base, fontSizes[size], stateStyles, widthCls, className]
            .filter(Boolean)
            .join(' ')}
          {...rest}
        />
        {error && errorMessage && (
          <span
            id={errorId}
            className="text-[12px] text-[var(--color-error)]"
            role="alert"
          >
            {errorMessage}
          </span>
        )}
      </div>
    )
  },
)
Textarea.displayName = 'Textarea'

export default Input
export type { InputProps, TextareaProps, InputSize, InputVariant } from './types'
