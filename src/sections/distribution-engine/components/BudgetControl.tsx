import { useState } from 'react'

interface BudgetControlProps {
  currentBudget: number
  onAdjust: (newBudget: number) => void
  onCancel: () => void
}

export function BudgetControl({ currentBudget, onAdjust, onCancel }: BudgetControlProps) {
  const [budget, setBudget] = useState(currentBudget)
  const minBudget = 1000
  const maxBudget = 100000
  const step = 1000

  const percentageChange = ((budget - currentBudget) / currentBudget) * 100
  const isIncrease = budget > currentBudget
  const isDecrease = budget < currentBudget

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/80 p-6 backdrop-blur-xl dark:border-slate-700 dark:bg-slate-800/80">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Adjust Budget Allocation</h3>
          <p className="mt-1 text-sm text-slate-400">
            Set the monthly budget for this channel
          </p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white dark:hover:bg-slate-700 dark:hover:text-white"
          aria-label="Close budget control"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Current vs New Budget */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            Current Budget
          </p>
          <p className="mt-2 font-mono text-2xl font-bold text-slate-300">
            ${(currentBudget / 1000).toFixed(0)}K
          </p>
        </div>
        <div className={`rounded-lg border p-4 ${
          isIncrease
            ? 'border-emerald-500/30 bg-emerald-500/10'
            : isDecrease
              ? 'border-amber-500/30 bg-amber-500/10'
              : 'border-slate-700 bg-slate-900/50'
        }`}>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            New Budget
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <p className={`font-mono text-2xl font-bold ${
              isIncrease
                ? 'text-emerald-400'
                : isDecrease
                  ? 'text-amber-400'
                  : 'text-white'
            }`}>
              ${(budget / 1000).toFixed(0)}K
            </p>
            {percentageChange !== 0 && (
              <span className={`text-sm font-medium ${
                isIncrease ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {isIncrease ? '+' : ''}{percentageChange.toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <label htmlFor="budget-slider" className="text-sm font-medium text-slate-300">
            Budget Amount
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(Math.max(minBudget, Math.min(maxBudget, Number(e.target.value))))}
            className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1 text-right font-mono text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
          />
        </div>

        <input
          id="budget-slider"
          type="range"
          min={minBudget}
          max={maxBudget}
          step={step}
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-700 dark:bg-slate-700 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-indigo-400 [&::-webkit-slider-thumb]:active:scale-110 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-indigo-500 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:bg-indigo-400 [&::-moz-range-thumb]:active:scale-110"
        />

        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>${(minBudget / 1000).toFixed(0)}K</span>
          <span>${(maxBudget / 1000).toFixed(0)}K</span>
        </div>
      </div>

      {/* Quick presets */}
      <div className="mb-6">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-400">
          Quick Presets
        </p>
        <div className="grid grid-cols-5 gap-2">
          {[5000, 10000, 20000, 50000, 75000].map((preset) => (
            <button
              key={preset}
              onClick={() => setBudget(preset)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                budget === preset
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 dark:border-indigo-500 dark:bg-indigo-500/20 dark:text-indigo-400'
                  : 'border-slate-700 bg-slate-900/50 text-slate-400 hover:border-slate-600 hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:border-slate-600 dark:hover:bg-slate-800'
              }`}
            >
              ${(preset / 1000).toFixed(0)}K
            </button>
          ))}
        </div>
      </div>

      {/* Impact estimate */}
      <div className="mb-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
        <div className="flex items-start gap-3">
          <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-indigo-300">Estimated Impact</p>
            <p className="mt-1 text-xs leading-relaxed text-indigo-200/80">
              {isIncrease
                ? `Increasing budget by ${Math.abs(percentageChange).toFixed(0)}% may generate approximately ${Math.floor((budget - currentBudget) / 50)} additional leads based on current LTGP:CAC performance.`
                : isDecrease
                  ? `Decreasing budget by ${Math.abs(percentageChange).toFixed(0)}% will reduce lead generation capacity. Consider reallocating to higher-performing channels.`
                  : 'Adjust the budget above to see estimated impact.'}
            </p>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center justify-end gap-3">
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          onClick={() => onAdjust(budget)}
          disabled={budget === currentBudget}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-indigo-600 disabled:hover:shadow-indigo-500/20 dark:bg-indigo-600 dark:hover:bg-indigo-500"
        >
          Apply Changes
        </button>
      </div>
    </div>
  )
}
