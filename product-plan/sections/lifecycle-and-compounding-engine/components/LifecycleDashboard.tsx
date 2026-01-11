'use client'

import { useState } from 'react'
import type { LifecycleDashboardProps, Contact } from '../../../../product/sections/lifecycle-and-compounding-engine/types'

const stageConfig: Record<Contact['lifecycleStage'], { label: string; color: string; icon: string }> = {
  'lead': { label: 'Leads', color: 'indigo', icon: '🌱' },
  'new-customer': { label: 'New Customers', color: 'emerald', icon: '🌿' },
  'active': { label: 'Active', color: 'lime', icon: '🌳' },
  'at-risk': { label: 'At-Risk', color: 'amber', icon: '🍂' },
  'dormant': { label: 'Dormant', color: 'orange', icon: '🍁' },
  'churned': { label: 'Churned', color: 'red', icon: '💀' }
}

export function LifecycleDashboard({
  contacts,
  healthScores,
  retentionMetrics,
  onViewStage,
  onViewContact,
  onViewAtRisk
}: LifecycleDashboardProps) {
  const [selectedStage, setSelectedStage] = useState<Contact['lifecycleStage'] | null>(null)

  // Calculate stage distribution
  const stageDistribution = contacts.reduce((acc, contact) => {
    acc[contact.lifecycleStage] = (acc[contact.lifecycleStage] || 0) + 1
    return acc
  }, {} as Record<Contact['lifecycleStage'], number>)

  // Calculate CLV metrics
  const totalCLV = contacts.reduce((sum, c) => sum + c.lifetimeValue, 0)
  const averageCLV = totalCLV / contacts.length
  const activeCustomers = contacts.filter(c => c.lifecycleStage === 'active' || c.lifecycleStage === 'new-customer')

  // At-risk contacts
  const atRiskContacts = healthScores.filter(h => h.riskLevel === 'at-risk' || h.riskLevel === 'critical')

  // Filter contacts by selected stage
  const filteredContacts = selectedStage
    ? contacts.filter(c => c.lifecycleStage === selectedStage)
    : contacts

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-emerald-50/20 dark:from-slate-950 dark:via-indigo-950/30 dark:to-emerald-950/20">
      {/* Header */}
      <div className="border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-2 tracking-tight">
                Lifecycle Engine
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Long-term customer value, compounding over time
              </p>
            </div>

            {atRiskContacts.length > 0 && (
              <button
                onClick={onViewAtRisk}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-105"
              >
                ⚠️ {atRiskContacts.length} At-Risk
              </button>
            )}
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
              <div className="text-indigo-100 text-sm font-medium mb-2 uppercase tracking-wide">Total Contacts</div>
              <div className="text-4xl font-bold mb-1">{contacts.length}</div>
              <div className="text-indigo-200 text-sm">Across all stages</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
              <div className="text-emerald-100 text-sm font-medium mb-2 uppercase tracking-wide">Active Customers</div>
              <div className="text-4xl font-bold mb-1">{activeCustomers.length}</div>
              <div className="text-emerald-200 text-sm">
                {Math.round((activeCustomers.length / contacts.length) * 100)}% of total
              </div>
            </div>

            <div className="bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20">
              <div className="text-violet-100 text-sm font-medium mb-2 uppercase tracking-wide">Avg CLV</div>
              <div className="text-4xl font-bold mb-1">${Math.round(averageCLV).toLocaleString()}</div>
              <div className="text-violet-200 text-sm">Per customer</div>
            </div>

            <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 text-white shadow-xl shadow-slate-500/20">
              <div className="text-slate-300 text-sm font-medium mb-2 uppercase tracking-wide">Retention Rate</div>
              <div className="text-4xl font-bold mb-1">{Math.round(retentionMetrics.retentionRate * 100)}%</div>
              <div className="text-slate-400 text-sm">
                Churn: {Math.round(retentionMetrics.monthlyChurnRate * 100)}%/mo
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Lifecycle Funnel */}
        <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 mb-8 shadow-xl">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
            Customer Lifecycle Funnel
          </h2>

          <div className="space-y-4">
            {(['lead', 'new-customer', 'active', 'at-risk', 'dormant', 'churned'] as const).map((stage, index) => {
              const config = stageConfig[stage]
              const count = stageDistribution[stage] || 0
              const percentage = (count / contacts.length) * 100
              const isSelected = selectedStage === stage

              return (
                <div
                  key={stage}
                  onClick={() => {
                    setSelectedStage(isSelected ? null : stage)
                    onViewStage?.(stage)
                  }}
                  className={`relative cursor-pointer transition-all group ${
                    isSelected ? 'scale-[1.02]' : 'hover:scale-[1.01]'
                  }`}
                >
                  <div className={`bg-gradient-to-r from-${config.color}-50 to-${config.color}-100/50 dark:from-${config.color}-950/30 dark:to-${config.color}-900/20 border-2 rounded-xl overflow-hidden transition-all ${
                    isSelected
                      ? `border-${config.color}-500 shadow-lg shadow-${config.color}-500/20`
                      : `border-${config.color}-200 dark:border-${config.color}-800/40 group-hover:border-${config.color}-400`
                  }`}>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{config.icon}</span>
                          <div>
                            <h3 className={`text-lg font-bold text-${config.color}-900 dark:text-${config.color}-100`}>
                              {config.label}
                            </h3>
                            <p className={`text-sm text-${config.color}-700 dark:text-${config.color}-300`}>
                              {count} contacts
                            </p>
                          </div>
                        </div>
                        <div className={`text-3xl font-bold text-${config.color}-600 dark:text-${config.color}-400`}>
                          {Math.round(percentage)}%
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r from-${config.color}-500 to-${config.color}-600 rounded-full transition-all duration-1000`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Health Scores Summary */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Customer Health Overview
            </h2>

            <div className="space-y-4">
              {healthScores.slice(0, 5).map((health) => {
                const contact = contacts.find(c => c.id === health.contactId)
                if (!contact) return null

                const getRiskColor = (level: string) => {
                  switch (level) {
                    case 'healthy': return 'emerald'
                    case 'at-risk': return 'amber'
                    case 'critical': return 'red'
                    default: return 'slate'
                  }
                }

                const color = getRiskColor(health.riskLevel)

                return (
                  <div
                    key={health.contactId}
                    onClick={() => onViewContact?.(health.contactId)}
                    className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-50 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                          {contact.name}
                        </h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          {contact.company}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide bg-${color}-100 text-${color}-700 dark:bg-${color}-950 dark:text-${color}-300`}>
                        {health.riskLevel}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full bg-gradient-to-r from-${color}-500 to-${color}-600`}
                          style={{ width: `${health.overallScore}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-50">
                        {health.overallScore}
                      </span>
                    </div>

                    {health.recommendedActions[0] && (
                      <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                        → {health.recommendedActions[0]}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Compounding Indicators */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Compounding Value
            </h2>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Repeat Purchase Rate
                  </span>
                  <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                    {Math.round(retentionMetrics.compoundingIndicators.repeatPurchaseRate * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600"
                    style={{ width: `${retentionMetrics.compoundingIndicators.repeatPurchaseRate * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    Referral Generation Rate
                  </span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                    {Math.round(retentionMetrics.compoundingIndicators.referralGenerationRate * 100)}%
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                    style={{ width: `${retentionMetrics.compoundingIndicators.referralGenerationRate * 100}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-950/30 rounded-xl">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                    {retentionMetrics.compoundingIndicators.averageReferralsPerCustomer.toFixed(1)}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Avg Referrals
                  </div>
                </div>

                <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl">
                  <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                    {retentionMetrics.compoundingIndicators.netPromoterScore}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 uppercase tracking-wide">
                    Net Promoter
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30 rounded-xl border border-violet-200 dark:border-violet-800/40">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Advocacy Score</div>
                    <div className="text-2xl font-bold text-violet-600 dark:text-violet-400">
                      {retentionMetrics.compoundingIndicators.advocacyScore}/10
                    </div>
                  </div>
                  <div className="text-4xl">⭐</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Stage Contacts */}
        {selectedStage && (
          <div className="mt-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 dark:border-slate-800/60 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                {stageConfig[selectedStage].label} ({filteredContacts.length})
              </h2>
              <button
                onClick={() => setSelectedStage(null)}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
              >
                Clear filter ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => onViewContact?.(contact.id)}
                  className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 hover:border-indigo-400 dark:hover:border-indigo-600 transition-all cursor-pointer"
                >
                  <h4 className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    {contact.name}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {contact.company}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 dark:text-slate-400">CLV:</span>
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">
                      ${contact.lifetimeValue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-slate-600 dark:text-slate-400">Engagement:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {contact.engagementScore}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
