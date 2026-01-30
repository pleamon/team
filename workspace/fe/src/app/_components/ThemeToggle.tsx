'use client'

import { useEffect, useMemo, useState } from 'react'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const initial = useMemo(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }, [])

  const [isDark, setIsDark] = useState(initial)

  useEffect(() => {
    if (typeof document === 'undefined') return
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light')
  }, [isDark])

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="切换暗色模式"
      onClick={() => setIsDark((v) => !v)}
      className={[
        'inline-flex items-center gap-2 rounded-full border border-[var(--color-border-primary)] px-3 py-1.5 text-[14px]',
        'hover:bg-[var(--color-bg-spotlight)] transition-colors',
        className,
      ].join(' ')}
    >
      <span className={!isDark ? 'font-semibold text-[var(--color-info)]' : 'text-[var(--color-text-tertiary)]'}>
        Light
      </span>
      <span
        className={`h-5 w-5 rounded-full transition-colors ${
          isDark ? 'bg-[var(--color-info)]' : 'bg-[var(--color-border-primary)]'
        }`}
      />
      <span className={isDark ? 'font-semibold text-[var(--color-info)]' : 'text-[var(--color-text-tertiary)]'}>
        Dark
      </span>
    </button>
  )
}
