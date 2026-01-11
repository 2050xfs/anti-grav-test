import data from '@/../product/sections/lifecycle-and-compounding-engine/data.json'
import { ContactTimeline } from './components/ContactTimeline'

export default function ContactTimelinePreview() {
  // Show the first active customer with transitions
  const contact = data.contacts.find((c) => c.lifecycleStage === 'active') || data.contacts[0]
  const contactTransitions = data.lifecycleTransitions.filter((t) => t.contactId === contact.id)
  const contactHealth = data.healthScores.find((h) => h.contactId === contact.id)

  return (
    <ContactTimeline
      contact={contact}
      transitions={contactTransitions}
      healthScore={contactHealth}
      onBack={() => console.log('Back')}
      onTriggerAction={(action) => console.log('Trigger action:', action)}
      onEdit={() => console.log('Edit contact')}
    />
  )
}
