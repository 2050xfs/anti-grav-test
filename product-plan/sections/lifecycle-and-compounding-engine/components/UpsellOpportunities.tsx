import type { UpsellOpportunitiesProps } from '../../../../product/sections/lifecycle-and-compounding-engine/types'
import { useState } from 'react'

export function UpsellOpportunities({
  opportunities,
  contacts,
  onViewDetails,
  onPursue,
  onDismiss,
  onSort,
}: UpsellOpportunitiesProps) {
  const [sortBy, setSortBy] = useState<'probability' | 'revenue' | 'closeDate'>('probability')

  const getContact = (contactId: string) => contacts.find((c) => c.id === contactId)

  const sortedOpportunities = [...opportunities].sort((a, b) => {
    switch (sortBy) {
      case 'probability':
        return b.probability - a.probability
      case 'revenue':
        return b.expectedRevenue - a.expectedRevenue
      case 'closeDate':
        return new Date(a.estimatedCloseDate).getTime() - new Date(b.estimatedCloseDate).getTime()
      default:
        return 0
    }
  })

  const totalRevenue = opportunities
    .filter((o) => o.status === 'identified' || o.status === 'in-progress')
    .reduce((sum, o) => sum + o.expectedRevenue * o.probability, 0)

  const handleSort = (newSort: typeof sortBy) => {
    setSortBy(newSort)
    onSort?.(newSort)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-emerald-950/20 dark:to-indigo-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Upsell Opportunities
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            AI-recommended expansion opportunities for your customers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-600 dark:to-indigo-700 rounded-xl p-6 text-white">
            <div className="text-indigo-100 text-sm mb-2">Active Opportunities</div>
            <div className="text-4xl font-bold">
              {opportunities.filter((o) => o.status === 'identified' || o.status === 'in-progress').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 rounded-xl p-6 text-white">
            <div className="text-emerald-100 text-sm mb-2">Weighted Pipeline</div>
            <div className="text-4xl font-bold">{formatCurrency(totalRevenue)}</div>
          </div>

          <div className="bg-gradient-to-br from-amber-500 to-amber-600 dark:from-amber-600 dark:to-amber-700 rounded-xl p-6 text-white">
            <div className="text-amber-100 text-sm mb-2">In Progress</div>
            <div className="text-4xl font-bold">
              {opportunities.filter((o) => o.status === 'in-progress').length}
            </div>
          </div>

          <div className="bg-gradient-to-br from-lime-500 to-lime-600 dark:from-lime-600 dark:to-lime-700 rounded-xl p-6 text-white">
            <div className="text-lime-100 text-sm mb-2">Closed Won</div>
            <div className="text-4xl font-bold">
              {opportunities.filter((o) => o.status === 'closed-won').length}
            </div>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg p-2 border border-slate-200 dark:border-slate-800">
          <span className="text-sm text-slate-600 dark:text-slate-400 px-2">Sort by:</span>
          <button
            onClick={() => handleSort('probability')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'probability'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Probability
          </button>
          <button
            onClick={() => handleSort('revenue')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'revenue'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => handleSort('closeDate')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              sortBy === 'closeDate'
                ? 'bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-100'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Close Date
          </button>
        </div>

        {/* Opportunities Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {sortedOpportunities.map((opportunity) => {
            const contact = getContact(opportunity.contactId)
            if (!contact) return null

            const statusColor = {
              identified: 'indigo',
              'in-progress': 'amber',
              'closed-won': 'emerald',
              'closed-lost': 'slate',
            }[opportunity.status]

            return (
              <div
                key={opportunity.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Card Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        {contact.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{contact.company}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 dark:bg-${statusColor}-950 text-${statusColor}-900 dark:text-${statusColor}-100 capitalize`}
                    >
                      {opportunity.status.replace('-', ' ')}
                    </div>
                  </div>

                  {/* Opportunity Details */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Current Plan</span>
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                        {opportunity.currentPlan}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 dark:text-slate-400">Recommended</span>
                      <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {opportunity.recommendedProduct}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Metrics Bar */}
                <div className="grid grid-cols-3 gap-px bg-slate-200 dark:bg-slate-800">
                  <div className="bg-white dark:bg-slate-900 p-4 text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Revenue</div>
                    <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(opportunity.expectedRevenue)}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Probability</div>
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                      {Math.round(opportunity.probability * 100)}%
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 text-center">
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Close Date</div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {formatDate(opportunity.estimatedCloseDate)}
                    </div>
                  </div>
                </div>

                {/* AI Reasoning */}
                <div className="p-6 pt-4 space-y-4">
                  <div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase mb-2">
                      AI Reasoning
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {opportunity.reasoning}
                    </p>
                  </div>

                  <div>
                    <div className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase mb-2">
                      Suggested Approach
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {opportunity.suggestedApproach}
                    </p>
                  </div>

                  {/* Actions */}
                  {(opportunity.status === 'identified' || opportunity.status === 'in-progress') && (
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => onPursue?.(opportunity.id)}
                        className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                      >
                        {opportunity.status === 'identified' ? 'Pursue' : 'Continue'}
                      </button>
                      <button
                        onClick={() => onViewDetails?.(opportunity.id)}
                        className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => onDismiss?.(opportunity.id)}
                        className="px-4 py-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
