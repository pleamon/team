import type { ReactNode } from 'react'

export type DialogVariant = 'confirm' | 'form' | 'large' | 'fullscreen'

export interface DialogProps {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 变体（决定宽度） */
  variant?: DialogVariant
  /** 标题 */
  title?: ReactNode
  /** 内容 */
  children?: ReactNode
  /** 底部操作区 */
  footer?: ReactNode
  /** 是否加载中 */
  loading?: boolean
  /** 点击遮罩是否关闭 */
  closeOnOverlay?: boolean
  /** 是否显示关闭按钮 */
  showClose?: boolean
  /** 自定义类名 */
  className?: string
}
