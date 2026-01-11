// =============================================================================
// Data Types
// =============================================================================

export interface BrainStatus {
  mode: 'training' | 'supervised' | 'autonomous'
  activeDecisionCount: number
  healthStatus: 'healthy' | 'warning' | 'critical'
  lastActivityTimestamp: string
  decisionsToday: number
  approvalsRequired: number
}

export interface HistoricalContext {
  decisionId: string
  date: string
  summary: string
  outcome: string
}

export interface Decision {
  id: string
  type: 'budget-reallocation' | 'channel-pause' | 'offer-evolution' | 'constraint-response'
  stage: 'signal-detected' | 'analyzing' | 'proposed' | 'executing'
  title: string
  description: string
  timestamp: string
  priority: 'low' | 'medium' | 'high'
  affectedChannels: string[]
  expectedOutcome: string | null
  confidence: number | null
  aiThinking: string | null
  sourceMetrics: Record<string, number | string>
  historicalContext: HistoricalContext[]
}

export interface Channel {
  id: string
  name: string
  description: string
  dailyBudget: number
  ltgpCacRatio: number
  status: 'active' | 'paused' | 'archived'
  healthStatus: 'excellent' | 'good' | 'warning' | 'critical'
  performance: 'outperforming' | 'on-target' | 'declining' | 'underperforming' | 'improving'
  monthlyReferralRate: number
  constraintStatus: 'none' | 'volume-capped' | 'creative-fatigue' | 'audience-saturation'
}

export interface Insight {
  id: string
  type: 'winning-message' | 'failed-experiment' | 'channel-performance' | 'objection-handling'
  title: string
  description: string
  sourceChannel: string
  dateDiscovered: string
  applicationCount: number
  confidenceScore: number
}

export interface ActivityLogEntry {
  id: string
  timestamp: string
  type: 'signal-detection' | 'analysis' | 'decision-execution' | 'mode-change' | 'constraint-detection' | 'metric-calculation' | 'insight-application' | 'escalation'
  title: string
  description: string
  status: 'in-progress' | 'completed' | 'failed' | 'warning'
  relatedDecisionId?: string
  relatedChannelId?: string
  metadata?: Record<string, unknown>
}

// =============================================================================
// Component Props
// =============================================================================

export interface StrategyBrainProps {
  /** Current operational status of the Strategy Brain */
  brainStatus: BrainStatus
  /** List of decisions in the pipeline across all stages */
  decisions: Decision[]
  /** The Core Four channels with performance metrics */
  channels: Channel[]
  /** Historical insights from institutional memory */
  insights: Insight[]

  // Decision Actions
  /** Called when user wants to view full details of a decision */
  onViewDecision?: (decisionId: string) => void
  /** Called when user approves a proposed decision (Training/Supervised mode) */
  onApproveDecision?: (decisionId: string) => void
  /** Called when user rejects a proposed decision */
  onRejectDecision?: (decisionId: string) => void
  /** Called when user modifies a decision before approval with override parameters */
  onModifyDecision?: (decisionId: string, modifications: Record<string, unknown>) => void
  /** Called when user manually creates a new decision card */
  onCreateDecision?: (decisionType: Decision['type']) => void

  // Mode Controls
  /** Called when user switches between Training/Supervised/Autonomous modes */
  onSwitchMode?: (mode: BrainStatus['mode']) => void
  /** Called when user opens the detailed activity log */
  onViewActivityLog?: () => void

  // Channel Actions
  /** Called when user wants to view detailed channel performance */
  onViewChannel?: (channelId: string) => void

  // Insight Actions
  /** Called when user wants to view details of a learned insight */
  onViewInsight?: (insightId: string) => void
}

export interface ActivityLogViewProps {
  /** Current operational status of the Strategy Brain */
  brainStatus: BrainStatus
  /** Recent activity log entries showing what the brain is doing */
  activityLog: ActivityLogEntry[]
  /** List of decisions for reference when clicking related items */
  decisions: Decision[]
  /** The Core Four channels for reference */
  channels: Channel[]

  // Actions
  /** Called when user clicks to view a decision referenced in activity log */
  onViewDecision?: (decisionId: string) => void
  /** Called when user clicks to view a channel referenced in activity log */
  onViewChannel?: (channelId: string) => void
  /** Called when user wants to export the activity log */
  onExport?: (format: 'csv' | 'json') => void
  /** Called when user applies time range filters */
  onFilterByTimeRange?: (range: 'hour' | 'day' | 'week' | 'month') => void
  /** Called when user filters by activity type */
  onFilterByType?: (types: ActivityLogEntry['type'][]) => void
}

export interface ChannelPerformanceDataPoint {
  date: string
  ltgpCacRatio: number
  dailySpend: number
  leadsGenerated: number
  qualifiedLeads: number
}

export interface ChannelDetailViewProps {
  /** The channel being viewed */
  channel: Channel
  /** Historical performance data for trend charts */
  performanceHistory: ChannelPerformanceDataPoint[]
  /** Decisions that affected this channel */
  relatedDecisions: Decision[]
  /** Insights learned from this channel */
  relatedInsights: Insight[]
  /** Current experiments running on this channel */
  activeExperiments?: Array<{
    id: string
    name: string
    startDate: string
    status: 'running' | 'completed' | 'paused'
    description: string
  }>

  // Actions
  /** Called when user wants to view a related decision */
  onViewDecision?: (decisionId: string) => void
  /** Called when user wants to view a related insight */
  onViewInsight?: (insightId: string) => void
  /** Called when user wants to adjust channel budget */
  onAdjustBudget?: (channelId: string, newBudget: number) => void
  /** Called when user wants to pause/resume the channel */
  onToggleChannel?: (channelId: string) => void
}

export interface InsightApplication {
  id: string
  date: string
  decisionId: string
  decisionTitle: string
  outcome: 'success' | 'partial-success' | 'failure' | 'pending'
  impactMetric?: string
  notes?: string
}

export interface InsightDetailViewProps {
  /** The insight being viewed */
  insight: Insight
  /** History of times this insight has been applied */
  applications: InsightApplication[]
  /** Decisions that referenced this insight */
  relatedDecisions: Decision[]
  /** The channel this insight was learned from */
  sourceChannel: Channel

  // Actions
  /** Called when user wants to view a related decision */
  onViewDecision?: (decisionId: string) => void
  /** Called when user wants to view the source channel */
  onViewChannel?: (channelId: string) => void
}
