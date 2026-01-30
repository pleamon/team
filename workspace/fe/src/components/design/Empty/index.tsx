import type { EmptyProps, EmptyVariant } from './types'

/* ── Default copy per variant ── */
const defaults: Record<EmptyVariant, { title: string; description: string }> = {
  'empty-default': { title: '暂无数据', description: '当前没有可显示的内容' },
  'empty-search': { title: '未找到匹配结果', description: '尝试调整搜索关键词' },
  'empty-filter': { title: '没有符合条件的数据', description: '尝试修改筛选条件' },
  'error-network': { title: '网络连接失败', description: '请检查网络后重试' },
  'error-server': { title: '服务暂时不可用', description: '我们正在修复，请稍后重试' },
  'error-permission': { title: '没有访问权限', description: '请联系管理员获取权限' },
  'error-notfound': { title: '页面不存在', description: '该页面可能已被移动或删除' },
}

/* ── Icons (32px for compact / 120px illustration for full) ── */
const EmptyIcon = () => (
  <svg className="h-[120px] w-[120px] text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 120 120" stroke="currentColor" strokeWidth="1">
    <rect x="20" y="30" width="80" height="60" rx="8" />
    <path d="M40 60h40M40 72h20" strokeLinecap="round" />
    <circle cx="60" cy="48" r="6" />
  </svg>
)

const ErrorIcon = () => (
  <svg className="h-[120px] w-[120px] text-[var(--color-error)]" fill="none" viewBox="0 0 120 120" stroke="currentColor" strokeWidth="1">
    <circle cx="60" cy="60" r="40" />
    <path d="M60 42v24M60 74h.01" strokeLinecap="round" strokeWidth="3" />
  </svg>
)

const CompactEmptyIcon = () => (
  <svg className="h-8 w-8 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="2" strokeWidth="1.5" />
    <path d="M8 12h8M8 15h4" strokeLinecap="round" strokeWidth="1.5" />
  </svg>
)

const CompactErrorIcon = () => (
  <svg className="h-8 w-8 text-[var(--color-error)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="9" strokeWidth="1.5" />
    <path d="M12 8v5M12 15h.01" strokeLinecap="round" strokeWidth="2" />
  </svg>
)

/**
 * Empty / Error — 空态与错误态 (T1-11)
 *
 * 7 variants + compact mode + action button
 */
export function Empty({
  variant = 'empty-default',
  title,
  description,
  action,
  compact = false,
  icon,
  className = '',
}: EmptyProps) {
  const cfg = defaults[variant]
  const isError = variant.startsWith('error-')

  const displayIcon =
    icon ??
    (compact
      ? isError
        ? <CompactErrorIcon />
        : <CompactEmptyIcon />
      : isError
        ? <ErrorIcon />
        : <EmptyIcon />)

  return (
    <div
      role="status"
      className={[
        'flex flex-col items-center justify-center text-center',
        compact ? 'gap-2 py-6' : 'gap-4 py-12',
        className,
      ].join(' ')}
    >
      <span aria-hidden="true">{displayIcon}</span>

      <div className="flex flex-col items-center gap-2">
        <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)]">
          {title ?? cfg.title}
        </h2>
        <p className="text-[14px] text-[var(--color-text-secondary)]">
          {description ?? cfg.description}
        </p>
      </div>

      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export default Empty
export type { EmptyProps, EmptyVariant } from './types'
