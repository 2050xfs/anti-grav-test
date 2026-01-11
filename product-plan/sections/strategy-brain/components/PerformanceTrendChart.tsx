import type { ChannelPerformanceDataPoint } from '@/../product/sections/strategy-brain/types'

interface PerformanceTrendChartProps {
  data: ChannelPerformanceDataPoint[]
}

export function PerformanceTrendChart({ data }: PerformanceTrendChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        No performance data available
      </div>
    )
  }

  // Chart dimensions
  const width = 800
  const height = 300
  const padding = { top: 20, right: 40, bottom: 40, left: 60 }
  const chartWidth = width - padding.left - padding.right
  const chartHeight = height - padding.top - padding.bottom

  // Calculate scales
  const ltgpValues = data.map(d => d.ltgpCacRatio)
  const minLtgp = Math.min(...ltgpValues)
  const maxLtgp = Math.max(...ltgpValues)
  const ltgpRange = maxLtgp - minLtgp

  // Add 10% padding to y-axis
  const yMin = Math.max(0, minLtgp - ltgpRange * 0.1)
  const yMax = maxLtgp + ltgpRange * 0.1

  // Create points for the line
  const points = data.map((d, i) => {
    const x = padding.left + (i / (data.length - 1)) * chartWidth
    const y = padding.top + chartHeight - ((d.ltgpCacRatio - yMin) / (yMax - yMin)) * chartHeight
    return { x, y, data: d }
  })

  // Create path for the line
  const linePath = points.map((p, i) =>
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ')

  // Create area path
  const areaPath = `
    M ${points[0].x} ${padding.top + chartHeight}
    ${points.map(p => `L ${p.x} ${p.y}`).join(' ')}
    L ${points[points.length - 1].x} ${padding.top + chartHeight}
    Z
  `

  // Y-axis labels
  const yAxisLabels = [yMin, (yMin + yMax) / 2, yMax].map(value => ({
    value,
    y: padding.top + chartHeight - ((value - yMin) / (yMax - yMin)) * chartHeight
  }))

  // X-axis labels (show every 3rd date)
  const xAxisLabels = data
    .filter((_, i) => i % 3 === 0 || i === data.length - 1)
    .map((d, i, arr) => {
      const originalIndex = data.indexOf(d)
      const x = padding.left + (originalIndex / (data.length - 1)) * chartWidth
      return {
        label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        x
      }
    })

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* Grid lines */}
        {yAxisLabels.map((label, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={label.y}
            x2={width - padding.right}
            y2={label.y}
            stroke="rgb(51 65 85)"
            strokeWidth="1"
            strokeDasharray="4 4"
            opacity="0.3"
          />
        ))}

        {/* Area fill */}
        <path
          d={areaPath}
          fill="url(#areaGradient)"
          opacity="0.2"
        />

        {/* Line */}
        <path
          d={linePath}
          stroke="rgb(99 102 241)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, i) => (
          <g key={i}>
            <circle
              cx={point.x}
              cy={point.y}
              r="5"
              fill="rgb(99 102 241)"
              stroke="rgb(15 23 42)"
              strokeWidth="2"
              className="hover:r-7 transition-all cursor-pointer"
            />
          </g>
        ))}

        {/* Y-axis labels */}
        {yAxisLabels.map((label, i) => (
          <text
            key={i}
            x={padding.left - 12}
            y={label.y}
            textAnchor="end"
            dominantBaseline="middle"
            fill="rgb(148 163 184)"
            fontSize="12"
            fontFamily="monospace"
          >
            {label.value.toFixed(1)}
          </text>
        ))}

        {/* X-axis labels */}
        {xAxisLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - padding.bottom + 20}
            textAnchor="middle"
            fill="rgb(148 163 184)"
            fontSize="12"
          >
            {label.label}
          </text>
        ))}

        {/* Y-axis title */}
        <text
          x={20}
          y={padding.top + chartHeight / 2}
          textAnchor="middle"
          fill="rgb(148 163 184)"
          fontSize="12"
          transform={`rotate(-90, 20, ${padding.top + chartHeight / 2})`}
        >
          LTGP:CAC Ratio
        </text>

        {/* Gradient definition */}
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(99 102 241)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(99 102 241)" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500" />
          <span>LTGP:CAC Ratio</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Current:</span>
          <span className="font-semibold text-slate-200">
            {data[data.length - 1].ltgpCacRatio.toFixed(1)}:1
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">15-day avg:</span>
          <span className="font-semibold text-slate-200">
            {(data.reduce((sum, d) => sum + d.ltgpCacRatio, 0) / data.length).toFixed(1)}:1
          </span>
        </div>
      </div>
    </div>
  )
}
