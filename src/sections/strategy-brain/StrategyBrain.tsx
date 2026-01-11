import data from '@/../product/sections/strategy-brain/data.json'
import { StrategyBrain } from './components/StrategyBrain'

export default function StrategyBrainPreview() {
  return (
    <StrategyBrain
      brainStatus={data.brainStatus}
      decisions={data.decisions}
      channels={data.channels}
      insights={data.insights}
      onViewDecision={(id) => console.log('View decision:', id)}
      onApproveDecision={(id) => console.log('Approve decision:', id)}
      onRejectDecision={(id) => console.log('Reject decision:', id)}
      onModifyDecision={(id, mods) => console.log('Modify decision:', id, mods)}
      onCreateDecision={(type) => console.log('Create decision:', type)}
      onSwitchMode={(mode) => console.log('Switch mode:', mode)}
      onViewActivityLog={() => console.log('View activity log')}
      onViewChannel={(id) => console.log('View channel:', id)}
      onViewInsight={(id) => console.log('View insight:', id)}
    />
  )
}
