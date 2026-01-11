import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { UpsellOpportunities } from './components/UpsellOpportunities'

export default function UpsellOpportunitiesPreview() {
  return (
    <UpsellOpportunities
      opportunities={data.upsellOpportunities}
      contacts={data.contacts}
      onViewDetails={(opportunityId) => console.log('View details:', opportunityId)}
      onPursue={(opportunityId) => console.log('Pursue:', opportunityId)}
      onDismiss={(opportunityId) => console.log('Dismiss:', opportunityId)}
      onSort={(sortBy) => console.log('Sort by:', sortBy)}
    />
  )
}
