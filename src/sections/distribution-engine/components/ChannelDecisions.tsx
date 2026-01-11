import type { Decision } from '@/../product/sections/distribution-engine/types'

interface ChannelDecisionsProps {
  decisions: Decision[]
  channelName: string
}

const decisionTypeConfig = {
  'budget-reallocation': { icon: '💰', label: 'Budget Reallocation' },
  'campaign-pause': { icon: '⏸️', label: 'Campaign Pause' },
  'campaign-scale': { icon: '📈', label: 'Campaign Scale' },
  'channel-optimization': { icon: '⚡', label: 'Channel Optimization' },
  'constraint-detection': { icon: '⚠️', label: 'Constraint Detection' },
  'offer-testing': { icon: '🧪', label: 'Offer Testing' }
} as const

const statusConfig = {
  executing: { color: 'indigo', label: 'Executing', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
  completed: { color: 'emerald', label: 'Completed', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
  testing: { color: 'amber', label: 'Testing', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400' },
  monitoring: { color: 'slate', label: 'Monitoring', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
  escalated: { color: 'red', label: 'Escalated', bgClass: 'bg-red-500/10', textClass: 'text-red-400' },
  failed: { color: 'red', label: 'Failed', bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
} as const

export function ChannelDecisions({ decisions, channelName }: ChannelDecisionsProps) {
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

  if (decisions.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-8 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
        <svg className="mx-auto h-10 w-10 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p className="mt-3 text-sm text-slate-400">No AI decisions yet for this channel</p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      {/* Header */}
      <div className="border-b border-slate-800 p-5 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">AI Decisions</h2>
            <p className="mt-0.5 text-xs text-slate-400">
              Autonomous optimizations for {channelName}
            </p>
          </div>
        </div>
      </div>

      {/* Decisions list */}
      <div className="divide-y divide-slate-800 dark:divide-slate-800">
        {decisions.map((decision) => {
          const typeConfig = decisionTypeConfig[decision.decisionType]
          const status = statusConfig[decision.status]

          return (
            <div
              key={decision.id}
              className="group cursor-pointer p-4 transition-colors hover:bg-slate-800/30 dark:hover:bg-slate-800/30"
            >
              {/* Header */}
              <div className="mb-2 flex items-start gap-3">
                <div className="mt-0.5 text-xl">{typeConfig.icon}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white">
                    {decision.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1 rounded-full ${status.bgClass} px-2 py-0.5 text-xs font-medium ${status.textClass}`}>
                      {status.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatTime(decision.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="mb-3 ml-9">
                <p className="text-xs leading-relaxed text-slate-400">
                  {decision.reasoning}
                </p>
              </div>

              {/* Context data */}
              {Object.keys(decision.context).length > 0 && (
                <div className="mb-3 ml-9 rounded-lg border border-slate-800/50 bg-slate-800/30 p-2 dark:border-slate-800/50 dark:bg-slate-800/30">
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(decision.context).slice(0, 4).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-xs text-slate-500">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </p>
                        <p className="font-mono text-xs font-semibold text-white">
                          {typeof value === 'number' ? value.toFixed(1) : value.toString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expected outcome */}
              {decision.expectedOutcome && (
                <div className="ml-9 rounded-lg bg-slate-800/50 p-2 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-300">
                    <span className="font-medium text-slate-400">Expected: </span>
                    {decision.expectedOutcome}
                  </p>
                </div>
              )}

              {/* Actual result */}
              {decision.actualResult && decision.status === 'completed' && (
                <div className="ml-9 mt-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-2 dark:border-emerald-500/20 dark:bg-emerald-500/5">
                  <p className="text-xs text-emerald-300">
                    <span className="font-medium text-emerald-400">Result: </span>
                    {decision.actualResult}
                  </p>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Footer */}
      {decisions.length > 5 && (
        <div className="border-t border-slate-800 p-4 text-center dark:border-slate-800">
          <p className="text-xs text-slate-500">
            Showing {Math.min(5, decisions.length)} of {decisions.length} decisions
          </p>
        </div>
      )}
    </div>
  )
}
