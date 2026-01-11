import data from '@/../product/sections/offer-and-product-cell/data.json'
import { OfferLibrary } from './components/OfferLibrary'

export default function OfferLibraryPreview() {
  return (
    <OfferLibrary
      offers={data.offers}
      insights={data.insights}
      competitors={data.competitors}
      onViewOffer={(id) => console.log('View offer:', id)}
      onEditOffer={(id) => console.log('Edit offer:', id)}
      onCloneOffer={(id) => console.log('Clone offer:', id)}
      onPauseOffer={(id) => console.log('Pause offer:', id)}
      onActivateOffer={(id) => console.log('Activate offer:', id)}
      onArchiveOffer={(id) => console.log('Archive offer:', id)}
      onDeleteOffer={(id) => console.log('Delete offer:', id)}
      onViewPerformance={(id) => console.log('View performance:', id)}
      onGenerateOffers={(input) => console.log('Generate offers:', input)}
      onApplyInsight={(id) => console.log('Apply insight:', id)}
      onViewCompetitor={(id) => console.log('View competitor:', id)}
      onAddCompetitor={(url) => console.log('Add competitor:', url)}
      onCreateOffer={() => console.log('Create new offer')}
    />
  )
}
