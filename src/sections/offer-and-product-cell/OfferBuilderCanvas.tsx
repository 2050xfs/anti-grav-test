import data from '@/../product/sections/offer-and-product-cell/data.json'
import { OfferBuilderCanvas } from './components/OfferBuilderCanvas'

export default function OfferBuilderCanvasPreview() {
  return (
    <OfferBuilderCanvas
      offers={data.offers}
      onSaveOffer={(offer) => console.log('Save offer:', offer)}
      onPreviewChannel={(channel) => console.log('Preview channel:', channel)}
    />
  )
}
