import type { LeadGetter, Campaign } from '@/../product/sections/distribution-engine/types'

interface LeadGetterCardProps {
  leadGetter: LeadGetter
  campaigns: Campaign[]
}

const statusConfig = {
  active: { color: 'emerald', label: 'Active' },
  paused: { color: 'slate', label: 'Paused' },
  optimizing: { color: 'indigo', label: 'Optimizing' },
  error: { color: 'red', label: 'Error' }
} as const

export function LeadGetterCard({ leadGetter, campaigns }: LeadGetterCardProps) {
  const status = statusConfig[leadGetter.status]

  // Format metrics based on lead getter type
  const getMetricDisplay = () => {
    const { metrics } = leadGetter

    if (metrics.referralRate !== undefined) {
      return (
        <>
          <div>
            <p className="text-xs text-slate-500">Referral Rate</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.referralRate.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">New Referrals</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.newReferrals}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Conversions</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.conversions}
            </p>
          </div>
        </>
      )
    }

    if (metrics.activeEmployees !== undefined) {
      return (
        <>
          <div>
            <p className="text-xs text-slate-500">Active</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.activeEmployees}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Leads</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.leads}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg ROI</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              ${(metrics.avgRoiPerEmployee! / 1000).toFixed(1)}K
            </p>
          </div>
        </>
      )
    }

    if (metrics.activeAgencies !== undefined) {
      return (
        <>
          <div>
            <p className="text-xs text-slate-500">Active</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.activeAgencies}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Monthly Spend</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              ${(metrics.monthlySpend! / 1000).toFixed(1)}K
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Conversions</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.conversions}
            </p>
          </div>
        </>
      )
    }

    if (metrics.activeAffiliates !== undefined) {
      return (
        <>
          <div>
            <p className="text-xs text-slate-500">Active</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.activeAffiliates}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Leads</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              {metrics.leads}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500">Avg Commission</p>
            <p className="mt-0.5 font-mono text-base font-bold text-white">
              ${metrics.avgCommissionPerSale}
            </p>
          </div>
        </>
      )
    }

    return null
  }

  return (
    <div className="group relative overflow-hidden rounded-lg border border-slate-800/50 bg-slate-900/30 p-4 backdrop-blur transition-all hover:border-slate-700/50 dark:border-slate-800/50 dark:bg-slate-900/30 dark:hover:border-slate-700/50">
      {/* Status indicator */}
      <div className={`absolute left-0 top-0 h-full w-0.5 bg-${status.color}-500/50 dark:bg-${status.color}-500/50`} />

      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">{leadGetter.name}</h3>
            <span className={`rounded-full bg-${status.color}-500/10 px-2 py-0.5 text-xs font-medium text-${status.color}-400 dark:bg-${status.color}-500/10 dark:text-${status.color}-400`}>
              {status.label}
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">{leadGetter.description}</p>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        {getMetricDisplay()}
      </div>

      {/* Footer */}
      {leadGetter.activeCampaigns > 0 && (
        <div className="mt-3 flex items-center gap-1 border-t border-slate-800/50 pt-3 text-xs text-slate-500 dark:border-slate-800/50">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          {leadGetter.activeCampaigns} {leadGetter.activeCampaigns === 1 ? 'campaign' : 'campaigns'}
        </div>
      )}
    </div>
  )
}
