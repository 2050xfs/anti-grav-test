// Typography: Inter for headings and body (applied at app level)
// Colors: indigo (primary), emerald (secondary), slate (neutral)

import { useState } from 'react'
import { Search, Plus, TrendingUp, TrendingDown, Sparkles, Crown, Zap } from 'lucide-react'
import type { OfferProductCellProps } from '@/../product/sections/offer-and-product-cell/types'
import { OfferCard } from './OfferCard'
import { InsightCard } from './InsightCard'

export function OfferLibrary({
  offers,
  insights,
  onViewOffer,
  onEditOffer,
  onCloneOffer,
  onPauseOffer,
  onActivateOffer,
  onArchiveOffer,
  onViewPerformance,
  onCreateOffer,
  onApplyInsight
}: OfferProductCellProps) {
  const [filterType, setFilterType] = useState<'all' | 'lead-magnet' | 'core-offer' | 'expansion'>('all')
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'paused' | 'archived'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter offers
  const filteredOffers = offers.filter(offer => {
    const matchesType = filterType === 'all' || offer.type === filterType
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus
    const matchesSearch = offer.title.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesType && matchesStatus && matchesSearch
  })

  // Calculate summary metrics
  const activeOffers = offers.filter(o => o.status === 'active').length
  const avgConversionRate = offers.length > 0
    ? offers.reduce((sum, o) => sum + (o.performance.conversionRates.leadToSql * 100), 0) / offers.length
    : 0
  const totalRevenue = offers.reduce((sum, o) => sum + o.performance.revenue, 0)
  const topPerformer = [...offers].sort((a, b) => b.valueScore - a.valueScore)[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-emerald-950/20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">

        {/* Header */}
        <div className="mb-8 lg:mb-12">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 lg:gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  Offer Library
                </h1>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg max-w-2xl">
                Conversion intelligence system powered by Hormozi's Value Equation framework
              </p>
            </div>
            <button
              onClick={onCreateOffer}
              className="w-full lg:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              Generate New Offer
            </button>
          </div>
        </div>

        {/* Performance Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                Live
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {activeOffers}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Active Offers</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span className="text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-1 rounded-full">
                Avg
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              {avgConversionRate.toFixed(1)}%
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Lead → SQL Rate</div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 lg:p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">$</span>
              </div>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-full">
                Total
              </span>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
              ${(totalRevenue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Revenue Generated</div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-900/20 dark:to-amber-800/10 rounded-2xl p-5 lg:p-6 border border-amber-200 dark:border-amber-800/30 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400/20 dark:bg-amber-600/20 flex items-center justify-center">
                <Crown className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                {topPerformer?.valueScore}/10
              </span>
            </div>
            <div className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-1 line-clamp-1">
              {topPerformer?.title || 'N/A'}
            </div>
            <div className="text-sm text-amber-700 dark:text-amber-400">Top Performer</div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="mb-6 lg:mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search offers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-slate-50 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'lead-magnet', 'core-offer', 'expansion'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                    ${filterType === type
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                    }
                  `}
                >
                  {type === 'all' ? 'All Types' : type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'active', 'draft', 'paused', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`
                    px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                    ${filterStatus === status
                      ? 'bg-emerald-600 dark:bg-emerald-500 text-white shadow-lg shadow-emerald-500/25'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }
                  `}
                >
                  {status[0].toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Institutional Learnings */}
        {insights.length > 0 && (
          <div className="mb-8 lg:mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                Institutional Learnings
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {insights.slice(0, 4).map((insight) => (
                <InsightCard
                  key={insight.id}
                  insight={insight}
                  onApply={() => onApplyInsight?.(insight.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Offers Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {filteredOffers.length} {filteredOffers.length === 1 ? 'Offer' : 'Offers'}
            </h2>
          </div>

          {filteredOffers.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-2">
                No offers found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => {
                  setFilterType('all')
                  setFilterStatus('all')
                  setSearchQuery('')
                }}
                className="px-6 py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
              {filteredOffers.map((offer) => (
                <OfferCard
                  key={offer.id}
                  offer={offer}
                  onView={() => onViewOffer?.(offer.id)}
                  onEdit={() => onEditOffer?.(offer.id)}
                  onClone={() => onCloneOffer?.(offer.id)}
                  onPause={() => onPauseOffer?.(offer.id)}
                  onActivate={() => onActivateOffer?.(offer.id)}
                  onArchive={() => onArchiveOffer?.(offer.id)}
                  onViewPerformance={() => onViewPerformance?.(offer.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
