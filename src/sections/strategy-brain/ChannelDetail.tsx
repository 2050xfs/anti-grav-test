import data from '@/../product/sections/strategy-brain/data.json'
import { ChannelDetailView } from './components/ChannelDetailView'

export default function ChannelDetailPreview() {
  // Show Paid Ads channel (most interesting with good performance)
  const channel = data.channels.find(c => c.id === 'paid-ads') || data.channels[0]
  const performanceHistory = data.channelPerformanceHistory['paid-ads']
  const activeExperiments = data.channelExperiments['paid-ads']

  // Get related decisions (decisions that affect this channel)
  const relatedDecisions = data.decisions.filter(d =>
    d.affectedChannels.includes(channel.id)
  )

  // Get related insights (insights from this channel)
  const relatedInsights = data.insights.filter(i =>
    i.sourceChannel === channel.id
  )

  return (
    <ChannelDetailView
      channel={channel}
      performanceHistory={performanceHistory}
      relatedDecisions={relatedDecisions}
      relatedInsights={relatedInsights}
      activeExperiments={activeExperiments}
      onViewDecision={(id) => console.log('View decision:', id)}
      onViewInsight={(id) => console.log('View insight:', id)}
      onAdjustBudget={(channelId, budget) => console.log('Adjust budget:', channelId, budget)}
      onToggleChannel={(channelId) => console.log('Toggle channel:', channelId)}
    />
  )
}
