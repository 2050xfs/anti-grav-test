import { useState } from 'react'
import { Sparkles, Zap, TrendingUp } from 'lucide-react'
import type { Offer, OfferGeneratorInput } from '@/../product/sections/offer-and-product-cell/types'

// Design Tokens: indigo (primary), emerald (secondary), slate (neutral)
// Typography: Inter (heading/body), JetBrains Mono (mono)

interface OfferGeneratorProps {
  /** Available pain points from Strategy Brain */
  painPoints?: Array<{ id: string; title: string; description: string }>
  /** Called when user generates offers with the selected parameters */
  onGenerate?: (input: OfferGeneratorInput) => void
  /** Called when user selects a generated variant */
  onSelectVariant?: (variant: Partial<Offer>) => void
  /** Optional: pre-generated variants to display */
  generatedVariants?: Array<Partial<Offer>>
}

export function OfferGenerator({
  painPoints = [],
  onGenerate,
  onSelectVariant,
  generatedVariants = [],
}: OfferGeneratorProps) {
  const [painPointId, setPainPointId] = useState('')
  const [offerType, setOfferType] = useState<'lead-magnet' | 'core-offer' | 'expansion'>('lead-magnet')
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100 })
  const [deliveryPreference, setDeliveryPreference] = useState<'physical' | 'digital' | 'event' | 'human' | 'hybrid' | ''>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = () => {
    if (!painPointId || !onGenerate) return

    setIsGenerating(true)
    onGenerate({
      painPointId,
      offerType,
      priceRange,
      deliveryPreference: deliveryPreference || undefined,
    })

    // Simulate generation delay
    setTimeout(() => setIsGenerating(false), 1500)
  }

  const getTypeConfig = (type: typeof offerType) => {
    switch (type) {
      case 'lead-magnet':
        return {
          label: 'Lead Magnet',
          description: 'Top of funnel - Free value to attract leads',
          icon: '🧲',
          suggestedRange: { min: 0, max: 0 },
        }
      case 'core-offer':
        return {
          label: 'Core Offer',
          description: 'Main purchase - Your primary product/service',
          icon: '💎',
          suggestedRange: { min: 1000, max: 10000 },
        }
      case 'expansion':
        return {
          label: 'Expansion',
          description: 'Upsell/cross-sell for existing customers',
          icon: '📈',
          suggestedRange: { min: 500, max: 5000 },
        }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 dark:from-indigo-400 dark:to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-indigo-700 dark:from-slate-100 dark:via-indigo-100 dark:to-indigo-300 bg-clip-text text-transparent">
              AI Offer Generator
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">
            Generate high-converting offers powered by institutional learnings and Hormozi's Value Equation
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Configuration Form - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pain Point Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Target Pain Point
              </label>
              <select
                value={painPointId}
                onChange={(e) => setPainPointId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              >
                <option value="">Select a pain point...</option>
                {painPoints.map((pp) => (
                  <option key={pp.id} value={pp.id}>
                    {pp.title}
                  </option>
                ))}
              </select>
              {painPointId && (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {painPoints.find((p) => p.id === painPointId)?.description}
                </p>
              )}
            </div>

            {/* Offer Type Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4">
                Offer Type
              </label>
              <div className="space-y-2">
                {(['lead-magnet', 'core-offer', 'expansion'] as const).map((type) => {
                  const config = getTypeConfig(type)
                  const isSelected = offerType === type
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        setOfferType(type)
                        setPriceRange(config.suggestedRange)
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all ${
                        isSelected
                          ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-950/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-950'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{config.icon}</span>
                        <div className="flex-1">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {config.label}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">
                            {config.description}
                          </div>
                        </div>
                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-indigo-500 dark:bg-indigo-400 flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-white" />
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Price Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Min $</label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 dark:text-slate-400 mb-2">Max $</label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Preference */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-shadow">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Delivery Preference (Optional)
              </label>
              <select
                value={deliveryPreference}
                onChange={(e) => setDeliveryPreference(e.target.value as typeof deliveryPreference)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
              >
                <option value="">Any delivery method</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
                <option value="event">Event/Workshop</option>
                <option value="human">Human-Delivered Service</option>
                <option value="hybrid">Hybrid (Multiple Methods)</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!painPointId || isGenerating}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 dark:from-indigo-500 dark:to-indigo-400 hover:from-indigo-700 hover:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-500 disabled:from-slate-400 disabled:to-slate-400 dark:disabled:from-slate-700 dark:disabled:to-slate-700 text-white font-semibold px-6 py-4 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 disabled:shadow-none transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" strokeWidth={2.5} />
                  Generate 3 Variants
                </>
              )}
            </button>
          </div>

          {/* Generated Variants - Right Side */}
          <div className="lg:col-span-3">
            {generatedVariants.length === 0 ? (
              <div className="h-full min-h-[600px] bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-900/50 dark:to-slate-800/50 rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center p-8">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                    <Sparkles className="w-10 h-10 text-slate-400 dark:text-slate-500" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Ready to Generate Offers
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Configure your parameters on the left and click "Generate 3 Variants" to create AI-powered offer variations
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Generated Variants
                  </h2>
                  <span className="px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold rounded-full">
                    {generatedVariants.length} Variants
                  </span>
                </div>

                {generatedVariants.map((variant, index) => (
                  <div
                    key={variant.id || index}
                    className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-md hover:shadow-xl transition-all"
                  >
                    {/* Variant Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold rounded-full">
                            VARIANT {index + 1}
                          </span>
                          <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-full capitalize">
                            {variant.type?.replace('-', ' ')}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
                          {variant.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                          {variant.valueStack?.coreOffer.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right">
                          <div className="text-sm text-slate-600 dark:text-slate-400">Value Score</div>
                          <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                            {variant.valueScore?.toFixed(1) || '8.5'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Value Stack Summary */}
                    {variant.valueStack && (
                      <div className="grid sm:grid-cols-3 gap-4 mb-4">
                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Bonuses</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            {variant.valueStack.bonuses.length} Items
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Guarantee</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 capitalize">
                            {variant.valueStack.guarantee.type.replace('-', ' ')}
                          </div>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-950/50 rounded-xl p-4">
                          <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Price</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            ${variant.valueStack.pricing.price.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Projected Metrics */}
                    <div className="bg-gradient-to-r from-emerald-50 to-indigo-50 dark:from-emerald-950/20 dark:to-indigo-950/20 rounded-xl p-4 mb-4">
                      <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                        <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          Projected Performance
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                        <div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Conv Rate</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">28%</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Leads/Mo</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">450</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">SQLs/Mo</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">126</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-600 dark:text-slate-400">Revenue/Mo</div>
                          <div className="text-lg font-bold text-slate-900 dark:text-slate-100">$45K</div>
                        </div>
                      </div>
                    </div>

                    {/* Channel Fit */}
                    <div className="mb-4">
                      <div className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Best Channel Fit
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Warm Outreach', 'Content', 'Cold Outreach'].map((channel) => (
                          <span
                            key={channel}
                            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm rounded-lg"
                          >
                            {channel}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => onSelectVariant?.(variant)}
                      className="w-full bg-indigo-600 dark:bg-indigo-500 hover:bg-indigo-700 dark:hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Select This Variant
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
