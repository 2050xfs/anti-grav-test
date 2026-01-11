import { X, Brain, TrendingUp, AlertTriangle, CheckCircle, XCircle, Clock, Target, Activity } from 'lucide-react'
import type { Decision } from '@/../product/sections/strategy-brain/types'

// Design Tokens: indigo (primary), emerald (secondary), slate (neutral)
// Typography: Inter (heading/body), JetBrains Mono (mono)
// Aesthetic: Technical dashboard with detailed metrics and AI transparency

interface DecisionDetailViewProps {
  /** The decision to display in detail */
  decision: Decision
  /** Called when user closes the detail view */
  onClose?: () => void
  /** Called when user approves the decision */
  onApprove?: (decisionId: string, notes?: string) => void
  /** Called when user rejects the decision */
  onReject?: (decisionId: string, reason: string) => void
  /** Called when user modifies the decision */
  onModify?: (decisionId: string, modifications: Record<string, unknown>) => void
}

export function DecisionDetailView({
  decision,
  onClose,
  onApprove,
  onReject,
  onModify,
}: DecisionDetailViewProps) {
  // Decision type configuration
  const getTypeConfig = (type: Decision['type']) => {
    switch (type) {
      case 'budget-reallocation':
        return {
          label: 'Budget Reallocation',
          icon: Target,
          color: 'indigo',
          bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
          textClass: 'text-indigo-700 dark:text-indigo-300',
          borderClass: 'border-indigo-300 dark:border-indigo-700',
        }
      case 'channel-pause':
        return {
          label: 'Channel Pause',
          icon: AlertTriangle,
          color: 'amber',
          bgClass: 'bg-amber-100 dark:bg-amber-900/30',
          textClass: 'text-amber-700 dark:text-amber-300',
          borderClass: 'border-amber-300 dark:border-amber-700',
        }
      case 'offer-evolution':
        return {
          label: 'Offer Evolution',
          icon: TrendingUp,
          color: 'emerald',
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
          textClass: 'text-emerald-700 dark:text-emerald-300',
          borderClass: 'border-emerald-300 dark:border-emerald-700',
        }
      case 'constraint-response':
        return {
          label: 'Constraint Response',
          icon: Activity,
          color: 'red',
          bgClass: 'bg-red-100 dark:bg-red-900/30',
          textClass: 'text-red-700 dark:text-red-300',
          borderClass: 'border-red-300 dark:border-red-700',
        }
    }
  }

  // Stage configuration
  const getStageConfig = (stage: Decision['stage']) => {
    switch (stage) {
      case 'signal-detected':
        return { label: 'Signal Detected', color: 'slate' }
      case 'analyzing':
        return { label: 'Analyzing', color: 'indigo' }
      case 'proposed':
        return { label: 'Proposed', color: 'emerald' }
      case 'executing':
        return { label: 'Executing', color: 'indigo' }
    }
  }

  const typeConfig = getTypeConfig(decision.type)
  const stageConfig = getStageConfig(decision.stage)
  const TypeIcon = typeConfig.icon

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 ${typeConfig.bgClass} rounded-xl flex items-center justify-center border ${typeConfig.borderClass}`}>
                <TypeIcon className={`w-6 h-6 ${typeConfig.textClass}`} strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-3 py-1 ${typeConfig.bgClass} ${typeConfig.textClass} text-sm font-semibold rounded-full`}>
                    {typeConfig.label}
                  </span>
                  <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full">
                    {stageConfig.label}
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {decision.title}
                </h1>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
              {decision.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" strokeWidth={2} />
                {formatDate(decision.timestamp)}
              </div>
              <div className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${
                  decision.priority === 'high' ? 'bg-red-500' :
                  decision.priority === 'medium' ? 'bg-amber-500' :
                  'bg-slate-400'
                }`} />
                {decision.priority.charAt(0).toUpperCase() + decision.priority.slice(1)} Priority
              </div>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-slate-600 dark:text-slate-400" strokeWidth={2} />
            </button>
          )}
        </div>

        {/* AI Thinking Section */}
        {decision.aiThinking && (
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950/30 dark:to-indigo-900/30 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                AI Thinking Process
              </h2>
              {decision.confidence !== null && (
                <span className="ml-auto px-3 py-1 bg-indigo-200 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-full">
                  {decision.confidence}% confidence
                </span>
              )}
            </div>
            <div className="bg-white dark:bg-slate-950 rounded-xl p-5 border border-indigo-200 dark:border-indigo-800">
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                {decision.aiThinking}
              </p>
            </div>
          </div>
        )}

        {/* Source Metrics */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Source Metrics & Data
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {Object.entries(decision.sourceMetrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4"
              >
                <div className="text-sm text-slate-600 dark:text-slate-400 mb-1 capitalize">
                  {key.replace(/_/g, ' ')}
                </div>
                <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Affected Channels */}
        {decision.affectedChannels.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Affected Channels
            </h2>
            <div className="flex flex-wrap gap-2">
              {decision.affectedChannels.map((channel) => (
                <span
                  key={channel}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Expected Outcome */}
        {decision.expectedOutcome && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/30 dark:to-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Expected Outcome
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
              {decision.expectedOutcome}
            </p>
          </div>
        )}

        {/* Historical Context */}
        {decision.historicalContext.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Similar Past Decisions
            </h2>
            <div className="space-y-3">
              {decision.historicalContext.map((context) => (
                <div
                  key={context.decisionId}
                  className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      {context.summary}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {new Date(context.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    <span className="font-medium">Outcome:</span> {context.outcome}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {decision.stage === 'proposed' && (onApprove || onReject) && (
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Decision Required
            </h2>
            <div className="flex flex-col sm:flex-row gap-3">
              {onApprove && (
                <button
                  onClick={() => onApprove(decision.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 dark:bg-emerald-500 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle className="w-5 h-5" strokeWidth={2.5} />
                  Approve Decision
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(decision.id, 'User rejected')}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all"
                >
                  <XCircle className="w-5 h-5" strokeWidth={2.5} />
                  Reject Decision
                </button>
              )}
            </div>
            {onModify && (
              <button
                onClick={() => onModify(decision.id, {})}
                className="w-full mt-3 px-6 py-3 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-medium rounded-xl transition-all"
              >
                Modify & Approve
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
