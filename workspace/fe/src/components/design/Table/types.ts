import type { ReactNode } from 'react'

export type TableVariant = 'default' | 'striped' | 'bordered' | 'compact'
export type SortDirection = 'asc' | 'desc' | null

export interface TableColumn<T = any> {
  /** 列唯一 key */
  key: string
  /** 表头文本 */
  title: ReactNode
  /** 渲染单元格 */
  render?: (value: any, row: T, index: number) => ReactNode
  /** 数据字段名（默认=key） */
  dataIndex?: string
  /** 宽度 */
  width?: number | string
  /** 对齐 */
  align?: 'left' | 'center' | 'right'
  /** 可排序 */
  sortable?: boolean
  /** 固定列 */
  fixed?: 'left' | 'right'
}

export interface TableProps<T = any> {
  /** 列定义 */
  columns: TableColumn<T>[]
  /** 数据 */
  dataSource: T[]
  /** 行 key 字段名 */
  rowKey: string | ((row: T) => string)
  /** 变体 */
  variant?: TableVariant
  /** 加载中 */
  loading?: boolean
  /** 空组件 */
  emptyContent?: ReactNode
  /** 错误组件 */
  errorContent?: ReactNode
  /** 是否显示错误 */
  error?: boolean
  /** 行选择 */
  selectable?: boolean
  /** 已选行 keys */
  selectedKeys?: string[]
  /** 选择变化 */
  onSelectionChange?: (keys: string[]) => void
  /** 排序变化 */
  onSort?: (key: string, direction: SortDirection) => void
  /** 当前排序 */
  sortKey?: string
  /** 排序方向 */
  sortDirection?: SortDirection
  /** 自定义类名 */
  className?: string
  /** 分页（简单） */
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
}
