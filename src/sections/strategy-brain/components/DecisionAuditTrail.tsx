import type { Decision } from '@/../product/sections/strategy-brain/types'
import { Clock, CheckCircle, XCircle } from 'lucide-react'

interface DecisionAuditTrailProps {
  decisions: Decision[]
  onViewDecision?: (decisionId: string) => void
}

export function DecisionAuditTrail({ decisions, onViewDecision }: DecisionAuditTrailProps) {
  // Show recent executing decisions as audit trail
  const recentDecisions = decisions
    .filter(d => d.stage === 'executing')
    .slice(0, 5)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Recent Decisions
      </h3>

      {recentDecisions.length === 0 ? (
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
          No executed decisions yet
        </p>
      ) : (
        <div className="space-y-3">
          {recentDecisions.map(decision => {
            const time = new Date(decision.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })

            return (
              <button
                key={decision.id}
                onClick={() => onViewDecision?.(decision.id)}
                className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1 line-clamp-1">
                      {decision.title}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{time}</span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="capitalize">{decision.type.replace(/-/g, ' ')}</span>
                    </div>
                  </div>
                </div>
                {decision.expectedOutcome && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 ml-9 line-clamp-2">
                    {decision.expectedOutcome}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
