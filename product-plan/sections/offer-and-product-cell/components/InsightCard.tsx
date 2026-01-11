import { Lightbulb, ArrowRight } from 'lucide-react'
import type { Insight } from '@/../product/sections/offer-and-product-cell/types'

interface InsightCardProps {
  insight: Insight
  onApply?: () => void
}

export function InsightCard({ insight, onApply }: InsightCardProps) {
  // Confidence level styling
  const confidenceLevel = insight.confidence >= 90 ? 'high' : insight.confidence >= 75 ? 'medium' : 'low'
  const confidenceStyles = {
    high: {
      bg: 'bg-emerald-100 dark:bg-emerald-900/30',
      text: 'text-emerald-700 dark:text-emerald-400',
      bar: 'bg-emerald-500 dark:bg-emerald-400'
    },
    medium: {
      bg: 'bg-amber-100 dark:bg-amber-900/30',
      text: 'text-amber-700 dark:text-amber-400',
      bar: 'bg-amber-500 dark:bg-amber-400'
    },
    low: {
      bg: 'bg-slate-100 dark:bg-slate-800',
      text: 'text-slate-600 dark:text-slate-400',
      bar: 'bg-slate-400'
    }
  }

  const style = confidenceStyles[confidenceLevel]

  return (
    <div className="bg-gradient-to-br from-white to-slate-50/50 dark:from-slate-900 dark:to-slate-800/30 rounded-xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all duration-200 group hover:shadow-lg">
      <div className="flex items-start gap-4 mb-4">
        <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 dark:text-slate-50 leading-relaxed mb-3">
            {insight.insight}
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-3">
            <span>{insight.supportingData}</span>
          </div>

          {/* Confidence Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                Confidence Score
              </span>
              <span className={`text-xs font-bold ${style.text}`}>
                {insight.confidence}%
              </span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full ${style.bar} transition-all duration-500 rounded-full`}
                style={{ width: `${insight.confidence}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Apply Button */}
      <button
        onClick={onApply}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 group-hover:shadow-lg group-hover:shadow-emerald-500/25"
      >
        Apply to New Offer
        <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  )
}
