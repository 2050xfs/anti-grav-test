import data from '@/../product/sections/distribution-engine/data.json'
import { CampaignDetail } from './components/CampaignDetail'

export default function CampaignDetailPreview() {
  // Show the first campaign as an example
  const campaign = data.campaigns[0]

  // Get the channel this campaign belongs to
  const channel = data.channels.find(c => c.id === campaign.channelId)!

  // Get decisions that affected this campaign
  const campaignDecisions = data.decisions.filter(d =>
    d.affectedCampaignIds.includes(campaign.id)
  )

  return (
    <CampaignDetail
      campaign={campaign}
      channel={channel}
      decisions={campaignDecisions}
      onBack={() => console.log('Back to channel')}
      onPause={() => console.log('Pause campaign:', campaign.id)}
      onResume={() => console.log('Resume campaign:', campaign.id)}
      onAdjustBudget={(budget) => console.log('Adjust budget to:', budget)}
      onEditTargeting={() => console.log('Edit targeting for campaign:', campaign.id)}
    />
  )
}
