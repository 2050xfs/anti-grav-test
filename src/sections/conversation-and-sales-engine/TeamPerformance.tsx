import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { TeamPerformance } from './components/TeamPerformance'

export default function TeamPerformancePreview() {
  return (
    <TeamPerformance
      teamMembers={data.teamMembers}
      conversations={data.conversations}
    />
  )
}
