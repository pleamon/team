'use client'

import { useMemo, useState } from 'react'
import { Button, Checkbox, Dialog, Empty, Input, Select, Skeleton, Table, ToastContainer, useToast } from '../../components/design'

export default function ExamplesPage() {
  const toast = useToast()
  const [submitting, setSubmitting] = useState(false)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [agree, setAgree] = useState(false)
  const [payment, setPayment] = useState<string | string[] | undefined>(undefined)
  const [openConfirm, setOpenConfirm] = useState(false)

  const [tableLoading, setTableLoading] = useState(false)
  const [tableError, setTableError] = useState(false)

  const columns = useMemo(
    () => [
      { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
      { key: 'merchant', title: 'Merchant', dataIndex: 'merchant', sortable: true },
      { key: 'amount', title: 'Amount', dataIndex: 'amount', sortable: true },
      { key: 'status', title: 'Status', dataIndex: 'status' },
    ],
    [],
  )

  const data = useMemo(
    () => [
      { id: 'T-1001', merchant: 'Coffee Shop', amount: '$12.80', status: 'Paid' },
      { id: 'T-1002', merchant: 'Book Store', amount: '$80.00', status: 'Pending' },
      { id: 'T-1003', merchant: 'Grocery', amount: '$46.50', status: 'Refunded' },
      { id: 'T-1004', merchant: 'Taxi', amount: '$18.20', status: 'Paid' },
    ],
    [],
  )

  const paymentOptions = useMemo(
    () => [
      { value: 'alipay', label: 'Alipay' },
      { value: 'wechat', label: 'WeChat Pay' },
      { value: 'bank', label: 'Bank Transfer' },
    ],
    [],
  )

  const nameError = submitting && !name
  const emailError = submitting && (!email || !email.includes('@'))
  const agreeError = submitting && !agree

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer />

      <header>
        <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">Examples</h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
          端到端示例：把组件组合成真实场景（表单 / 数据表格 / 状态展示）。
        </p>
      </header>

      {/* Form example */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">完整表单示例</h2>
          <Button variant="secondary" size="sm" onClick={() => {
            setName('')
            setEmail('')
            setAgree(false)
            setPayment(undefined)
            setSubmitting(false)
          }}>Reset</Button>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
            errorMessage={nameError ? 'Name is required' : undefined}
            fullWidth
          />
          <Input
            label="Email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={emailError}
            errorMessage={emailError ? 'Please enter a valid email' : undefined}
            fullWidth
          />
          <Select
            label="Payment method"
            options={paymentOptions}
            value={payment}
            onChange={setPayment}
            placeholder="Select"
            clearable
            fullWidth
          />
          <div className="flex items-center">
            <Checkbox checked={agree} onChange={setAgree} label="I agree to terms" />
            {agreeError && <span className="ml-3 text-[12px] text-[var(--color-error)]">Required</span>}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => toast.show({ variant: 'info', title: 'Draft saved', description: 'Saved locally.' })}
          >
            Save draft
          </Button>
          <Button
            loading={submitting}
            onClick={async () => {
              setSubmitting(true)
              const invalid = !name || !email.includes('@') || !agree
              if (invalid) {
                toast.show({ variant: 'error', title: 'Invalid form', description: 'Please fix errors and retry.' })
                setSubmitting(false)
                return
              }
              setOpenConfirm(true)
              setSubmitting(false)
            }}
          >
            Submit
          </Button>
        </div>

        <Dialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          title="Confirm submit"
          description="This will submit the form."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setOpenConfirm(false)}>Cancel</Button>
              <Button
                onClick={() => {
                  setOpenConfirm(false)
                  toast.show({ variant: 'success', title: 'Submitted', description: 'Form has been submitted.' })
                }}
              >
                Confirm
              </Button>
            </div>
          }
        >
          <div className="text-[14px] text-[var(--color-text-secondary)]">
            Name: <b className="text-[var(--color-text-primary)]">{name}</b>
            <br />
            Email: <b className="text-[var(--color-text-primary)]">{email}</b>
          </div>
        </Dialog>
      </section>

      {/* Table example */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">数据表格示例</h2>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={() => {
              setTableLoading(true)
              setTableError(false)
              setTimeout(() => setTableLoading(false), 900)
            }}>Simulate loading</Button>
            <Button size="sm" variant="secondary" onClick={() => {
              setTableError(true)
              setTableLoading(false)
            }}>Simulate error</Button>
            <Button size="sm" variant="secondary" onClick={() => {
              setTableError(false)
              setTableLoading(false)
            }}>Normal</Button>
          </div>
        </div>

        <div className="mt-4">
          {tableLoading ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
              <div className="flex flex-col">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Skeleton key={idx} variant="table-row" columns={4} />
                ))}
              </div>
            </div>
          ) : tableError ? (
            <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
              <Empty variant="error-server" action={<Button size="sm" onClick={() => setTableError(false)}>Retry</Button>} />
            </div>
          ) : (
            <Table columns={columns as any} data={data as any} sortable selectable pagination={{ pageSize: 3 }} />
          )}
        </div>
      </section>

      {/* State showcase */}
      <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">状态展示示例</h2>
        <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">
          统一使用 Skeleton / Empty / Toast 处理加载、空数据、错误与反馈。
        </p>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Empty</div>
            <Empty variant="empty-search" action={<Button size="sm" variant="secondary">Clear</Button>} />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Skeleton</div>
            <Skeleton variant="card" width="100%" />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Toast</div>
            <Button onClick={() => toast.show({ variant: 'success', title: 'Success', description: 'Operation completed.' })}>
              Show toast
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
