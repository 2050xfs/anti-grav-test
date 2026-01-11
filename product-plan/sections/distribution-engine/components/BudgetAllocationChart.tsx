import type { Channel, LeadGetter } from '@/../product/sections/distribution-engine/types'

interface BudgetAllocationChartProps {
  channels: Channel[]
  leadGetters: LeadGetter[]
}

export function BudgetAllocationChart({ channels, leadGetters }: BudgetAllocationChartProps) {
  // Calculate total spend and allocations
  const channelAllocations = channels.map(ch => ({
    id: ch.id,
    name: ch.name,
    spend: ch.metrics.spend,
    allocated: ch.budget.allocated,
    color: getChannelColor(ch.name)
  }))

  const totalSpend = channelAllocations.reduce((sum, ch) => sum + ch.spend, 0)
  const totalAllocated = channelAllocations.reduce((sum, ch) => sum + ch.allocated, 0)

  // Calculate percentages and cumulative angles for donut chart
  const allocationsWithAngles = channelAllocations.map((ch, index) => {
    const percentage = (ch.spend / totalSpend) * 100
    const startAngle = channelAllocations
      .slice(0, index)
      .reduce((sum, prev) => sum + (prev.spend / totalSpend) * 360, 0)
    const endAngle = startAngle + (ch.spend / totalSpend) * 360

    return {
      ...ch,
      percentage,
      startAngle,
      endAngle
    }
  })

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Budget Allocation</h3>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-medium text-slate-400 dark:bg-slate-800">
          Core Four Only
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Donut Chart */}
        <div className="flex items-center justify-center">
          <div className="relative" style={{ width: '240px', height: '240px' }}>
            {/* SVG Donut Chart */}
            <svg width="240" height="240" viewBox="0 0 240 240" className="transform -rotate-90">
              {allocationsWithAngles.map((allocation) => {
                const radius = 90
                const innerRadius = 60
                const centerX = 120
                const centerY = 120

                // Convert angles to radians
                const startRad = (allocation.startAngle * Math.PI) / 180
                const endRad = (allocation.endAngle * Math.PI) / 180

                // Calculate arc path
                const x1 = centerX + radius * Math.cos(startRad)
                const y1 = centerY + radius * Math.sin(startRad)
                const x2 = centerX + radius * Math.cos(endRad)
                const y2 = centerY + radius * Math.sin(endRad)
                const x3 = centerX + innerRadius * Math.cos(endRad)
                const y3 = centerY + innerRadius * Math.sin(endRad)
                const x4 = centerX + innerRadius * Math.cos(startRad)
                const y4 = centerY + innerRadius * Math.sin(startRad)

                const largeArcFlag = allocation.endAngle - allocation.startAngle > 180 ? 1 : 0

                const pathData = [
                  `M ${x1} ${y1}`,
                  `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                  `L ${x3} ${y3}`,
                  `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
                  'Z'
                ].join(' ')

                return (
                  <path
                    key={allocation.id}
                    d={pathData}
                    fill={allocation.color}
                    className="transition-opacity hover:opacity-80"
                  />
                )
              })}
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                Total Spend
              </p>
              <p className="mt-1 font-mono text-2xl font-bold text-white">
                ${(totalSpend / 1000).toFixed(0)}K
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                of ${(totalAllocated / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>

        {/* Legend and Details */}
        <div className="flex flex-col justify-center">
          <div className="space-y-3">
            {allocationsWithAngles.map((allocation) => (
              <div
                key={allocation.id}
                className="group flex items-center justify-between rounded-lg border border-slate-800/50 bg-slate-900/30 p-3 transition-colors hover:border-slate-700/50 hover:bg-slate-800/30 dark:border-slate-800/50 dark:bg-slate-900/30 dark:hover:border-slate-700/50 dark:hover:bg-slate-800/30"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: allocation.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-white">{allocation.name}</p>
                    <p className="text-xs text-slate-500">
                      {allocation.percentage.toFixed(1)}% of spend
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-sm font-semibold text-white">
                    ${(allocation.spend / 1000).toFixed(1)}K
                  </p>
                  <p className="text-xs text-slate-500">
                    ${(allocation.allocated / 1000).toFixed(0)}K allocated
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Summary stats */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-800 pt-4 dark:border-slate-800">
            <div className="rounded-lg bg-slate-800/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500">Utilization</p>
              <p className="mt-1 font-mono text-lg font-bold text-white">
                {((totalSpend / totalAllocated) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="rounded-lg bg-slate-800/50 p-3 dark:bg-slate-800/50">
              <p className="text-xs text-slate-500">Remaining</p>
              <p className="mt-1 font-mono text-lg font-bold text-white">
                ${((totalAllocated - totalSpend) / 1000).toFixed(0)}K
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Distribution bar */}
      <div className="mt-6">
        <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
          <span>Spend Distribution</span>
          <span>{((totalSpend / totalAllocated) * 100).toFixed(0)}% utilized</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full bg-slate-800 dark:bg-slate-800">
          {allocationsWithAngles.map((allocation) => (
            <div
              key={allocation.id}
              className="group relative transition-all hover:opacity-80"
              style={{
                width: `${allocation.percentage}%`,
                backgroundColor: allocation.color
              }}
            >
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 group-hover:block">
                <div className="whitespace-nowrap rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs shadow-xl dark:border-slate-700 dark:bg-slate-900">
                  <p className="font-medium text-white">{allocation.name}</p>
                  <p className="mt-0.5 text-slate-400">
                    ${(allocation.spend / 1000).toFixed(1)}K ({allocation.percentage.toFixed(1)}%)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper function to assign colors to channels
function getChannelColor(channelName: string): string {
  const colorMap: Record<string, string> = {
    'Warm Outreach': '#8b5cf6', // purple
    'Cold Outreach': '#3b82f6', // blue
    'Content': '#10b981', // emerald
    'Paid Ads': '#f59e0b' // amber
  }

  return colorMap[channelName] || '#64748b' // default slate
}
