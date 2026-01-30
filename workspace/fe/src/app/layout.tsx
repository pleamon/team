import type { ReactNode } from 'react'
import './globals.css'
import '../styles/skeleton.css'

export const metadata = {
  title: 'PSP Design System v2',
  description: 'Design system documentation & component showcase',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="zh-CN" data-theme="light">
      <body>
        <div
          style={{
            minHeight: '100vh',
            padding: '24px',
          }}
        >
          <div
            style={{
              maxWidth: 1200,
              margin: '0 auto',
            }}
          >
            {children}
          </div>
        </div>
      </body>
    </html>
  )
}
