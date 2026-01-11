import data from '@/../product/sections/strategy-brain/data.json'
import { DecisionAuditLog } from './components/DecisionAuditLog'

export default function AuditLogPreview() {
  return (
    <DecisionAuditLog
      decisions={data.decisions}
      onViewDecision={(id) => console.log('View decision:', id)}
      onExport={(format) => console.log('Export as:', format)}
      onFilter={(filters) => console.log('Apply filters:', filters)}
    />
  )
}
