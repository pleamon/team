import { useCallback, useEffect, useRef, useState } from 'react'
import type { DialogProps } from './types'

const widthMap: Record<string, string> = {
  confirm: 'w-[400px]',
  form: 'w-[520px]',
  large: 'w-[720px]',
  fullscreen: 'w-screen h-screen',
}

/**
 * Dialog — 模态弹窗 (T1-09)
 *
 * Variants: confirm (400px) / form (520px) / large (720px) / fullscreen
 * Features: focus trap, Escape close, animations, overlay click
 */
export function Dialog({
  open,
  onClose,
  variant = 'form',
  title,
  children,
  footer,
  loading = false,
  closeOnOverlay = true,
  showClose = true,
  className = '',
}: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const [visible, setVisible] = useState(false)
  const [animating, setAnimating] = useState(false)

  /* ── Open / Close animation ── */
  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      setVisible(true)
      requestAnimationFrame(() => setAnimating(true))
      // focus first focusable
      setTimeout(() => {
        const el = dialogRef.current?.querySelector<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        el?.focus()
      }, 50)
    } else if (visible) {
      setAnimating(false)
      const timer = setTimeout(() => {
        setVisible(false)
        previousFocusRef.current?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [open])

  /* ── Escape key ── */
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  /* ── Focus trap ── */
  const handleTab = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== 'Tab' || !dialogRef.current) return
    const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (focusable.length === 0) return
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }, [])

  /* ── Lock body scroll ── */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = '' }
    }
  }, [open])

  if (!visible) return null

  const isFullscreen = variant === 'fullscreen'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      {/* Overlay */}
      <div
        className={[
          'absolute inset-0 transition-opacity duration-200',
          'bg-black/45 dark:bg-black/65',
          animating ? 'opacity-100' : 'opacity-0',
        ].join(' ')}
        onClick={closeOnOverlay ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Dialog container */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        className={[
          'relative flex flex-col transition-all duration-200',
          isFullscreen
            ? 'w-screen h-screen'
            : `${widthMap[variant]} max-h-[80vh] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)]`,
          'bg-[var(--color-bg-elevated)]',
          animating
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-95',
          className,
        ].join(' ')}
        onKeyDown={handleTab}
      >
        {/* Header */}
        {(title || showClose) && (
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-secondary)] px-6">
            {title && (
              <h2
                id="dialog-title"
                className="text-[18px] font-semibold text-[var(--color-text-primary)]"
              >
                {title}
              </h2>
            )}
            {showClose && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-6 w-6 items-center justify-center rounded hover:bg-[var(--color-bg-spotlight)] text-[var(--color-text-secondary)]"
                aria-label="关闭"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Body */}
        <div
          className={[
            'flex-1 overflow-auto p-6',
            isFullscreen ? '' : 'max-h-[calc(80vh-130px)]',
          ].join(' ')}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <svg className="h-8 w-8 animate-spin text-[var(--color-info)]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : (
            children
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex h-16 shrink-0 items-center justify-end gap-2 border-t border-[var(--color-border-secondary)] px-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export default Dialog
export type { DialogProps, DialogVariant } from './types'
