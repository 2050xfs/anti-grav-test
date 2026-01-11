import { useState } from 'react'
import type { Channel, LeadGetter } from '@/../product/sections/distribution-engine/types'

interface CampaignLaunchModalProps {
  channels: Channel[]
  leadGetters: LeadGetter[]
  isOpen: boolean
  onClose: () => void
  onLaunch: (campaign: CampaignFormData) => void
}

export interface CampaignFormData {
  name: string
  channelIds: string[]
  budget: number
  targetAudience: string
}

export function CampaignLaunchModal({
  channels,
  leadGetters,
  isOpen,
  onClose,
  onLaunch
}: CampaignLaunchModalProps) {
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    channelIds: [],
    budget: 10000,
    targetAudience: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Combine channels and lead getters for selection
  const allChannels = [
    ...channels.map(c => ({ id: c.id, name: c.name, type: 'Core Four' as const, status: c.status })),
    ...leadGetters.map(lg => ({ id: lg.id, name: lg.name, type: 'Lead Getter' as const, status: lg.status }))
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Campaign name is required'
    if (formData.channelIds.length === 0) newErrors.channels = 'Select at least one channel'
    if (formData.budget < 1000) newErrors.budget = 'Minimum budget is $1,000'
    if (!formData.targetAudience.trim()) newErrors.targetAudience = 'Target audience is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onLaunch(formData)
    handleClose()
  }

  const handleClose = () => {
    setFormData({
      name: '',
      channelIds: [],
      budget: 10000,
      targetAudience: ''
    })
    setErrors({})
    onClose()
  }

  const toggleChannel = (channelId: string) => {
    setFormData(prev => ({
      ...prev,
      channelIds: prev.channelIds.includes(channelId)
        ? prev.channelIds.filter(id => id !== channelId)
        : [...prev.channelIds, channelId]
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm dark:bg-slate-950/80"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-6 dark:border-slate-800">
          <div>
            <h2 className="text-2xl font-bold text-white">Launch New Campaign</h2>
            <p className="mt-1 text-sm text-slate-400">
              Configure and deploy across selected channels
            </p>
          </div>
          <button
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label="Close modal"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label htmlFor="campaign-name" className="block text-sm font-medium text-slate-300">
                Campaign Name
              </label>
              <input
                id="campaign-name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="e.g., Q1 Tech CEO Outreach"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-400">{errors.name}</p>
              )}
            </div>

            {/* Channel Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-300">
                Select Channels
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Campaign will run across all selected channels simultaneously
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {allChannels.map((channel) => {
                  const isSelected = formData.channelIds.includes(channel.id)
                  const isDisabled = channel.status === 'paused' || channel.status === 'error'

                  return (
                    <button
                      key={channel.id}
                      type="button"
                      onClick={() => !isDisabled && toggleChannel(channel.id)}
                      disabled={isDisabled}
                      className={`relative rounded-lg border p-4 text-left transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-500/10'
                          : isDisabled
                            ? 'border-slate-800 bg-slate-900/50 opacity-50 cursor-not-allowed dark:border-slate-800 dark:bg-slate-900/50'
                            : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500 dark:border-indigo-500 dark:bg-indigo-500'
                            : 'border-slate-600 dark:border-slate-600'
                        }`}>
                          {isSelected && (
                            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{channel.name}</p>
                          <p className="mt-0.5 text-xs text-slate-500">{channel.type}</p>
                        </div>
                      </div>
                      {isDisabled && (
                        <div className="absolute right-2 top-2">
                          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500 dark:bg-slate-800">
                            {channel.status}
                          </span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
              {errors.channels && (
                <p className="mt-2 text-sm text-red-400">{errors.channels}</p>
              )}
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-slate-300">
                Campaign Budget
              </label>
              <div className="mt-2 flex items-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">$</span>
                  <input
                    id="budget"
                    type="number"
                    min="1000"
                    step="1000"
                    value={formData.budget}
                    onChange={(e) => setFormData(prev => ({ ...prev, budget: Number(e.target.value) }))}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-8 pr-4 font-mono text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
                  />
                </div>
                <div className="rounded-lg bg-slate-800/50 px-4 py-3 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500">Per Channel</p>
                  <p className="font-mono text-sm font-semibold text-white">
                    ${formData.channelIds.length > 0 ? (formData.budget / formData.channelIds.length).toFixed(0) : '0'}
                  </p>
                </div>
              </div>
              {errors.budget && (
                <p className="mt-1 text-sm text-red-400">{errors.budget}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                Budget will be distributed evenly across selected channels
              </p>
            </div>

            {/* Target Audience */}
            <div>
              <label htmlFor="target-audience" className="block text-sm font-medium text-slate-300">
                Target Audience
              </label>
              <textarea
                id="target-audience"
                rows={3}
                value={formData.targetAudience}
                onChange={(e) => setFormData(prev => ({ ...prev, targetAudience: e.target.value }))}
                className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800"
                placeholder="e.g., B2B SaaS founders, Series A-B, 50-500 employees, $5M-$50M ARR"
              />
              {errors.targetAudience && (
                <p className="mt-1 text-sm text-red-400">{errors.targetAudience}</p>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="mt-6 rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
            <div className="flex items-start gap-3">
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-indigo-300">Ready to Launch</p>
                <p className="mt-1 text-xs text-indigo-200/80">
                  {formData.channelIds.length > 0
                    ? `This campaign will deploy across ${formData.channelIds.length} channel${formData.channelIds.length > 1 ? 's' : ''} with ${formData.budget > 0 ? `$${(formData.budget / 1000).toFixed(0)}K` : '$0'} total budget. AI will optimize execution based on real-time performance.`
                    : 'Select channels and configure budget to launch your campaign.'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-slate-700 bg-slate-900/50 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900/50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-500 hover:shadow-indigo-500/30 dark:bg-indigo-600 dark:hover:bg-indigo-500"
            >
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Launch Campaign
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
