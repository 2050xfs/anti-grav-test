import { LogOut, User as UserIcon } from 'lucide-react'
import type { User } from './AppShell'

export interface UserMenuProps {
  user: User
  onLogout?: () => void
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  return (
    <div className="border-t border-slate-200 dark:border-slate-800 p-3 mt-auto">
      <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
        {/* Avatar */}
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-8 h-8 rounded-full shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <span className="text-xs font-medium text-slate-700 dark:text-slate-200">
              {getInitials(user.name)}
            </span>
          </div>
        )}

        {/* User info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
            {user.name}
          </div>
          {user.email && (
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </div>
          )}
        </div>

        {/* Logout button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
            aria-label="Logout"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </button>
        )}
      </div>
    </div>
  )
}
