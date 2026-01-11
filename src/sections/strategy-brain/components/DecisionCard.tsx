import type { Decision } from '@/../product/sections/strategy-brain/types'
import { Clock, TrendingUp, TrendingDown, DollarSign, AlertTriangle, Lightbulb, Pause } from 'lucide-react'

interface DecisionCardProps {
  decision: Decision
  showActions?: boolean
  onView?: () => void
  onApprove?: () => void
  onReject?: () => void
}

const decisionTypeIcons = {
  'budget-reallocation': DollarSign,
  'channel-pause': Pause,
  'offer-evolution': Lightbulb,
  'constraint-response': AlertTriangle,
}

const priorityColors = {
  low: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400',
  medium: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
}

export function DecisionCard({ decision, showActions = false, onView, onApprove, onReject }: DecisionCardProps) {
  const Icon = decisionTypeIcons[decision.type]
  const timeAgo = new Date(decision.timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm hover:shadow-md transition-shadow min-w-[280px] max-w-[320px]">
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <div className="mt-0.5 p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
          <Icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 leading-tight mb-1">
            {decision.title}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 line-clamp-3">
        {decision.description}
      </p>

      {/* Priority Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[decision.priority]}`}>
          {decision.priority}
        </span>
        {decision.confidence !== null && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {Math.round(decision.confidence * 100)}% confidence
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700">
        <button
          onClick={onView}
          className="flex-1 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
        >
          View Details
        </button>
        {showActions && (
          <>
            <button
              onClick={onApprove}
              className="p-1.5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 rounded-md transition-colors"
              title="Approve"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
            <button
              onClick={onReject}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
              title="Reject"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </>
        )}
      </div>
    </div>
  )
}
