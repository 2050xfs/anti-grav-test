import data from '@/../product/sections/strategy-brain/data.json'
import { InsightDetailView } from './components/InsightDetailView'

export default function InsightDetailPreview() {
  // Show insight-004 (Quick Win positioning) which has good application history
  const insight = data.insights.find(i => i.id === 'insight-004') || data.insights[0]
  const applications = data.insightApplications[insight.id as keyof typeof data.insightApplications] || []

  // Get related decisions
  const relatedDecisions = data.decisions.filter(d =>
    applications.some(app => app.decisionId === d.id)
  )

  // Get source channel
  const sourceChannel = data.channels.find(c => c.id === insight.sourceChannel) || data.channels[0]

  return (
    <InsightDetailView
      insight={insight}
      applications={applications}
      relatedDecisions={relatedDecisions}
      sourceChannel={sourceChannel}
      onViewDecision={(id) => console.log('View decision:', id)}
      onViewChannel={(id) => console.log('View channel:', id)}
    />
  )
}
