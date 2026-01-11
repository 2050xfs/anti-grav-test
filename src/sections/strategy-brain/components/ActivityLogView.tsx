import { useState } from 'react'
import type { ActivityLogViewProps, ActivityLogEntry } from '@/../product/sections/strategy-brain/types'
import { ActivityLogEntry as ActivityLogEntryComponent } from './ActivityLogEntry'
import { ActivityLogFilters } from './ActivityLogFilters'

export function ActivityLogView({
  brainStatus,
  activityLog,
  decisions,
  channels,
  onViewDecision,
  onViewChannel,
  onExport,
  onFilterByTimeRange,
  onFilterByType
}: ActivityLogViewProps) {
  const [selectedTimeRange, setSelectedTimeRange] = useState<'hour' | 'day' | 'week' | 'month'>('day')
  const [selectedTypes, setSelectedTypes] = useState<ActivityLogEntry['type'][]>([])

  const handleTimeRangeChange = (range: 'hour' | 'day' | 'week' | 'month') => {
    setSelectedTimeRange(range)
    onFilterByTimeRange?.(range)
  }

  const handleTypeFilterChange = (types: ActivityLogEntry['type'][]) => {
    setSelectedTypes(types)
    onFilterByType?.(types)
  }

  // Filter activity log based on selected filters
  const filteredLog = selectedTypes.length > 0
    ? activityLog.filter(entry => selectedTypes.includes(entry.type))
    : activityLog

  // Group by time periods
  const groupedLog = filteredLog.reduce((groups, entry) => {
    const date = new Date(entry.timestamp)
    const today = new Date()

    let label: string
    if (date.toDateString() === today.toDateString()) {
      label = 'Today'
    } else if (date.toDateString() === new Date(today.setDate(today.getDate() - 1)).toDateString()) {
      label = 'Yesterday'
    } else {
      label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    }

    if (!groups[label]) {
      groups[label] = []
    }
    groups[label].push(entry)
    return groups
  }, {} as Record<string, ActivityLogEntry[]>)

  const inProgressCount = activityLog.filter(e => e.status === 'in-progress').length
  const warningCount = activityLog.filter(e => e.status === 'warning').length

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold tracking-tight text-slate-50">
                  Activity Log
                </h1>
                <div className="flex items-center gap-2">
                  {/* Mode Badge */}
                  <span className={`
                    px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider
                    ${brainStatus.mode === 'training' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : ''}
                    ${brainStatus.mode === 'supervised' ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : ''}
                    ${brainStatus.mode === 'autonomous' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : ''}
                  `}>
                    {brainStatus.mode}
                  </span>

                  {/* Live Indicator */}
                  {inProgressCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                      <span className="text-xs font-semibold text-indigo-300">
                        {inProgressCount} Active
                      </span>
                    </div>
                  )}

                  {/* Warning Indicator */}
                  {warningCount > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span className="text-xs font-semibold text-amber-300">
                        {warningCount}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-slate-400">
                Real-time feed of Strategy Brain activity and processing tasks
              </p>
            </div>

            {/* Export Button */}
            <button
              onClick={() => onExport?.('json')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-slate-100 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export
            </button>
          </div>

          {/* Filters */}
          <ActivityLogFilters
            selectedTimeRange={selectedTimeRange}
            selectedTypes={selectedTypes}
            onTimeRangeChange={handleTimeRangeChange}
            onTypeFilterChange={handleTypeFilterChange}
          />
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="px-6 py-6">
        <div className="max-w-5xl">
          {Object.entries(groupedLog).map(([dateLabel, entries]) => (
            <div key={dateLabel} className="mb-8">
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4 sticky top-[140px] z-[5] bg-slate-950/80 backdrop-blur-sm py-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-3">
                  {dateLabel}
                </span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
              </div>

              {/* Timeline Entries */}
              <div className="space-y-3">
                {entries.map((entry) => (
                  <ActivityLogEntryComponent
                    key={entry.id}
                    entry={entry}
                    decisions={decisions}
                    channels={channels}
                    onViewDecision={onViewDecision}
                    onViewChannel={onViewChannel}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredLog.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800 mb-4">
                <svg className="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-1">No activity in this time range</p>
              <p className="text-sm text-slate-500">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
