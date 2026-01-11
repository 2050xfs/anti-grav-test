import type { LeadGetter, Campaign, Decision } from '@/../product/sections/distribution-engine/types'

interface LeadGetterDetailProps {
  leadGetter: LeadGetter
  campaigns: Campaign[]
  decisions: Decision[]
  onBack?: () => void
  onPause?: () => void
  onResume?: () => void
  onViewCampaign?: (campaignId: string) => void
}

/**
 * Lead Getter Detail View
 *
 * Drill-down interface for a single lead getter (Customer Referrals, Employees, Agencies, Affiliates) showing:
 * - Real-time metrics specific to lead getter type
 * - Active campaigns (if applicable)
 * - AI decisions affecting this lead getter
 * - Manual control options
 */
export function LeadGetterDetail({
  leadGetter,
  campaigns,
  decisions,
  onBack,
  onPause,
  onResume,
  onViewCampaign
}: LeadGetterDetailProps) {
  const isPaused = leadGetter.status === 'paused'

  // Filter decisions that affected this lead getter
  const leadGetterDecisions = decisions.filter(d =>
    d.affectedChannelIds.includes(leadGetter.id)
  )

  const statusConfig = {
    active: { color: 'emerald', label: 'Active', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
    paused: { color: 'slate', label: 'Paused', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
    optimizing: { color: 'indigo', label: 'Optimizing', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
    error: { color: 'red', label: 'Error', bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
  } as const

  const status = statusConfig[leadGetter.status]

  // Format date/time
  const formatDateTime = (dateStr: string) => {
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

  // Render metrics based on lead getter type
  const renderMetrics = () => {
    const metrics = leadGetter.metrics
    const metricCards = []

    // Common metrics
    if (metrics.leads !== undefined) {
      metricCards.push(
        <div key="leads" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Total Leads
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.leads}
          </div>
          {metrics.conversionRate && (
            <div className="mt-1 text-xs text-slate-500">
              {metrics.conversionRate.toFixed(1)}% conv. rate
            </div>
          )}
        </div>
      )
    }

    if (metrics.conversions !== undefined) {
      metricCards.push(
        <div key="conversions" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Conversions
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.conversions}
          </div>
          {metrics.conversionRate && (
            <div className="mt-1 text-xs text-slate-500">
              {metrics.conversionRate.toFixed(1)}% rate
            </div>
          )}
        </div>
      )
    }

    // Customer Referrals metrics
    if (metrics.referralRate !== undefined) {
      metricCards.push(
        <div key="referralRate" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Referral Rate
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.referralRate.toFixed(1)}%
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Target: 25%+
          </div>
        </div>
      )
    }

    if (metrics.newReferrals !== undefined) {
      metricCards.push(
        <div key="newReferrals" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            New Referrals
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.newReferrals}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            This month
          </div>
        </div>
      )
    }

    // Employees metrics
    if (metrics.activeEmployees !== undefined) {
      metricCards.push(
        <div key="activeEmployees" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Active Employees
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.activeEmployees}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Trained & active
          </div>
        </div>
      )
    }

    if (metrics.avgRoiPerEmployee !== undefined) {
      metricCards.push(
        <div key="avgRoiPerEmployee" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Avg ROI per Employee
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            ${(metrics.avgRoiPerEmployee / 1000).toFixed(1)}K
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Per month
          </div>
        </div>
      )
    }

    // Agencies metrics
    if (metrics.activeAgencies !== undefined) {
      metricCards.push(
        <div key="activeAgencies" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Active Agencies
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.activeAgencies}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Current partners
          </div>
        </div>
      )
    }

    if (metrics.monthlySpend !== undefined) {
      metricCards.push(
        <div key="monthlySpend" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Monthly Spend
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            ${(metrics.monthlySpend / 1000).toFixed(1)}K
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Agency retainer
          </div>
        </div>
      )
    }

    // Affiliates metrics
    if (metrics.activeAffiliates !== undefined) {
      metricCards.push(
        <div key="activeAffiliates" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Active Affiliates
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            {metrics.activeAffiliates}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            In network
          </div>
        </div>
      )
    }

    if (metrics.avgCommissionPerSale !== undefined) {
      metricCards.push(
        <div key="avgCommission" className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
          <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Avg Commission
          </div>
          <div className="mt-2 text-2xl font-bold text-white">
            ${metrics.avgCommissionPerSale}
          </div>
          <div className="mt-1 text-xs text-slate-500">
            Per sale
          </div>
        </div>
      )
    }

    return metricCards
  }

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
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
                <span>Four Lead Getters</span>
                <span>/</span>
                <span>{leadGetter.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {leadGetter.name}
                </h1>
                <span className={`flex items-center gap-1.5 rounded-full ${status.bgClass} px-3 py-1 text-sm font-medium ${status.textClass}`}>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{leadGetter.description}</p>
            </div>

            {/* Control buttons */}
            {onPause && onResume && (
              <div className="flex items-center gap-2">
                <button
                  onClick={isPaused ? onResume : onPause}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isPaused
                      ? 'bg-emerald-600 text-white hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500'
                      : 'bg-slate-700 text-white hover:bg-slate-600 dark:bg-slate-700 dark:hover:bg-slate-600'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {isPaused ? (
                      <>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Resume
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        Pause
                      </>
                    )}
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Key metrics - dynamic based on lead getter type */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {renderMetrics()}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - 2 columns */}
          <div className="space-y-8 lg:col-span-2">
            {/* Strategy Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Strategy</h2>
              <p className="text-slate-300 leading-relaxed">
                {leadGetter.description}
              </p>
            </div>

            {/* Active Campaigns */}
            {campaigns.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <h2 className="mb-4 text-lg font-semibold text-white">
                  Active Campaigns ({campaigns.length})
                </h2>
                <div className="space-y-3">
                  {campaigns.map((campaign) => {
                    const campaignStatusConfig = {
                      active: { bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
                      paused: { bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
                      completed: { bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
                      error: { bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
                    } as const

                    const campaignStatus = campaignStatusConfig[campaign.status]

                    return (
                      <div
                        key={campaign.id}
                        onClick={() => onViewCampaign?.(campaign.id)}
                        className="cursor-pointer rounded-lg border border-slate-700 p-4 transition-colors hover:border-slate-600 hover:bg-slate-800/50"
                      >
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-white">{campaign.name}</h3>
                          <span className={`rounded-full ${campaignStatus.bgClass} px-2 py-0.5 text-xs font-medium ${campaignStatus.textClass} shrink-0`}>
                            {campaign.status}
                          </span>
                        </div>
                        <p className="mb-3 text-xs text-slate-400">{campaign.targetAudience}</p>
                        <div className="grid grid-cols-3 gap-3">
                          <div>
                            <div className="text-xs text-slate-500">Spend</div>
                            <div className="mt-1 font-mono text-sm text-white">
                              ${(campaign.metrics.spend / 1000).toFixed(1)}K
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Leads</div>
                            <div className="mt-1 font-mono text-sm text-white">
                              {campaign.metrics.leads}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-slate-500">Conv.</div>
                            <div className="mt-1 font-mono text-sm text-white">
                              {campaign.metrics.conversions}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* AI Decisions */}
            {leadGetterDecisions.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-white">AI Decisions</h2>
                </div>
                <p className="mb-4 text-sm text-slate-400">
                  Autonomous optimizations for {leadGetter.name}
                </p>
                <div className="space-y-3">
                  {leadGetterDecisions.slice(0, 3).map((decision) => {
                    const decisionStatusConfig = {
                      executing: { bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
                      completed: { bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
                      testing: { bgClass: 'bg-amber-500/10', textClass: 'text-amber-400' },
                      monitoring: { bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-400' },
                      escalated: { bgClass: 'bg-orange-500/10', textClass: 'text-orange-400' },
                      failed: { bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
                    } as const

                    const decisionStatus = decisionStatusConfig[decision.status]

                    return (
                      <div key={decision.id} className="cursor-pointer rounded-lg border border-slate-700 p-3 transition-colors hover:border-slate-600 hover:bg-slate-800/50">
                        <div className="mb-2 flex items-start justify-between gap-2">
                          <h3 className="text-sm font-medium text-white">{decision.title}</h3>
                          <span className={`rounded-full ${decisionStatus.bgClass} px-2 py-0.5 text-xs font-medium ${decisionStatus.textClass} shrink-0`}>
                            {decision.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 line-clamp-2">{decision.reasoning}</p>
                        <div className="mt-2 text-xs text-slate-500">{formatDateTime(decision.timestamp)}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Status & Info */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Information</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Status</span>
                  <span className={`rounded-full ${status.bgClass} px-2.5 py-1 text-xs font-medium ${status.textClass}`}>
                    {status.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active Campaigns</span>
                  <span className="font-mono text-sm text-white">{leadGetter.activeCampaigns}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Last Updated</span>
                  <span className="text-sm text-slate-500">{formatDateTime(leadGetter.lastUpdated)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
