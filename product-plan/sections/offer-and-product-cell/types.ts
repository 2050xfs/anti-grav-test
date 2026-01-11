// =============================================================================
// Data Types
// =============================================================================

export interface CoreOffer {
  title: string
  description: string
  deliveryMechanism: 'physical' | 'digital' | 'event' | 'human' | 'hybrid'
}

export interface Bonus {
  title: string
  description: string
  perceivedValue: number
}

export interface Guarantee {
  type: 'unconditional' | 'outcome-based' | 'satisfaction' | 'performance'
  terms: string
  riskReversal: string
}

export interface Pricing {
  price: number
  anchor: number
  paymentTerms: string
}

export interface ValueStack {
  coreOffer: CoreOffer
  bonuses: Bonus[]
  guarantee: Guarantee
  pricing: Pricing
}

export interface ConversionRates {
  impressionToClick: number
  clickToLead: number
  leadToSql: number
  sqlToCustomer: number
}

export interface ChannelBreakdown {
  warmOutreach: number
  coldOutreach: number
  content: number
  paidAds: number
}

export interface Performance {
  impressions: number
  clicks: number
  leads: number
  sqls: number
  customers: number
  revenue: number
  conversionRates: ConversionRates
  channelBreakdown: ChannelBreakdown
}

export interface Offer {
  id: string
  title: string
  type: 'lead-magnet' | 'core-offer' | 'expansion'
  status: 'draft' | 'active' | 'paused' | 'archived'
  painPointId: string
  valueStack: ValueStack
  performance: Performance
  valueScore: number
  createdBy: 'ai-generated' | 'human-created' | 'hybrid'
  createdAt: string
  updatedAt: string
  version: number
}

export interface Insight {
  id: string
  insight: string
  confidence: number
  supportingData: string
  category: string
  impactedOffers: string[]
  createdAt: string
}

export interface CompetitorValueStack {
  coreOffer: string
  keyBonuses: string[]
  guaranteeType: string
  pricing: string
}

export interface Competitor {
  id: string
  competitorName: string
  url: string
  offerType: string
  valueStack: CompetitorValueStack
  perceivedStrengths: string[]
  identifiedGaps: string[]
  positioningScore: number
  createdAt: string
}

// =============================================================================
// Component Props
// =============================================================================

export interface OfferGeneratorInput {
  painPointId: string
  offerType: 'lead-magnet' | 'core-offer' | 'expansion'
  priceRange: { min: number; max: number }
  deliveryPreference?: 'physical' | 'digital' | 'event' | 'human' | 'hybrid'
}

export interface OfferProductCellProps {
  /** The list of offers to display */
  offers: Offer[]
  /** Institutional learnings from offer performance */
  insights: Insight[]
  /** Competitive intelligence data */
  competitors: Competitor[]
  /** Called when user wants to view an offer's details */
  onViewOffer?: (offerId: string) => void
  /** Called when user wants to edit an offer */
  onEditOffer?: (offerId: string) => void
  /** Called when user wants to clone an offer */
  onCloneOffer?: (offerId: string) => void
  /** Called when user wants to pause an active offer */
  onPauseOffer?: (offerId: string) => void
  /** Called when user wants to activate a paused offer */
  onActivateOffer?: (offerId: string) => void
  /** Called when user wants to archive an offer */
  onArchiveOffer?: (offerId: string) => void
  /** Called when user wants to delete an offer permanently */
  onDeleteOffer?: (offerId: string) => void
  /** Called when user wants to view detailed performance metrics for an offer */
  onViewPerformance?: (offerId: string) => void
  /** Called when user wants to generate new offers with AI */
  onGenerateOffers?: (input: OfferGeneratorInput) => void
  /** Called when user wants to apply an insight to a new offer */
  onApplyInsight?: (insightId: string) => void
  /** Called when user wants to view competitor details */
  onViewCompetitor?: (competitorId: string) => void
  /** Called when user wants to add a new competitor for analysis */
  onAddCompetitor?: (url: string) => void
  /** Called when user wants to create a new offer manually */
  onCreateOffer?: () => void
}
