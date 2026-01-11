// Typography: Inter for headings and body (applied at app level)
// Colors: indigo (primary), emerald (secondary), slate (neutral)

import { TrendingUp, TrendingDown, ArrowRight, Users, Target, DollarSign, Zap, Sparkles } from 'lucide-react'
import type { Offer, Insight } from '@/../product/sections/offer-and-product-cell/types'

export interface PerformanceDashboardProps {
  /** The list of offers to analyze */
  offers: Offer[]
  /** Institutional learnings */
  insights: Insight[]
  /** Called when user wants to view an offer's details */
  onViewOffer?: (offerId: string) => void
  /** Called when user wants to apply an insight */
  onApplyInsight?: (insightId: string) => void
}

export function PerformanceDashboard({
  offers,
  insights,
  onViewOffer,
  onApplyInsight
}: PerformanceDashboardProps) {
  // Calculate aggregate metrics
  const activeOffers = offers.filter(o => o.status === 'active')
  const totalOffers = offers.length
  const totalRevenue = offers.reduce((sum, o) => sum + o.performance.revenue, 0)
  const totalLeads = offers.reduce((sum, o) => sum + o.performance.leads, 0)
  const totalSQLs = offers.reduce((sum, o) => sum + o.performance.sqls, 0)
  const totalCustomers = offers.reduce((sum, o) => sum + o.performance.customers, 0)
  const avgConversionRate = activeOffers.length > 0
    ? activeOffers.reduce((sum, o) => sum + o.performance.conversionRates.leadToSql, 0) / activeOffers.length
    : 0

  // Calculate channel performance
  const channelData = {
    warmOutreach: offers.reduce((sum, o) => sum + (o.performance.channelBreakdown.warmOutreach * o.performance.revenue), 0),
    coldOutreach: offers.reduce((sum, o) => sum + (o.performance.channelBreakdown.coldOutreach * o.performance.revenue), 0),
    content: offers.reduce((sum, o) => sum + (o.performance.channelBreakdown.content * o.performance.revenue), 0),
    paidAds: offers.reduce((sum, o) => sum + (o.performance.channelBreakdown.paidAds * o.performance.revenue), 0)
  }

  // Top performing offers
  const topOffers = [...offers]
    .filter(o => o.status === 'active')
    .sort((a, b) => b.performance.revenue - a.performance.revenue)
    .slice(0, 5)

  // Funnel stages
  const funnelStages = [
    { label: 'Leads', value: totalLeads, color: 'indigo' },
    { label: 'SQLs', value: totalSQLs, color: 'emerald' },
    { label: 'Customers', value: totalCustomers, color: 'amber' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900/50 dark:to-indigo-950/30">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
              Performance Dashboard
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
            Full funnel analytics, channel performance, and institutional learning insights
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              {totalOffers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Total Offers</div>
            <div className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="font-semibold">{activeOffers.length}</span>
              <span>active</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                Avg
              </span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              {(avgConversionRate * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Lead → SQL Rate</div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              Across all active offers
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 rounded-2xl p-6 border border-emerald-200 dark:border-emerald-800/30 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-400/20 dark:bg-emerald-600/20 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-emerald-700 dark:text-emerald-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              ${(totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">Total Revenue</div>
            <div className="mt-3 text-xs text-emerald-700/70 dark:text-emerald-400/70">
              ${(totalRevenue / totalCustomers).toFixed(0)} avg per customer
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Users className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-slate-50 mb-2">
              {totalCustomers.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Customers Acquired</div>
            <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
              From {totalLeads.toLocaleString()} leads
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-8 lg:mb-12">

          {/* Funnel Visualization */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <Zap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Conversion Funnel
              </h2>
            </div>

            <div className="space-y-4">
              {funnelStages.map((stage, index) => {
                const percentage = index === 0 ? 100 : (stage.value / funnelStages[0].value) * 100
                const colorClasses = {
                  indigo: 'bg-indigo-500 dark:bg-indigo-400',
                  emerald: 'bg-emerald-500 dark:bg-emerald-400',
                  amber: 'bg-amber-500 dark:bg-amber-400'
                }

                return (
                  <div key={stage.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {stage.label}
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {stage.value.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 dark:text-slate-400 ml-2">
                          ({percentage.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-12 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden relative">
                      <div
                        className={`h-full ${colorClasses[stage.color]} transition-all duration-500 flex items-center justify-end px-4`}
                        style={{ width: `${percentage}%` }}
                      >
                        {percentage > 20 && (
                          <span className="text-white font-bold text-sm">
                            {stage.value.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                    {index < funnelStages.length - 1 && (
                      <div className="flex items-center gap-2 my-2 ml-2">
                        <ArrowRight className="w-4 h-4 text-slate-400" />
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {((funnelStages[index + 1].value / stage.value) * 100).toFixed(1)}% conversion
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Channel Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50">
                Channel Revenue
              </h2>
            </div>

            <div className="space-y-4">
              {Object.entries(channelData)
                .sort(([, a], [, b]) => b - a)
                .map(([channel, revenue]) => {
                  const percentage = (revenue / totalRevenue) * 100
                  const channelLabels = {
                    warmOutreach: 'Warm Outreach',
                    coldOutreach: 'Cold Outreach',
                    content: 'Content',
                    paidAds: 'Paid Ads'
                  }

                  return (
                    <div key={channel}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {channelLabels[channel as keyof typeof channelLabels]}
                        </span>
                        <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                          ${(revenue / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        {percentage.toFixed(1)}% of total revenue
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Top Performing Offers */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm mb-8 lg:mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Top Performing Offers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Offer
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Leads
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    SQLs
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Conv Rate
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {topOffers.map((offer, index) => (
                  <tr key={offer.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 text-white font-bold text-sm">
                          #{index + 1}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 dark:text-slate-50 text-sm">
                            {offer.title}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {offer.type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900 dark:text-slate-50">
                      {offer.performance.leads.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-slate-900 dark:text-slate-50">
                      {offer.performance.sqls.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold">
                        {(offer.performance.conversionRates.leadToSql * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${(offer.performance.revenue / 1000).toFixed(0)}K
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        onClick={() => onViewOffer?.(offer.id)}
                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Institutional Learnings */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              Institutional Learnings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
            {insights.map((insight) => (
              <div
                key={insight.id}
                className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/30 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group"
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-50 leading-relaxed mb-2">
                      {insight.insight}
                    </p>
                    <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                      {insight.supportingData}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {insight.confidence}% confidence
                      </span>
                      <button
                        onClick={() => onApplyInsight?.(insight.id)}
                        className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                      >
                        Apply →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
