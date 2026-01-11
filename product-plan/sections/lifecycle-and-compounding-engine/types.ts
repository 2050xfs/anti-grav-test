// =============================================================================
// Data Types
// =============================================================================

export interface Contact {
  id: string
  name: string
  email: string
  company: string
  /** Lifecycle stage: lead, new-customer, active, at-risk, dormant, churned */
  lifecycleStage: 'lead' | 'new-customer' | 'active' | 'at-risk' | 'dormant' | 'churned'
  /** ISO date string of first purchase (null for leads) */
  firstPurchaseDate: string | null
  /** ISO date string of most recent activity */
  lastActivityDate: string
  /** Total number of purchases made */
  totalPurchases: number
  /** Total revenue generated from this contact */
  lifetimeValue: number
  /** Average value per order */
  averageOrderValue: number
  /** Days since last purchase (null for leads) */
  daysSinceLastPurchase: number | null
  /** Engagement score from 0-100 based on activity patterns */
  engagementScore: number
  /** Number of new customers this contact has referred */
  referralsGenerated: number
  /** Current product usage level */
  productUsageLevel: 'none' | 'trial' | 'low' | 'medium' | 'high'
  /** Total support tickets submitted */
  supportTickets: number
  /** Net Promoter Score (0-10, null for leads) */
  npsScore: number | null
}

export interface HealthScore {
  contactId: string
  /** Overall health score from 0-100 */
  overallScore: number
  /** Risk level classification */
  riskLevel: 'healthy' | 'at-risk' | 'critical'
  /** Breakdown of health factors */
  factors: {
    /** Engagement trend score (0-100) */
    engagementTrend: number
    /** Purchase frequency score (0-100) */
    purchaseFrequency: number
    /** Product usage score (0-100) */
    productUsage: number
    /** Support satisfaction score (0-100) */
    supportSatisfaction: number
    /** Payment history score (0-100) */
    paymentHistory: number
  }
  /** Predicted probability of churn (0-1) */
  predictedChurnProbability: number
  /** AI-recommended actions to improve health */
  recommendedActions: string[]
  /** ISO timestamp of last calculation */
  lastCalculated: string
}

export interface UpsellOpportunity {
  id: string
  contactId: string
  /** Product/service being recommended */
  recommendedProduct: string
  /** Contact's current plan/product */
  currentPlan: string
  /** Expected additional revenue */
  expectedRevenue: number
  /** Probability of conversion (0-1) */
  probability: number
  /** AI reasoning for this recommendation */
  reasoning: string
  /** Suggested approach for presenting the upsell */
  suggestedApproach: string
  /** Estimated close date */
  estimatedCloseDate: string
  /** Current status of this opportunity */
  status: 'identified' | 'in-progress' | 'closed-won' | 'closed-lost'
}

export interface LifecycleTransition {
  id: string
  contactId: string
  /** Previous lifecycle stage (null for first transition) */
  fromStage: Contact['lifecycleStage'] | null
  /** New lifecycle stage */
  toStage: Contact['lifecycleStage']
  /** ISO date string when transition occurred */
  transitionDate: string
  /** What triggered this transition */
  trigger: string
  /** Automated action taken by the system */
  automatedAction: string
  /** Number of days spent in previous stage (null for first transition) */
  daysInPreviousStage: number | null
}

export interface ReactivationCampaignStep {
  stepNumber: number
  /** Type of action in this step */
  type: 'email' | 'wait' | 'survey' | 'call' | 'internal-alert'
  /** Subject line or description */
  subject: string
  /** Delay before this step executes */
  delay: string
}

export interface ReactivationCampaign {
  id: string
  /** Campaign name */
  name: string
  /** Current status */
  status: 'draft' | 'active' | 'paused' | 'completed'
  /** Which lifecycle segment this targets */
  targetSegment: 'at-risk' | 'dormant' | 'churned'
  /** Condition that triggers enrollment */
  triggerCondition: string
  /** Number of contacts currently enrolled */
  enrolledContacts: number
  /** Percentage who complete all steps */
  completionRate: number
  /** Percentage who reactivate/convert */
  reactivationRate: number
  /** Sequence of steps in this campaign */
  steps: ReactivationCampaignStep[]
}

