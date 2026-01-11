import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { ConversationInbox } from './components/ConversationInbox'

export default function ConversationInboxPreview() {
  return (
    <ConversationInbox
      conversations={data.conversations}
      contacts={data.contacts}
      analytics={data.analytics}
      onViewConversation={(id) => console.log('View conversation:', id)}
      onFilterChange={(filters) => console.log('Filters changed:', filters)}
    />
  )
}
