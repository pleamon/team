'use client'

import { useMemo, useState } from 'react'
import {
  Badge,
  Button,
  Checkbox,
  Dialog,
  Empty,
  Input,
  Select,
  Skeleton,
  Table,
  ToastContainer,
  useToast,
} from '../../components/design'

function PageHeader({ title, desc }: { title: string; desc: string }) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">{title}</h1>
      <p className="text-[14px] text-[var(--color-text-secondary)]">{desc}</p>
    </header>
  )
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Code({ children }: { children: string }) {
  return (
    <pre className="mt-3 overflow-x-auto rounded-[var(--radius-md)] bg-[#111827] p-4 text-[12px] text-slate-200">
      <code>{children}</code>
    </pre>
  )
}

export default function ComponentsPage() {
  const [inputSize, setInputSize] = useState<'sm' | 'md' | 'lg'>('md')
  const [inputState, setInputState] = useState<'default' | 'disabled' | 'readonly' | 'error'>('default')

  const [selectVariant, setSelectVariant] = useState<'single' | 'multiple' | 'searchable' | 'grouped'>('single')
  const [selectValue, setSelectValue] = useState<string | string[] | undefined>(undefined)

  const [checked, setChecked] = useState(false)
  const [indeterminate, setIndeterminate] = useState(true)

  const [dialogOpen, setDialogOpen] = useState(false)

  const toast = useToast()

  const tableColumns = useMemo(
    () => [
      { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
      { key: 'name', title: 'Name', dataIndex: 'name', sortable: true },
      { key: 'status', title: 'Status', dataIndex: 'status' },
    ],
    [],
  )

  const tableData = useMemo(
    () => [
      { id: '1001', name: 'Alice', status: 'Active' },
      { id: '1002', name: 'Bob', status: 'Blocked' },
      { id: '1003', name: 'Carol', status: 'Active' },
      { id: '1004', name: 'Dave', status: 'Pending' },
      { id: '1005', name: 'Eve', status: 'Active' },
      { id: '1006', name: 'Frank', status: 'Active' },
    ],
    [],
  )

  const options = useMemo(
    () => [
      { value: 'alipay', label: 'Alipay' },
      { value: 'wechat', label: 'WeChat Pay' },
      { value: 'card', label: 'Credit Card', disabled: true },
      { value: 'bank', label: 'Bank Transfer' },
      { value: 'other', label: 'Other' },
    ],
    [],
  )

  const groupedOptions = useMemo(
    () => [
      { value: 'cn-sh', label: 'Shanghai', group: 'China' },
      { value: 'cn-bj', label: 'Beijing', group: 'China' },
      { value: 'us-ny', label: 'New York', group: 'USA' },
      { value: 'us-sf', label: 'San Francisco', group: 'USA' },
    ],
    [],
  )

  const inputDisabled = inputState === 'disabled'
  const inputReadOnly = inputState === 'readonly'
  const inputError = inputState === 'error'

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer />

      <PageHeader
        title="Components"
        desc="v2 已实现的基础组件展示：变体切换 + Props 摘要 + 代码示例（用于文档与复用对齐）。"
      />

      <Block title="Button（5 variants × 3 sizes × states）">
        <div className="flex flex-wrap items-center gap-3">
          {(['primary', 'secondary', 'ghost', 'danger', 'link'] as const).map((v) => (
            <Button key={v} variant={v}>
              {v}
            </Button>
          ))}
          <Button size="sm">sm</Button>
          <Button size="md">md</Button>
          <Button size="lg">lg</Button>
          <Button disabled>disabled</Button>
          <Button loading>loading</Button>
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">
          Props：variant, size, loading, disabled, fullWidth, icon
        </div>
        <Code>{`<Button variant="primary" size="md" loading={false}>Submit</Button>`}</Code>
      </Block>

      <Block title="Badge（4 variants + dot）">
        <div className="flex flex-wrap items-center gap-3">
          {(['default', 'info', 'success', 'warning', 'error'] as const).map((v) => (
            <Badge key={v} variant={v}>
              {v}
            </Badge>
          ))}
          <Badge dot>dot</Badge>
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">Props：variant, dot</div>
        <Code>{`<Badge variant="success">Paid</Badge>
<Badge dot />`}</Code>
      </Block>

      <Block title="Input（3 sizes × states + prefix/suffix）">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] text-[var(--color-text-tertiary)]">Size:</span>
          {(['sm', 'md', 'lg'] as const).map((s) => (
            <Button key={s} size="sm" variant={inputSize === s ? 'primary' : 'secondary'} onClick={() => setInputSize(s)}>
              {s}
            </Button>
          ))}
          <span className="ml-2 text-[12px] text-[var(--color-text-tertiary)]">State:</span>
          {(['default', 'disabled', 'readonly', 'error'] as const).map((st) => (
            <Button
              key={st}
              size="sm"
              variant={inputState === st ? 'primary' : 'secondary'}
              onClick={() => setInputState(st)}
            >
              {st}
            </Button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Input
            label="Default"
            placeholder="Type here..."
            size={inputSize}
            disabled={inputDisabled}
            readOnly={inputReadOnly}
            error={inputError}
            errorMessage={inputError ? 'This field is required' : undefined}
            fullWidth
          />

          <Input
            label="Prefix"
            placeholder="example"
            size={inputSize}
            prefix="https://"
            disabled={inputDisabled}
            readOnly={inputReadOnly}
            error={inputError}
            errorMessage={inputError ? 'Invalid URL' : undefined}
            fullWidth
          />

          <Input
            label="Suffix"
            placeholder="name"
            size={inputSize}
            suffix=".com"
            disabled={inputDisabled}
            readOnly={inputReadOnly}
            error={inputError}
            errorMessage={inputError ? 'Invalid domain' : undefined}
            fullWidth
          />
        </div>

        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">
          Props：size, disabled, readOnly, error, errorMessage, prefix, suffix, iconLeft/iconRight, label, fullWidth
        </div>
        <Code>{`<Input size="md" label="Website" prefix="https://" placeholder="example" fullWidth />`}</Code>
      </Block>

      <Block title="Select（single / multi / searchable / grouped）">
        <div className="flex flex-wrap items-center gap-2">
          {(['single', 'multiple', 'searchable', 'grouped'] as const).map((v) => (
            <Button key={v} size="sm" variant={selectVariant === v ? 'primary' : 'secondary'} onClick={() => {
              setSelectVariant(v)
              setSelectValue(undefined)
            }}>
              {v}
            </Button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Demo"
            variant={selectVariant}
            options={selectVariant === 'grouped' ? groupedOptions : options}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Select an option"
            clearable
            fullWidth
          />

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)]">Current value</div>
            <pre className="mt-2 overflow-x-auto text-[12px] text-[var(--color-text-secondary)]">{JSON.stringify(selectValue, null, 2)}</pre>
          </div>
        </div>

        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">
          Props：variant, options, value/defaultValue, onChange, placeholder, disabled, error, loading, clearable, onSearch
        </div>
        <Code>{`<Select variant="multiple" options={options} value={value} onChange={setValue} clearable />`}</Code>
      </Block>

      <Block title="Checkbox（default / indeterminate / disabled）">
        <div className="flex flex-wrap items-center gap-6">
          <Checkbox checked={checked} onChange={setChecked} label="default" />
          <Checkbox checked={indeterminate} indeterminate onChange={setIndeterminate} label="indeterminate" />
          <Checkbox checked disabled label="disabled" />
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">Props：checked, indeterminate, disabled, onChange</div>
        <Code>{`<Checkbox indeterminate>Partially selected</Checkbox>`}</Code>
      </Block>

      <Block title="Table（sortable / selectable / pagination）">
        <Table
          columns={tableColumns as any}
          data={tableData as any}
          selectable
          pagination={{ pageSize: 4 }}
        />
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">
          Props：columns, data, sortable, selectable, pagination
        </div>
        <Code>{`<Table columns={columns} data={rows} selectable pagination={{ pageSize: 10 }} />`}</Code>
      </Block>

      <Block title="Dialog（sizes / scrollable / footer variants）">
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={() => setDialogOpen(true)}>Open dialog</Button>
        </div>

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title="Dialog title"
          description="This is a description."
          footer={
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setDialogOpen(false)}>Confirm</Button>
            </div>
          }
        >
          <div className="text-[14px] text-[var(--color-text-secondary)]">
            Content area. Try putting long content here to verify scroll behavior.
          </div>
        </Dialog>

        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">Props：open, onClose, title, description, footer, variant/size</div>
        <Code>{`<Dialog open={open} onClose={close} title="Title" footer={<Actions />}>...</Dialog>`}</Code>
      </Block>

      <Block title="Toast（4 types × positions）">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={() => toast.show({ variant: 'success', title: 'Saved', description: 'Changes have been saved.' })}
          >
            success
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.show({ variant: 'info', title: 'Info', description: 'This is an informational toast.' })}
          >
            info
          </Button>
          <Button
            variant="secondary"
            onClick={() => toast.show({ variant: 'warning', title: 'Warning', description: 'Be careful with this action.' })}
          >
            warning
          </Button>
          <Button
            variant="danger"
            onClick={() => toast.show({ variant: 'error', title: 'Error', description: 'Something went wrong.' })}
          >
            error
          </Button>
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">API：useToast().show({ variant, title, description, duration, position })</div>
        <Code>{`const toast = useToast()
toast.show({ variant: 'success', title: 'Saved' })`}</Code>
      </Block>

      <Block title="Empty（default / custom / with action）">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <Empty variant="empty-default" />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <Empty
              title="No results"
              description="Try adjusting filters"
              action={<Button size="sm" variant="secondary">Reset</Button>}
            />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <Empty variant="error-network" action={<Button size="sm">Retry</Button>} />
          </div>
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">Props：variant, title, description, action</div>
        <Code>{`<Empty variant="empty-search" action={<Button size="sm">Clear</Button>} />`}</Code>
      </Block>

      <Block title="Skeleton（text / avatar / card / table）">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Text</div>
            <Skeleton variant="text" lines={4} width="100%" />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Avatar</div>
            <div className="flex items-center gap-3">
              <Skeleton variant="avatar" size="sm" />
              <Skeleton variant="avatar" size="md" />
              <Skeleton variant="avatar" size="lg" />
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Card</div>
            <Skeleton variant="card" width="100%" />
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)] mb-3">Table rows</div>
            <div className="flex flex-col">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} variant="table-row" columns={4} />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-3 text-[12px] text-[var(--color-text-tertiary)]">Props：variant, size, lines, columns, width, height</div>
        <Code>{`<Skeleton variant="text" lines={3} width="100%" />`}</Code>
      </Block>
    </div>
  )
}
