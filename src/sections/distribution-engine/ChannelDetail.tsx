import data from '@/../product/sections/distribution-engine/data.json'
import { ChannelDetail } from './components/ChannelDetail'

export default function ChannelDetailPreview() {
  // Show the first channel (Warm Outreach) as an example
  const channel = data.channels[0]

  // Get campaigns for this channel
  const channelCampaigns = data.campaigns.filter(c => c.channelId === channel.id)

  // Get decisions that affected this channel
  const channelDecisions = data.decisions.filter(d =>
    d.affectedChannelIds.includes(channel.id)
  )

  return (
    <ChannelDetail
      channel={channel}
      campaigns={channelCampaigns}
      decisions={channelDecisions}
      performanceHistory={data.performanceHistory}
      onBack={() => console.log('Back to dashboard')}
      onPause={() => console.log('Pause channel:', channel.id)}
      onResume={() => console.log('Resume channel:', channel.id)}
      onAdjustBudget={(budget) => console.log('Adjust budget to:', budget)}
      onPauseCampaign={(campaignId) => console.log('Pause campaign:', campaignId)}
      onResumeCampaign={(campaignId) => console.log('Resume campaign:', campaignId)}
      onViewCampaign={(campaignId) => console.log('View campaign:', campaignId)}
    />
  )
}
