import data from '@/../product/sections/distribution-engine/data.json'
import { LeadGetterDetail } from './components/LeadGetterDetail'

export default function LeadGetterDetailPreview() {
  // Show the first lead getter (Customer Referrals) as an example
  const leadGetter = data.leadGetters[0]

  // Get campaigns for this lead getter
  const campaigns = data.campaigns.filter(c => c.channelId === leadGetter.id)

  // Get decisions that affected this lead getter
  const leadGetterDecisions = data.decisions.filter(d =>
    d.affectedChannelIds.includes(leadGetter.id)
  )

  return (
    <LeadGetterDetail
      leadGetter={leadGetter}
      campaigns={campaigns}
      decisions={leadGetterDecisions}
      onBack={() => console.log('Back to dashboard')}
      onPause={() => console.log('Pause lead getter:', leadGetter.id)}
      onResume={() => console.log('Resume lead getter:', leadGetter.id)}
      onViewCampaign={(campaignId) => console.log('View campaign:', campaignId)}
    />
  )
}
