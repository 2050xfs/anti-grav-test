import type { Decision, Channel, Campaign } from '@/../product/sections/distribution-engine/types'

interface DecisionDetailProps {
  decision: Decision
  affectedChannels: Channel[]
  affectedCampaigns: Campaign[]
  onBack?: () => void
  onOverride?: () => void
  onEscalate?: () => void
}

/**
 * Decision Detail View
 *
 * Full breakdown of an AI decision showing:
 * - Complete reasoning and context
 * - Expected vs actual outcomes
 * - Impact on channels and campaigns
 * - Decision execution timeline
 * - Override and escalation controls
 */
export function DecisionDetail({
  decision,
  affectedChannels,
  affectedCampaigns,
  onBack,
  onOverride,
  onEscalate
}: DecisionDetailProps) {
  const statusConfig = {
    executing: {
      color: 'indigo',
      label: 'Executing',
      bgClass: 'bg-indigo-500/10',
      textClass: 'text-indigo-400',
      icon: '⚡'
    },
    completed: {
      color: 'emerald',
      label: 'Completed',
      bgClass: 'bg-emerald-500/10',
      textClass: 'text-emerald-400',
      icon: '✓'
    },
    testing: {
      color: 'amber',
      label: 'Testing',
      bgClass: 'bg-amber-500/10',
      textClass: 'text-amber-400',
      icon: '🧪'
    },
    monitoring: {
      color: 'cyan',
      label: 'Monitoring',
      bgClass: 'bg-cyan-500/10',
      textClass: 'text-cyan-400',
      icon: '👁️'
    },
    escalated: {
      color: 'orange',
      label: 'Escalated',
      bgClass: 'bg-orange-500/10',
      textClass: 'text-orange-400',
      icon: '⬆️'
    },
    failed: {
      color: 'red',
      label: 'Failed',
      bgClass: 'bg-red-500/10',
      textClass: 'text-red-400',
      icon: '✗'
    }
  } as const

  const status = statusConfig[decision.status]

  const decisionTypeConfig = {
    'budget-reallocation': {
      label: 'Budget Reallocation',
      icon: '💰',
      description: 'Shifting budget allocation between channels'
    },
    'campaign-pause': {
      label: 'Campaign Pause',
      icon: '⏸️',
      description: 'Pausing underperforming campaign'
    },
    'campaign-scale': {
      label: 'Campaign Scale',
      icon: '📈',
      description: 'Scaling successful campaign'
    },
    'channel-optimization': {
      label: 'Channel Optimization',
      icon: '⚡',
      description: 'Optimizing channel performance'
    },
    'constraint-detection': {
      label: 'Constraint Detection',
      icon: '⚠️',
      description: 'Budget or operational constraint detected'
    },
    'offer-testing': {
      label: 'Offer Testing',
      icon: '🧪',
      description: 'Testing new offer or creative'
    }
  } as const

  const decisionType = decisionTypeConfig[decision.decisionType]

  // Format date/time
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr)
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
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">
          {/* Back button and title */}
          <div className="mb-6 flex items-center gap-4">
            <button
              onClick={onBack}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label="Back to dashboard"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                <span>AI Decision Log</span>
                <span>/</span>
                <span>Decision #{decision.id}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {decision.title}
                </h1>
                <span className={`flex items-center gap-1.5 rounded-full ${status.bgClass} px-3 py-1 text-sm font-medium ${status.textClass}`}>
                  <span>{status.icon}</span>
                  {status.label}
                </span>
              </div>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-base">{decisionType.icon}</span>
                  {decisionType.label}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-400">
                  {formatDateTime(decision.timestamp)}
                </span>
                <span className="text-slate-600">•</span>
                <span className="text-slate-500">
                  {formatRelativeTime(decision.timestamp)}
                </span>
              </div>
            </div>

            {/* Control buttons */}
            {(decision.status === 'executing' || decision.status === 'monitoring') && (
              <div className="flex items-center gap-2">
                {onEscalate && (
                  <button
                    onClick={onEscalate}
                    className="rounded-lg border border-orange-700/50 bg-orange-900/20 px-4 py-2 text-sm font-medium text-orange-300 transition-colors hover:bg-orange-900/40"
                  >
                    Escalate to Human
                  </button>
                )}
                {onOverride && (
                  <button
                    onClick={onOverride}
                    className="rounded-lg border border-red-700/50 bg-red-900/20 px-4 py-2 text-sm font-medium text-red-300 transition-colors hover:bg-red-900/40"
                  >
                    Override Decision
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - 2 columns */}
          <div className="space-y-8 lg:col-span-2">
            {/* Reasoning */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-lg font-semibold text-white">AI Reasoning</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {decision.reasoning}
              </p>
            </div>

            {/* Context Data */}
            {Object.keys(decision.context).length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-white">Decision Context</h2>
                </div>
                <div className="space-y-2">
                  {Object.entries(decision.context).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                      <span className="text-sm text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <span className="font-mono text-white">
                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Outcome */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <div className="mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <h2 className="text-lg font-semibold text-white">Expected Outcome</h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {decision.expectedOutcome}
              </p>
            </div>

            {/* Actual Result */}
            {decision.actualResult && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-white">Actual Result</h2>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  {decision.actualResult}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* Affected Channels */}
            {affectedChannels.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="mb-4 text-lg font-semibold text-white">Affected Channels</h2>
                <div className="space-y-3">
                  {affectedChannels.map((channel) => {
                    const channelStatusConfig = {
                      active: { bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
                      paused: { bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
                      optimizing: { bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
                      constrained: { bgClass: 'bg-amber-500/10', textClass: 'text-amber-400' },
                      error: { bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
                    } as const

                    const channelStatus = channelStatusConfig[channel.status]

                    return (
                      <div key={channel.id} className="rounded-lg border border-slate-700 p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-white">{channel.name}</h3>
                          <span className={`rounded-full ${channelStatus.bgClass} px-2 py-0.5 text-xs font-medium ${channelStatus.textClass} shrink-0`}>
                            {channel.status}
                          </span>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">LTGP:CAC</span>
                            <span className="font-mono text-white">{channel.metrics.ltgpCacRatio.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Spend</span>
                            <span className="font-mono text-white">${(channel.metrics.spend / 1000).toFixed(1)}K</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Leads</span>
                            <span className="font-mono text-white">{channel.metrics.leads}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Affected Campaigns */}
            {affectedCampaigns.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="mb-4 text-lg font-semibold text-white">Affected Campaigns</h2>
                <div className="space-y-3">
                  {affectedCampaigns.map((campaign) => {
                    const campaignStatusConfig = {
                      active: { bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
                      paused: { bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
                      completed: { bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
                      error: { bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
                    } as const

                    const campaignStatus = campaignStatusConfig[campaign.status]

                    return (
                      <div key={campaign.id} className="rounded-lg border border-slate-700 p-3">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-white">{campaign.name}</h3>
                          <span className={`rounded-full ${campaignStatus.bgClass} px-2 py-0.5 text-xs font-medium ${campaignStatus.textClass} shrink-0`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="mb-2 text-xs text-slate-400">{campaign.targetAudience}</p>
                        <div className="space-y-1">
                          {campaign.metrics.ltgpCacRatio && (
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-400">LTGP:CAC</span>
                              <span className="font-mono text-white">{campaign.metrics.ltgpCacRatio.toFixed(1)}</span>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Spend</span>
                            <span className="font-mono text-white">${(campaign.metrics.spend / 1000).toFixed(1)}K</span>
                          </div>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-400">Leads</span>
                            <span className="font-mono text-white">{campaign.metrics.leads}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Decision Type Info */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Decision Type</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-xl">
                    {decisionType.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{decisionType.label}</div>
                    <div className="text-xs text-slate-400">{decisionType.description}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
