'use client'

import type { ReactNode } from 'react'

export interface Step {
  key: string
  label: ReactNode
}

export interface StepIndicatorProps {
  steps: Step[]
  /** 0-based current step index */
  current: number
  /** mark a step as completed (typically < current, but can be all completed on result page) */
  completed?: boolean[]
  className?: string
}

const CheckIcon = (
  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
)

export function StepIndicator({ steps, current, completed, className = '' }: StepIndicatorProps) {
  const completedFlags = completed ?? steps.map((_, i) => i < current)

  return (
    <nav
      role="navigation"
      aria-label="Form steps"
      className={['flex items-center justify-center', 'mb-[var(--space-8)]', className].join(' ')}
    >
      <ol className="flex items-center">
        {steps.map((s, idx) => {
          const isCompleted = !!completedFlags[idx]
          const isCurrent = idx === current
          const isUpcoming = !isCompleted && !isCurrent

          const circleCls = isCompleted
            ? 'bg-[var(--color-success)] text-[var(--color-white)]'
            : isCurrent
              ? 'bg-[var(--color-primary-500)] text-[var(--color-white)]'
              : 'bg-[var(--color-gray-200)] text-[var(--color-gray-500)]'

          const connectorActive = idx < current || (completedFlags[idx] && !isCurrent)
          const connectorCls = connectorActive
            ? 'bg-[var(--color-primary-500)]'
            : 'bg-[var(--color-gray-200)]'

          return (
            <li key={s.key} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={[
                    'h-8 w-8 rounded-full flex items-center justify-center text-[var(--font-sm)] font-semibold',
                    circleCls,
                  ].join(' ')}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? CheckIcon : idx + 1}
                </div>
                <div className="mt-[var(--space-2)] text-center text-[var(--font-sm)]">
                  <div className={isUpcoming ? 'text-[var(--color-gray-500)]' : 'text-[var(--color-gray-700)]'}>
                    {s.label}
                  </div>
                </div>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={['mx-3 h-[2px] w-20', connectorCls].join(' ')}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default StepIndicator

