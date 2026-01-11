import type { HealthScoreDashboardProps } from '../../../../product/sections/lifecycle-and-compounding-engine/types'
import { useState } from 'react'

export function HealthScoreDashboard({
  healthScores,
  contacts,
  onViewDetails,
  onTakeAction,
  onFilterByRisk,
}: HealthScoreDashboardProps) {
  const [selectedRisk, setSelectedRisk] = useState<'all' | 'healthy' | 'at-risk' | 'critical'>('all')

  const filteredScores =
    selectedRisk === 'all'
      ? healthScores
      : healthScores.filter((score) => score.riskLevel === selectedRisk)

  const criticalCount = healthScores.filter((s) => s.riskLevel === 'critical').length
  const atRiskCount = healthScores.filter((s) => s.riskLevel === 'at-risk').length
  const healthyCount = healthScores.filter((s) => s.riskLevel === 'healthy').length
  const avgScore = Math.round(
    healthScores.reduce((sum, s) => sum + s.overallScore, 0) / healthScores.length
  )

  const getContact = (contactId: string) => contacts.find((c) => c.id === contactId)

  const handleFilterClick = (risk: 'healthy' | 'at-risk' | 'critical') => {
    setSelectedRisk(selectedRisk === risk ? 'all' : risk)
    onFilterByRisk?.(risk)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-rose-50/20 to-amber-50/20 dark:from-slate-950 dark:via-rose-950/20 dark:to-amber-950/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Customer Health Dashboard
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Monitor health scores and identify at-risk customers
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Average Score</div>
            <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Out of 100</div>
          </div>

          <button
            onClick={() => handleFilterClick('healthy')}
            className={`bg-white dark:bg-slate-900 rounded-xl p-6 border-2 transition-all text-left ${
              selectedRisk === 'healthy'
                ? 'border-emerald-500 dark:border-emerald-400 shadow-lg'
                : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700'
            }`}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Healthy</div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {healthyCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Low risk customers</div>
          </button>

          <button
            onClick={() => handleFilterClick('at-risk')}
            className={`bg-white dark:bg-slate-900 rounded-xl p-6 border-2 transition-all text-left ${
              selectedRisk === 'at-risk'
                ? 'border-amber-500 dark:border-amber-400 shadow-lg'
                : 'border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
            }`}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">At-Risk</div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {atRiskCount}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Need attention</div>
          </button>

          <button
            onClick={() => handleFilterClick('critical')}
            className={`bg-white dark:bg-slate-900 rounded-xl p-6 border-2 transition-all text-left ${
              selectedRisk === 'critical'
                ? 'border-red-500 dark:border-red-400 shadow-lg'
                : 'border-slate-200 dark:border-slate-800 hover:border-red-300 dark:hover:border-red-700'
            }`}
          >
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-2">Critical</div>
            <div className="text-3xl font-bold text-red-600 dark:text-red-400">{criticalCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-500 mt-1">Urgent action needed</div>
          </button>
        </div>

        {/* Health Score List */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
              Customer Health Scores
              {selectedRisk !== 'all' && (
                <span className="ml-2 text-sm font-normal text-slate-600 dark:text-slate-400">
                  • Filtered by {selectedRisk}
                </span>
              )}
            </h2>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {filteredScores
              .sort((a, b) => {
                // Sort by risk level priority (critical first) then by score
                const riskOrder = { critical: 0, 'at-risk': 1, healthy: 2 }
                const riskDiff = riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
                return riskDiff !== 0 ? riskDiff : a.overallScore - b.overallScore
              })
              .map((score) => {
                const contact = getContact(score.contactId)
                if (!contact) return null

                const riskColor =
                  score.riskLevel === 'critical'
                    ? 'red'
                    : score.riskLevel === 'at-risk'
                    ? 'amber'
                    : 'emerald'

                return (
                  <div
                    key={score.contactId}
                    className="p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-start gap-6">
                      {/* Health Score Circle */}
                      <div className="shrink-0">
                        <div
                          className={`w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-${riskColor}-100 to-${riskColor}-200 dark:from-${riskColor}-950 dark:to-${riskColor}-900 border-4 border-${riskColor}-500 dark:border-${riskColor}-400`}
                        >
                          <span className={`text-2xl font-bold text-${riskColor}-900 dark:text-${riskColor}-100`}>
                            {score.overallScore}
                          </span>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                              {contact.name}
                            </h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {contact.company} • {contact.email}
                            </p>
                            <div
                              className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 bg-${riskColor}-100 dark:bg-${riskColor}-950 text-${riskColor}-900 dark:text-${riskColor}-100 capitalize`}
                            >
                              {score.riskLevel}
                            </div>
                          </div>
                          <button
                            onClick={() => onViewDetails?.(score.contactId)}
                            className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium"
                          >
                            View Details →
                          </button>
                        </div>

                        {/* Health Factors */}
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                          <div className="text-sm">
                            <div className="text-slate-600 dark:text-slate-400 text-xs mb-1">
                              Engagement
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {score.factors.engagementTrend}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-slate-600 dark:text-slate-400 text-xs mb-1">
                              Purchase Freq
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {score.factors.purchaseFrequency}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-slate-600 dark:text-slate-400 text-xs mb-1">
                              Usage
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {score.factors.productUsage}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-slate-600 dark:text-slate-400 text-xs mb-1">
                              Support
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {score.factors.supportSatisfaction}
                            </div>
                          </div>
                          <div className="text-sm">
                            <div className="text-slate-600 dark:text-slate-400 text-xs mb-1">
                              Payment
                            </div>
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {score.factors.paymentHistory}
                            </div>
                          </div>
                        </div>

                        {/* Recommended Actions */}
                        {score.recommendedActions.length > 0 && (
                          <div>
                            <div className="text-xs font-medium text-slate-600 dark:text-slate-400 uppercase mb-2">
                              Recommended Actions
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {score.recommendedActions.map((action, index) => (
                                <button
                                  key={index}
                                  onClick={() => onTakeAction?.(score.contactId, action)}
                                  className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 hover:bg-indigo-100 dark:hover:bg-indigo-900 border border-indigo-200 dark:border-indigo-800 text-xs text-indigo-900 dark:text-indigo-100 font-medium transition-colors"
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Churn Probability (if high risk) */}
                        {score.predictedChurnProbability > 0.3 && (
                          <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900">
                            <div className="flex items-center gap-2">
                              <span className="text-red-900 dark:text-red-100 text-sm font-medium">
                                ⚠️ Churn Risk:
                              </span>
                              <span className="text-red-700 dark:text-red-300 text-sm font-bold">
                                {Math.round(score.predictedChurnProbability * 100)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </div>
    </div>
  )
}
