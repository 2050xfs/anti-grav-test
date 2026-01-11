import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { LifecycleDashboard } from './components/LifecycleDashboard'

export default function LifecycleDashboardPreview() {
  return (
    <LifecycleDashboard
      contacts={data.contacts}
      healthScores={data.healthScores}
      retentionMetrics={data.retentionMetrics}
      onViewStage={(stage) => console.log('View stage:', stage)}
      onViewContact={(contactId) => console.log('View contact:', contactId)}
      onViewAtRisk={() => console.log('View at-risk contacts')}
    />
  )
}
