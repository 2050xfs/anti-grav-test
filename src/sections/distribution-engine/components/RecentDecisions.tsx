import type { Decision } from '@/../product/sections/distribution-engine/types'

interface RecentDecisionsProps {
  decisions: Decision[]
  onViewDecision?: (decisionId: string) => void
}

const decisionTypeConfig = {
  'budget-reallocation': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'indigo',
    label: 'Budget Reallocation'
  },
  'campaign-pause': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'slate',
    label: 'Campaign Pause'
  },
  'campaign-scale': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: 'emerald',
    label: 'Campaign Scale'
  },
  'channel-optimization': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: 'indigo',
    label: 'Channel Optimization'
  },
  'constraint-detection': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    color: 'amber',
    label: 'Constraint Detection'
  },
  'offer-testing': {
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    color: 'indigo',
    label: 'Offer Testing'
  }
} as const

const statusConfig = {
  executing: { color: 'indigo', label: 'Executing' },
  completed: { color: 'emerald', label: 'Completed' },
  testing: { color: 'amber', label: 'Testing' },
  monitoring: { color: 'slate', label: 'Monitoring' },
  escalated: { color: 'red', label: 'Escalated' },
  failed: { color: 'red', label: 'Failed' }
} as const

export function RecentDecisions({ decisions, onViewDecision }: RecentDecisionsProps) {
  // Format timestamp
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      {/* Header */}
      <div className="border-b border-slate-800 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h2 className="text-lg font-semibold text-white">AI Decision Log</h2>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Recent autonomous optimizations by Strategy Brain
        </p>
      </div>

      {/* Decisions list */}
      <div className="divide-y divide-slate-800 dark:divide-slate-800">
        {decisions.slice(0, 8).map((decision) => {
          const typeConfig = decisionTypeConfig[decision.decisionType]
          const status = statusConfig[decision.status]

          return (
            <div
              key={decision.id}
              onClick={() => onViewDecision?.(decision.id)}
              className="group cursor-pointer p-4 transition-colors hover:bg-slate-800/30 dark:hover:bg-slate-800/30"
            >
              {/* Header */}
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 rounded-lg bg-${typeConfig.color}-500/10 p-1.5 text-${typeConfig.color}-400 dark:bg-${typeConfig.color}-500/10 dark:text-${typeConfig.color}-400`}>
                    {typeConfig.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-white group-hover:text-indigo-400 dark:group-hover:text-indigo-400">
                      {decision.title}
                    </h3>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 rounded-full bg-${status.color}-500/10 px-2 py-0.5 text-xs font-medium text-${status.color}-400 dark:bg-${status.color}-500/10 dark:text-${status.color}-400`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {formatTime(decision.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning preview */}
              <p className="mb-2 line-clamp-2 text-xs text-slate-400">
                {decision.reasoning}
              </p>

              {/* Expected outcome */}
              {decision.expectedOutcome && (
                <div className="rounded-lg bg-slate-800/50 p-2 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-300">
                    <span className="font-medium text-slate-400">Expected: </span>
                    {decision.expectedOutcome}
                  </p>
                </div>
              )}

              {/* Actual result (if completed) */}
              {decision.actualResult && decision.status === 'completed' && (
                <div className="mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <p className="text-xs text-emerald-300">
                    <span className="font-medium text-emerald-400">Result: </span>
                    {decision.actualResult}
                  </p>
                </div>
              )}

              {/* View details hint */}
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-indigo-400 opacity-0 transition-opacity group-hover:opacity-100 dark:text-indigo-400">
                View full context
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>

      {/* View all footer */}
      {decisions.length > 8 && (
        <div className="border-t border-slate-800 p-4 text-center dark:border-slate-800">
          <button className="text-sm font-medium text-indigo-400 transition-colors hover:text-indigo-300 dark:text-indigo-400 dark:hover:text-indigo-300">
            View all {decisions.length} decisions →
          </button>
        </div>
      )}
    </div>
  )
}
