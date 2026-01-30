import { useCallback, useMemo } from 'react'
import type { TableProps, TableColumn, SortDirection } from './types'

/* ── Sort arrow icon ── */
const SortIcon = ({ active, dir }: { active: boolean; dir: SortDirection }) => (
  <span className="ml-1 inline-flex flex-col text-[10px] leading-none" aria-hidden="true">
    <span className={active && dir === 'asc' ? 'text-[var(--color-info)]' : 'text-[var(--color-text-tertiary)]'}>▲</span>
    <span className={active && dir === 'desc' ? 'text-[var(--color-info)]' : 'text-[var(--color-text-tertiary)]'}>▼</span>
  </span>
)

/**
 * Table — 数据表格 (T1-08)
 *
 * Variants: default / striped / bordered / compact
 * Features: sorting, pagination, row selection, fixed column shadow
 */
export function Table<T = any>({
  columns,
  dataSource,
  rowKey,
  variant = 'default',
  loading = false,
  emptyContent,
  errorContent,
  error = false,
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  onSort,
  sortKey,
  sortDirection,
  className = '',
  pagination,
}: TableProps<T>) {
  const getKey = useCallback(
    (row: T) => (typeof rowKey === 'function' ? rowKey(row) : String((row as any)[rowKey])),
    [rowKey],
  )

  const selectedSet = useMemo(() => new Set(selectedKeys), [selectedKeys])
  const allKeys = useMemo(() => dataSource.map(getKey), [dataSource, getKey])
  const allSelected = allKeys.length > 0 && allKeys.every((k) => selectedSet.has(k))
  const someSelected = !allSelected && allKeys.some((k) => selectedSet.has(k))

  const toggleAll = useCallback(() => {
    if (allSelected) onSelectionChange?.([])
    else onSelectionChange?.(allKeys)
  }, [allSelected, allKeys, onSelectionChange])

  const toggleRow = useCallback(
    (key: string) => {
      const next = selectedSet.has(key)
        ? selectedKeys.filter((k) => k !== key)
        : [...selectedKeys, key]
      onSelectionChange?.(next)
    },
    [selectedKeys, selectedSet, onSelectionChange],
  )

  const handleSort = useCallback(
    (col: TableColumn) => {
      if (!col.sortable || !onSort) return
      let next: SortDirection
      if (sortKey !== col.key) next = 'asc'
      else if (sortDirection === 'asc') next = 'desc'
      else next = null
      onSort(col.key, next)
    },
    [sortKey, sortDirection, onSort],
  )

  /* ── Variant styles ── */
  const isCompact = variant === 'compact'
  const rowH = isCompact ? 'h-10' : 'h-14'
  const cellPad = 'px-4 py-3'
  const bordered = variant === 'bordered' ? 'border border-[var(--color-border-secondary)]' : ''

  const getValue = (row: T, col: TableColumn) => {
    const field = col.dataIndex ?? col.key
    return (row as any)[field]
  }

  /* ── Pagination ── */
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.pageSize) : 0

  return (
    <div className={`w-full overflow-auto ${className}`}>
      <table
        role="table"
        className={`w-full border-collapse text-[14px] ${bordered}`}
      >
        {/* Header */}
        <thead>
          <tr className="h-12 bg-[var(--color-bg-spotlight)]">
            {selectable && (
              <th className="w-12 px-3 text-center" role="columnheader">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => { if (el) el.indeterminate = someSelected }}
                  onChange={toggleAll}
                  aria-label="Select all rows"
                  className="h-4 w-4 accent-[var(--color-info)]"
                />
              </th>
            )}
            {columns.map((col) => (
              <th
                key={col.key}
                role="columnheader"
                aria-sort={
                  sortKey === col.key && sortDirection
                    ? sortDirection === 'asc'
                      ? 'ascending'
                      : 'descending'
                    : col.sortable
                      ? 'none'
                      : undefined
                }
                className={[
                  cellPad,
                  'text-left font-semibold text-[var(--color-text-secondary)]',
                  'border-b border-[var(--color-border-secondary)]',
                  col.sortable ? 'cursor-pointer select-none hover:text-[var(--color-text-primary)]' : '',
                  col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
                ].join(' ')}
                style={{ width: col.width }}
                onClick={() => handleSort(col)}
              >
                <span className="inline-flex items-center">
                  {col.title}
                  {col.sortable && (
                    <SortIcon active={sortKey === col.key} dir={sortKey === col.key ? sortDirection ?? null : null} />
                  )}
                </span>
              </th>
            ))}
          </tr>
        </thead>

        {/* Body */}
        <tbody>
          {loading ? (
            // Skeleton rows
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className={rowH}>
                {selectable && <td className="px-3"><div className="mx-auto h-4 w-4 animate-pulse rounded bg-[var(--color-bg-spotlight)]" /></td>}
                {columns.map((col) => (
                  <td key={col.key} className={cellPad}>
                    <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--color-bg-spotlight)]" />
                  </td>
                ))}
              </tr>
            ))
          ) : error && errorContent ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                {errorContent}
              </td>
            </tr>
          ) : dataSource.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-12 text-center">
                {emptyContent ?? (
                  <span className="text-[var(--color-text-tertiary)]">暂无数据</span>
                )}
              </td>
            </tr>
          ) : (
            dataSource.map((row, rowIdx) => {
              const key = getKey(row)
              const isSelected = selectedSet.has(key)
              const stripeBg =
                variant === 'striped' && rowIdx % 2 === 1
                  ? 'bg-[var(--color-bg-spotlight)]'
                  : ''
              const selectedBg = isSelected ? 'bg-[var(--color-info-light)]' : ''

              return (
                <tr
                  key={key}
                  role="row"
                  className={[
                    rowH,
                    'border-b border-[var(--color-border-secondary)]',
                    'hover:bg-[var(--color-bg-spotlight)] transition-colors',
                    stripeBg,
                    selectedBg,
                  ].join(' ')}
                >
                  {selectable && (
                    <td className="px-3 text-center" role="cell">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleRow(key)}
                        aria-label={`Select row ${key}`}
                        className="h-4 w-4 accent-[var(--color-info)]"
                      />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      role="cell"
                      className={[
                        cellPad,
                        'text-[var(--color-text-primary)]',
                        col.align === 'center' ? 'text-center' : col.align === 'right' ? 'text-right' : '',
                      ].join(' ')}
                    >
                      {col.render
                        ? col.render(getValue(row, col), row, rowIdx)
                        : String(getValue(row, col) ?? '')}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-[14px]">
          <button
            type="button"
            disabled={pagination.current <= 1}
            onClick={() => pagination.onChange(pagination.current - 1)}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border-primary)] px-3 py-1 disabled:opacity-40 hover:border-[var(--color-info-hover)]"
          >
            上一页
          </button>
          <span className="text-[var(--color-text-secondary)]">
            {pagination.current} / {totalPages}
          </span>
          <button
            type="button"
            disabled={pagination.current >= totalPages}
            onClick={() => pagination.onChange(pagination.current + 1)}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border-primary)] px-3 py-1 disabled:opacity-40 hover:border-[var(--color-info-hover)]"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  )
}

export default Table
export type { TableProps, TableColumn, SortDirection, TableVariant } from './types'
