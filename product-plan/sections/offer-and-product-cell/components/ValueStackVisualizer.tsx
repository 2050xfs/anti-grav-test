import { Check, Shield, DollarSign, Sparkles, TrendingUp, Package } from 'lucide-react'
import type { Offer } from '@/../product/sections/offer-and-product-cell/types'

// Design Tokens: indigo (primary), emerald (secondary), slate (neutral)
// Typography: Inter (heading/body), JetBrains Mono (mono)
// Aesthetic: Bold hierarchical layout with visual weight showing value accumulation

interface ValueStackVisualizerProps {
  /** The offer to visualize */
  offer: Offer
  /** Called when user wants to edit the offer */
  onEdit?: (offerId: string) => void
  /** Called when user wants to clone the offer */
  onClone?: (offerId: string) => void
}

export function ValueStackVisualizer({ offer, onEdit, onClone }: ValueStackVisualizerProps) {
  const { valueStack, valueScore, title, type } = offer

  // Calculate total perceived value
  const totalBonusValue = valueStack.bonuses.reduce((sum, bonus) => sum + bonus.perceivedValue, 0)
  const totalPerceivedValue = valueStack.pricing.anchor + totalBonusValue

  // Calculate value ratio (what they get vs what they pay)
  const valueRatio = valueStack.pricing.price > 0
    ? (totalPerceivedValue / valueStack.pricing.price).toFixed(1)
    : '∞'

  // Value score color coding
  const getScoreColor = (score: number) => {
    if (score >= 9) return 'from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500'
    if (score >= 7) return 'from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500'
    return 'from-slate-500 to-slate-600 dark:from-slate-400 dark:to-slate-500'
  }

  const getScoreBadgeColor = (score: number) => {
    if (score >= 9) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
    if (score >= 7) return 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700'
    return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-full capitalize">
                  {type.replace('-', ' ')}
                </span>
                <span className={`px-3 py-1 text-sm font-bold rounded-full border-2 ${getScoreBadgeColor(valueScore)}`}>
                  Score: {valueScore}/10
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                {title}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                {valueStack.coreOffer.description}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <button
                onClick={() => onEdit?.(offer.id)}
                className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => onClone?.(offer.id)}
                className="px-4 py-2 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium"
              >
                Clone
              </button>
            </div>
          </div>

          {/* Value Ratio Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-emerald-50 dark:from-indigo-950/30 dark:to-emerald-950/30 border border-indigo-200 dark:border-indigo-800 rounded-xl">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" strokeWidth={2.5} />
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Value Ratio: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{valueRatio}x</span>
            </span>
            <span className="text-sm text-slate-600 dark:text-slate-400">
              (${totalPerceivedValue.toLocaleString()} perceived / ${valueStack.pricing.price.toLocaleString()} price)
            </span>
          </div>
        </div>

        {/* Visual Value Stack */}
        <div className="space-y-4">
          {/* Core Offer - Largest Block */}
          <div className="relative">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 dark:from-indigo-500 dark:to-indigo-600 rounded-2xl p-8 shadow-2xl shadow-indigo-500/20">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Package className="w-8 h-8 text-white" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-white">Core Offer</h2>
                    <span className="px-3 py-1 bg-white/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm capitalize">
                      {valueStack.coreOffer.deliveryMechanism}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {valueStack.coreOffer.title}
                  </h3>
                  <p className="text-indigo-100 leading-relaxed mb-4">
                    {valueStack.coreOffer.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg">
                      <div className="text-xs text-indigo-200 mb-1">Anchor Value</div>
                      <div className="text-2xl font-bold text-white">
                        ${valueStack.pricing.anchor.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Connector */}
            <div className="absolute left-1/2 -bottom-2 w-0.5 h-4 bg-slate-300 dark:bg-slate-700 transform -translate-x-1/2" />
          </div>

          {/* Bonuses - Stacked Cards */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Bonuses ({valueStack.bonuses.length})
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Total value: ${totalBonusValue.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {valueStack.bonuses.map((bonus, index) => (
                  <div
                    key={index}
                    className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-xl p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-emerald-600 dark:bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-5 h-5 text-white" strokeWidth={3} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                          {bonus.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                          {bonus.description}
                        </p>
                        <div className="inline-flex items-center px-2 py-1 bg-emerald-100 dark:bg-emerald-900/40 rounded-md">
                          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                            +${bonus.perceivedValue} value
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Connector */}
            <div className="absolute left-1/2 -bottom-2 w-0.5 h-4 bg-slate-300 dark:bg-slate-700 transform -translate-x-1/2" />
          </div>

          {/* Guarantee - Security Block */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-2 border-slate-300 dark:border-slate-700 rounded-2xl p-6 shadow-lg">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-slate-700 dark:bg-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">
                    Guarantee: {valueStack.guarantee.type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                  </h2>
                  <p className="text-slate-700 dark:text-slate-300 mb-3 leading-relaxed">
                    {valueStack.guarantee.terms}
                  </p>
                  <div className="flex items-start gap-2 px-4 py-3 bg-slate-700 dark:bg-slate-950 rounded-lg">
                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <p className="text-sm text-slate-200 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold">Risk Reversal:</span> {valueStack.guarantee.riskReversal}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Connector */}
            <div className="absolute left-1/2 -bottom-2 w-0.5 h-4 bg-slate-300 dark:bg-slate-700 transform -translate-x-1/2" />
          </div>

          {/* Pricing - Final Block with Comparison */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-950 dark:to-black border-2 border-slate-800 dark:border-slate-900 rounded-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <DollarSign className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Investment</h2>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Total Perceived Value</div>
                    <div className="text-3xl font-bold text-slate-300 line-through decoration-2">
                      ${totalPerceivedValue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-400 mb-1">Your Investment</div>
                    <div className="text-5xl font-bold text-white mb-2">
                      ${valueStack.pricing.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-400">
                      {valueStack.pricing.paymentTerms}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center">
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${getScoreColor(valueScore)} flex flex-col items-center justify-center shadow-2xl`}>
                  <div className="text-sm font-semibold text-white/90 mb-1">Value Score</div>
                  <div className="text-4xl font-bold text-white">{valueScore}</div>
                  <div className="text-sm text-white/90">/10</div>
                </div>
                {valueStack.pricing.price === 0 && (
                  <div className="mt-4 px-4 py-2 bg-emerald-500 text-white text-sm font-bold rounded-full">
                    FREE OFFER
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {valueStack.bonuses.length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Bonuses</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              ${totalBonusValue.toLocaleString()}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Bonus Value</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-slate-600 dark:text-slate-400 capitalize">
              {valueStack.guarantee.type.split('-')[0]}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Guarantee</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {valueRatio}x
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Value Ratio</div>
          </div>
        </div>
      </div>
    </div>
  )
}
