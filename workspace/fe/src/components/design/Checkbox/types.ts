import type { ReactNode } from 'react'

export type CheckboxSize = 'sm' | 'md'
export type CheckboxVariant = 'default' | 'with-description' | 'card'

export interface CheckboxProps {
  /** 选中状态 */
  checked?: boolean
  /** 默认选中 */
  defaultChecked?: boolean
  /** 半选状态 */
  indeterminate?: boolean
  /** 变化回调 */
  onChange?: (checked: boolean) => void
  /** 禁用 */
  disabled?: boolean
  /** 错误态 */
  error?: boolean
  /** 尺寸 */
  size?: CheckboxSize
  /** 变体 */
  variant?: CheckboxVariant
  /** 标签文本 */
  label?: ReactNode
  /** 描述文本（with-description 变体） */
  description?: ReactNode
  /** 自定义类名 */
  className?: string
  /** name */
  name?: string
  /** value */
  value?: string
}

export interface CheckboxGroupProps {
  /** 子 Checkbox */
  children: ReactNode
  /** 选中值列表 */
  value?: string[]
  /** 默认值 */
  defaultValue?: string[]
  /** 变化 */
  onChange?: (values: string[]) => void
  /** 禁用 */
  disabled?: boolean
  /** 标题 */
  label?: string
  /** 方向 */
  direction?: 'vertical' | 'horizontal'
}
