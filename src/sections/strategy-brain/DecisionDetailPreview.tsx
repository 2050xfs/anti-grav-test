import data from '@/../product/sections/strategy-brain/data.json'
import { DecisionDetailView } from './components/DecisionDetailView'

export default function DecisionDetailPreview() {
  // Use a "proposed" decision for the preview to show action buttons
  const sampleDecision = data.decisions.find(d => d.stage === 'proposed') || data.decisions[0]

  return (
    <DecisionDetailView
      decision={sampleDecision}
      onClose={() => console.log('Close detail view')}
      onApprove={(id, notes) => console.log('Approve decision:', id, notes)}
      onReject={(id, reason) => console.log('Reject decision:', id, reason)}
      onModify={(id, mods) => console.log('Modify decision:', id, mods)}
    />
  )
}
