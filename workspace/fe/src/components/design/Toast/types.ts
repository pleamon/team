import type { ReactNode } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  variant: ToastVariant
  title: string
  description?: string
  duration?: number // ms, 0 = manual close
}

export interface ToastProps {
  item: ToastItem
  onClose: (id: string) => void
}

export interface ToastContainerProps {
  /** 当前 toast 列表 */
  toasts: ToastItem[]
  /** 关闭回调 */
  onClose: (id: string) => void
}
