import data from '@/../product/sections/strategy-brain/data.json'
import { ActivityLogView } from './components/ActivityLogView'

export default function ActivityLogPreview() {
  return (
    <ActivityLogView
      brainStatus={data.brainStatus}
      activityLog={data.activityLog}
      decisions={data.decisions}
      channels={data.channels}
      onViewDecision={(id) => console.log('View decision:', id)}
      onViewChannel={(id) => console.log('View channel:', id)}
      onExport={(format) => console.log('Export as:', format)}
      onFilterByTimeRange={(range) => console.log('Filter by time range:', range)}
      onFilterByType={(types) => console.log('Filter by types:', types)}
    />
  )
}
