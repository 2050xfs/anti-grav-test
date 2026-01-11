import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { MainNav } from './MainNav'
import { UserMenu } from './UserMenu'

export interface NavigationItem {
  label: string
  href: string
  icon: React.ReactNode
  isActive?: boolean
}

export interface User {
  name: string
  email?: string
  avatarUrl?: string
}

export interface AppShellProps {
  children: React.ReactNode
  navigationItems: NavigationItem[]
  user?: User
  onNavigate?: (href: string) => void
  onLogout?: () => void
}

export function AppShell({
  children,
  navigationItems,
  user,
  onNavigate,
  onLogout,
}: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleNavigate = (href: string) => {
    onNavigate?.(href)
    setIsMobileMenuOpen(false)
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        ) : (
          <Menu className="w-5 h-5 text-slate-700 dark:text-slate-200" />
        )}
      </button>

      {/* Mobile backdrop */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-slate-900/50 z-30"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-60 shrink-0
          bg-white dark:bg-slate-900
          border-r border-slate-200 dark:border-slate-800
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 dark:bg-indigo-500 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">AG</span>
            </div>
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              AGRD
            </span>
          </div>

          {/* Navigation */}
          <MainNav items={navigationItems} onNavigate={handleNavigate} />

          {/* User Menu */}
          {user && <UserMenu user={user} onLogout={onLogout} />}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
