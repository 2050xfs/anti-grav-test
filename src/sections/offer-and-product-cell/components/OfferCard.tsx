import { Eye, Edit, Copy, Pause, Play, Archive, BarChart3, TrendingUp, TrendingDown, Minus, Sparkles, Bot, User, Users } from 'lucide-react'
import type { Offer } from '@/../product/sections/offer-and-product-cell/types'

interface OfferCardProps {
  offer: Offer
  onView?: () => void
  onEdit?: () => void
  onClone?: () => void
  onPause?: () => void
  onActivate?: () => void
  onArchive?: () => void
  onViewPerformance?: () => void
}

export function OfferCard({
  offer,
  onView,
  onEdit,
  onClone,
  onPause,
  onActivate,
  onArchive,
  onViewPerformance
}: OfferCardProps) {
  // Type badge styles
  const typeStyles = {
    'lead-magnet': {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      label: 'Lead Magnet'
    },
    'core-offer': {
      bg: 'bg-indigo-100 dark:bg-indigo-900/30',
      text: 'text-indigo-700 dark:text-indigo-400',
      label: 'Core Offer'
    },
    'expansion': {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      label: 'Expansion'
    }
  }

  // Status badge styles
  const statusStyles = {
    'active': {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-400',
      border: 'border-emerald-200 dark:border-emerald-800',
      dot: 'bg-emerald-500'
    },
    'draft': {
      bg: 'bg-slate-50 dark:bg-slate-800/50',
      text: 'text-slate-600 dark:text-slate-400',
      border: 'border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-400'
    },
    'paused': {
      bg: 'bg-amber-50 dark:bg-amber-900/20',
      text: 'text-amber-700 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-800',
      dot: 'bg-amber-500'
    },
    'archived': {
      bg: 'bg-slate-50 dark:bg-slate-800/50',
      text: 'text-slate-500 dark:text-slate-500',
      border: 'border-slate-200 dark:border-slate-700',
      dot: 'bg-slate-300 dark:bg-slate-600'
    }
  }

  // Created by icon
  const creatorIcon = {
    'ai-generated': <Bot className="w-3.5 h-3.5" />,
    'human-created': <User className="w-3.5 h-3.5" />,
    'hybrid': <Users className="w-3.5 h-3.5" />
  }

  const typeStyle = typeStyles[offer.type]
  const statusStyle = statusStyles[offer.status]

  // Calculate conversion rate trend (mock - in real app would compare to previous period)
  const conversionRateTrend = offer.performance.conversionRates.leadToSql > 0.25 ? 'up' : offer.performance.conversionRates.leadToSql < 0.15 ? 'down' : 'neutral'

  return (
    <div className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-200 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-50 line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {offer.title}
            </h3>
          </div>
          <div className={`shrink-0 px-2 py-1 ${typeStyle.bg} ${typeStyle.text} text-xs font-semibold rounded-lg`}>
            {typeStyle.label}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Badge */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1 ${statusStyle.bg} ${statusStyle.text} border ${statusStyle.border} rounded-full text-xs font-medium`}>
            <div className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot} animate-pulse`} />
            {offer.status[0].toUpperCase() + offer.status.slice(1)}
          </div>

          {/* Value Score */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-full text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            {offer.valueScore}/10
          </div>

          {/* Created By */}
          <div className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs font-medium">
            {creatorIcon[offer.createdBy]}
            {offer.createdBy === 'ai-generated' ? 'AI' : offer.createdBy === 'human-created' ? 'Human' : 'Hybrid'}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="p-5 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Leads</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {offer.performance.leads.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">SQLs</div>
            <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
              {offer.performance.sqls.toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1">Revenue</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ${(offer.performance.revenue / 1000).toFixed(0)}K
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Lead → SQL Rate</div>
            <div className="text-xl font-bold text-slate-900 dark:text-slate-50">
              {(offer.performance.conversionRates.leadToSql * 100).toFixed(1)}%
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg ${
            conversionRateTrend === 'up'
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
              : conversionRateTrend === 'down'
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}>
            {conversionRateTrend === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : conversionRateTrend === 'down' ? (
              <TrendingDown className="w-4 h-4" />
            ) : (
              <Minus className="w-4 h-4" />
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 flex items-center gap-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={onView}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
        <button
          onClick={onViewPerformance}
          className="flex items-center justify-center px-3 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors"
          title="View Performance"
        >
          <BarChart3 className="w-4 h-4" />
        </button>
        <button
          onClick={onClone}
          className="flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          title="Clone"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={onEdit}
          className="flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
          title="Edit"
        >
          <Edit className="w-4 h-4" />
        </button>
        {offer.status === 'active' ? (
          <button
            onClick={onPause}
            className="flex items-center justify-center px-3 py-2 bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/30 dark:hover:bg-amber-900/50 text-amber-700 dark:text-amber-400 rounded-lg transition-colors"
            title="Pause"
          >
            <Pause className="w-4 h-4" />
          </button>
        ) : offer.status === 'paused' || offer.status === 'draft' ? (
          <button
            onClick={onActivate}
            className="flex items-center justify-center px-3 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-lg transition-colors"
            title="Activate"
          >
            <Play className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={onArchive}
            className="flex items-center justify-center px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors"
            title="Archive"
          >
            <Archive className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
