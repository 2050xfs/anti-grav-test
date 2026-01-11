// =============================================================================
// Data Types
// =============================================================================

export interface ChannelMetrics {
  /** Lifetime Gross Profit to Customer Acquisition Cost ratio */
  ltgpCacRatio: number
  /** Total spend in dollars */
  spend: number
  /** Total leads generated */
  leads: number
  /** Total conversions (qualified leads) */
  conversions: number
  /** Conversion rate as percentage */
  conversionRate: number
}

export interface ChannelBudget {
  /** Total budget allocated in dollars */
  allocated: number
  /** Remaining budget in dollars */
  remaining: number
  /** Budget utilization as percentage */
  utilizationPercent: number
}

export interface Channel {
  id: string
  name: string
  type: 'core-four' | 'lead-getter'
  /** Current operational status */
  status: 'active' | 'paused' | 'optimizing' | 'constrained' | 'error'
  /** Brief description of channel's execution strategy */
  description: string
  metrics: ChannelMetrics
  budget: ChannelBudget
  /** Number of campaigns currently running in this channel */
  activeCampaigns: number
  /** ISO timestamp of last metrics update */
  lastUpdated: string
}

export interface LeadGetterMetrics {
  /** For referrals: monthly referral rate percentage */
  referralRate?: number
  /** For referrals: new referrals count */
  newReferrals?: number
  /** For employees: number of active employees */
  activeEmployees?: number
  /** For agencies: number of active agency partnerships */
  activeAgencies?: number
  /** For affiliates: number of active affiliates */
  activeAffiliates?: number
  /** Total leads generated */
  leads?: number
  /** Total conversions */
  conversions?: number
  /** Conversion rate as percentage */
  conversionRate?: number
  /** For employees: average ROI per employee */
  avgRoiPerEmployee?: number
  /** For agencies: monthly spend on agencies */
  monthlySpend?: number
  /** For affiliates: average commission per sale */
  avgCommissionPerSale?: number
}

export interface LeadGetter {
  id: string
  name: string
  type: 'lead-getter'
  /** Current operational status */
  status: 'active' | 'paused' | 'optimizing' | 'error'
  /** Brief description of lead getter strategy */
  description: string
  metrics: LeadGetterMetrics
  /** Number of campaigns currently running */
  activeCampaigns: number
  /** ISO timestamp of last metrics update */
  lastUpdated: string
}

export interface CampaignMetrics {
  /** Total spend in dollars */
  spend: number
  /** Total leads generated */
  leads: number
  /** Total conversions */
  conversions: number
  /** LTGP:CAC ratio for this campaign */
  ltgpCacRatio?: number
  /** For lead getters: number of triggers activated */
  triggered?: number
  /** For lead getters: number reached */
  reached?: number
}

export interface Campaign {
  id: string
  name: string
  /** ID of the channel or lead getter this campaign belongs to */
  channelId: string
  /** Current campaign status */
  status: 'active' | 'paused' | 'completed' | 'error'
  /** Description of target audience */
  targetAudience: string
  metrics: CampaignMetrics
  /** ISO date when campaign started */
  startDate: string
  /** ISO timestamp of last activity */
  lastActivity: string
}

export interface DecisionContext {
  [key: string]: string | number | boolean
}

export interface Decision {
  id: string
  /** ISO timestamp when decision was made */
  timestamp: string
  /** Type of decision made by Strategy Brain */
  decisionType: 'budget-reallocation' | 'campaign-pause' | 'campaign-scale' | 'channel-optimization' | 'constraint-detection' | 'offer-testing'
  /** Human-readable title of the decision */
  title: string
  /** AI reasoning explaining why this decision was made */
  reasoning: string
  /** Contextual data that informed the decision */
  context: DecisionContext
  /** What the AI expects to happen as a result */
  expectedOutcome: string
  /** What actually happened (null if still executing) */
  actualResult: string | null
  /** Channel IDs affected by this decision */
  affectedChannelIds: string[]
  /** Campaign IDs affected by this decision */
  affectedCampaignIds: string[]
  /** Current status of the decision */
  status: 'executing' | 'completed' | 'testing' | 'monitoring' | 'escalated' | 'failed'
}

export interface PerformanceDataPoint {
  /** ISO date for this data point */
  date: string
  /** Average LTGP:CAC ratio across all channels */
  ltgpCacRatio: number
  /** Total spend across all channels */
  totalSpend: number
  /** Total leads across all channels */
  totalLeads: number
}

// =============================================================================
// Component Props
// =============================================================================

export interface DistributionEngineProps {
  /** The Core Four channels (Warm Outreach, Cold Outreach, Content, Paid Ads) */
  channels: Channel[]
  /** The Four Lead Getters (Customer Referrals, Employees, Agencies, Affiliates) */
  leadGetters: LeadGetter[]
  /** All active campaigns across channels and lead getters */
  campaigns: Campaign[]
  /** Recent AI decisions with reasoning and outcomes */
  decisions: Decision[]
  /** Time-series performance data for chart visualization */
  performanceHistory: PerformanceDataPoint[]
  /** Called when user wants to launch a new campaign */
  onLaunchCampaign?: () => void
  /** Called when user clicks a channel card to drill into details */
  onChannelClick?: (channelId: string) => void
  /** Called when user wants to pause a channel */
  onPauseChannel?: (channelId: string) => void
  /** Called when user wants to resume a paused channel */
  onResumeChannel?: (channelId: string) => void
  /** Called when user wants to adjust a channel's budget */
  onAdjustBudget?: (channelId: string, newBudget: number) => void
  /** Called when user wants to pause a specific campaign */
  onPauseCampaign?: (campaignId: string) => void
  /** Called when user wants to resume a paused campaign */
  onResumeCampaign?: (campaignId: string) => void
  /** Called when user wants to view full details of an AI decision */
  onViewDecision?: (decisionId: string) => void
}

export interface ChannelDetailProps {
  /** The channel being viewed in detail */
  channel: Channel
  /** Campaigns belonging to this channel */
  campaigns: Campaign[]
  /** AI decisions that affected this channel */
  decisions: Decision[]
  /** Performance history data points for this channel */
  performanceHistory: PerformanceDataPoint[]
  /** Called when user wants to go back to dashboard */
  onBack?: () => void
  /** Called when user wants to pause this channel */
  onPause?: () => void
  /** Called when user wants to resume this channel */
  onResume?: () => void
  /** Called when user adjusts the budget slider */
  onAdjustBudget?: (newBudget: number) => void
  /** Called when user wants to pause a campaign */
  onPauseCampaign?: (campaignId: string) => void
  /** Called when user wants to resume a campaign */
  onResumeCampaign?: (campaignId: string) => void
  /** Called when user wants to view campaign details */
  onViewCampaign?: (campaignId: string) => void
}
