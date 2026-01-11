import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { ReactivationCampaigns } from './components/ReactivationCampaigns'

export default function ReactivationCampaignsPreview() {
  return (
    <ReactivationCampaigns
      campaigns={data.reactivationCampaigns}
      onViewCampaign={(campaignId) => console.log('View campaign:', campaignId)}
      onCreateCampaign={() => console.log('Create campaign')}
      onEditCampaign={(campaignId) => console.log('Edit campaign:', campaignId)}
      onToggleStatus={(campaignId, newStatus) =>
        console.log('Toggle status:', campaignId, newStatus)
      }
      onViewEnrolled={(campaignId) => console.log('View enrolled:', campaignId)}
    />
  )
}
