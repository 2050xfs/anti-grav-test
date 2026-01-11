import data from '@/../product/sections/distribution-engine/data.json'
import { DistributionDashboard } from './components/DistributionDashboard'

export default function DistributionDashboardPreview() {
  return (
    <DistributionDashboard
      channels={data.channels}
      leadGetters={data.leadGetters}
      campaigns={data.campaigns}
      decisions={data.decisions}
      performanceHistory={data.performanceHistory}
      onLaunchCampaign={() => console.log('Launch campaign modal')}
      onChannelClick={(channelId) => console.log('View channel details:', channelId)}
      onPauseChannel={(channelId) => console.log('Pause channel:', channelId)}
      onResumeChannel={(channelId) => console.log('Resume channel:', channelId)}
      onAdjustBudget={(channelId, budget) => console.log('Adjust budget:', channelId, budget)}
      onPauseCampaign={(campaignId) => console.log('Pause campaign:', campaignId)}
      onResumeCampaign={(campaignId) => console.log('Resume campaign:', campaignId)}
      onViewDecision={(decisionId) => console.log('View decision details:', decisionId)}
    />
  )
}
