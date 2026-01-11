import data from '@/../product/sections/offer-and-product-cell/data.json'
import { CompetitiveIntelligence } from './components/CompetitiveIntelligence'

export default function CompetitiveViewPreview() {
  return (
    <CompetitiveIntelligence
      competitors={data.competitors}
      onAddCompetitor={(url) => console.log('Add competitor:', url)}
      onViewCompetitor={(id) => console.log('View competitor:', id)}
    />
  )
}
