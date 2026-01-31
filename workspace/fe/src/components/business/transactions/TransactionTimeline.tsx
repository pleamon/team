'use client'

import type { TransactionTimelineEvent } from './types'

function formatTimelineTime(iso: string) {
  const d = new Date(iso)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

function toneColor(tone?: TransactionTimelineEvent['tone']) {
  switch (tone) {
    case 'success':
      return 'bg-[var(--color-success)]'
    case 'error':
      return 'bg-[var(--color-error)]'
    case 'warning':
      return 'bg-[var(--color-warning)]'
    case 'info':
      return 'bg-[var(--color-info)]'
    default:
      return 'bg-[var(--color-gray-300)]'
  }
}

export interface TransactionTimelineProps {
  events: TransactionTimelineEvent[]
}

export function TransactionTimeline({ events }: TransactionTimelineProps) {
  return (
    <ol aria-label="Transaction timeline" className="space-y-[var(--space-4)]">
      {events.map((e, idx) => {
        const last = idx === events.length - 1
        return (
          <li key={e.id} className="relative flex gap-[var(--space-3)]">
            {/* Connector */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute left-[3px] top-[10px] h-[calc(100%-10px)] w-[2px] bg-[var(--color-gray-200)]"
              />
            )}
            {/* Node */}
            <span
              aria-hidden="true"
              className={[
                'mt-[2px] h-[8px] w-[8px] rounded-full',
                toneColor(e.tone),
              ].join(' ')}
            />

            <div className="flex min-w-0 flex-1 items-start justify-between gap-[var(--space-4)]">
              <div className="min-w-0">
                <div className="truncate text-[var(--font-sm)] text-[var(--color-gray-700)]">{e.label}</div>
              </div>
              <div className="shrink-0 text-right text-[var(--font-xs)] text-[var(--color-gray-500)]">
                {formatTimelineTime(e.timestamp)}
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export default TransactionTimeline

