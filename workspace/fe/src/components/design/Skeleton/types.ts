export type SkeletonVariant = 'text' | 'avatar' | 'image' | 'card' | 'table-row' | 'form'
export type SkeletonSize = 'sm' | 'md' | 'lg'

export interface SkeletonProps {
  /** 变体 */
  variant?: SkeletonVariant
  /** 尺寸（avatar/text 用） */
  size?: SkeletonSize
  /** 文本行数 */
  lines?: number
  /** 宽度 */
  width?: string | number
  /** 高度 */
  height?: string | number
  /** 是否加载中 */
  loading?: boolean
  /** 加载完后的内容 */
  children?: React.ReactNode
  /** 表格列数（table-row 用） */
  columns?: number
  /** 表单字段数（form 用） */
  fields?: number
  /** 自定义类名 */
  className?: string
}
