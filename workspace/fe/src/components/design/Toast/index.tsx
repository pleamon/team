import { useCallback, useEffect, useRef, useState } from 'react'
import type { ToastItem, ToastProps, ToastContainerProps } from './types'

/* ── Variant config ── */
const variantConfig = {
  success: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M9 12l2 2 4-4" />
      </svg>
    ),
    color: 'var(--color-success)',
    liveMode: 'polite' as const,
    defaultDuration: 3000,
  },
  error: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
    color: 'var(--color-error)',
    liveMode: 'assertive' as const,
    defaultDuration: 0, // manual close
  },
  warning: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeWidth="2" d="M12 2l10 18H2L12 2z" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 10v4M12 16h.01" />
      </svg>
    ),
    color: 'var(--color-warning)',
    liveMode: 'assertive' as const,
    defaultDuration: 5000,
  },
  info: {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <path strokeLinecap="round" strokeWidth="2" d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    color: 'var(--color-info)',
    liveMode: 'polite' as const,
    defaultDuration: 3000,
  },
}

/**
 * Single Toast item (T1-10)
 */
function ToastCard({ item, onClose }: ToastProps) {
  const cfg = variantConfig[item.variant]
  const duration = item.duration ?? cfg.defaultDuration
  const [exiting, setExiting] = useState(false)
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const startTimer = useCallback(() => {
    if (duration <= 0) return
    timerRef.current = setTimeout(() => {
      setExiting(true)
      setTimeout(() => onClose(item.id), 200)
    }, duration)
  }, [duration, item.id, onClose])

  useEffect(() => {
    if (!paused) startTimer()
    return () => clearTimeout(timerRef.current)
  }, [paused, startTimer])

  return (
    <div
      role="alert"
      aria-live={cfg.liveMode}
      className={[
        'relative flex w-[360px] items-start gap-3 rounded-[var(--radius-md)] border-l-[3px] bg-[var(--color-bg-elevated)] p-4 shadow-[var(--shadow-lg)] transition-all duration-300',
        exiting
          ? 'translate-x-full opacity-0'
          : 'translate-x-0 opacity-100',
      ].join(' ')}
      style={{ borderLeftColor: cfg.color }}
      onMouseEnter={() => {
        setPaused(true)
        clearTimeout(timerRef.current)
      }}
      onMouseLeave={() => setPaused(false)}
    >
      <span style={{ color: cfg.color }} className="shrink-0 mt-0.5">
        {cfg.icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-semibold text-[var(--color-text-primary)]">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-1 text-[14px] text-[var(--color-text-secondary)]">
            {item.description}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          setExiting(true)
          setTimeout(() => onClose(item.id), 200)
        }}
        className="shrink-0 flex h-4 w-4 items-center justify-center text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)]"
        aria-label="关闭"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

/**
 * ToastContainer — 右上角 toast 列表
 */
export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2" aria-label="通知">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} onClose={onClose} />
      ))}
    </div>
  )
}

/**
 * useToast — helper hook for managing toast state
 */
export function useToast() {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const add = useCallback(
    (opts: Omit<ToastItem, 'id'>) => {
      const id = String(++idRef.current)
      setToasts((prev) => [...prev, { ...opts, id }])
      return id
    },
    [],
  )

  const close = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const success = useCallback(
    (title: string, description?: string) => add({ variant: 'success', title, description }),
    [add],
  )
  const error = useCallback(
    (title: string, description?: string) => add({ variant: 'error', title, description }),
    [add],
  )
  const warning = useCallback(
    (title: string, description?: string) => add({ variant: 'warning', title, description }),
    [add],
  )
  const info = useCallback(
    (title: string, description?: string) => add({ variant: 'info', title, description }),
    [add],
  )

  return { toasts, add, close, success, error, warning, info }
}

export { ToastCard as Toast }
export default ToastContainer
export type { ToastItem, ToastProps, ToastContainerProps, ToastVariant } from './types'
