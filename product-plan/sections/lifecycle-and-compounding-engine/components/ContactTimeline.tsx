import type { ContactTimelineProps } from '../../../../product/sections/lifecycle-and-compounding-engine/types'

export function ContactTimeline({
  contact,
  transitions,
  healthScore,
  onBack,
  onTriggerAction,
  onEdit,
}: ContactTimelineProps) {
  const stageColors: Record<string, string> = {
    lead: 'indigo',
    'new-customer': 'emerald',
    active: 'lime',
    'at-risk': 'amber',
    dormant: 'orange',
    churned: 'red',
  }

  const stageColor = stageColors[contact.lifecycleStage] || 'slate'

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-emerald-950/20">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                >
                  ← Back
                </button>
              )}
              <div>
                <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {contact.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {contact.company} • {contact.email}
                </p>
              </div>
            </div>
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                Edit Contact
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Contact Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Lifecycle Stage Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3">
                Current Stage
              </h3>
              <div
                className={`px-4 py-3 rounded-lg bg-${stageColor}-100 dark:bg-${stageColor}-950 border border-${stageColor}-200 dark:border-${stageColor}-800`}
              >
                <span className={`text-lg font-semibold text-${stageColor}-900 dark:text-${stageColor}-100 capitalize`}>
                  {contact.lifecycleStage.replace('-', ' ')}
                </span>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                Key Metrics
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Lifetime Value</div>
                  <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(contact.lifetimeValue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Purchases</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contact.totalPurchases}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Avg Order Value</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatCurrency(contact.averageOrderValue)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Engagement Score</div>
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {contact.engagementScore}/100
                  </div>
                </div>
                {contact.npsScore !== null && (
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">NPS Score</div>
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                      {contact.npsScore}/10
                    </div>
                  </div>
                )}
                <div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Referrals Generated</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {contact.referralsGenerated}
                  </div>
                </div>
              </div>
            </div>

            {/* Health Score (if available) */}
            {healthScore && (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-4">
                  Health Score
                </h3>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                      {healthScore.overallScore}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">/100</span>
                  </div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full mt-2 ${
                      healthScore.riskLevel === 'healthy'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-100'
                        : healthScore.riskLevel === 'at-risk'
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100'
                        : 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-100'
                    }`}
                  >
                    {healthScore.riskLevel}
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase">
                    Recommended Actions
                  </h4>
                  {healthScore.recommendedActions.slice(0, 3).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => onTriggerAction?.(action)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      → {action}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6">
                Lifecycle Timeline
              </h2>

              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-emerald-300 to-slate-300 dark:from-indigo-700 dark:via-emerald-700 dark:to-slate-700" />

                {/* Timeline events */}
                <div className="space-y-6">
                  {transitions
                    .sort(
                      (a, b) =>
                        new Date(b.transitionDate).getTime() - new Date(a.transitionDate).getTime()
                    )
                    .map((transition) => {
                      const toColor = stageColors[transition.toStage] || 'slate'
                      return (
                        <div key={transition.id} className="relative pl-16">
                          {/* Timeline dot */}
                          <div
                            className={`absolute left-3.5 w-5 h-5 rounded-full bg-${toColor}-500 dark:bg-${toColor}-400 border-4 border-white dark:border-slate-900`}
                          />

                          {/* Event content */}
                          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className="font-medium text-slate-900 dark:text-slate-100">
                                  {transition.fromStage ? (
                                    <>
                                      Moved from{' '}
                                      <span className="capitalize">
                                        {transition.fromStage.replace('-', ' ')}
                                      </span>{' '}
                                      to{' '}
                                      <span className="capitalize">
                                        {transition.toStage.replace('-', ' ')}
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      First contact as{' '}
                                      <span className="capitalize">
                                        {transition.toStage.replace('-', ' ')}
                                      </span>
                                    </>
                                  )}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                  {formatDate(transition.transitionDate)}
                                  {transition.daysInPreviousStage !== null && (
                                    <span className="ml-2">
                                      • {transition.daysInPreviousStage} days in previous stage
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                            <div className="space-y-2 text-sm">
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">Trigger: </span>
                                <span className="text-slate-900 dark:text-slate-100">
                                  {transition.trigger}
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600 dark:text-slate-400">
                                  Automated Action:{' '}
                                </span>
                                <span className="text-slate-900 dark:text-slate-100">
                                  {transition.automatedAction}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
