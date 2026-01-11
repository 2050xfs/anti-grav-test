import type { RetentionAnalyticsProps } from '../../../../product/sections/lifecycle-and-compounding-engine/types'
import { useState } from 'react'

export function RetentionAnalytics({
  retentionMetrics,
  onViewCohort,
  onExport,
  onTimeRangeChange,
}: RetentionAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '12m' | 'all'>('12m')

  const handleTimeRangeChange = (range: typeof timeRange) => {
    setTimeRange(range)
    onTimeRangeChange?.(range)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-purple-50/20 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Retention Analytics
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Cohort analysis and customer lifetime value tracking
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center gap-1 bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-800">
              {(['3m', '6m', '12m', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => handleTimeRangeChange(range)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range
                      ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {range === 'all' ? 'All' : range.toUpperCase()}
                </button>
              ))}
            </div>
            <button
              onClick={onExport}
              className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium transition-colors"
            >
              Export Data
            </button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl p-6 text-white">
            <div className="text-indigo-100 text-sm mb-2">Retention Rate</div>
            <div className="text-4xl font-bold">
              {Math.round(retentionMetrics.retentionRate * 100)}%
            </div>
            <div className="text-indigo-100 text-xs mt-1">Annual average</div>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-red-600 dark:from-red-600 dark:to-red-700 rounded-xl p-6 text-white">
            <div className="text-red-100 text-sm mb-2">Churn Rate</div>
            <div className="text-4xl font-bold">
              {Math.round(retentionMetrics.monthlyChurnRate * 100)}%
            </div>
            <div className="text-red-100 text-xs mt-1">Monthly average</div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl p-6 text-white">
            <div className="text-emerald-100 text-sm mb-2">Avg Lifespan</div>
            <div className="text-4xl font-bold">{retentionMetrics.averageCustomerLifespan}</div>
            <div className="text-emerald-100 text-xs mt-1">Months</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl p-6 text-white">
            <div className="text-purple-100 text-sm mb-2">Net Promoter Score</div>
            <div className="text-4xl font-bold">
              {retentionMetrics.compoundingIndicators.netPromoterScore}
            </div>
            <div className="text-purple-100 text-xs mt-1">Out of 100</div>
          </div>
        </div>

        {/* Compounding Indicators */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Compounding Value Indicators
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                {Math.round(retentionMetrics.compoundingIndicators.repeatPurchaseRate * 100)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Repeat Purchase Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                {Math.round(retentionMetrics.compoundingIndicators.referralGenerationRate * 100)}%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Referral Generation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {retentionMetrics.compoundingIndicators.averageReferralsPerCustomer.toFixed(1)}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Avg Referrals per Customer
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                {retentionMetrics.compoundingIndicators.advocacyScore.toFixed(1)}/10
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Advocacy Score</div>
            </div>
          </div>
        </div>

        {/* Cohort Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
            Cohort Retention Analysis
          </h2>

          {/* Cohort Cards */}
          <div className="space-y-4">
            {retentionMetrics.cohorts.map((cohort) => {
              const retentionRate = Math.round(
                (cohort.currentSize / cohort.initialSize) * 100
              )
              const maxMonths = Math.max(...retentionMetrics.cohorts.map((c) => c.retentionByMonth.length))

              return (
                <div
                  key={cohort.cohortName}
                  className="border border-slate-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  {/* Cohort Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {cohort.cohortName}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Started with {cohort.initialSize} customers • {cohort.currentSize} active
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {retentionRate}%
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Retention Rate
                      </div>
                    </div>
                  </div>

                  {/* Retention Curve */}
                  <div className="mb-4">
                    <div className="flex items-end gap-1 h-32">
                      {Array.from({ length: maxMonths }).map((_, monthIndex) => {
                        const retentionValue = cohort.retentionByMonth[monthIndex] || 0
                        const height = `${retentionValue}%`
                        const color =
                          retentionValue >= 80
                            ? 'bg-emerald-500 dark:bg-emerald-400'
                            : retentionValue >= 60
                            ? 'bg-amber-500 dark:bg-amber-400'
                            : 'bg-red-500 dark:bg-red-400'

                        return (
                          <div
                            key={monthIndex}
                            className="flex-1 flex flex-col justify-end group relative"
                          >
                            <div
                              className={`${color} rounded-t transition-all group-hover:opacity-80`}
                              style={{ height }}
                            />
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs px-2 py-1 rounded whitespace-nowrap">
                              Month {monthIndex}: {retentionValue}%
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-between text-xs text-slate-500 dark:text-slate-500 mt-2">
                      <span>Month 0</span>
                      <span>Month {maxMonths - 1}</span>
                    </div>
                  </div>

                  {/* Cohort Metrics */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
                    <div>
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        Average CLV:{' '}
                      </span>
                      <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        {formatCurrency(cohort.averageCLV)}
                      </span>
                    </div>
                    <button
                      onClick={() => onViewCohort?.(cohort.cohortName)}
                      className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Overall Churn Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            Churn Analysis
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Annual Churn Rate
              </div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                {Math.round(retentionMetrics.overallChurnRate * 100)}%
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                Monthly Churn Rate
              </div>
              <div className="text-4xl font-bold text-red-600 dark:text-red-400">
                {Math.round(retentionMetrics.monthlyChurnRate * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
