import type { InsightDetailViewProps } from '@/../product/sections/strategy-brain/types'
import { InsightApplicationTimeline } from './InsightApplicationTimeline'

export function InsightDetailView({
  insight,
  applications,
  relatedDecisions,
  sourceChannel,
  onViewDecision,
  onViewChannel
}: InsightDetailViewProps) {
  const insightTypeInfo = {
    'winning-message': {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      label: 'Winning Message'
    },
    'failed-experiment': {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      label: 'Failed Experiment'
    },
    'channel-performance': {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      label: 'Channel Performance'
    },
    'objection-handling': {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      color: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      label: 'Objection Handling'
    }
  }

  const typeInfo = insightTypeInfo[insight.type]

  // Calculate success rate
  const completedApplications = applications.filter(a => a.outcome !== 'pending')
  const successfulApplications = applications.filter(a => a.outcome === 'success' || a.outcome === 'partial-success')
  const successRate = completedApplications.length > 0
    ? (successfulApplications.length / completedApplications.length) * 100
    : 0

  const discoveryDate = new Date(insight.dateDiscovered).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`p-3 rounded-lg border ${typeInfo.color}`}>
              {typeInfo.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${typeInfo.color}`}>
                  {typeInfo.label}
                </span>
                <span className="text-sm text-slate-500">
                  Discovered {discoveryDate}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-50 mb-3">
                {insight.title}
              </h1>
              <p className="text-lg text-slate-400 leading-relaxed">
                {insight.description}
              </p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-cyan-400 mb-1">
                {(insight.confidenceScore * 100).toFixed(0)}%
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Confidence Score</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-slate-50 mb-1">
                {insight.applicationCount}
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Applications</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-emerald-400 mb-1">
                {successRate.toFixed(0)}%
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Success Rate</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <button
                onClick={() => onViewChannel?.(sourceChannel.id)}
                className="w-full text-left hover:opacity-80 transition-opacity"
              >
                <div className="text-xl font-bold text-slate-50 mb-1 truncate">
                  {sourceChannel.name}
                </div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">Source Channel</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Application Timeline */}
          <div className="col-span-2 space-y-6">
            {/* Application History */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-200">
                  Application History
                </h2>
                <span className="text-sm text-slate-500">
                  {applications.length} total applications
                </span>
              </div>

              <InsightApplicationTimeline
                applications={applications}
                onViewDecision={onViewDecision}
              />
            </div>

            {/* Related Decisions */}
            {relatedDecisions.length > 0 && (
              <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
                <h2 className="text-lg font-semibold text-slate-200 mb-4">
                  Decisions Referencing This Insight
                </h2>
                <div className="space-y-3">
                  {relatedDecisions.map((decision) => (
                    <button
                      key={decision.id}
                      onClick={() => onViewDecision?.(decision.id)}
                      className="w-full text-left p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-200 mb-1 group-hover:text-cyan-400 transition-colors">
                            {decision.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {decision.description}
                          </p>
                        </div>
                        <span className="text-xs text-slate-500">
                          {new Date(decision.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Stats & Context */}
          <div className="space-y-6">
            {/* Success Breakdown */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Outcome Breakdown
              </h2>
              <div className="space-y-3">
                {[
                  {
                    label: 'Success',
                    count: applications.filter(a => a.outcome === 'success').length,
                    color: 'bg-emerald-500'
                  },
                  {
                    label: 'Partial Success',
                    count: applications.filter(a => a.outcome === 'partial-success').length,
                    color: 'bg-blue-500'
                  },
                  {
                    label: 'Pending',
                    count: applications.filter(a => a.outcome === 'pending').length,
                    color: 'bg-slate-500'
                  },
                  {
                    label: 'Failure',
                    count: applications.filter(a => a.outcome === 'failure').length,
                    color: 'bg-red-500'
                  }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-slate-400">{item.label}</span>
                      <span className="font-semibold text-slate-200">{item.count}</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} transition-all duration-500`}
                        style={{ width: `${applications.length > 0 ? (item.count / applications.length) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insight Metadata */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Insight Details
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Type</p>
                  <p className="text-sm text-slate-200 capitalize">{insight.type.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Discovery Date</p>
                  <p className="text-sm text-slate-200">{discoveryDate}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Source Channel</p>
                  <button
                    onClick={() => onViewChannel?.(sourceChannel.id)}
                    className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    {sourceChannel.name}
                  </button>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Confidence Evolution</p>
                  <p className="text-sm text-slate-200">
                    {(insight.confidenceScore * 100).toFixed(0)}% confidence
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Based on {applications.length} applications
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
