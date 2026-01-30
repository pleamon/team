import { ThemeToggle } from '../_components/ThemeToggle'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-sm)] p-6">
      <h2 className="text-[18px] font-semibold text-[var(--color-text-primary)]">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

function Swatch({ name, varName }: { name: string; varName: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] p-3">
      <div className="flex items-center gap-3">
        <div
          className="h-9 w-9 rounded-[var(--radius-sm)] border border-[var(--color-border-secondary)]"
          style={{ background: `var(${varName})` }}
        />
        <div className="flex flex-col">
          <span className="text-[14px] font-medium text-[var(--color-text-primary)]">{name}</span>
          <code className="text-[12px] text-[var(--color-text-tertiary)]">{varName}</code>
        </div>
      </div>
      <code className="text-[12px] text-[var(--color-text-tertiary)]">var({varName})</code>
    </div>
  )
}

export default function TokensPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[var(--color-text-primary)]">Tokens</h1>
          <p className="text-[14px] text-[var(--color-text-secondary)]">
            设计 Token：用于统一颜色、排版、间距、圆角与阴影，并支持 Light/Dark 切换预览。
          </p>
        </div>
        <ThemeToggle />
      </header>

      <Section title="颜色（Primary / Neutral / Semantic）">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4" data-theme="light">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Light</h3>
              <code className="text-[12px] text-[var(--color-text-tertiary)]">data-theme="light"</code>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Swatch name="Info / Primary" varName="--color-info" />
              <Swatch name="Info Light" varName="--color-info-light" />
              <Swatch name="Success" varName="--color-success" />
              <Swatch name="Success Light" varName="--color-success-light" />
              <Swatch name="Warning" varName="--color-warning" />
              <Swatch name="Warning Light" varName="--color-warning-light" />
              <Swatch name="Error" varName="--color-error" />
              <Swatch name="Error Light" varName="--color-error-light" />
              <Swatch name="Text Primary" varName="--color-text-primary" />
              <Swatch name="Border Secondary" varName="--color-border-secondary" />
            </div>
          </div>

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4" data-theme="dark">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-semibold text-[var(--color-text-primary)]">Dark</h3>
              <code className="text-[12px] text-[var(--color-text-tertiary)]">data-theme="dark"</code>
            </div>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Swatch name="Info / Primary" varName="--color-info" />
              <Swatch name="Info Light" varName="--color-info-light" />
              <Swatch name="Success" varName="--color-success" />
              <Swatch name="Success Light" varName="--color-success-light" />
              <Swatch name="Warning" varName="--color-warning" />
              <Swatch name="Warning Light" varName="--color-warning-light" />
              <Swatch name="Error" varName="--color-error" />
              <Swatch name="Error Light" varName="--color-error-light" />
              <Swatch name="Text Primary" varName="--color-text-primary" />
              <Swatch name="Border Secondary" varName="--color-border-secondary" />
            </div>
          </div>
        </div>
      </Section>

      <Section title="字体规范（Family / Sizes / Weights / Line-heights）">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)]">Font family</div>
            <div className="mt-2 text-[16px] text-[var(--color-text-primary)]" style={{ fontFamily: 'var(--font-sans)' }}>
              var(--font-sans) — The quick brown fox jumps over the lazy dog.
            </div>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-secondary)] p-4">
            <div className="text-[12px] text-[var(--color-text-tertiary)]">Sizes / Weights / Line-heights</div>
            <div className="mt-3 flex flex-col gap-2">
              {[
                { label: '12 / regular / 16', style: { fontSize: 12, fontWeight: 400, lineHeight: '16px' } },
                { label: '14 / regular / 20', style: { fontSize: 14, fontWeight: 400, lineHeight: '20px' } },
                { label: '16 / medium / 24', style: { fontSize: 16, fontWeight: 500, lineHeight: '24px' } },
                { label: '20 / semibold / 28', style: { fontSize: 20, fontWeight: 600, lineHeight: '28px' } },
                { label: '24 / bold / 32', style: { fontSize: 24, fontWeight: 700, lineHeight: '32px' } },
              ].map((row) => (
                <div key={row.label} className="rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] p-3">
                  <div className="text-[12px] text-[var(--color-text-tertiary)]">{row.label}</div>
                  <div className="text-[var(--color-text-primary)]" style={row.style as React.CSSProperties}>
                    标题 / Title Sample
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section title="间距系统（space-1 ~ space-12）">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({ length: 12 }).map((_, i) => {
            const n = i + 1
            return (
              <div key={n} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] p-3">
                <code className="w-[110px] text-[12px] text-[var(--color-text-tertiary)]">--space-{n}</code>
                <div className="h-3 rounded bg-[var(--color-info-light)]" style={{ width: `var(--space-${n})` }} />
                <div className="text-[12px] text-[var(--color-text-tertiary)]">{`var(--space-${n})`}</div>
              </div>
            )
          })}
        </div>
      </Section>

      <Section title="圆角规范（radius-sm/md/lg/xl/full）">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'sm', v: '--radius-sm' },
            { label: 'md', v: '--radius-md' },
            { label: 'lg', v: '--radius-lg' },
            { label: 'xl', v: '--radius-xl' },
            { label: 'full', v: '--radius-full' },
          ].map((r) => (
            <div key={r.label} className="rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] p-4">
              <div
                className="h-14 w-full border border-[var(--color-border-secondary)] bg-[var(--color-bg-spotlight)]"
                style={{ borderRadius: `var(${r.v})` }}
              />
              <div className="mt-2 text-[12px] text-[var(--color-text-secondary)]">{r.label}</div>
              <code className="text-[12px] text-[var(--color-text-tertiary)]">{r.v}</code>
            </div>
          ))}
        </div>
      </Section>

      <Section title="阴影规范（shadow-sm/md/lg/xl）">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'sm', v: '--shadow-sm' },
            { label: 'md', v: '--shadow-md' },
            { label: 'lg', v: '--shadow-lg' },
            { label: 'xl', v: '--shadow-xl' },
          ].map((s) => (
            <div key={s.label} className="rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] p-4">
              <div
                className="h-16 w-full rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)]"
                style={{ boxShadow: `var(${s.v})` }}
              />
              <div className="mt-2 text-[12px] text-[var(--color-text-secondary)]">{s.label}</div>
              <code className="text-[12px] text-[var(--color-text-tertiary)]">{s.v}</code>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}
