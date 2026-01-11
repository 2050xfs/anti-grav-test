import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { ContactProfile } from './components/ContactProfile'

export default function ContactProfilePreview() {
  // Show the first contact (David Martinez)
  const contact = data.contacts[0]
  const contactConversations = data.conversations.filter(c => c.contactId === contact.id)
  const contactMessages = data.messages.filter(m =>
    contactConversations.some(c => c.id === m.conversationId)
  )

  return (
    <ContactProfile
      contact={contact}
      conversations={contactConversations}
      messages={contactMessages}
      onBack={() => console.log('Back to inbox')}
      onEditContact={(contact) => console.log('Edit contact:', contact)}
      onAddNote={(note) => console.log('Add note:', note)}
    />
  )
}
