'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Store, 
  Wallet, 
  ShieldAlert, 
  Code, 
  Settings 
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Transactions',
    href: '/transactions',
    icon: ArrowRightLeft,
  },
  {
    label: 'Merchants',
    href: '/merchants',
    icon: Store,
  },
  {
    label: 'Settlements',
    href: '/settlements',
    icon: Wallet,
  },
  {
    label: 'Risk Mgmt',
    href: '/risk',
    icon: ShieldAlert,
  },
  {
    label: 'Developers',
    href: '/developers',
    icon: Code,
  },
  {
    label: 'System',
    href: '/system',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-[240px] flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 px-5 border-b border-white/[0.06]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-500 text-white font-bold text-sm">
          P
        </div>
        <span className="text-[15px] font-semibold text-white tracking-tight">PSP Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-sidebar-active text-sidebar-text-active'
                  : 'text-sidebar-text hover:bg-sidebar-hover hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white">
            PL
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-[13px] font-medium text-white">Pleamon Li</p>
            <p className="truncate text-[11px] text-sidebar-text">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
