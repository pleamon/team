import Link from 'next/link'

const nav = [
  {
    title: 'Tokens',
    desc: '颜色、字体、间距、圆角、阴影、主题（Light/Dark）',
    href: '/tokens',
  },
  {
    title: 'Components',
    desc: '所有基础组件：Input / Select / Checkbox / Table / Dialog / Toast / Empty / Skeleton / Button / Badge',
    href: '/components',
  },
  {
    title: 'Business',
    desc: '业务规则、表单验证、错误处理、状态管理规范',
    href: '/business',
  },
  {
    title: 'Examples',
    desc: '端到端示例：表单 / 表格 / 状态展示',
    href: '/examples',
  },
]

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
        <h1 className="text-[28px] font-bold text-[var(--color-text-primary)]">PSP Design System v2</h1>
        <p className="mt-2 text-[14px] text-[var(--color-text-secondary)] max-w-[80ch]">
          v2 作为设计系统文档站点：集中展示 Token、基础组件、业务规则与端到端示例，用于研发对齐与复用。
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-[12px] text-[var(--color-text-tertiary)]">
          <span className="rounded-full border border-[var(--color-border-secondary)] px-2 py-1">Docs</span>
          <span className="rounded-full border border-[var(--color-border-secondary)] px-2 py-1">Components</span>
          <span className="rounded-full border border-[var(--color-border-secondary)] px-2 py-1">Tokens</span>
        </div>
      </header>

      <section>
        <h2 className="text-[16px] font-semibold text-[var(--color-text-primary)] mb-3">快速导航</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-5 hover:shadow-[var(--shadow-md)] transition-shadow"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[18px] font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-info)]">
                  {item.title}
                </h3>
                <span className="text-[14px] text-[var(--color-text-tertiary)]">→</span>
              </div>
              <p className="mt-2 text-[14px] text-[var(--color-text-secondary)]">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <footer className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] p-4 text-[12px] text-[var(--color-text-tertiary)]">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <span>Version: v2</span>
          <span>Last updated: 2026-01-30</span>
        </div>
      </footer>
    </div>
  )
}
