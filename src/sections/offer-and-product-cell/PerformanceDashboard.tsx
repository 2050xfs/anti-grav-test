import data from '@/../product/sections/offer-and-product-cell/data.json'
import { PerformanceDashboard } from './components/PerformanceDashboard'

export default function PerformanceDashboardPreview() {
  return (
    <PerformanceDashboard
      offers={data.offers}
      insights={data.insights}
      onViewOffer={(id) => console.log('View offer:', id)}
      onApplyInsight={(id) => console.log('Apply insight:', id)}
    />
  )
}
