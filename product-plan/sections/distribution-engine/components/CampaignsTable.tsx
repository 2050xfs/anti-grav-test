import type { Campaign } from '@/../product/sections/distribution-engine/types'

interface CampaignsTableProps {
  campaigns: Campaign[]
  onPause?: (campaignId: string) => void
  onResume?: (campaignId: string) => void
  onView?: (campaignId: string) => void
}

export function CampaignsTable({ campaigns, onPause, onResume, onView }: CampaignsTableProps) {
  // Format date/time
  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  const statusConfig = {
    active: { color: 'emerald', label: 'Active', bgClass: 'bg-emerald-500/10', textClass: 'text-emerald-400' },
    paused: { color: 'slate', label: 'Paused', bgClass: 'bg-slate-500/10', textClass: 'text-slate-400' },
    completed: { color: 'indigo', label: 'Completed', bgClass: 'bg-indigo-500/10', textClass: 'text-indigo-400' },
    error: { color: 'red', label: 'Error', bgClass: 'bg-red-500/10', textClass: 'text-red-400' }
  } as const

  if (campaigns.length === 0) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-12 text-center backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
        <svg className="mx-auto h-12 w-12 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p className="mt-4 text-sm text-slate-400">No campaigns in this channel yet</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur dark:border-slate-800 dark:bg-slate-900/50">
      {/* Desktop table view */}
      <div className="hidden sm:block">
        <table className="w-full">
          <thead className="border-b border-slate-800 bg-slate-900/80 dark:border-slate-800 dark:bg-slate-900/80">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                LTGP:CAC
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                Spend
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                Leads
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                Conv.
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                Last Activity
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 dark:divide-slate-800">
            {campaigns.map((campaign) => {
              const status = statusConfig[campaign.status]
              const isPaused = campaign.status === 'paused'
              const ltgpCac = campaign.metrics.ltgpCacRatio || 0
              const isUnderperforming = ltgpCac < 3.0 && ltgpCac > 0
              const isHighPerforming = ltgpCac >= 7.0

              return (
                <tr
                  key={campaign.id}
                  className="group transition-colors hover:bg-slate-800/30 dark:hover:bg-slate-800/30"
                >
                  <td className="px-4 py-4">
                    <div>
                      <p className="font-medium text-white">{campaign.name}</p>
                      <p className="mt-1 text-xs text-slate-500">{campaign.targetAudience}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full ${status.bgClass} px-2.5 py-1 text-xs font-medium ${status.textClass}`}>
                      <div className="h-1.5 w-1.5 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    {ltgpCac > 0 ? (
                      <span className={`font-mono font-semibold ${
                        isHighPerforming
                          ? 'text-emerald-400'
                          : isUnderperforming
                            ? 'text-amber-400'
                            : 'text-white'
                      }`}>
                        {ltgpCac.toFixed(1)}
                      </span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-white">
                      ${(campaign.metrics.spend / 1000).toFixed(1)}K
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-white">
                      {campaign.metrics.leads}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <span className="font-mono text-white">
                      {campaign.metrics.conversions}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-xs text-slate-400">
                      {formatDateTime(campaign.lastActivity)}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView?.(campaign.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label="View campaign"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => isPaused ? onResume?.(campaign.id) : onPause?.(campaign.id)}
                        className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
                        aria-label={isPaused ? 'Resume campaign' : 'Pause campaign'}
                      >
                        {isPaused ? (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="sm:hidden">
        {campaigns.map((campaign) => {
          const status = statusConfig[campaign.status]
          const isPaused = campaign.status === 'paused'
          const ltgpCac = campaign.metrics.ltgpCacRatio || 0

          return (
            <div
              key={campaign.id}
              className="border-b border-slate-800 p-4 last:border-b-0 dark:border-slate-800"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-white">{campaign.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{campaign.targetAudience}</p>
                </div>
                <span className={`ml-2 inline-flex items-center gap-1.5 rounded-full ${status.bgClass} px-2.5 py-1 text-xs font-medium ${status.textClass}`}>
                  {status.label}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <p className="text-xs text-slate-500">LTGP:CAC</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-white">
                    {ltgpCac > 0 ? ltgpCac.toFixed(1) : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Spend</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-white">
                    ${(campaign.metrics.spend / 1000).toFixed(1)}K
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Leads</p>
                  <p className="mt-0.5 font-mono text-sm font-semibold text-white">
                    {campaign.metrics.leads}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-800 pt-3 dark:border-slate-800">
                <span className="text-xs text-slate-400">
                  {formatDateTime(campaign.lastActivity)}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onView?.(campaign.id)}
                    className="text-xs font-medium text-indigo-400 dark:text-indigo-400"
                  >
                    View
                  </button>
                  <button
                    onClick={() => isPaused ? onResume?.(campaign.id) : onPause?.(campaign.id)}
                    className="text-xs font-medium text-slate-400"
                  >
                    {isPaused ? 'Resume' : 'Pause'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
