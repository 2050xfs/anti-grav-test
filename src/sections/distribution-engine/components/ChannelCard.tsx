import type { Channel, Campaign } from '@/../product/sections/distribution-engine/types'

interface ChannelCardProps {
  channel: Channel
  campaigns: Campaign[]
  onClick?: () => void
  onPause?: () => void
  onResume?: () => void
}

const statusConfig = {
  active: {
    color: 'emerald',
    label: 'Active',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    )
  },
  paused: {
    color: 'slate',
    label: 'Paused',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  optimizing: {
    color: 'indigo',
    label: 'Optimizing',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
      </svg>
    )
  },
  constrained: {
    color: 'amber',
    label: 'Constrained',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  },
  error: {
    color: 'red',
    label: 'Error',
    icon: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    )
  }
} as const

export function ChannelCard({ channel, campaigns, onClick, onPause, onResume }: ChannelCardProps) {
  const status = statusConfig[channel.status]
  const isPaused = channel.status === 'paused'
  const isUnderperforming = channel.metrics.ltgpCacRatio < 3.0
  const isHighPerforming = channel.metrics.ltgpCacRatio >= 7.0

  return (
    <div
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-5 backdrop-blur transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-slate-900/50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700"
    >
      {/* Status indicator stripe */}
      <div className={`absolute left-0 top-0 h-full w-1 bg-${status.color}-500 dark:bg-${status.color}-500`} />

      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white">{channel.name}</h3>
            <span className={`flex items-center gap-1 rounded-full bg-${status.color}-500/10 px-2 py-0.5 text-xs font-medium text-${status.color}-400 dark:bg-${status.color}-500/10 dark:text-${status.color}-400`}>
              {status.icon}
              {status.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{channel.description}</p>
        </div>

        {/* Pause/Resume button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            isPaused ? onResume?.() : onPause?.()
          }}
          className="ml-2 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
          aria-label={isPaused ? 'Resume channel' : 'Pause channel'}
        >
          {isPaused ? (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Key metrics */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-slate-500">LTGP:CAC</p>
          <p className={`mt-0.5 font-mono text-lg font-bold ${
            isHighPerforming
              ? 'text-emerald-400'
              : isUnderperforming
                ? 'text-amber-400'
                : 'text-white'
          }`}>
            {channel.metrics.ltgpCacRatio.toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Spend</p>
          <p className="mt-0.5 font-mono text-lg font-bold text-white">
            ${(channel.metrics.spend / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Leads</p>
          <p className="mt-0.5 font-mono text-lg font-bold text-white">
            {channel.metrics.leads}
          </p>
        </div>
      </div>

      {/* Budget bar */}
      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between text-xs">
          <span className="text-slate-500">Budget</span>
          <span className="font-mono text-slate-400">
            {channel.budget.utilizationPercent.toFixed(0)}%
          </span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-800">
          <div
            className={`h-full rounded-full transition-all ${
              channel.budget.utilizationPercent > 90
                ? 'bg-amber-500'
                : channel.budget.utilizationPercent > 75
                  ? 'bg-indigo-500'
                  : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(channel.budget.utilizationPercent, 100)}%` }}
          />
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            ${(channel.budget.remaining / 1000).toFixed(1)}K remaining
          </span>
          <span className="text-slate-500">
            ${(channel.budget.allocated / 1000).toFixed(1)}K total
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-slate-800 pt-3 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          {channel.activeCampaigns} {channel.activeCampaigns === 1 ? 'campaign' : 'campaigns'}
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
          View details
          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>

      {/* Performance indicator */}
      {isHighPerforming && (
        <div className="absolute right-3 top-3 rounded-full bg-emerald-500/10 p-1.5 dark:bg-emerald-500/10">
          <svg className="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
}
