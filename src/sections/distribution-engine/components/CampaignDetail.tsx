import type { Campaign, Channel, Decision } from '@/../product/sections/distribution-engine/types'
import { useState } from 'react'

interface CampaignDetailProps {
  campaign: Campaign
  channel: Channel
  decisions: Decision[]
  onBack?: () => void
  onPause?: () => void
  onResume?: () => void
  onAdjustBudget?: (newBudget: number) => void
  onEditTargeting?: () => void
}

/**
 * Campaign Detail View
 *
 * Drill-down interface for a single campaign showing:
 * - Campaign metrics and status
 * - Performance trends over time
 * - Targeting parameters
 * - Recent activity log
 * - AI decisions affecting this campaign
 * - Manual control buttons
 */
export function CampaignDetail({
  campaign,
  channel,
  decisions,
  onBack,
  onPause,
  onResume,
  onAdjustBudget,
  onEditTargeting
}: CampaignDetailProps) {
  const isPaused = campaign.status === 'paused'
  const isActive = campaign.status === 'active'
  const isUnderperforming = campaign.metrics.ltgpCacRatio && campaign.metrics.ltgpCacRatio < 3.0
  const isHighPerforming = campaign.metrics.ltgpCacRatio && campaign.metrics.ltgpCacRatio >= 7.0

  // Filter decisions that affected this campaign
  const campaignDecisions = decisions.filter(d =>
    d.affectedCampaignIds.includes(campaign.id)
  )

  const statusConfig = {
    active: { color: 'emerald', label: 'Active', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
    paused: { color: 'slate', label: 'Paused', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
    completed: { color: 'indigo', label: 'Completed', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
    error: { color: 'red', label: 'Error', bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
  } as const

  const status = statusConfig[campaign.status]

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

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

  // Calculate campaign duration
  const startDate = new Date(campaign.startDate)
  const now = new Date()
  const durationDays = Math.floor((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

  // Calculate daily averages
  const avgDailySpend = durationDays > 0 ? campaign.metrics.spend / durationDays : campaign.metrics.spend
  const avgDailyLeads = durationDays > 0 ? campaign.metrics.leads / durationDays : campaign.metrics.leads

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
              aria-label="Back to channel"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-1">
                <span>{channel.name}</span>
                <span>/</span>
                <span>Campaign</span>
              </div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {campaign.name}
                </h1>
                <span className={`flex items-center gap-1.5 rounded-full ${status.bgClass} px-3 py-1 text-sm font-medium ${status.textClass}`}>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  {status.label}
                </span>
                {isUnderperforming && (
                  <span className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-400">
                    ⚠️ Below Target
                  </span>
                )}
                {isHighPerforming && (
                  <span className="flex items-center gap-1.5 rounded-full bg-lime-500/10 px-3 py-1 text-sm font-medium text-lime-400">
                    🚀 High Performer
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-slate-400">{campaign.targetAudience}</p>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-2">
              {onEditTargeting && (
                <button
                  onClick={onEditTargeting}
                  className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
                >
                  Edit Targeting
                </button>
              )}

              {onPause && onResume && (
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
                        Resume Campaign
                      </>
                    ) : (
                      <>
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                        </svg>
                        Pause Campaign
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {campaign.metrics.ltgpCacRatio && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  LTGP:CAC Ratio
                </div>
                <div className="mt-2 text-2xl font-bold text-white">
                  {campaign.metrics.ltgpCacRatio.toFixed(1)}
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Target: 5.0+
                </div>
              </div>
            )}

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Spend
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                ${(campaign.metrics.spend / 1000).toFixed(1)}K
              </div>
              <div className="mt-1 text-xs text-slate-500">
                ${avgDailySpend.toFixed(0)}/day avg
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Leads
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {campaign.metrics.leads}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {avgDailyLeads.toFixed(1)}/day avg
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Conversions
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {campaign.metrics.conversions}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                {((campaign.metrics.conversions / campaign.metrics.leads) * 100).toFixed(1)}% rate
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Duration
              </div>
              <div className="mt-2 text-2xl font-bold text-white">
                {durationDays}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                days running
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
              <div className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Last Activity
              </div>
              <div className="mt-2 text-xl font-bold text-white">
                {formatDateTime(campaign.lastActivity)}
              </div>
              <div className="mt-1 text-xs text-slate-500">
                Started {formatDate(campaign.startDate)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main content - 2 columns */}
          <div className="space-y-8 lg:col-span-2">
            {/* Campaign Details */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Campaign Details</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">Target Audience</div>
                  <div className="text-white">{campaign.targetAudience}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">Channel</div>
                  <div className="text-white">{channel.name}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">Start Date</div>
                  <div className="text-white">{formatDate(campaign.startDate)}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-400 mb-1">Campaign ID</div>
                  <div className="font-mono text-sm text-slate-400">{campaign.id}</div>
                </div>
              </div>
            </div>

            {/* Performance Breakdown */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Performance Breakdown</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-sm text-slate-300">Cost per Lead</span>
                  <span className="font-mono text-white">
                    ${(campaign.metrics.spend / campaign.metrics.leads).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-sm text-slate-300">Cost per Conversion</span>
                  <span className="font-mono text-white">
                    ${(campaign.metrics.spend / campaign.metrics.conversions).toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-sm text-slate-300">Conversion Rate</span>
                  <span className="font-mono text-white">
                    {((campaign.metrics.conversions / campaign.metrics.leads) * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-sm text-slate-300">Daily Average Spend</span>
                  <span className="font-mono text-white">
                    ${avgDailySpend.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800/50 p-3">
                  <span className="text-sm text-slate-300">Daily Average Leads</span>
                  <span className="font-mono text-white">
                    {avgDailyLeads.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-8">
            {/* AI Decisions */}
            {campaignDecisions.length > 0 && (
              <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4 flex items-center gap-2">
                  <svg className="h-5 w-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h2 className="text-lg font-semibold text-white">AI Decisions</h2>
                </div>
                <p className="mb-4 text-sm text-slate-400">
                  Autonomous optimizations affecting this campaign
                </p>
                <div className="space-y-3">
                  {campaignDecisions.slice(0, 3).map((decision) => {
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

            {/* Campaign Status */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
              <h2 className="mb-4 text-lg font-semibold text-white">Status</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Current Status</span>
                  <span className={`rounded-full ${status.bgClass} px-2.5 py-1 text-xs font-medium ${status.textClass}`}>
                    {status.label}
                  </span>
                </div>
                {isUnderperforming && (
                  <div className="rounded-lg border border-red-800/50 bg-red-900/20 p-3">
                    <div className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-red-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-red-300">Below Target</div>
                        <div className="mt-1 text-xs text-red-400">
                          LTGP:CAC ratio is below the 3.0 threshold. Consider adjusting targeting or pausing.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {isHighPerforming && (
                  <div className="rounded-lg border border-lime-800/50 bg-lime-900/20 p-3">
                    <div className="flex items-start gap-2">
                      <svg className="h-5 w-5 text-lime-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <div>
                        <div className="text-sm font-medium text-lime-300">High Performer</div>
                        <div className="mt-1 text-xs text-lime-400">
                          Campaign exceeding target. Consider scaling budget.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
