import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { ConversationAnalytics } from './components/ConversationAnalytics'

export default function ConversationAnalyticsPreview() {
  return (
    <ConversationAnalytics analytics={data.analytics} />
  )
}