export interface Cohort {
  /** Cohort identifier (e.g., "Q1 2023") */
  cohortName: string
  /** ISO date string when cohort was acquired */
  acquisitionDate: string
  /** Number of customers acquired in this cohort */
  initialSize: number
  /** Current number of active customers */
  currentSize: number
  /** Retention percentage for each month (100 = month 0) */
  retentionByMonth: number[]
  /** Average customer lifetime value for this cohort */
  averageCLV: number
}

export interface RetentionMetrics {
  /** Overall churn rate (annual) */
  overallChurnRate: number
  /** Monthly churn rate */
  monthlyChurnRate: number
  /** Overall retention rate (1 - churn rate) */
  retentionRate: number
  /** Average customer lifespan in months */
  averageCustomerLifespan: number
  /** Cohort analysis data */
  cohorts: Cohort[]
  /** Indicators of compounding value over time */
  compoundingIndicators: {
    /** Percentage of customers who make repeat purchases */
    repeatPurchaseRate: number
    /** Percentage of customers who generate referrals */
    referralGenerationRate: number
    /** Average number of referrals per customer */
    averageReferralsPerCustomer: number
    /** Overall customer advocacy score (0-10) */
    advocacyScore: number
    /** Net Promoter Score (-100 to 100) */
    netPromoterScore: number
  }
}

// =============================================================================
// Component Props
// =============================================================================

export interface LifecycleDashboardProps {
  /** List of all contacts */
  contacts: Contact[]
  /** Customer health scores for active customers */
  healthScores: HealthScore[]
  /** Retention metrics and cohort analysis */
  retentionMetrics: RetentionMetrics
  /** Called when user clicks on a lifecycle stage to view contacts */
  onViewStage?: (stage: Contact['lifecycleStage']) => void
  /** Called when user clicks on a specific contact */
  onViewContact?: (contactId: string) => void
  /** Called when user wants to view at-risk contacts */
  onViewAtRisk?: () => void
}

export interface ContactTimelineProps {
  /** The contact being viewed */
  contact: Contact
  /** All lifecycle transitions for this contact */
  transitions: LifecycleTransition[]
  /** Customer health score (if applicable) */
  healthScore?: HealthScore
  /** Called when user wants to go back */
  onBack?: () => void
  /** Called when user wants to trigger a manual action */
  onTriggerAction?: (action: string) => void
  /** Called when user wants to edit the contact */
  onEdit?: () => void
}

export interface HealthScoreDashboardProps {
  /** Customer health scores */
  healthScores: HealthScore[]
  /** Associated contacts */
  contacts: Contact[]
  /** Called when user clicks on a health score to view details */
  onViewDetails?: (contactId: string) => void
  /** Called when user wants to take action on at-risk contact */
  onTakeAction?: (contactId: string, action: string) => void
  /** Called to filter by risk level */
  onFilterByRisk?: (riskLevel: HealthScore['riskLevel']) => void
}

export interface UpsellOpportunitiesProps {
  /** List of upsell opportunities */
  opportunities: UpsellOpportunity[]
  /** Associated contacts */
  contacts: Contact[]
  /** Called when user wants to view opportunity details */
  onViewDetails?: (opportunityId: string) => void
  /** Called when user wants to pursue an opportunity */
  onPursue?: (opportunityId: string) => void
  /** Called when user wants to dismiss an opportunity */
  onDismiss?: (opportunityId: string) => void
  /** Called to sort opportunities */
  onSort?: (sortBy: 'probability' | 'revenue' | 'closeDate') => void
}

export interface ReactivationCampaignsProps {
  /** List of reactivation campaigns */
  campaigns: ReactivationCampaign[]
  /** Called when user wants to view campaign details */
  onViewCampaign?: (campaignId: string) => void
  /** Called when user wants to create a new campaign */
  onCreateCampaign?: () => void
  /** Called when user wants to edit a campaign */
  onEditCampaign?: (campaignId: string) => void
  /** Called when user wants to pause/resume a campaign */
  onToggleStatus?: (campaignId: string, newStatus: ReactivationCampaign['status']) => void
  /** Called when user wants to view enrolled contacts */
  onViewEnrolled?: (campaignId: string) => void
}

export interface RetentionAnalyticsProps {
  /** Retention metrics and cohort data */
  retentionMetrics: RetentionMetrics
  /** Called when user wants to view a specific cohort */
  onViewCohort?: (cohortName: string) => void
  /** Called when user wants to export retention data */
  onExport?: () => void
  /** Called when user changes the time range */
  onTimeRangeChange?: (range: '3m' | '6m' | '12m' | 'all') => void
}
