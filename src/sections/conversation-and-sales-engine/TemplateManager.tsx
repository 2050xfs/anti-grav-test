import data from '@/../product/sections/conversation-and-sales-engine/data.json'
import { TemplateManager } from './components/TemplateManager'

export default function TemplateManagerPreview() {
  return (
    <TemplateManager
      templates={data.templates}
      onCreateTemplate={(template) => console.log('Create template:', template)}
      onUpdateTemplate={(id, template) => console.log('Update template:', id, template)}
      onDeleteTemplate={(id) => console.log('Delete template:', id)}
      onUseTemplate={(id) => console.log('Use template:', id)}
    />
  )
}
