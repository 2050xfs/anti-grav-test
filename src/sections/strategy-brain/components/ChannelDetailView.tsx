import type { ChannelDetailViewProps } from '@/../product/sections/strategy-brain/types'
import { PerformanceTrendChart } from './PerformanceTrendChart'
import { ConstraintStatusCard } from './ConstraintStatusCard'

export function ChannelDetailView({
  channel,
  performanceHistory,
  relatedDecisions,
  relatedInsights,
  activeExperiments = [],
  onViewDecision,
  onViewInsight,
  onAdjustBudget,
  onToggleChannel
}: ChannelDetailViewProps) {
  // Calculate trends
  const recentPerformance = performanceHistory.slice(-7)
  const avgLtgpCac = recentPerformance.reduce((sum, p) => sum + p.ltgpCacRatio, 0) / recentPerformance.length
  const trend = performanceHistory.length >= 2
    ? performanceHistory[performanceHistory.length - 1].ltgpCacRatio - performanceHistory[performanceHistory.length - 2].ltgpCacRatio
    : 0

  const totalLeads = recentPerformance.reduce((sum, p) => sum + p.leadsGenerated, 0)
  const totalQualifiedLeads = recentPerformance.reduce((sum, p) => sum + p.qualifiedLeads, 0)
  const qualificationRate = totalLeads > 0 ? (totalQualifiedLeads / totalLeads) * 100 : 0

  // Health status colors
  const healthColors = {
    'excellent': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    'good': 'text-green-400 bg-green-500/10 border-green-500/20',
    'warning': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    'critical': 'text-red-400 bg-red-500/10 border-red-500/20'
  }

  const performanceColors = {
    'outperforming': 'text-emerald-400',
    'on-target': 'text-green-400',
    'improving': 'text-blue-400',
    'declining': 'text-amber-400',
    'underperforming': 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm">
        <div className="px-6 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight text-slate-50">
                  {channel.name}
                </h1>
                <span className={`
                  px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border
                  ${healthColors[channel.healthStatus]}
                `}>
                  {channel.healthStatus}
                </span>
                <span className={`
                  text-sm font-medium ${performanceColors[channel.performance]}
                `}>
                  {channel.performance.replace('-', ' ')}
                </span>
              </div>
              <p className="text-slate-400">
                {channel.description}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onAdjustBudget?.(channel.id, channel.dailyBudget)}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors text-sm"
              >
                Adjust Budget
              </button>
              <button
                onClick={() => onToggleChannel?.(channel.id)}
                className={`
                  px-4 py-2 rounded-lg font-medium transition-colors text-sm border
                  ${channel.status === 'active'
                    ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                    : 'bg-emerald-600 hover:bg-emerald-500 border-emerald-600 text-white'
                  }
                `}
              >
                {channel.status === 'active' ? 'Pause Channel' : 'Resume Channel'}
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-bold text-slate-50">
                  {channel.ltgpCacRatio.toFixed(1)}:1
                </span>
                {trend !== 0 && (
                  <span className={`text-sm font-medium ${trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {trend > 0 ? '+' : ''}{trend.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">LTGP:CAC Ratio</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-slate-50 mb-1">
                ${(channel.dailyBudget / 1000).toFixed(1)}k
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Daily Budget</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-slate-50 mb-1">
                {totalLeads}
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Leads (7d)</p>
            </div>

            <div className="bg-slate-900 rounded-lg p-4 border border-slate-800">
              <div className="text-3xl font-bold text-slate-50 mb-1">
                {qualificationRate.toFixed(0)}%
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Qualification Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6">
        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Performance Chart */}
          <div className="col-span-2 space-y-6">
            {/* Performance Trend */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Performance Trend
              </h2>
              <PerformanceTrendChart data={performanceHistory} />
            </div>

            {/* Related Decisions */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Recent Decisions
              </h2>
              {relatedDecisions.length > 0 ? (
                <div className="space-y-3">
                  {relatedDecisions.slice(0, 5).map((decision) => (
                    <button
                      key={decision.id}
                      onClick={() => onViewDecision?.(decision.id)}
                      className="w-full text-left p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-slate-200 mb-1 group-hover:text-indigo-400 transition-colors">
                            {decision.title}
                          </h3>
                          <p className="text-xs text-slate-400 line-clamp-2">
                            {decision.description}
                          </p>
                        </div>
                        <span className={`
                          px-2 py-1 rounded text-xs font-medium whitespace-nowrap
                          ${decision.stage === 'executing' ? 'bg-emerald-500/20 text-emerald-400' : ''}
                          ${decision.stage === 'proposed' ? 'bg-indigo-500/20 text-indigo-400' : ''}
                          ${decision.stage === 'analyzing' ? 'bg-violet-500/20 text-violet-400' : ''}
                          ${decision.stage === 'signal-detected' ? 'bg-slate-500/20 text-slate-400' : ''}
                        `}>
                          {decision.stage.replace('-', ' ')}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No recent decisions for this channel</p>
              )}
            </div>

            {/* Related Insights */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Learned Insights
              </h2>
              {relatedInsights.length > 0 ? (
                <div className="space-y-3">
                  {relatedInsights.map((insight) => (
                    <button
                      key={insight.id}
                      onClick={() => onViewInsight?.(insight.id)}
                      className="w-full text-left p-4 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-sm font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">
                          {insight.title}
                        </h3>
                        <span className="text-xs font-mono text-slate-500">
                          {(insight.confidenceScore * 100).toFixed(0)}% confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        {insight.description}
                      </p>
                      <div className="mt-2 text-xs text-slate-500">
                        Applied {insight.applicationCount} times
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No insights learned from this channel yet</p>
              )}
            </div>
          </div>

          {/* Right Column - Status & Experiments */}
          <div className="space-y-6">
            {/* Constraint Status */}
            <ConstraintStatusCard
              channel={channel}
              onViewDecision={onViewDecision}
            />

            {/* Active Experiments */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-800">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">
                Active Experiments
              </h2>
              {activeExperiments.length > 0 ? (
                <div className="space-y-3">
                  {activeExperiments.map((experiment) => (
                    <div
                      key={experiment.id}
                      className="p-4 rounded-lg bg-slate-800 border border-slate-700"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-sm font-semibold text-slate-200">
                          {experiment.name}
                        </h3>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/20 text-indigo-400">
                          {experiment.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">
                        {experiment.description}
                      </p>
                      <p className="text-xs text-slate-500">
                        Started {new Date(experiment.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500 italic">No active experiments</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
