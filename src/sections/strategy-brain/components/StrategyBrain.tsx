import type { StrategyBrainProps, Decision } from '@/../product/sections/strategy-brain/types'
import { BrainStatusBand } from './BrainStatusBand'
import { DecisionPipeline } from './DecisionPipeline'
import { ChannelPerformance } from './ChannelPerformance'
import { DecisionAuditTrail } from './DecisionAuditTrail'
import { DecisionDetailPanel } from './DecisionDetailPanel'
import { AlertCircle } from 'lucide-react'
import { useState } from 'react'

export function StrategyBrain({
  brainStatus,
  decisions,
  channels,
  insights,
  onViewDecision,
  onApproveDecision,
  onRejectDecision,
  onModifyDecision,
  onCreateDecision,
  onSwitchMode,
  onViewActivityLog,
  onViewChannel,
  onViewInsight,
}: StrategyBrainProps) {
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(null)

  // Check for escalations
  const escalations = decisions.filter(d =>
    d.priority === 'high' &&
    (d.stage === 'proposed' || d.stage === 'analyzing')
  )

  const handleViewDecision = (decisionId: string) => {
    const decision = decisions.find(d => d.id === decisionId)
    if (decision) {
      setSelectedDecision(decision)
      onViewDecision?.(decisionId)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Status Band */}
      <BrainStatusBand
        brainStatus={brainStatus}
        onViewActivityLog={onViewActivityLog}
        onSwitchMode={onSwitchMode}
      />

      {/* Escalation Banner */}
      {escalations.length > 0 && (
        <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 px-6 py-3">
          <div className="max-w-[1600px] mx-auto flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-900 dark:text-red-200 font-medium">
              {escalations.length} high-priority {escalations.length === 1 ? 'decision requires' : 'decisions require'} your attention
            </p>
          </div>
        </div>
      )}

      {/* Main Pipeline */}
      <DecisionPipeline
        decisions={decisions}
        brainMode={brainStatus.mode}
        onViewDecision={handleViewDecision}
        onApproveDecision={onApproveDecision}
        onRejectDecision={onRejectDecision}
        onCreateDecision={onCreateDecision}
      />

      {/* Bottom Metrics Section */}
      <div className="px-6 pb-6">
        <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <DecisionAuditTrail
            decisions={decisions}
            onViewDecision={handleViewDecision}
          />
          <ChannelPerformance
            channels={channels}
            onViewChannel={onViewChannel}
          />
        </div>
      </div>

      {/* Detail Panel Overlay */}
      {selectedDecision && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            onClick={() => setSelectedDecision(null)}
          />
          {/* Panel */}
          <DecisionDetailPanel
            decision={selectedDecision}
            onClose={() => setSelectedDecision(null)}
            onApprove={onApproveDecision}
            onReject={onRejectDecision}
            onModify={onModifyDecision}
            showActions={brainStatus.mode === 'training'}
          />
        </>
      )}
    </div>
  )
}
