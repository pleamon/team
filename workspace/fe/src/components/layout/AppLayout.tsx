import { useState, useCallback, useEffect, type ReactNode } from 'react'

/* ── Nav items for Design System docs ── */
const navItems = [
  { icon: '🏠', label: 'Overview', path: '/' },
  { icon: '🎨', label: 'Tokens', path: '/tokens' },
  { icon: '🧩', label: 'Components', path: '/components' },
  { icon: '📐', label: 'Business', path: '/business' },
  { icon: '🧪', label: 'Examples', path: '/examples' },
]

interface AppLayoutProps {
  children: ReactNode
  activePath?: string
  userName?: string
}

/**
 * AppLayout — Header + Sidebar + Content
 *
 * Note: kept as a reusable layout shell for docs pages.
 */
export function AppLayout({
  children,
  activePath = '/',
  userName = 'PSP',
}: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('sidebar-collapsed') === 'true'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('sidebar-collapsed', String(collapsed))
    } catch {}
  }, [collapsed])

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) setMobileOpen((o) => !o)
    else setCollapsed((c) => !c)
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg-base)]">
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/45 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={[
          'flex flex-col border-r border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] transition-all duration-200 shrink-0',
          // mobile: drawer
          'fixed inset-y-0 left-0 z-50 md:relative md:z-auto',
          mobileOpen ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0',
          collapsed ? 'md:w-16' : 'md:w-60',
        ].join(' ')}
        aria-label="主导航"
      >
        <nav className="flex-1 overflow-y-auto p-2 pt-16 md:pt-2" role="navigation">
          {navItems.map((item) => {
            const isActive = activePath === item.path
            return (
              <a
                key={item.path}
                href={item.path}
                aria-current={isActive ? 'page' : undefined}
                title={collapsed ? item.label : undefined}
                className={[
                  'group flex items-center gap-3 rounded-[var(--radius-md)] mx-1 my-0.5 transition-colors',
                  collapsed ? 'justify-center h-11 w-11 mx-auto' : 'h-11 px-4',
                  isActive
                    ? 'bg-[var(--color-info-light)] text-[var(--color-info)]'
                    : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-spotlight)] hover:text-[var(--color-text-primary)]',
                ].join(' ')}
                onClick={() => setMobileOpen(false)}
              >
                <span className="text-[20px] shrink-0">{item.icon}</span>
                {!collapsed && <span className="text-[14px]">{item.label}</span>}
              </a>
            )
          })}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden md:block border-t border-[var(--color-border-secondary)] p-2">
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            className="flex w-full items-center justify-center h-11 rounded-[var(--radius-md)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-spotlight)] hover:text-[var(--color-text-primary)] transition-colors"
          >
            <span className="text-[20px]">{collapsed ? '»' : '«'}</span>
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] px-4 shadow-[var(--shadow-sm)] z-50">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-bg-spotlight)] text-[var(--color-text-primary)]"
              aria-label="切换侧边栏"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <span className="text-[18px] font-bold text-[var(--color-text-primary)]">PSP Design System</span>
          </div>

          <div className="flex items-center gap-4">
            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1 hover:bg-[var(--color-bg-spotlight)] transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-info-light)] text-[var(--color-info)] text-[14px] font-semibold">
                  {userName[0]}
                </div>
                <span className="hidden sm:block text-[14px] text-[var(--color-text-primary)]">{userName}</span>
                <svg className="h-4 w-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-[220px] rounded-[var(--radius-md)] border border-[var(--color-border-secondary)] bg-[var(--color-bg-elevated)] shadow-[var(--shadow-md)] z-50">
                  {[
                    { label: 'Documentation', href: '/' },
                    { label: 'GitHub', href: '#' },
                  ].map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={() => setUserMenuOpen(false)}
                      className="block w-full text-left px-4 py-2.5 text-[14px] hover:bg-[var(--color-bg-spotlight)] transition-colors text-[var(--color-text-primary)]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-[1200px]">{children}</div>
        </main>
      </div>
    </div>
  )
}

export default AppLayout
