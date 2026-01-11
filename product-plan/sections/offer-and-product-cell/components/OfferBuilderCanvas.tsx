import type { Offer, Bonus, Guarantee, CoreOffer, Pricing } from '@/../product/sections/offer-and-product-cell/types'
import { useState } from 'react'

interface OfferBuilderCanvasProps {
  /** Existing offers for reference/cloning */
  offers?: Offer[]
  /** Called when user saves the offer */
  onSaveOffer?: (offer: Partial<Offer>) => void
  /** Called when user wants to preview in different channels */
  onPreviewChannel?: (channel: 'landing' | 'email' | 'sales-deck') => void
}

export function OfferBuilderCanvas({ offers, onSaveOffer, onPreviewChannel }: OfferBuilderCanvasProps) {
  // State for building the offer
  const [offerTitle, setOfferTitle] = useState('Untitled Offer')
  const [offerType, setOfferType] = useState<'lead-magnet' | 'core-offer' | 'expansion'>('lead-magnet')
  const [coreOffer, setCoreOffer] = useState<Partial<CoreOffer> | null>(null)
  const [bonuses, setBonuses] = useState<Bonus[]>([])
  const [guarantee, setGuarantee] = useState<Partial<Guarantee> | null>(null)
  const [pricing, setPricing] = useState<Partial<Pricing> | null>(null)
  const [previewMode, setPreviewMode] = useState<'landing' | 'email' | 'sales-deck'>('landing')

  // Calculate value score based on current stack (simplified algorithm)
  const calculateValueScore = (): number => {
    let score = 0

    // Core offer adds base value
    if (coreOffer?.title) score += 2
    if (coreOffer?.description) score += 1

    // Bonuses add value (optimal is 3-4)
    const bonusCount = bonuses.length
    if (bonusCount >= 3 && bonusCount <= 4) {
      score += 3
    } else if (bonusCount > 0) {
      score += 1.5
    }

    // Guarantee adds significant value
    if (guarantee?.type === 'outcome-based') score += 2
    else if (guarantee?.type) score += 1

    // Pricing structure adds value
    if (pricing?.price !== undefined && pricing?.anchor !== undefined) {
      const discount = ((pricing.anchor - pricing.price) / pricing.anchor) * 100
      if (discount >= 30 && discount <= 60) score += 1.5
      else if (discount > 0) score += 0.5
    }

    return Math.min(10, Math.max(0, score))
  }

  const valueScore = calculateValueScore()

  // Component palette items
  const coreOfferTemplates = [
    { type: 'assessment', title: 'Free Assessment', delivery: 'human' as const, icon: '🔍' },
    { type: 'training', title: 'Training Program', delivery: 'event' as const, icon: '🎓' },
    { type: 'implementation', title: 'Done-For-You Service', delivery: 'hybrid' as const, icon: '⚙️' },
    { type: 'subscription', title: 'Ongoing Support', delivery: 'digital' as const, icon: '🔄' }
  ]

  const bonusTemplates = [
    { title: 'Resource Library Access', value: 297, icon: '📚' },
    { title: 'Template Package', value: 197, icon: '📋' },
    { title: 'Strategy Call', value: 500, icon: '📞' },
    { title: 'Community Access', value: 147, icon: '👥' }
  ]

  const guaranteeTemplates = [
    { type: 'outcome-based' as const, label: 'Outcome Guarantee', icon: '🎯' },
    { type: 'unconditional' as const, label: 'Money-Back', icon: '💰' },
    { type: 'satisfaction' as const, label: 'Satisfaction', icon: '⭐' },
    { type: 'performance' as const, label: 'Performance', icon: '📈' }
  ]

  // AI Suggestions (based on institutional learnings)
  const aiSuggestions = [
    {
      id: 'sug-1',
      title: 'Add outcome-based guarantee',
      reason: 'Converts 34% higher than money-back',
      impact: '+34% conversion',
      confidence: 87
    },
    {
      id: 'sug-2',
      title: 'Add 1 more bonus',
      reason: '3-4 bonuses perform optimally',
      impact: '+0.8 value score',
      confidence: 81
    },
    {
      id: 'sug-3',
      title: 'Use specific numbers',
      reason: 'Numerical outcomes convert 2.1x better',
      impact: '+110% SQL rate',
      confidence: 92
    }
  ]

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
      {/* Top Bar */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={offerTitle}
              onChange={(e) => setOfferTitle(e.target.value)}
              className="text-xl font-semibold bg-transparent border-none outline-none focus:ring-2 focus:ring-indigo-500 rounded px-2 py-1 text-slate-900 dark:text-white"
            />
            <select
              value={offerType}
              onChange={(e) => setOfferType(e.target.value as any)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-700 dark:text-slate-300"
            >
              <option value="lead-magnet">Lead Magnet</option>
              <option value="core-offer">Core Offer</option>
              <option value="expansion">Expansion</option>
            </select>
          </div>

          {/* Preview Mode Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Preview:</span>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              {(['landing', 'email', 'sales-deck'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setPreviewMode(mode)
                    onPreviewChannel?.(mode)
                  }}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    previewMode === mode
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {mode === 'landing' ? '🌐 Landing' : mode === 'email' ? '📧 Email' : '📊 Deck'}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => onSaveOffer?.({
              title: offerTitle,
              type: offerType,
              valueStack: coreOffer && guarantee && pricing ? {
                coreOffer: coreOffer as CoreOffer,
                bonuses,
                guarantee: guarantee as Guarantee,
                pricing: pricing as Pricing
              } : undefined as any
            })}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/30 transition-all"
          >
            Save Offer
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Component Palette */}
        <div className="w-72 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4 space-y-6">
            {/* Core Offer Templates */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Core Offer Types</h3>
              <div className="space-y-2">
                {coreOfferTemplates.map((template) => (
                  <button
                    key={template.type}
                    onClick={() => setCoreOffer({
                      title: template.title,
                      description: 'Describe what you\'ll deliver...',
                      deliveryMechanism: template.delivery
                    })}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{template.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{template.title}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 capitalize">{template.delivery}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Bonus Templates */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Add Bonuses</h3>
              <div className="space-y-2">
                {bonusTemplates.map((bonus, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBonuses([...bonuses, {
                      title: bonus.title,
                      description: 'Describe this bonus...',
                      perceivedValue: bonus.value
                    }])}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-emerald-400 dark:hover:border-emerald-600 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{bonus.icon}</span>
                    <div className="text-left flex-1">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{bonus.title}</div>
                      <div className="text-xs text-emerald-600 dark:text-emerald-400">${bonus.value} value</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Guarantee Templates */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Risk Reversal</h3>
              <div className="space-y-2">
                {guaranteeTemplates.map((g) => (
                  <button
                    key={g.type}
                    onClick={() => setGuarantee({
                      type: g.type,
                      terms: 'Enter your guarantee terms...',
                      riskReversal: 'What do they keep if they refund?'
                    })}
                    className="w-full flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition-all group"
                  >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{g.icon}</span>
                    <div className="text-left">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{g.label}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Pricing</h3>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-3">
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setPricing({ ...pricing, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Anchor Price</label>
                  <input
                    type="number"
                    placeholder="0"
                    onChange={(e) => setPricing({ ...pricing, anchor: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 dark:text-slate-400 mb-1 block">Terms</label>
                  <input
                    type="text"
                    placeholder="one-time, monthly, etc."
                    onChange={(e) => setPricing({ ...pricing, paymentTerms: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Value Score Display */}
            <div className="relative">
              <div className="absolute -top-2 -right-2 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full w-16 h-16 flex flex-col items-center justify-center shadow-xl">
                <div className="text-2xl font-bold">{valueScore.toFixed(1)}</div>
                <div className="text-xs">score</div>
              </div>
              <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Value Score</h3>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${(valueScore / 10) * 100}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                  {valueScore < 5 ? 'Needs more components' : valueScore < 7 ? 'Good foundation' : valueScore < 9 ? 'Strong offer' : 'Exceptional value stack'}
                </p>
              </div>
            </div>

            {/* Core Offer */}
            {coreOffer ? (
              <div className="p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-900 bg-white dark:bg-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Core Offer</h3>
                  </div>
                  <button onClick={() => setCoreOffer(null)} className="text-slate-400 hover:text-red-500">✕</button>
                </div>
                <input
                  type="text"
                  value={coreOffer.title || ''}
                  onChange={(e) => setCoreOffer({ ...coreOffer, title: e.target.value })}
                  className="w-full px-3 py-2 mb-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-medium"
                  placeholder="Offer title..."
                />
                <textarea
                  value={coreOffer.description || ''}
                  onChange={(e) => setCoreOffer({ ...coreOffer, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                  placeholder="Describe what you'll deliver..."
                />
                <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 capitalize">
                  Delivery: {coreOffer.deliveryMechanism}
                </div>
              </div>
            ) : (
              <div className="p-12 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white/30 dark:bg-slate-900/30 text-center">
                <div className="text-4xl mb-2">⬅️</div>
                <p className="text-slate-600 dark:text-slate-400">Select a core offer type from the palette</p>
              </div>
            )}

            {/* Bonuses */}
            {bonuses.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Bonuses ({bonuses.length})</h3>
                </div>
                {bonuses.map((bonus, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-800 shadow">
                    <div className="flex items-start justify-between mb-2">
                      <input
                        type="text"
                        value={bonus.title}
                        onChange={(e) => {
                          const newBonuses = [...bonuses]
                          newBonuses[idx].title = e.target.value
                          setBonuses(newBonuses)
                        }}
                        className="flex-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-medium"
                      />
                      <button
                        onClick={() => setBonuses(bonuses.filter((_, i) => i !== idx))}
                        className="ml-2 text-slate-400 hover:text-red-500"
                      >
                        ✕
                      </button>
                    </div>
                    <textarea
                      value={bonus.description}
                      onChange={(e) => {
                        const newBonuses = [...bonuses]
                        newBonuses[idx].description = e.target.value
                        setBonuses(newBonuses)
                      }}
                      rows={2}
                      className="w-full px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs"
                    />
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-slate-600 dark:text-slate-400">Value:</span>
                      <input
                        type="number"
                        value={bonus.perceivedValue}
                        onChange={(e) => {
                          const newBonuses = [...bonuses]
                          newBonuses[idx].perceivedValue = Number(e.target.value)
                          setBonuses(newBonuses)
                        }}
                        className="w-24 px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 text-xs font-semibold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Guarantee */}
            {guarantee ? (
              <div className="p-6 rounded-xl border-2 border-purple-200 dark:border-purple-900 bg-white dark:bg-slate-800 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Guarantee</h3>
                  </div>
                  <button onClick={() => setGuarantee(null)} className="text-slate-400 hover:text-red-500">✕</button>
                </div>
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium capitalize">
                    {guarantee.type?.replace('-', ' ')}
                  </span>
                </div>
                <textarea
                  value={guarantee.terms || ''}
                  onChange={(e) => setGuarantee({ ...guarantee, terms: e.target.value })}
                  rows={2}
                  placeholder="Guarantee terms..."
                  className="w-full px-3 py-2 mb-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
                <textarea
                  value={guarantee.riskReversal || ''}
                  onChange={(e) => setGuarantee({ ...guarantee, riskReversal: e.target.value })}
                  rows={2}
                  placeholder="What they keep if they refund..."
                  className="w-full px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm"
                />
              </div>
            ) : null}

            {/* Pricing Display */}
            {pricing && pricing.price !== undefined && (
              <div className="p-6 rounded-xl border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Pricing</h3>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
                    ${pricing.price === 0 ? 'FREE' : pricing.price.toLocaleString()}
                  </div>
                  {pricing.anchor && pricing.anchor > (pricing.price || 0) && (
                    <div className="text-xl text-slate-500 dark:text-slate-400 line-through">
                      ${pricing.anchor.toLocaleString()}
                    </div>
                  )}
                </div>
                {pricing.paymentTerms && (
                  <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 capitalize">
                    {pricing.paymentTerms}
                  </div>
                )}
                {pricing.anchor && pricing.price !== undefined && pricing.anchor > pricing.price && (
                  <div className="mt-3 inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium">
                    Save {(((pricing.anchor - pricing.price) / pricing.anchor) * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - AI Suggestions */}
        <div className="w-80 border-l border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">✨</span>
              <h3 className="font-semibold text-slate-900 dark:text-white">AI Suggestions</h3>
            </div>
            <div className="space-y-3">
              {aiSuggestions.map((suggestion) => (
                <div key={suggestion.id} className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-900 dark:text-white">{suggestion.title}</h4>
                    <div className="text-xs text-slate-500 dark:text-slate-400">{suggestion.confidence}%</div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{suggestion.reason}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">{suggestion.impact}</span>
                    <button className="px-3 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/50 dark:to-purple-950/50 border border-indigo-200 dark:border-indigo-900">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">💡 Pro Tip</h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Offers with 3-4 bonuses and outcome-based guarantees achieve the highest conversion rates. Consider adding specific numerical promises to your core offer.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
