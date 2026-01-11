import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { RetentionAnalytics } from './components/RetentionAnalytics'

export default function RetentionAnalyticsPreview() {
  return (
    <RetentionAnalytics
      retentionMetrics={data.retentionMetrics}
      onViewCohort={(cohortName) => console.log('View cohort:', cohortName)}
      onExport={() => console.log('Export data')}
      onTimeRangeChange={(range) => console.log('Time range changed:', range)}
    />
  )
}
