import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { HealthScoreDashboard } from './components/HealthScoreDashboard'

export default function HealthScoreDashboardPreview() {
  return (
    <HealthScoreDashboard
      healthScores={data.healthScores}
      contacts={data.contacts}
      onViewDetails={(contactId) => console.log('View details:', contactId)}
      onTakeAction={(contactId, action) => console.log('Take action:', contactId, action)}
      onFilterByRisk={(riskLevel) => console.log('Filter by risk:', riskLevel)}
    />
  )
}
