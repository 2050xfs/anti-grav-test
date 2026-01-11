import type { Decision } from '@/../product/sections/strategy-brain/types'
import { X, ChevronDown, ChevronUp, AlertCircle, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface DecisionDetailPanelProps {
  decision: Decision | null
  onClose: () => void
  onApprove?: (decisionId: string) => void
  onReject?: (decisionId: string) => void
  onModify?: (decisionId: string, modifications: Record<string, unknown>) => void
  showActions?: boolean
}

export function DecisionDetailPanel({
  decision,
  onClose,
  onApprove,
  onReject,
  onModify,
  showActions = false,
}: DecisionDetailPanelProps) {
  const [thinkingExpanded, setThinkingExpanded] = useState(true)
  const [metricsExpanded, setMetricsExpanded] = useState(true)
  const [historyExpanded, setHistoryExpanded] = useState(true)

  if (!decision) return null

  return (
    <div className="fixed inset-y-0 right-0 w-[480px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
              {decision.title}
            </h2>
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span className="capitalize">{decision.type.replace(/-/g, ' ')}</span>
              <span>•</span>
              <span className="capitalize">{decision.stage.replace(/-/g, ' ')}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
            Description
          </h3>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {decision.description}
          </p>
        </div>

        {/* Priority & Confidence */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Priority
            </h3>
            <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 capitalize">
              {decision.priority}
            </span>
          </div>
          {decision.confidence !== null && (
            <div>
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Confidence
              </h3>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 transition-all"
                    style={{ width: `${decision.confidence * 100}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {Math.round(decision.confidence * 100)}%
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Expected Outcome */}
        {decision.expectedOutcome && (
          <div>
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
              Expected Outcome
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {decision.expectedOutcome}
            </p>
          </div>
        )}

        {/* AI Thinking Process */}
        {decision.aiThinking && (
          <div>
            <button
              onClick={() => setThinkingExpanded(!thinkingExpanded)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                AI Reasoning
              </h3>
              {thinkingExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              )}
            </button>
            {thinkingExpanded && (
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-mono">
                  {decision.aiThinking}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Source Metrics */}
        <div>
          <button
            onClick={() => setMetricsExpanded(!metricsExpanded)}
            className="flex items-center justify-between w-full mb-2 group"
          >
            <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Source Metrics
            </h3>
            {metricsExpanded ? (
              <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
            )}
          </button>
          {metricsExpanded && (
            <div className="space-y-2">
              {Object.entries(decision.sourceMetrics).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-slate-200 dark:border-slate-700 last:border-0">
                  <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Historical Context */}
        {decision.historicalContext.length > 0 && (
          <div>
            <button
              onClick={() => setHistoryExpanded(!historyExpanded)}
              className="flex items-center justify-between w-full mb-2 group"
            >
              <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Historical Context
              </h3>
              {historyExpanded ? (
                <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
              )}
            </button>
            {historyExpanded && (
              <div className="space-y-3">
                {decision.historicalContext.map(context => (
                  <div key={context.decisionId} className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                        {new Date(context.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-2">
                      {context.summary}
                    </p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                      {context.outcome}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {showActions && decision.stage === 'proposed' && (
        <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 px-6 py-4">
          <div className="flex gap-3">
            <button
              onClick={() => onReject?.(decision.id)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              Reject
            </button>
            <button
              onClick={() => onApprove?.(decision.id)}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg transition-colors"
            >
              Approve Decision
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
