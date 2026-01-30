import type { ReactNode } from 'react'

export type SelectSize = 'sm' | 'md' | 'lg'
export type SelectVariant = 'single' | 'multiple' | 'searchable' | 'grouped'

export interface SelectOption {
  value: string
  label: string
  disabled?: boolean
  group?: string
}

export interface SelectProps {
  /** 选项列表 */
  options: SelectOption[]
  /** 当前值（单选 string，多选 string[]） */
  value?: string | string[]
  /** 默认值 */
  defaultValue?: string | string[]
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void
  /** 变体 */
  variant?: SelectVariant
  /** 尺寸 */
  size?: SelectSize
  /** 占位文本 */
  placeholder?: string
  /** 禁用 */
  disabled?: boolean
  /** 错误态 */
  error?: boolean
  /** 错误提示 */
  errorMessage?: string
  /** 加载中 */
  loading?: boolean
  /** 可清除 */
  clearable?: boolean
  /** 全宽 */
  fullWidth?: boolean
  /** label */
  label?: string
  /** 自定义类名 */
  className?: string
  /** 无选项时的文案 */
  emptyText?: string
  /** 搜索过滤 */
  onSearch?: (keyword: string) => void
}
