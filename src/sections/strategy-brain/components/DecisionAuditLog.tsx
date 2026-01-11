import { Search, Filter, Download, Calendar, TrendingUp, AlertTriangle, Target, Activity, CheckCircle, XCircle, Clock, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Decision } from '@/../product/sections/strategy-brain/types'

// Design Tokens: indigo (primary), emerald (secondary), slate (neutral)
// Typography: Inter (heading/body), JetBrains Mono (mono)
// Aesthetic: Data-dense technical log with filtering and precise chronological display

interface DecisionAuditLogProps {
  /** Complete list of decisions for the audit trail */
  decisions: Decision[]
  /** Called when user clicks to view a decision's full details */
  onViewDecision?: (decisionId: string) => void
  /** Called when user exports the audit log */
  onExport?: (format: 'csv' | 'json') => void
  /** Called when user applies filters */
  onFilter?: (filters: AuditFilters) => void
}

interface AuditFilters {
  searchQuery?: string
  decisionType?: Decision['type'] | 'all'
  stage?: Decision['stage'] | 'all'
  priority?: Decision['priority'] | 'all'
  dateRange?: { start: string; end: string }
}

export function DecisionAuditLog({
  decisions,
  onViewDecision,
  onExport,
  onFilter,
}: DecisionAuditLogProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<Decision['type'] | 'all'>('all')
  const [stageFilter, setStageFilter] = useState<Decision['stage'] | 'all'>('all')
  const [priorityFilter, setPriorityFilter] = useState<Decision['priority'] | 'all'>('all')
  const [showFilters, setShowFilters] = useState(false)

  // Decision type configuration
  const getTypeConfig = (type: Decision['type']) => {
    switch (type) {
      case 'budget-reallocation':
        return {
          label: 'Budget Reallocation',
          icon: Target,
          color: 'indigo',
          bgClass: 'bg-indigo-100 dark:bg-indigo-900/30',
          textClass: 'text-indigo-700 dark:text-indigo-300',
        }
      case 'channel-pause':
        return {
          label: 'Channel Pause',
          icon: AlertTriangle,
          color: 'amber',
          bgClass: 'bg-amber-100 dark:bg-amber-900/30',
          textClass: 'text-amber-700 dark:text-amber-300',
        }
      case 'offer-evolution':
        return {
          label: 'Offer Evolution',
          icon: TrendingUp,
          color: 'emerald',
          bgClass: 'bg-emerald-100 dark:bg-emerald-900/30',
          textClass: 'text-emerald-700 dark:text-emerald-300',
        }
      case 'constraint-response':
        return {
          label: 'Constraint Response',
          icon: Activity,
          color: 'red',
          bgClass: 'bg-red-100 dark:bg-red-900/30',
          textClass: 'text-red-700 dark:text-red-300',
        }
    }
  }

  // Stage configuration
  const getStageConfig = (stage: Decision['stage']) => {
    switch (stage) {
      case 'signal-detected':
        return { label: 'Signal Detected', icon: Clock, color: 'slate' }
      case 'analyzing':
        return { label: 'Analyzing', icon: Activity, color: 'indigo' }
      case 'proposed':
        return { label: 'Proposed', icon: AlertTriangle, color: 'emerald' }
      case 'executing':
        return { label: 'Executing', icon: CheckCircle, color: 'indigo' }
    }
  }

  // Filter decisions based on current filters
  const filteredDecisions = decisions.filter((decision) => {
    if (searchQuery && !decision.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !decision.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (typeFilter !== 'all' && decision.type !== typeFilter) return false
    if (stageFilter !== 'all' && decision.stage !== stageFilter) return false
    if (priorityFilter !== 'all' && decision.priority !== priorityFilter) return false
    return true
  })

  // Sort by timestamp descending (most recent first)
  const sortedDecisions = [...filteredDecisions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  )

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
  }

  const handleApplyFilters = () => {
    onFilter?.({
      searchQuery,
      decisionType: typeFilter,
      stage: stageFilter,
      priority: priorityFilter,
    })
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                Decision Audit Log
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Complete history of all strategic decisions made by Strategy Brain
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onExport?.('csv')}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export CSV
              </button>
              <button
                onClick={() => onExport?.('json')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors"
              >
                <Download className="w-4 h-4" strokeWidth={2} />
                Export JSON
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search decisions by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-medium transition-colors ${
                  showFilters
                    ? 'bg-indigo-100 dark:bg-indigo-900/30 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300'
                    : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Filter className="w-4 h-4" strokeWidth={2} />
                Filters
              </button>
            </div>

            {/* Filter Controls */}
            {showFilters && (
              <div className="grid sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Decision Type
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as Decision['type'] | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Types</option>
                    <option value="budget-reallocation">Budget Reallocation</option>
                    <option value="channel-pause">Channel Pause</option>
                    <option value="offer-evolution">Offer Evolution</option>
                    <option value="constraint-response">Constraint Response</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Stage
                  </label>
                  <select
                    value={stageFilter}
                    onChange={(e) => setStageFilter(e.target.value as Decision['stage'] | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Stages</option>
                    <option value="signal-detected">Signal Detected</option>
                    <option value="analyzing">Analyzing</option>
                    <option value="proposed">Proposed</option>
                    <option value="executing">Executing</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as Decision['priority'] | 'all')}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Decisions</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">{filteredDecisions.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Executing</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {filteredDecisions.filter((d) => d.stage === 'executing').length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">High Priority</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">
              {filteredDecisions.filter((d) => d.priority === 'high').length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Confidence</div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(
                filteredDecisions
                  .filter((d) => d.confidence !== null)
                  .reduce((sum, d) => sum + (d.confidence || 0), 0) /
                  filteredDecisions.filter((d) => d.confidence !== null).length *
                  100
              )}%
            </div>
          </div>
        </div>

        {/* Decision Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Decision
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Stage
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Confidence
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Channels
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {sortedDecisions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400">
                        <Search className="w-12 h-12 mb-3 opacity-20" strokeWidth={2} />
                        <p className="text-lg font-medium mb-1">No decisions found</p>
                        <p className="text-sm">Try adjusting your search or filters</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  sortedDecisions.map((decision) => {
                    const typeConfig = getTypeConfig(decision.type)
                    const stageConfig = getStageConfig(decision.stage)
                    const TypeIcon = typeConfig.icon
                    const StageIcon = stageConfig.icon
                    const { date, time } = formatTimestamp(decision.timestamp)

                    return (
                      <tr
                        key={decision.id}
                        className="hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors cursor-pointer"
                        onClick={() => onViewDecision?.(decision.id)}
                      >
                        <td className="px-6 py-4">
                          <div className={`flex items-center gap-2 ${typeConfig.textClass}`}>
                            <div className={`p-2 ${typeConfig.bgClass} rounded-lg`}>
                              <TypeIcon className="w-4 h-4" strokeWidth={2.5} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            <div className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                              {decision.title}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                              {decision.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <StageIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" strokeWidth={2} />
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                              {stageConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                              decision.priority === 'high'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                : decision.priority === 'medium'
                                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                decision.priority === 'high'
                                  ? 'bg-red-500'
                                  : decision.priority === 'medium'
                                  ? 'bg-amber-500'
                                  : 'bg-slate-400'
                              }`}
                            />
                            {decision.priority.charAt(0).toUpperCase() + decision.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {decision.confidence !== null ? (
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    decision.confidence >= 0.8
                                      ? 'bg-emerald-500'
                                      : decision.confidence >= 0.6
                                      ? 'bg-indigo-500'
                                      : 'bg-amber-500'
                                  }`}
                                  style={{ width: `${decision.confidence * 100}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 w-10">
                                {Math.round(decision.confidence * 100)}%
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{date}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">{time}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {decision.affectedChannels.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {decision.affectedChannels.slice(0, 2).map((channel) => (
                                <span
                                  key={channel}
                                  className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded"
                                >
                                  {channel}
                                </span>
                              ))}
                              {decision.affectedChannels.length > 2 && (
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs rounded">
                                  +{decision.affectedChannels.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-sm text-slate-400 dark:text-slate-600">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewDecision?.(decision.id)
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-medium rounded-lg transition-colors"
                          >
                            View
                            <ChevronRight className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
