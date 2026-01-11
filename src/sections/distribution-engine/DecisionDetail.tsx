import data from '@/../product/sections/distribution-engine/data.json'
import { DecisionDetail } from './components/DecisionDetail'

export default function DecisionDetailPreview() {
  // Show the first decision as an example
  const decision = data.decisions[0]

  // Get channels affected by this decision
  const affectedChannels = data.channels.filter(c =>
    decision.affectedChannelIds.includes(c.id)
  )

  // Get campaigns affected by this decision
  const affectedCampaigns = data.campaigns.filter(c =>
    decision.affectedCampaignIds.includes(c.id)
  )

  return (
    <DecisionDetail
      decision={decision}
      affectedChannels={affectedChannels}
      affectedCampaigns={affectedCampaigns}
      onBack={() => console.log('Back to dashboard')}
      onOverride={() => console.log('Override decision:', decision.id)}
      onEscalate={() => console.log('Escalate decision:', decision.id)}
    />
  )
}
