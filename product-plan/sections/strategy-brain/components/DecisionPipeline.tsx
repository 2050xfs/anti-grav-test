import type { Decision, BrainStatus } from '@/../product/sections/strategy-brain/types'
import { DecisionCard } from './DecisionCard'
import { Plus } from 'lucide-react'

interface DecisionPipelineProps {
  decisions: Decision[]
  brainMode: BrainStatus['mode']
  onViewDecision?: (decisionId: string) => void
  onApproveDecision?: (decisionId: string) => void
  onRejectDecision?: (decisionId: string) => void
  onCreateDecision?: (decisionType: Decision['type']) => void
}

const stages = [
  { id: 'signal-detected', label: 'Signal Detected' },
  { id: 'analyzing', label: 'Analyzing' },
  { id: 'proposed', label: 'Proposed' },
  { id: 'executing', label: 'Executing' },
] as const

export function DecisionPipeline({
  decisions,
  brainMode,
  onViewDecision,
  onApproveDecision,
  onRejectDecision,
  onCreateDecision,
}: DecisionPipelineProps) {
  const getDecisionsByStage = (stage: string) => {
    return decisions.filter(d => d.stage === stage)
  }

  const showActions = brainMode === 'training'

  return (
    <div className="px-6 py-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Pipeline Stages */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {stages.map((stage, index) => {
            const stageDecisions = getDecisionsByStage(stage.id)

            return (
              <div key={stage.id} className="flex items-start gap-6 flex-shrink-0">
                {/* Stage Column */}
                <div className="flex flex-col gap-4 min-w-[320px]">
                  {/* Stage Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {stage.label}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {stageDecisions.length} {stageDecisions.length === 1 ? 'decision' : 'decisions'}
                      </p>
                    </div>
                    <button
                      onClick={() => onCreateDecision?.('budget-reallocation')}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors"
                      title="Add decision"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Decision Cards */}
                  <div className="flex flex-col gap-3">
                    {stageDecisions.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center">
                        <p className="text-xs text-slate-400 dark:text-slate-500">No decisions</p>
                      </div>
                    ) : (
                      stageDecisions.map(decision => (
                        <DecisionCard
                          key={decision.id}
                          decision={decision}
                          showActions={showActions && stage.id === 'proposed'}
                          onView={() => onViewDecision?.(decision.id)}
                          onApprove={() => onApproveDecision?.(decision.id)}
                          onReject={() => onRejectDecision?.(decision.id)}
                        />
                      ))
                    )}
                  </div>
                </div>

                {/* Arrow Between Stages */}
                {index < stages.length - 1 && (
                  <div className="flex items-center pt-8 flex-shrink-0">
                    <svg className="w-6 h-6 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
