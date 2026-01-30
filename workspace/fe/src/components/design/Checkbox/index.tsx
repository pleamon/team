import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import type { CheckboxProps, CheckboxGroupProps } from './types'

/* ── Group context ── */
interface GroupCtx {
  value: Set<string>
  toggle: (v: string) => void
  disabled: boolean
}
const GroupContext = createContext<GroupCtx | null>(null)

/* ── Size ── */
const boxSizes: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-5 w-5',
}
const labelSizes: Record<string, string> = {
  sm: 'text-[14px]',
  md: 'text-[16px]',
}

/**
 * Checkbox — 复选框 (T1-07)
 *
 * Variants: default / with-description / card
 * States: unchecked, checked, indeterminate, disabled, disabled-checked, error
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      indeterminate = false,
      onChange,
      disabled = false,
      error = false,
      size = 'md',
      variant = 'default',
      label,
      description,
      className = '',
      name,
      value,
    },
    ref,
  ) => {
    const id = useId()
    const innerRef = useRef<HTMLInputElement>(null)
    const group = useContext(GroupContext)

    const isDisabled = disabled || (group?.disabled ?? false)

    const [internalChecked, setInternalChecked] = useState(defaultChecked)
    const isChecked =
      group && value !== undefined
        ? group.value.has(value)
        : (controlledChecked ?? internalChecked)

    // sync indeterminate
    useEffect(() => {
      const el = innerRef.current
      if (el) el.indeterminate = indeterminate
    }, [indeterminate])

    const handleChange = useCallback(() => {
      if (isDisabled) return
      if (group && value !== undefined) {
        group.toggle(value)
      } else {
        const next = !isChecked
        setInternalChecked(next)
        onChange?.(next)
      }
    }, [isDisabled, group, value, isChecked, onChange])

    /* ── Visual box ── */
    const boxBorder = error
      ? 'border-[var(--color-error)]'
      : isChecked || indeterminate
        ? ''
        : isDisabled
          ? 'border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)]'
          : 'border-[var(--color-border-primary)] group-hover:border-[var(--color-info)]'

    const boxFill =
      isChecked || indeterminate
        ? isDisabled
          ? 'bg-[var(--color-text-disabled)] border-transparent'
          : 'bg-[var(--color-info)] border-transparent group-hover:bg-[var(--color-info-hover)]'
        : ''

    const cardStyles =
      variant === 'card'
        ? [
            'rounded-[var(--radius-md)] border p-3',
            isChecked
              ? 'border-[var(--color-info)] bg-[var(--color-info-light)]'
              : 'border-[var(--color-border-primary)] hover:border-[var(--color-info-hover)]',
            isDisabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer',
          ].join(' ')
        : ''

    return (
      <label
        className={[
          'group inline-flex items-start gap-2',
          isDisabled ? 'cursor-not-allowed' : 'cursor-pointer',
          cardStyles,
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <input
          ref={(node) => {
            (innerRef as React.MutableRefObject<HTMLInputElement | null>).current = node
            if (typeof ref === 'function') ref(node)
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node
          }}
          type="checkbox"
          role="checkbox"
          aria-checked={indeterminate ? 'mixed' : isChecked}
          checked={isChecked}
          disabled={isDisabled}
          name={name}
          value={value}
          onChange={handleChange}
          className="sr-only"
        />

        {/* Visual box */}
        <span
          className={[
            'mt-0.5 flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] border transition-colors',
            boxSizes[size],
            boxBorder,
            boxFill,
          ].join(' ')}
          aria-hidden="true"
        >
          {isChecked && !indeterminate && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {indeterminate && (
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 12h14" />
            </svg>
          )}
        </span>

        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className={labelSizes[size]}>{label}</span>}
            {description && (
              <span className="text-[14px] text-[var(--color-text-secondary)]">
                {description}
              </span>
            )}
          </span>
        )}
      </label>
    )
  },
)
Checkbox.displayName = 'Checkbox'

/**
 * CheckboxGroup — 复选框组
 */
export function CheckboxGroup({
  children,
  value: controlledValue,
  defaultValue,
  onChange,
  disabled = false,
  label,
  direction = 'vertical',
}: CheckboxGroupProps) {
  const id = useId()
  const [internalValue, setInternalValue] = useState<string[]>(defaultValue ?? [])
  const value = controlledValue ?? internalValue
  const valueSet = new Set(value)

  const toggle = useCallback(
    (v: string) => {
      const next = valueSet.has(v)
        ? value.filter((x) => x !== v)
        : [...value, v]
      setInternalValue(next)
      onChange?.(next)
    },
    [value, valueSet, onChange],
  )

  return (
    <div role="group" aria-labelledby={label ? id : undefined}>
      {label && (
        <span id={id} className="mb-2 block text-[14px] font-medium text-[var(--color-text-primary)]">
          {label}
        </span>
      )}
      <div
        className={
          direction === 'vertical' ? 'flex flex-col gap-3' : 'flex flex-wrap gap-4'
        }
      >
        <GroupContext.Provider value={{ value: valueSet, toggle, disabled }}>
          {children}
        </GroupContext.Provider>
      </div>
    </div>
  )
}

export default Checkbox
export type {
  CheckboxProps,
  CheckboxGroupProps,
  CheckboxSize,
  CheckboxVariant,
} from './types'
