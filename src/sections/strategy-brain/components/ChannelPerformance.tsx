import type { Channel } from '@/../product/sections/strategy-brain/types'
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle } from 'lucide-react'

interface ChannelPerformanceProps {
  channels: Channel[]
  onViewChannel?: (channelId: string) => void
}

const performanceIcons = {
  'outperforming': TrendingUp,
  'improving': TrendingUp,
  'on-target': CheckCircle,
  'declining': TrendingDown,
  'underperforming': AlertCircle,
}

const performanceColors = {
  'outperforming': 'text-emerald-600 dark:text-emerald-400',
  'improving': 'text-blue-600 dark:text-blue-400',
  'on-target': 'text-slate-600 dark:text-slate-400',
  'declining': 'text-amber-600 dark:text-amber-400',
  'underperforming': 'text-red-600 dark:text-red-400',
}

const healthColors = {
  excellent: 'bg-emerald-500',
  good: 'bg-blue-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
}

export function ChannelPerformance({ channels, onViewChannel }: ChannelPerformanceProps) {
  const totalBudget = channels.reduce((sum, ch) => sum + ch.dailyBudget, 0)

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Channel Performance
      </h3>

      {/* Budget Allocation Visualization */}
      <div className="mb-6">
        <div className="flex h-3 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-700 mb-2">
          {channels.map((channel, index) => {
            const percentage = (channel.dailyBudget / totalBudget) * 100
            const colors = [
              'bg-indigo-500',
              'bg-emerald-500',
              'bg-amber-500',
              'bg-blue-500',
            ]
            return (
              <div
                key={channel.id}
                className={colors[index % colors.length]}
                style={{ width: `${percentage}%` }}
                title={`${channel.name}: ${percentage.toFixed(1)}%`}
              />
            )
          })}
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Total Daily Budget: ${totalBudget.toLocaleString()}
        </p>
      </div>

      {/* Channel List */}
      <div className="space-y-3">
        {channels.map(channel => {
          const Icon = performanceIcons[channel.performance]
          const percentage = (channel.dailyBudget / totalBudget) * 100

          return (
            <button
              key={channel.id}
              onClick={() => onViewChannel?.(channel.id)}
              className="w-full text-left p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${healthColors[channel.healthStatus]}`} />
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {channel.name}
                  </span>
                  <Icon className={`w-4 h-4 ${performanceColors[channel.performance]}`} />
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {channel.ltgpCacRatio.toFixed(1)}:1
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    LTGP:CAC
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  ${channel.dailyBudget.toLocaleString()}/day ({percentage.toFixed(0)}%)
                </span>
                {channel.constraintStatus !== 'none' && (
                  <span className="text-amber-600 dark:text-amber-400 font-medium">
                    {channel.constraintStatus.replace(/-/g, ' ')}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
