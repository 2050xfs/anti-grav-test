import type { ActivityLogEntry as ActivityLogEntryType, Decision, Channel } from '@/../product/sections/strategy-brain/types'

interface ActivityLogEntryProps {
  entry: ActivityLogEntryType
  decisions: Decision[]
  channels: Channel[]
  onViewDecision?: (decisionId: string) => void
  onViewChannel?: (channelId: string) => void
}

export function ActivityLogEntry({
  entry,
  decisions,
  channels,
  onViewDecision,
  onViewChannel
}: ActivityLogEntryProps) {
  const relatedDecision = entry.relatedDecisionId
    ? decisions.find(d => d.id === entry.relatedDecisionId)
    : null

  const relatedChannel = entry.relatedChannelId
    ? channels.find(c => c.id === entry.relatedChannelId)
    : null

  // Format timestamp
  const time = new Date(entry.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  // Type icons and colors
  const typeConfig = {
    'signal-detection': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    'analysis': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20'
    },
    'decision-execution': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    },
    'mode-change': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
        </svg>
      ),
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20'
    },
    'constraint-detection': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
    },
    'metric-calculation': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    'insight-application': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
    },
    'escalation': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      color: 'text-red-400 bg-red-500/10 border-red-500/20'
    }
  }

  const config = typeConfig[entry.type]

  // Status indicator
  const statusConfig = {
    'in-progress': {
      indicator: <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />,
      text: 'In Progress'
    },
    'completed': {
      indicator: <div className="w-2 h-2 rounded-full bg-emerald-400" />,
      text: 'Completed'
    },
    'failed': {
      indicator: <div className="w-2 h-2 rounded-full bg-red-400" />,
      text: 'Failed'
    },
    'warning': {
      indicator: <div className="w-2 h-2 rounded-full bg-amber-400" />,
      text: 'Warning'
    }
  }

  const statusInfo = statusConfig[entry.status]

  // Progress bar for in-progress entries
  const progress = entry.metadata?.progress as number | undefined

  return (
    <div className="relative group">
      {/* Timeline Line */}
      <div className="absolute left-[19px] top-[42px] bottom-0 w-px bg-slate-800 group-last:hidden" />

      <div className="flex gap-4">
        {/* Icon */}
        <div className={`
          flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center
          ${config.color}
          transition-all duration-200
        `}>
          {config.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pb-6">
          <div className="flex items-start justify-between gap-4 mb-1">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-slate-200 truncate">
                  {entry.title}
                </h3>
                <div className="flex items-center gap-1.5">
                  {statusInfo.indicator}
                  <span className="text-xs text-slate-500">
                    {statusInfo.text}
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                {entry.description}
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 whitespace-nowrap">
              {time}
            </span>
          </div>

          {/* Progress Bar */}
          {progress !== undefined && entry.status === 'in-progress' && (
            <div className="mt-3 mb-2">
              <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all duration-500 rounded-full"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {Math.round(progress * 100)}% complete
              </p>
            </div>
          )}

          {/* Related Items */}
          {(relatedDecision || relatedChannel) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {relatedDecision && (
                <button
                  onClick={() => onViewDecision?.(relatedDecision.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors text-xs text-slate-300 hover:text-slate-100"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span className="truncate max-w-[200px]">{relatedDecision.title}</span>
                </button>
              )}
              {relatedChannel && (
                <button
                  onClick={() => onViewChannel?.(relatedChannel.id)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-colors text-xs text-slate-300 hover:text-slate-100"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  {relatedChannel.name}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
