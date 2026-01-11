import data from '@/../product/sections/offer-and-product-cell/data.json'
import { ValueStackVisualizer } from './components/ValueStackVisualizer'

export default function ValueStackViewPreview() {
  // Use the first active offer with a high value score for the preview
  const sampleOffer = data.offers.find(o => o.status === 'active' && o.valueScore > 8) || data.offers[0]

  return (
    <ValueStackVisualizer
      offer={sampleOffer}
      onEdit={(id) => console.log('Edit offer:', id)}
      onClone={(id) => console.log('Clone offer:', id)}
    />
  )
}
