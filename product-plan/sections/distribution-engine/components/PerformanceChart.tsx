import type { PerformanceDataPoint } from '@/../product/sections/distribution-engine/types'

interface PerformanceChartProps {
  data: PerformanceDataPoint[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  // Calculate scales for visualization
  const maxLtgpCac = Math.max(...data.map(d => d.ltgpCacRatio))
  const minLtgpCac = Math.min(...data.map(d => d.ltgpCacRatio))
  const maxSpend = Math.max(...data.map(d => d.totalSpend))
  const maxLeads = Math.max(...data.map(d => d.totalLeads))

  // Take every 3rd point for x-axis labels to avoid crowding
  const labelIndices = data.map((_, i) => i).filter((_, i) => i % 3 === 0)

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Calculate point positions
  const getPointY = (value: number, max: number, min: number) => {
    const range = max - min
    const normalized = range > 0 ? (value - min) / range : 0.5
    return 100 - normalized * 80 // 80% of height, leaving margins
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500 dark:bg-indigo-500" />
          <span className="text-slate-400">LTGP:CAC Ratio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-emerald-500 dark:bg-emerald-500" />
          <span className="text-slate-400">Total Spend</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-500 dark:bg-slate-500" />
          <span className="text-slate-400">Total Leads</span>
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-64 w-full">
        {/* Y-axis grid lines */}
        <div className="absolute inset-0">
          {[0, 25, 50, 75, 100].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-slate-800/50 dark:border-slate-800/50"
              style={{ top: `${percent}%` }}
            />
          ))}
        </div>

        {/* SVG for data lines */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {/* LTGP:CAC line */}
          <polyline
            points={data
              .map((point, i) => {
                const x = (i / (data.length - 1)) * 100
                const y = getPointY(point.ltgpCacRatio, maxLtgpCac, minLtgpCac)
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-lg"
          />

          {/* Spend line */}
          <polyline
            points={data
              .map((point, i) => {
                const x = (i / (data.length - 1)) * 100
                const y = getPointY(point.totalSpend, maxSpend, 0)
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke="rgb(16, 185, 129)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            opacity="0.6"
          />

          {/* Data points for LTGP:CAC */}
          {data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100
            const y = getPointY(point.ltgpCacRatio, maxLtgpCac, minLtgpCac)
            return (
              <circle
                key={`ltgp-${i}`}
                cx={`${x}%`}
                cy={`${y}%`}
                r="3"
                fill="rgb(99, 102, 241)"
                className="transition-all hover:r-5"
              />
            )
          })}
        </svg>

        {/* Hover tooltips layer */}
        <div className="absolute inset-0 flex">
          {data.map((point, i) => {
            const x = (i / (data.length - 1)) * 100
            return (
              <div
                key={i}
                className="group relative flex-1"
                style={{ left: `${x}%` }}
              >
                <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-slate-700/0 transition-all group-hover:bg-slate-700/50 dark:group-hover:bg-slate-700/50" />
                <div className="absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-900">
                  <div className="whitespace-nowrap text-xs">
                    <p className="mb-2 font-medium text-white">{formatDate(point.date)}</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500" />
                        <span className="text-slate-400">LTGP:CAC:</span>
                        <span className="font-mono font-semibold text-white">
                          {point.ltgpCacRatio.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500" />
                        <span className="text-slate-400">Spend:</span>
                        <span className="font-mono font-semibold text-white">
                          ${(point.totalSpend / 1000).toFixed(1)}K
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-slate-500" />
                        <span className="text-slate-400">Leads:</span>
                        <span className="font-mono font-semibold text-white">
                          {point.totalLeads.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="relative mt-4 flex justify-between text-xs text-slate-500">
        {labelIndices.map((index) => (
          <span key={index}>{formatDate(data[index].date)}</span>
        ))}
      </div>

      {/* Summary stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500">Avg LTGP:CAC</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {(data.reduce((sum, d) => sum + d.ltgpCacRatio, 0) / data.length).toFixed(1)}
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Spend</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            ${(data[data.length - 1].totalSpend / 1000).toFixed(1)}K
          </p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Leads</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {data[data.length - 1].totalLeads.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}
