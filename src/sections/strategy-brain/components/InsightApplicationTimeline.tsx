import type { InsightApplication } from '@/../product/sections/strategy-brain/types'

interface InsightApplicationTimelineProps {
  applications: InsightApplication[]
  onViewDecision?: (decisionId: string) => void
}

export function InsightApplicationTimeline({
  applications,
  onViewDecision
}: InsightApplicationTimelineProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        This insight hasn't been applied yet
      </div>
    )
  }

  // Sort by date (most recent first)
  const sortedApplications = [...applications].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const outcomeConfig = {
    'success': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      label: 'Success'
    },
    'partial-success': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      label: 'Partial Success'
    },
    'pending': {
      icon: (
        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      ),
      color: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
      label: 'Pending'
    },
    'failure': {
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      label: 'Failed'
    }
  }

  return (
    <div className="space-y-4">
      {sortedApplications.map((application, index) => {
        const outcome = outcomeConfig[application.outcome]
        const date = new Date(application.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })

        return (
          <div key={application.id} className="relative group">
            {/* Timeline Line */}
            {index < sortedApplications.length - 1 && (
              <div className="absolute left-[19px] top-[42px] bottom-0 w-px bg-slate-800" />
            )}

            <div className="flex gap-4">
              {/* Icon */}
              <div className={`
                flex-shrink-0 w-10 h-10 rounded-full border flex items-center justify-center
                ${outcome.color}
              `}>
                {outcome.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-4">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider border ${outcome.color}`}>
                        {outcome.label}
                      </span>
                      <span className="text-xs text-slate-500">{date}</span>
                    </div>
                    <button
                      onClick={() => onViewDecision?.(application.decisionId)}
                      className="text-sm font-semibold text-slate-200 hover:text-cyan-400 transition-colors text-left"
                    >
                      {application.decisionTitle}
                    </button>
                  </div>
                </div>

                {/* Impact Metric */}
                {application.impactMetric && (
                  <div className="bg-slate-800 rounded-lg p-3 mb-2">
                    <p className="text-xs text-slate-400 mb-1">Impact</p>
                    <p className="text-sm font-medium text-slate-200">
                      {application.impactMetric}
                    </p>
                  </div>
                )}

                {/* Notes */}
                {application.notes && (
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {application.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
