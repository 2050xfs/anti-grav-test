import type { DistributionEngineProps } from '@/../product/sections/distribution-engine/types'
import { ChannelCard } from './ChannelCard'
import { LeadGetterCard } from './LeadGetterCard'
import { PerformanceChart } from './PerformanceChart'
import { RecentDecisions } from './RecentDecisions'
import { CampaignLaunchModal } from './CampaignLaunchModal'
import { BudgetAllocationChart } from './BudgetAllocationChart'
import { useState } from 'react'

/**
 * Distribution Engine Dashboard
 *
 * Design Tokens:
 * - Primary: indigo (strategic actions, key metrics)
 * - Secondary: emerald (positive performance, active states)
 * - Neutral: slate (backgrounds, text, borders)
 * - Typography: Inter for headings and body, JetBrains Mono for metrics
 *
 * Aesthetic: Mission Control
 * Real-time operational dashboard with emphasis on live data, status monitoring,
 * and autonomous system oversight. Dark mode optimized for long monitoring sessions.
 */
export function DistributionDashboard({
  channels,
  leadGetters,
  campaigns,
  decisions,
  performanceHistory,
  onLaunchCampaign,
  onChannelClick,
  onPauseChannel,
  onResumeChannel,
  onAdjustBudget,
  onViewDecision
}: DistributionEngineProps) {
  const [isLaunchModalOpen, setIsLaunchModalOpen] = useState(false)

  // Calculate aggregate metrics
  const totalSpend = channels.reduce((sum, ch) => sum + ch.metrics.spend, 0)
  const totalLeads = channels.reduce((sum, ch) => sum + ch.metrics.leads, 0)
  const avgLtgpCac = channels.reduce((sum, ch) => sum + ch.metrics.ltgpCacRatio, 0) / channels.length
  const totalCampaigns = campaigns.length

  // Get latest performance data point
  const latestPerformance = performanceHistory[performanceHistory.length - 1]

  return (
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950">
      {/* Header with aggregate metrics */}
      <div className="border-b border-slate-800 bg-slate-900/50 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Distribution Engine
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Autonomous execution across Core Four + Lead Getters
              </p>
            </div>

            <button
              onClick={() => setIsLaunchModalOpen(true)}
              className="group relative overflow-hidden rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <span className="relative z-10 flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Launch Campaign
              </span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
            </button>
          </div>

          {/* Live metrics bar */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                  LTGP:CAC Ratio
                </p>
              </div>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {avgLtgpCac.toFixed(1)}
              </p>
              <p className="mt-1 text-xs text-emerald-400">
                Target: 5.0+
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Spend
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                ${(totalSpend / 1000).toFixed(1)}K
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Across {channels.length} channels
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Leads
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {totalLeads.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {totalCampaigns} active campaigns
              </p>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Latest Update
              </p>
              <p className="mt-2 font-mono text-2xl font-bold text-white">
                {latestPerformance?.totalLeads.toLocaleString() || 0}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Leads today
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content - 2 columns */}
          <div className="lg:col-span-2">
            {/* Core Four channels */}
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Core Four Channels
                </h2>
                <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 dark:bg-indigo-500/10 dark:text-indigo-400">
                  Parallel Execution
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {channels.map((channel) => (
                  <ChannelCard
                    key={channel.id}
                    channel={channel}
                    campaigns={campaigns.filter(c => c.channelId === channel.id)}
                    onClick={() => onChannelClick?.(channel.id)}
                    onPause={() => onPauseChannel?.(channel.id)}
                    onResume={() => onResumeChannel?.(channel.id)}
                  />
                ))}
              </div>
            </div>

            {/* Budget allocation visualization */}
            <div className="mb-8">
              <BudgetAllocationChart channels={channels} leadGetters={leadGetters} />
            </div>

            {/* Performance chart */}
            <div className="mb-8">
              <h2 className="mb-4 text-lg font-semibold text-white">
                30-Day Performance Trend
              </h2>
              <PerformanceChart data={performanceHistory} />
            </div>

            {/* Lead Getters */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Four Lead Getters
                </h2>
                <span className="rounded-full bg-slate-700/50 px-3 py-1 text-xs font-medium text-slate-400 dark:bg-slate-700/50 dark:text-slate-400">
                  Secondary Channels
                </span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {leadGetters.map((getter) => (
                  <LeadGetterCard
                    key={getter.id}
                    leadGetter={getter}
                    campaigns={campaigns.filter(c => c.channelId === getter.id)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="lg:col-span-1">
            <RecentDecisions
              decisions={decisions}
              onViewDecision={onViewDecision}
            />
          </div>
        </div>
      </div>

      {/* Campaign Launch Modal */}
      <CampaignLaunchModal
        channels={channels}
        leadGetters={leadGetters}
        isOpen={isLaunchModalOpen}
        onClose={() => setIsLaunchModalOpen(false)}
        onLaunch={(campaignData) => {
          onLaunchCampaign?.()
          console.log('Launch campaign:', campaignData)
        }}
      />
    </div>
  )
}
