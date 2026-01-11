import { Brain, Package, Zap, MessageSquare, TrendingUp } from 'lucide-react'
import { AppShell } from './components/AppShell'
import type { NavigationItem } from './components/AppShell'

export default function ShellPreview() {
  const navigationItems: NavigationItem[] = [
    {
      label: 'Strategy Brain',
      href: '/strategy-brain',
      icon: <Brain className="w-5 h-5" />,
      isActive: true,
    },
    {
      label: 'Offer & Product Cell',
      href: '/offer-product',
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: 'Distribution Engine',
      href: '/distribution',
      icon: <Zap className="w-5 h-5" />,
    },
    {
      label: 'Conversation & Sales Engine',
      href: '/conversation-sales',
      icon: <MessageSquare className="w-5 h-5" />,
    },
    {
      label: 'Lifecycle & Compounding Engine',
      href: '/lifecycle',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ]

  const user = {
    name: 'Alex Morgan',
    email: 'alex@company.com',
  }

  return (
    <AppShell
      navigationItems={navigationItems}
      user={user}
      onNavigate={(href) => console.log('Navigate to:', href)}
      onLogout={() => console.log('Logout')}
    >
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2">
            Strategy Brain
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Market sensing, offer evolution, and autonomous budget allocation
          </p>
        </div>

        {/* Sample content cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              LTGP:CAC Ratio
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-50">
              5.2:1
            </div>
            <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
              <span>↑</span>
              <span>12% from last week</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Active Campaigns
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-50">
              24
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Across 4 channels
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
              Decisions Today
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900 dark:text-slate-50">
              147
            </div>
            <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              12 escalated to human
            </div>
          </div>
        </div>

        {/* Sample table */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Recent Decisions
            </h2>
          </div>
          <div className="p-6">
            <p className="text-slate-600 dark:text-slate-300">
              Decision history and autonomous budget allocations will appear here.
              This preview demonstrates the shell layout with sample content.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
