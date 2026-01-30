import type { ReactNode } from 'react'

export type EmptyVariant =
  | 'empty-default'
  | 'empty-search'
  | 'empty-filter'
  | 'error-network'
  | 'error-server'
  | 'error-permission'
  | 'error-notfound'

export interface EmptyProps {
  /** 变体 */
  variant?: EmptyVariant
  /** 自定义标题 */
  title?: ReactNode
  /** 自定义描述 */
  description?: ReactNode
  /** 操作按钮 */
  action?: ReactNode
  /** 紧凑模式（无插图，仅图标+文字） */
  compact?: boolean
  /** 自定义图标（覆盖默认） */
  icon?: ReactNode
  /** 自定义类名 */
  className?: string
}
