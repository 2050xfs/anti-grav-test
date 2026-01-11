import type { Channel } from '@/../product/sections/strategy-brain/types'

interface ConstraintStatusCardProps {
  channel: Channel
  onViewDecision?: (decisionId: string) => void
}

export function ConstraintStatusCard({ channel }: ConstraintStatusCardProps) {
  const constraintInfo = {
    'none': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      title: 'No Constraints',
      description: 'Channel operating optimally with no identified bottlenecks.',
      recommendation: null
    },
    'volume-capped': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      ),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Volume Constraint',
      description: 'Artificial volume cap preventing scale. Current capacity underutilized.',
      recommendation: {
        lever: 'More',
        action: 'Increase volume',
        rationale: 'Strong performance with available capacity justifies scaling current approach.'
      }
    },
    'creative-fatigue': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      title: 'Creative Fatigue',
      description: 'Audience showing signs of message exhaustion. Engagement declining.',
      recommendation: {
        lever: 'Better',
        action: 'Refresh creative',
        rationale: 'Existing audience receptive but current messaging worn out. New angles needed.'
      }
    },
    'audience-saturation': {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: 'text-red-400 bg-red-500/10 border-red-500/20',
      title: 'Audience Saturation',
      description: 'High frequency and reach nearing market limits. Diminishing returns.',
      recommendation: {
        lever: 'New',
        action: 'Expand targeting',
        rationale: 'Current audience exhausted. Must find new addressable market to continue scaling.'
      }
    }
  }

  const info = constraintInfo[channel.constraintStatus]

  return (
    <div className={`rounded-lg p-6 border ${info.color}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={`p-2 rounded-lg ${info.color}`}>
          {info.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-slate-200 mb-1">
            {info.title}
          </h3>
          <p className="text-xs text-slate-400">
            {info.description}
          </p>
        </div>
      </div>

      {info.recommendation && (
        <div className="pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-2 py-1 rounded bg-indigo-500/20 text-indigo-400 text-xs font-semibold">
              {info.recommendation.lever}
            </div>
            <span className="text-xs text-slate-400">Lever</span>
          </div>

          <div className="space-y-2">
            <div>
              <p className="text-xs text-slate-500 mb-1">Recommended Action</p>
              <p className="text-sm font-medium text-slate-200">
                {info.recommendation.action}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 mb-1">Rationale</p>
              <p className="text-xs text-slate-400">
                {info.recommendation.rationale}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional Metrics */}
      <div className="mt-4 pt-4 border-t border-slate-800">
        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Channel Health
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Status</span>
            <span className="font-medium text-slate-200 capitalize">{channel.status}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Performance</span>
            <span className="font-medium text-slate-200 capitalize">{channel.performance.replace('-', ' ')}</span>
          </div>
          {channel.monthlyReferralRate > 0 && (
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Referral Rate</span>
              <span className="font-medium text-emerald-400">{(channel.monthlyReferralRate * 100).toFixed(0)}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
