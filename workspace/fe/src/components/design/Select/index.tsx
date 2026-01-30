import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SelectProps, SelectOption } from './types'

/* ── Size styles ── */
const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-2 text-[14px]',
  md: 'h-10 px-3 text-[16px]',
  lg: 'h-12 px-4 text-[18px]',
}

/* ── Chevron SVG ── */
const ChevronDown = ({ open }: { open: boolean }) => (
  <svg
    className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
)

const CheckIcon = () => (
  <svg className="h-4 w-4 text-[var(--color-info)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
)

const ClearIcon = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center justify-center rounded-full p-0.5 hover:bg-[var(--color-bg-spotlight)] text-[var(--color-text-tertiary)]"
    aria-label="清除"
  >
    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
)

/**
 * Select — 下拉选择器 (T1-06)
 *
 * Variants: single / multiple / searchable / grouped
 */
export const Select = forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options,
      value: controlledValue,
      defaultValue,
      onChange,
      variant = 'single',
      size = 'md',
      placeholder = '请选择',
      disabled = false,
      error = false,
      errorMessage,
      loading = false,
      clearable = false,
      fullWidth = false,
      label,
      className = '',
      emptyText = '无选项',
      onSearch,
    },
    ref,
  ) => {
    const id = useId()
    const listboxId = `${id}-listbox`
    const errorId = `${id}-error`
    const containerRef = useRef<HTMLDivElement>(null)

    const isMultiple = variant === 'multiple'
    const isSearchable = variant === 'searchable'

    /* ── State ── */
    const [open, setOpen] = useState(false)
    const [internalValue, setInternalValue] = useState<string | string[]>(
      defaultValue ?? (isMultiple ? [] : ''),
    )
    const [search, setSearch] = useState('')
    const [activeIndex, setActiveIndex] = useState(-1)

    const value = controlledValue ?? internalValue
    const selectedSet = useMemo(
      () => new Set(Array.isArray(value) ? value : value ? [value] : []),
      [value],
    )

    /* ── Filtered / grouped options ── */
    const filtered = useMemo(() => {
      let opts = options
      if (isSearchable && search) {
        const kw = search.toLowerCase()
        opts = opts.filter((o) => o.label.toLowerCase().includes(kw))
      }
      return opts
    }, [options, search, isSearchable])

    const groups = useMemo(() => {
      if (variant !== 'grouped') return null
      const map = new Map<string, SelectOption[]>()
      filtered.forEach((o) => {
        const g = o.group ?? ''
        if (!map.has(g)) map.set(g, [])
        map.get(g)!.push(o)
      })
      return map
    }, [filtered, variant])

    /* ── Handlers ── */
    const select = useCallback(
      (opt: SelectOption) => {
        if (opt.disabled) return
        let next: string | string[]
        if (isMultiple) {
          const arr = Array.isArray(value) ? [...value] : []
          const idx = arr.indexOf(opt.value)
          if (idx >= 0) arr.splice(idx, 1)
          else arr.push(opt.value)
          next = arr
        } else {
          next = opt.value
          setOpen(false)
          setSearch('')
        }
        setInternalValue(next)
        onChange?.(next)
      },
      [isMultiple, value, onChange],
    )

    const clear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation()
        const next = isMultiple ? [] : ''
        setInternalValue(next)
        onChange?.(next)
      },
      [isMultiple, onChange],
    )

    /* ── Close on outside click ── */
    useEffect(() => {
      if (!open) return
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setOpen(false)
          setSearch('')
        }
      }
      document.addEventListener('mousedown', handler)
      return () => document.removeEventListener('mousedown', handler)
    }, [open])

    /* ── Keyboard ── */
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          if (!open) {
            setOpen(true)
          } else if (activeIndex >= 0 && filtered[activeIndex]) {
            select(filtered[activeIndex])
          }
        } else if (e.key === 'Escape') {
          setOpen(false)
          setSearch('')
        } else if (e.key === 'ArrowDown') {
          e.preventDefault()
          setActiveIndex((i) => Math.min(i + 1, filtered.length - 1))
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setActiveIndex((i) => Math.max(i - 1, 0))
        }
      },
      [disabled, open, activeIndex, filtered, select],
    )

    /* ── Display label ── */
    const displayLabel = useMemo(() => {
      if (isMultiple) {
        const arr = Array.isArray(value) ? value : []
        if (arr.length === 0) return null
        return arr.map((v) => {
          const opt = options.find((o) => o.value === v)
          return (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-[var(--radius-sm)] bg-[var(--color-bg-spotlight)] px-1.5 py-0.5 text-[12px] h-6"
            >
              {opt?.label ?? v}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  select({ value: v, label: '' })
                }}
                className="hover:text-[var(--color-text-primary)]"
                aria-label={`移除 ${opt?.label ?? v}`}
              >
                ×
              </button>
            </span>
          )
        })
      }
      const sel = options.find((o) => o.value === value)
      return sel ? sel.label : null
    }, [value, options, isMultiple, select])

    /* ── Styles ── */
    const widthCls = fullWidth ? 'w-full' : 'w-64'

    const triggerState = disabled
      ? 'border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)] text-[var(--color-text-disabled)] cursor-not-allowed'
      : error
        ? 'border-[var(--color-error)] cursor-pointer'
        : open
          ? 'border-[var(--color-info)] ring-2 ring-[var(--color-info-light)] cursor-pointer'
          : 'border-[var(--color-border-primary)] hover:border-[var(--color-info-hover)] cursor-pointer'

    /* ── Render option row ── */
    const renderOption = (opt: SelectOption, idx: number) => (
      <li
        key={opt.value}
        role="option"
        aria-selected={selectedSet.has(opt.value)}
        aria-disabled={opt.disabled}
        className={[
          'flex h-9 items-center justify-between px-3 text-[14px] select-none',
          opt.disabled
            ? 'text-[var(--color-text-disabled)] cursor-not-allowed'
            : idx === activeIndex
              ? 'bg-[var(--color-bg-spotlight)]'
              : 'hover:bg-[var(--color-bg-spotlight)] cursor-pointer',
        ].join(' ')}
        onMouseEnter={() => !opt.disabled && setActiveIndex(idx)}
        onMouseDown={(e) => {
          e.preventDefault()
          select(opt)
        }}
      >
        <span>{opt.label}</span>
        {selectedSet.has(opt.value) && <CheckIcon />}
      </li>
    )

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          if (typeof ref === 'function') ref(node)
          else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node
        }}
        className={`relative inline-flex flex-col gap-1 ${widthCls} ${className}`}
      >
        {label && (
          <label className="text-[14px] text-[var(--color-text-primary)]">{label}</label>
        )}

        {/* Trigger */}
        <div
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls={open ? listboxId : undefined}
          aria-invalid={error || undefined}
          aria-describedby={error && errorMessage ? errorId : undefined}
          aria-disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          className={[
            'flex items-center gap-1 rounded-[var(--radius-md)] border outline-none transition-colors',
            sizeStyles[size],
            triggerState,
          ].join(' ')}
          onClick={() => !disabled && setOpen((o) => !o)}
          onKeyDown={handleKeyDown}
        >
          {isSearchable && open ? (
            <input
              autoFocus
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                onSearch?.(e.target.value)
              }}
              className="flex-1 bg-transparent outline-none placeholder:text-[var(--color-text-tertiary)]"
              placeholder={placeholder}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span
              className={`flex flex-1 flex-wrap items-center gap-1 overflow-hidden ${
                displayLabel ? '' : 'text-[var(--color-text-tertiary)]'
              }`}
            >
              {displayLabel ?? placeholder}
            </span>
          )}

          <span className="ml-auto flex items-center gap-1">
            {loading && <Spinner />}
            {clearable && selectedSet.size > 0 && !disabled && (
              <ClearIcon onClick={clear} />
            )}
            <ChevronDown open={open} />
          </span>
        </div>

        {/* Dropdown */}
        {open && !disabled && (
          <ul
            id={listboxId}
            role="listbox"
            aria-multiselectable={isMultiple || undefined}
            className="absolute top-full z-10 mt-1 max-h-64 w-full overflow-auto rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-md)]"
          >
            {filtered.length === 0 ? (
              <li className="flex h-9 items-center justify-center text-[14px] text-[var(--color-text-tertiary)]">
                {emptyText}
              </li>
            ) : groups ? (
              Array.from(groups.entries()).map(([group, opts]) => (
                <li key={group} role="group" aria-label={group}>
                  {group && (
                    <span className="block px-3 pt-2 text-[12px] text-[var(--color-text-tertiary)]">
                      {group}
                    </span>
                  )}
                  <ul role="presentation">
                    {opts.map((o) => renderOption(o, filtered.indexOf(o)))}
                  </ul>
                </li>
              ))
            ) : (
              filtered.map((o, i) => renderOption(o, i))
            )}
          </ul>
        )}

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
Select.displayName = 'Select'

export default Select
export type { SelectProps, SelectOption, SelectSize, SelectVariant } from './types'
