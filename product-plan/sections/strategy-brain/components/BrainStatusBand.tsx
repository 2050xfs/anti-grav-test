import type { BrainStatus } from '@/../product/sections/strategy-brain/types'
import { Brain, Activity } from 'lucide-react'

interface BrainStatusBandProps {
  brainStatus: BrainStatus
  onViewActivityLog?: () => void
  onSwitchMode?: (mode: BrainStatus['mode']) => void
}

const modeLabels = {
  training: 'Training',
  supervised: 'Supervised',
  autonomous: 'Autonomous',
}

const modeColors = {
  training: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  supervised: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700',
  autonomous: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
}

const healthColors = {
  healthy: 'bg-emerald-500',
  warning: 'bg-amber-500',
  critical: 'bg-red-500',
}

export function BrainStatusBand({ brainStatus, onViewActivityLog, onSwitchMode }: BrainStatusBandProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between max-w-[1600px] mx-auto">
        {/* Brain Status */}
        <button
          onClick={onViewActivityLog}
          className="flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg px-4 py-2 transition-colors"
        >
          <div className="relative">
            <div className="p-3 rounded-xl bg-indigo-100 dark:bg-indigo-900/30">
              <Brain className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            {/* Health indicator dot */}
            <div className={`absolute -top-1 -right-1 w-3 h-3 ${healthColors[brainStatus.healthStatus]} rounded-full border-2 border-white dark:border-slate-800`} />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Strategy Brain
              </span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${modeColors[brainStatus.mode]}`}>
                {modeLabels[brainStatus.mode]}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span>{brainStatus.activeDecisionCount} active decisions</span>
              {brainStatus.approvalsRequired > 0 && (
                <span className="text-amber-600 dark:text-amber-400 font-medium">
                  {brainStatus.approvalsRequired} need approval
                </span>
              )}
              <span>{brainStatus.decisionsToday} decisions today</span>
            </div>
          </div>
        </button>

        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" />
          <select
            value={brainStatus.mode}
            onChange={(e) => onSwitchMode?.(e.target.value as BrainStatus['mode'])}
            className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="training">Training Mode</option>
            <option value="supervised">Supervised Mode</option>
            <option value="autonomous">Autonomous Mode</option>
          </select>
        </div>
      </div>
    </div>
  )
}
