import { NurtureSequenceBuilder } from './components/NurtureSequenceBuilder'

export default function NurtureSequenceBuilderPreview() {
  return (
    <NurtureSequenceBuilder
      onCreateSequence={(sequence) => console.log('Create sequence:', sequence)}
      onUpdateSequence={(id, sequence) => console.log('Update sequence:', id, sequence)}
      onDeleteSequence={(id) => console.log('Delete sequence:', id)}
    />
  )
}
