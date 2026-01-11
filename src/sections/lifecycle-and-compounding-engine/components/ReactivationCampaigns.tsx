import type { ReactivationCampaignsProps } from '../../../../product/sections/lifecycle-and-compounding-engine/types'

export function ReactivationCampaigns({
  campaigns,
  onViewCampaign,
  onCreateCampaign,
  onEditCampaign,
  onToggleStatus,
  onViewEnrolled,
}: ReactivationCampaignsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'emerald'
      case 'paused':
        return 'amber'
      case 'completed':
        return 'slate'
      case 'draft':
        return 'indigo'
      default:
        return 'slate'
    }
  }

  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case 'at-risk':
        return 'amber'
      case 'dormant':
        return 'orange'
      case 'churned':
        return 'red'
      default:
        return 'slate'
    }
  }

  const totalEnrolled = campaigns.reduce((sum, c) => sum + c.enrolledContacts, 0)
  const avgReactivationRate =
    campaigns.length > 0
      ? Math.round(
          campaigns.reduce((sum, c) => sum + c.reactivationRate, 0) / campaigns.length
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/20 to-orange-50/20 dark:from-slate-950 dark:via-amber-950/20 dark:to-orange-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Reactivation Campaigns
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Automated win-back sequences for dormant and churned customers
            </p>
          </div>
          <button
            onClick={onCreateCampaign}
            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
          >
            + New Campaign
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Total Campaigns</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
              {campaigns.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Active Campaigns</div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {campaigns.filter((c) => c.status === 'active').length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Contacts Enrolled</div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {totalEnrolled}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Avg Reactivation</div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {avgReactivationRate}%
            </div>
          </div>
        </div>

        {/* Campaigns List */}
        <div className="space-y-4">
          {campaigns.map((campaign) => {
            const statusColor = getStatusColor(campaign.status)
            const segmentColor = getSegmentColor(campaign.targetSegment)

            return (
              <div
                key={campaign.id}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  {/* Campaign Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                          {campaign.name}
                        </h3>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-${statusColor}-100 dark:bg-${statusColor}-950 text-${statusColor}-900 dark:text-${statusColor}-100 capitalize`}
                        >
                          {campaign.status}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium bg-${segmentColor}-100 dark:bg-${segmentColor}-950 text-${segmentColor}-900 dark:text-${segmentColor}-100 capitalize`}
                        >
                          {campaign.targetSegment}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {campaign.triggerCondition}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEditCampaign?.(campaign.id)}
                        className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-medium transition-colors"
                      >
                        Edit
                      </button>
                      {campaign.status === 'active' ? (
                        <button
                          onClick={() => onToggleStatus?.(campaign.id, 'paused')}
                          className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-950 hover:bg-amber-200 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-100 text-sm font-medium transition-colors"
                        >
                          Pause
                        </button>
                      ) : campaign.status === 'paused' ? (
                        <button
                          onClick={() => onToggleStatus?.(campaign.id, 'active')}
                          className="px-4 py-2 rounded-lg bg-emerald-100 dark:bg-emerald-950 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-100 text-sm font-medium transition-colors"
                        >
                          Resume
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {/* Campaign Metrics */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {campaign.enrolledContacts}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Enrolled</div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {campaign.completionRate}%
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Completion
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {campaign.reactivationRate}%
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                        Reactivation
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {campaign.steps.length}
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mt-1">Steps</div>
                    </div>
                  </div>

                  {/* Campaign Steps */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-slate-600 dark:text-slate-400 uppercase">
                        Campaign Sequence
                      </h4>
                      <button
                        onClick={() => onViewCampaign?.(campaign.id)}
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                      >
                        View Full Details →
                      </button>
                    </div>

                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700" />

                      {/* Steps */}
                      <div className="space-y-3">
                        {campaign.steps.map((step) => {
                          const stepIcon = {
                            email: '📧',
                            wait: '⏱️',
                            survey: '📋',
                            call: '📞',
                            'internal-alert': '🔔',
                          }[step.type]

                          return (
                            <div key={step.stepNumber} className="relative pl-16">
                              {/* Step number circle */}
                              <div className="absolute left-3.5 w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400 text-white text-xs flex items-center justify-center font-bold">
                                {step.stepNumber}
                              </div>

                              {/* Step content */}
                              <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{stepIcon}</span>
                                  <div className="flex-1">
                                    <div className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                                      {step.subject}
                                    </div>
                                    <div className="text-xs text-slate-600 dark:text-slate-400">
                                      {step.type === 'wait' ? step.delay : `After ${step.delay}`}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => onViewEnrolled?.(campaign.id)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium"
                    >
                      View {campaign.enrolledContacts} enrolled contacts →
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
