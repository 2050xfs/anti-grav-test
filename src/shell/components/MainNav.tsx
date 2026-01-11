import type { NavigationItem } from './AppShell'

export interface MainNavProps {
  items: NavigationItem[]
  onNavigate?: (href: string) => void
}

export function MainNav({ items, onNavigate }: MainNavProps) {
  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <button
              onClick={() => onNavigate?.(item.href)}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-colors
                ${
                  item.isActive
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <span className={`w-5 h-5 flex items-center justify-center shrink-0 ${item.isActive ? 'text-white' : ''}`}>
                {item.icon}
              </span>
              <span className="flex-1 text-left truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
