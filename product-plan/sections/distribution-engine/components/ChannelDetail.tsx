import type { ChannelDetailProps } from '@/../product/sections/distribution-engine/types'
import { ChannelPerformanceChart } from './ChannelPerformanceChart'
import { CampaignsTable } from './CampaignsTable'
import { ChannelDecisions } from './ChannelDecisions'
import { BudgetControl } from './BudgetControl'
import { useState } from 'react'

/**
 * Channel Detail View
 *
 * Drill-down interface for a single channel showing:
 * - Real-time metrics and status controls
 * - Performance chart over time
 * - Active campaigns table
 * - AI decision log for this channel
 * - Budget adjustment controls
 */
export function ChannelDetail({
  channel,
  campaigns,
  decisions,
  performanceHistory,
  onBack,
  onPause,
  onResume,
  onAdjustBudget,
  onPauseCampaign,
  onResumeCampaign,
  onViewCampaign
}: ChannelDetailProps) {
  const [showBudgetControl, setShowBudgetControl] = useState(false)
  const isPaused = channel.status === 'paused'
  const isUnderperforming = channel.metrics.ltgpCacRatio < 3.0
  const isHighPerforming = channel.metrics.ltgpCacRatio >= 7.0

  // Filter decisions that affected this channel
  const channelDecisions = decisions.filter(d =>
    d.affectedChannelIds.includes(channel.id)
  )

  const statusConfig = {
    active: { color: 'emerald', label: 'Active', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
    paused: { color: 'slate', label: 'Paused', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
    optimizing: { color: 'indigo', label: 'Optimizing', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
    constrained: { color: 'amber', label: 'Constrained', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400' },
    error: { color: 'red', label: 'Error', bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
  } as const

  const status = statusConfig[channel.status]

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
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  {channel.name}
                </h1>
                <span className={`flex items-center gap-1.5 rounded-full ${status.bgClass} px-3 py-1 text-sm font-medium ${status.textClass}`}>
                  <div className="h-2 w-2 animate-pulse rounded-full bg-current" />
                  {status.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-400">{channel.description}</p>
            </div>

            {/* Control buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowBudgetControl(!showBudgetControl)}
                className="rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Adjust Budget
                </span>
              </button>

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
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                      Resume Channel
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      Pause Channel
                    </>
                  )}
                </span>
              </button>
            </div>
          </div>

          {/* Metrics bar */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                LTGP:CAC Ratio
              </p>
              <p className={`mt-2 font-mono text-2xl font-bold ${
                isHighPerforming
                  ? 'text-emerald-400'
                  : isUnderperforming
                    ? 'text-amber-400'
                    : 'text-white'
              }`}>
                {channel.metrics.ltgpCacRatio.toFixed(1)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Target: 5.0+
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Spend
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                ${(channel.metrics.spend / 1000).toFixed(1)}K
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Of ${(channel.budget.allocated / 1000).toFixed(1)}K allocated
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Leads
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {channel.metrics.leads}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                From {campaigns.length} campaigns
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Conversions
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {channel.metrics.conversions}
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                {channel.metrics.conversionRate.toFixed(1)}% rate
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Budget Used
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {channel.budget.utilizationPercent.toFixed(0)}%
              </p>
              <p className="mt-1 text-xs text-slate-500">
                ${(channel.budget.remaining / 1000).toFixed(1)}K remaining
              </p>
            </div>
          </div>

          {/* Budget control panel */}
          {showBudgetControl && (
            <div className="mt-4">
              <BudgetControl
                currentBudget={channel.budget.allocated}
                onAdjust={(budget) => {
                  onAdjustBudget?.(budget)
                  setShowBudgetControl(false)
                }}
                onCancel={() => setShowBudgetControl(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main column - 2/3 */}
          <div className="lg:col-span-2">
            {/* Performance chart */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-white">
                Channel Performance Trend
              </h2>
              <ChannelPerformanceChart
                data={performanceHistory}
                channelName={channel.name}
              />
            </div>

            {/* Active campaigns */}
            <div>
              <h2 className="mb-4 text-lg font-semibold text-white">
                Active Campaigns ({campaigns.length})
              </h2>
              <CampaignsTable
                campaigns={campaigns}
                onPause={onPauseCampaign}
                onResume={onResumeCampaign}
                onView={onViewCampaign}
              />
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="lg:col-span-1">
            <ChannelDecisions
              decisions={channelDecisions}
              channelName={channel.name}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
