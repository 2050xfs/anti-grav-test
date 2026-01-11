import { useState } from 'react'
import { Search, AlertCircle, TrendingUp, Target, DollarSign, BarChart3, Plus } from 'lucide-react'
import type { Competitor } from '@/../product/sections/offer-and-product-cell/types'

// Design Tokens: indigo (primary), emerald (secondary), slate (neutral)
// Typography: Inter (heading/body), JetBrains Mono (mono)
// Aesthetic: Data-rich analytical dashboard with charts and competitive positioning

interface CompetitiveIntelligenceProps {
  /** List of competitors analyzed */
  competitors: Competitor[]
  /** Called when user wants to add a new competitor URL to analyze */
  onAddCompetitor?: (url: string) => void
  /** Called when user wants to view full competitor details */
  onViewCompetitor?: (competitorId: string) => void
}

export function CompetitiveIntelligence({
  competitors,
  onAddCompetitor,
  onViewCompetitor,
}: CompetitiveIntelligenceProps) {
  const [newCompetitorUrl, setNewCompetitorUrl] = useState('')

  const handleAddCompetitor = () => {
    if (newCompetitorUrl && onAddCompetitor) {
      onAddCompetitor(newCompetitorUrl)
      setNewCompetitorUrl('')
    }
  }

  // Calculate aggregate stats
  const avgPositioningScore = competitors.length > 0
    ? (competitors.reduce((sum, c) => sum + c.positioningScore, 0) / competitors.length).toFixed(1)
    : '0'

  const competitorsWithPricing = competitors.filter(c =>
    c.valueStack.pricing.includes('$') || c.valueStack.pricing.toLowerCase().includes('custom')
  ).length

  // Identify gaps (simplified - count unique gaps)
  const allGaps = competitors.flatMap(c => c.identifiedGaps)
  const uniqueGaps = [...new Set(allGaps)]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-800 dark:from-slate-600 dark:to-slate-700 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100">
              Competitive Intelligence
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Analyze competitor offers, identify market gaps, and find positioning opportunities
          </p>
        </div>

        {/* Add Competitor Input */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm mb-8">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Add Competitor to Analyze
          </label>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" strokeWidth={2} />
              <input
                type="url"
                value={newCompetitorUrl}
                onChange={(e) => setNewCompetitorUrl(e.target.value)}
                placeholder="Enter competitor website URL (e.g., https://competitor.com)"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === 'Enter' && handleAddCompetitor()}
              />
            </div>
            <button
              onClick={handleAddCompetitor}
              disabled={!newCompetitorUrl}
              className="px-6 py-3 bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg disabled:shadow-none transition-all flex items-center gap-2 disabled:cursor-not-allowed"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              Analyze
            </button>
          </div>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            AI will scrape the competitor's offers and extract positioning insights
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Competitors</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {competitors.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Market Gaps</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {uniqueGaps.length}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-slate-600 dark:text-slate-400" strokeWidth={2.5} />
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Position Score</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {avgPositioningScore}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">With Pricing</div>
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              {competitorsWithPricing}/{competitors.length}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Positioning Map */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Competitive Positioning Map
              </h2>
            </div>

            {/* 2D Scatter Plot */}
            <div className="relative h-80 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
              {/* Axes */}
              <div className="absolute bottom-6 left-6 right-6 h-px bg-slate-300 dark:bg-slate-700" />
              <div className="absolute bottom-6 left-6 top-6 w-px bg-slate-300 dark:bg-slate-700" />

              {/* Axis Labels */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Value Score →
              </div>
              <div className="absolute left-2 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-slate-600 dark:text-slate-400">
                Price Point →
              </div>

              {/* Quadrant Labels */}
              <div className="absolute top-8 left-8 text-xs font-medium text-slate-500 dark:text-slate-400">
                High Price<br/>Low Value
              </div>
              <div className="absolute top-8 right-8 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                High Price<br/>High Value
              </div>
              <div className="absolute bottom-16 left-8 text-xs font-medium text-slate-500 dark:text-slate-400">
                Low Price<br/>Low Value
              </div>
              <div className="absolute bottom-16 right-8 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                Low Price<br/>High Value
              </div>

              {/* Competitor Dots */}
              {competitors.map((competitor, index) => {
                // Position based on score (0-100) and pricing tier
                const xPercent = competitor.positioningScore // 0-100
                const yPercent = 50 + (index * 10) % 40 // Simulate price positioning

                return (
                  <div
                    key={competitor.id}
                    className="absolute w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full cursor-pointer hover:scale-150 transition-transform"
                    style={{
                      left: `${20 + (xPercent * 0.65)}%`,
                      bottom: `${20 + (yPercent * 0.6)}%`,
                    }}
                    title={competitor.competitorName}
                  />
                )
              })}

              {/* "You" marker */}
              <div
                className="absolute w-4 h-4 bg-emerald-500 dark:bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900 shadow-lg"
                style={{ left: '75%', bottom: '35%' }}
                title="Your Position"
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 dark:bg-emerald-400 text-white text-xs font-bold px-2 py-0.5 rounded whitespace-nowrap">
                  You
                </div>
              </div>
            </div>
          </div>

          {/* Market Gaps */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <AlertCircle className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Market Gaps Identified
              </h2>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto">
              {uniqueGaps.length === 0 ? (
                <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                  Add competitors to identify market gaps
                </div>
              ) : (
                uniqueGaps.map((gap, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl hover:shadow-md transition-all"
                  >
                    <div className="w-6 h-6 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {gap}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Competitor Cards */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-6">
            Analyzed Competitors ({competitors.length})
          </h2>

          {competitors.length === 0 ? (
            <div className="bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center">
              <Target className="w-16 h-16 mx-auto mb-4 text-slate-400" strokeWidth={1.5} />
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No Competitors Analyzed Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Add competitor URLs above to analyze their offers and identify positioning opportunities
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {competitors.map((competitor) => (
                <div
                  key={competitor.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-lg transition-all"
                >
                  {/* Competitor Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                        {competitor.competitorName}
                      </h3>
                      <a
                        href={competitor.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        {competitor.url}
                      </a>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Position Score</div>
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                        {competitor.positioningScore}
                      </div>
                    </div>
                  </div>

                  {/* Value Stack Summary */}
                  <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4 mb-4">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                      {competitor.offerType}
                    </div>
                    <div className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                      {competitor.valueStack.coreOffer}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 dark:text-slate-400">
                        {competitor.valueStack.keyBonuses.length} bonuses
                      </span>
                      <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                        {competitor.valueStack.pricing}
                      </span>
                    </div>
                  </div>

                  {/* Strengths */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                      Strengths
                    </div>
                    <div className="space-y-1">
                      {competitor.perceivedStrengths.slice(0, 2).map((strength, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-emerald-600 dark:text-emerald-400 mt-0.5">•</span>
                          <span className="flex-1">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Gaps */}
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase mb-2">
                      Identified Gaps
                    </div>
                    <div className="space-y-1">
                      {competitor.identifiedGaps.slice(0, 2).map((gap, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="text-amber-600 dark:text-amber-400 mt-0.5">⚠</span>
                          <span className="flex-1">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    onClick={() => onViewCompetitor?.(competitor.id)}
                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium rounded-lg transition-all"
                  >
                    View Full Analysis
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
