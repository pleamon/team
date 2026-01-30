import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react'

export type InputSize = 'sm' | 'md' | 'lg'
export type InputVariant =
  | 'default'
  | 'with-icon-left'
  | 'with-icon-right'
  | 'with-prefix'
  | 'with-suffix'
  | 'textarea'

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** 输入框尺寸 */
  size?: InputSize
  /** 变体 */
  variant?: InputVariant
  /** 是否错误态 */
  error?: boolean
  /** 错误提示文本 */
  errorMessage?: string
  /** 左侧图标 */
  iconLeft?: ReactNode
  /** 右侧图标 */
  iconRight?: ReactNode
  /** 前缀文本（如 https://） */
  prefix?: ReactNode
  /** 后缀文本（如 .com） */
  suffix?: ReactNode
  /** 是否全宽 */
  fullWidth?: boolean
  /** label 文本 */
  label?: string
}

export interface TextareaProps
  extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'prefix'> {
  /** 尺寸 */
  size?: InputSize
  /** 是否错误态 */
  error?: boolean
  /** 错误提示文本 */
  errorMessage?: string
  /** 是否全宽 */
  fullWidth?: boolean
  /** label 文本 */
  label?: string
}
