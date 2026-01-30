import type { SkeletonProps } from './types'

/* ── Base shimmer class ── */
const shimmer = [
  'bg-gradient-to-r',
  'from-[var(--skeleton-base,#f0f0f0)] via-[var(--skeleton-highlight,#e0e0e0)] to-[var(--skeleton-base,#f0f0f0)]',
  'bg-[length:200%_100%]',
  'animate-[skeleton-shimmer_1.5s_ease-in-out_infinite]',
  'motion-reduce:animate-none',
].join(' ')

/**
 * Skeleton — 骨架屏 (T1-12)
 *
 * Variants: text / avatar / image / card / table-row / form
 * Features: shimmer animation, reduced-motion, fade to content
 */
export function Skeleton({
  variant = 'text',
  size = 'md',
  lines = 3,
  width,
  height,
  loading = true,
  children,
  columns = 4,
  fields = 3,
  className = '',
}: SkeletonProps) {
  if (!loading && children) {
    return (
      <div className="animate-[fade-in_300ms_ease-in]">{children}</div>
    )
  }

  if (!loading) return null

  const base = `${shimmer} ${className}`

  /* ── Text ── */
  if (variant === 'text') {
    return (
      <div
        className={`flex flex-col gap-3 ${className}`}
        aria-busy="true"
        aria-label="加载中"
        style={{ width }}
      >
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 rounded-[var(--radius-sm)] ${shimmer}`}
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  /* ── Avatar ── */
  if (variant === 'avatar') {
    const avatarSizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-16 w-16' }
    return (
      <div
        className={`rounded-full ${avatarSizes[size]} ${base}`}
        aria-busy="true"
        aria-label="加载中"
      />
    )
  }

  /* ── Image ── */
  if (variant === 'image') {
    return (
      <div
        className={`h-[200px] w-full rounded-[var(--radius-md)] ${base}`}
        style={{ width, height }}
        aria-busy="true"
        aria-label="加载中"
      />
    )
  }

  /* ── Card (image + text) ── */
  if (variant === 'card') {
    return (
      <div
        className={`flex flex-col gap-3 ${className}`}
        aria-busy="true"
        aria-label="加载中"
        style={{ width }}
      >
        <div className={`h-[200px] w-full rounded-[var(--radius-md)] ${shimmer}`} />
        <div className="flex flex-col gap-3">
          <div className={`h-4 w-3/4 rounded-[var(--radius-sm)] ${shimmer}`} />
          <div className={`h-4 w-full rounded-[var(--radius-sm)] ${shimmer}`} />
          <div className={`h-4 w-1/2 rounded-[var(--radius-sm)] ${shimmer}`} />
        </div>
      </div>
    )
  }

  /* ── Table row ── */
  if (variant === 'table-row') {
    return (
      <div
        className={`flex items-center gap-4 h-14 px-4 ${className}`}
        aria-busy="true"
        aria-label="加载中"
      >
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className={`h-4 flex-1 rounded-[var(--radius-sm)] ${shimmer}`}
            style={{ maxWidth: i === 0 ? '120px' : undefined }}
          />
        ))}
      </div>
    )
  }

  /* ── Form ── */
  if (variant === 'form') {
    return (
      <div
        className={`flex flex-col gap-5 ${className}`}
        aria-busy="true"
        aria-label="加载中"
        style={{ width }}
      >
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2">
            <div className={`h-3.5 w-20 rounded-[var(--radius-sm)] ${shimmer}`} />
            <div className={`h-10 w-full rounded-[var(--radius-md)] ${shimmer}`} />
          </div>
        ))}
      </div>
    )
  }

  return null
}

export default Skeleton
export type { SkeletonProps, SkeletonVariant, SkeletonSize } from './types'
