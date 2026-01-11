import type { PerformanceDataPoint } from '@/../product/sections/distribution-engine/types'

interface ChannelPerformanceChartProps {
  data: PerformanceDataPoint[]
  channelName: string
}

export function ChannelPerformanceChart({ data, channelName }: ChannelPerformanceChartProps) {
  // Use last 14 days for channel-specific view
  const recentData = data.slice(-14)

  // Calculate scales
  const maxLtgpCac = Math.max(...recentData.map(d => d.ltgpCacRatio))
  const minLtgpCac = Math.min(...recentData.map(d => d.ltgpCacRatio))
  const maxLeads = Math.max(...recentData.map(d => d.totalLeads))

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // Calculate point Y position
  const getPointY = (value: number, max: number, min: number) => {
    const range = max - min
    const normalized = range > 0 ? (value - min) / range : 0.5
    return 100 - normalized * 80
  }

  // Take every 2nd point for labels
  const labelIndices = recentData.map((_, i) => i).filter((_, i) => i % 2 === 0)

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      {/* Legend */}
      <div className="mb-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-indigo-500 dark:bg-indigo-500" />
          <span className="text-slate-400">LTGP:CAC Ratio</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-slate-500 dark:bg-slate-500" />
          <span className="text-slate-400">Leads</span>
        </div>
        <div className="ml-auto text-xs text-slate-500">
          Last 14 days
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-72 w-full">
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

        {/* Threshold line (LTGP:CAC = 5.0) */}
        <div
          className="absolute w-full border-t-2 border-dashed border-emerald-500/30 dark:border-emerald-500/30"
          style={{ top: `${getPointY(5.0, maxLtgpCac, minLtgpCac)}%` }}
        />
        <div
          className="absolute text-xs font-medium text-emerald-400"
          style={{ top: `${getPointY(5.0, maxLtgpCac, minLtgpCac) - 6}%`, right: '8px' }}
        >
          Target: 5.0
        </div>

        {/* SVG for data lines */}
        <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
          {/* Area fill under LTGP:CAC line */}
          <defs>
            <linearGradient id="ltgpGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
            </linearGradient>
          </defs>

          <polygon
            points={
              recentData
                .map((point, i) => {
                  const x = (i / (recentData.length - 1)) * 100
                  const y = getPointY(point.ltgpCacRatio, maxLtgpCac, minLtgpCac)
                  return `${x},${y}`
                })
                .join(' ') +
              ` 100,100 0,100`
            }
            fill="url(#ltgpGradient)"
          />

          {/* LTGP:CAC line */}
          <polyline
            points={recentData
              .map((point, i) => {
                const x = (i / (recentData.length - 1)) * 100
                const y = getPointY(point.ltgpCacRatio, maxLtgpCac, minLtgpCac)
                return `${x},${y}`
              })
              .join(' ')}
            fill="none"
            stroke="rgb(99, 102, 241)"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
            className="drop-shadow-lg"
          />

          {/* Data points */}
          {recentData.map((point, i) => {
            const x = (i / (recentData.length - 1)) * 100
            const y = getPointY(point.ltgpCacRatio, maxLtgpCac, minLtgpCac)
            return (
              <circle
                key={`ltgp-${i}`}
                cx={`${x}%`}
                cy={`${y}%`}
                r="4"
                fill="rgb(99, 102, 241)"
                stroke="rgb(30, 41, 59)"
                strokeWidth="2"
              />
            )
          })}
        </svg>

        {/* Hover tooltips */}
        <div className="absolute inset-0 flex">
          {recentData.map((point, i) => {
            const x = (i / (recentData.length - 1)) * 100
            return (
              <div
                key={i}
                className="group relative flex-1"
                style={{ left: `${x}%` }}
              >
                <div className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-slate-700/0 transition-all group-hover:bg-slate-700/50 dark:group-hover:bg-slate-700/50" />
                <div className="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-900 p-3 shadow-xl group-hover:block dark:border-slate-700 dark:bg-slate-900">
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
          <span key={index}>{formatDate(recentData[index].date)}</span>
        ))}
      </div>

      {/* Stats summary */}
      <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-800 pt-4 dark:border-slate-800">
        <div>
          <p className="text-xs text-slate-500">14-day Avg</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {(recentData.reduce((sum, d) => sum + d.ltgpCacRatio, 0) / recentData.length).toFixed(1)}
          </p>
          <p className="text-xs text-slate-500">LTGP:CAC</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Peak Ratio</p>
          <p className="mt-1 font-mono text-lg font-bold text-emerald-400">
            {maxLtgpCac.toFixed(1)}
          </p>
          <p className="text-xs text-slate-500">Best day</p>
        </div>
        <div>
          <p className="text-xs text-slate-500">Trend</p>
          <p className="mt-1 font-mono text-lg font-bold text-white">
            {recentData[recentData.length - 1].ltgpCacRatio > recentData[0].ltgpCacRatio ? '↑' : '↓'}{' '}
            {Math.abs(
              ((recentData[recentData.length - 1].ltgpCacRatio - recentData[0].ltgpCacRatio) /
                recentData[0].ltgpCacRatio) *
                100
            ).toFixed(0)}
            %
          </p>
          <p className="text-xs text-slate-500">vs start</p>
        </div>
      </div>
    </div>
  )
}
