import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { ConversationDetail } from './components/ConversationDetail'

export default function ConversationDetailPreview() {
  // Show the first qualified conversation (David Martinez from TechScale)
  const conversation = data.conversations[0]
  const contact = data.contacts.find(c => c.id === conversation.contactId)!
  const conversationMessages = data.messages.filter(m => m.conversationId === conversation.id)

  return (
    <ConversationDetail
      conversation={conversation}
      contact={contact}
      messages={conversationMessages}
      templates={data.templates}
      teamMembers={data.teamMembers}
      onBack={() => console.log('Back to inbox')}
      onSendMessage={(content, templateId) => console.log('Send message:', { content, templateId })}
      onAdjustPmau={(pmau) => console.log('Adjust PMAU:', pmau)}
      onRouteToMember={(memberId) => console.log('Route to member:', memberId)}
      onQualify={() => console.log('Qualify conversation')}
      onDisqualify={() => console.log('Disqualify conversation')}
      onMarkAsSpam={() => console.log('Mark as spam')}
    />
  )
}
