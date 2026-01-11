import type { ActivityLogEntry } from '@/../product/sections/strategy-brain/types'

interface ActivityLogFiltersProps {
  selectedTimeRange: 'hour' | 'day' | 'week' | 'month'
  selectedTypes: ActivityLogEntry['type'][]
  onTimeRangeChange: (range: 'hour' | 'day' | 'week' | 'month') => void
  onTypeFilterChange: (types: ActivityLogEntry['type'][]) => void
}

export function ActivityLogFilters({
  selectedTimeRange,
  selectedTypes,
  onTimeRangeChange,
  onTypeFilterChange
}: ActivityLogFiltersProps) {
  const timeRanges: Array<{ value: 'hour' | 'day' | 'week' | 'month'; label: string }> = [
    { value: 'hour', label: 'Last Hour' },
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ]

  const activityTypes: Array<{ value: ActivityLogEntry['type']; label: string; color: string }> = [
    { value: 'signal-detection', label: 'Signals', color: 'indigo' },
    { value: 'analysis', label: 'Analysis', color: 'violet' },
    { value: 'decision-execution', label: 'Execution', color: 'emerald' },
    { value: 'constraint-detection', label: 'Constraints', color: 'amber' },
    { value: 'metric-calculation', label: 'Metrics', color: 'blue' },
    { value: 'insight-application', label: 'Insights', color: 'cyan' },
    { value: 'mode-change', label: 'Mode', color: 'slate' },
    { value: 'escalation', label: 'Escalations', color: 'red' }
  ]

  const toggleType = (type: ActivityLogEntry['type']) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    onTypeFilterChange(newTypes)
  }

  return (
    <div className="space-y-3">
      {/* Time Range Filter */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[80px]">
          Time Range
        </span>
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((range) => (
            <button
              key={range.value}
              onClick={() => onTimeRangeChange(range.value)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${selectedTimeRange === range.value
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                }
              `}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Type Filter */}
      <div className="flex items-start gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 min-w-[80px] pt-1.5">
          Activity
        </span>
        <div className="flex flex-wrap gap-2">
          {activityTypes.map((type) => {
            const isSelected = selectedTypes.includes(type.value)
            const colorClasses = {
              indigo: isSelected ? 'bg-indigo-500 text-white border-indigo-500' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20',
              violet: isSelected ? 'bg-violet-500 text-white border-violet-500' : 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20',
              emerald: isSelected ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
              amber: isSelected ? 'bg-amber-500 text-white border-amber-500' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
              blue: isSelected ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
              cyan: isSelected ? 'bg-cyan-500 text-white border-cyan-500' : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20',
              slate: isSelected ? 'bg-slate-500 text-white border-slate-500' : 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20',
              red: isSelected ? 'bg-red-500 text-white border-red-500' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
            }

            return (
              <button
                key={type.value}
                onClick={() => toggleType(type.value)}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all border
                  ${colorClasses[type.color as keyof typeof colorClasses]}
                  ${isSelected ? 'shadow-lg' : ''}
                `}
              >
                {type.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Clear Filters */}
      {selectedTypes.length > 0 && (
        <div className="flex items-center gap-2">
          <div className="min-w-[80px]" />
          <button
            onClick={() => onTypeFilterChange([])}
            className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  )
}
