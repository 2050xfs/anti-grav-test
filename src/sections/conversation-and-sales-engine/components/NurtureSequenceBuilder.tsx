'use client'

import { useState } from 'react'

interface SequenceStep {
  id: string
  type: 'email' | 'wait' | 'condition' | 'action'
  title: string
  description: string
  delay?: string
  templateId?: string
  condition?: string
}

interface Sequence {
  id: string
  name: string
  trigger: string
  status: 'active' | 'draft' | 'paused'
  steps: SequenceStep[]
  enrolledContacts: number
  completionRate: number
}

export interface NurtureSequenceBuilderProps {
  sequences?: Sequence[]
  onCreateSequence?: (sequence: Omit<Sequence, 'id'>) => void
  onUpdateSequence?: (id: string, sequence: Partial<Sequence>) => void
  onDeleteSequence?: (id: string) => void
}

const mockSequences: Sequence[] = [
  {
    id: 'seq-001',
    name: 'Low PMAU Lead Nurture',
    trigger: 'PMAU Score < 15',
    status: 'active',
    enrolledContacts: 89,
    completionRate: 0.67,
    steps: [
      { id: 'step-1', type: 'email', title: 'Welcome Email', description: 'Introduce company and value prop' },
      { id: 'step-2', type: 'wait', title: 'Wait 3 Days', description: 'Give time to review content', delay: '3 days' },
      { id: 'step-3', type: 'email', title: 'Educational Content', description: 'Send case study', templateId: 'template-003' },
      { id: 'step-4', type: 'wait', title: 'Wait 5 Days', description: 'Monitor engagement', delay: '5 days' },
      { id: 'step-5', type: 'condition', title: 'Check Engagement', description: 'If opened email', condition: 'email_opened' },
      { id: 'step-6', type: 'email', title: 'Follow-up', description: 'Schedule discovery call', templateId: 'template-004' }
    ]
  },
  {
    id: 'seq-002',
    name: 'Post-Demo Follow-up',
    trigger: 'Demo Completed',
    status: 'active',
    enrolledContacts: 23,
    completionRate: 0.82,
    steps: [
      { id: 'step-1', type: 'email', title: 'Thank You Email', description: 'Recap key points from demo' },
      { id: 'step-2', type: 'wait', title: 'Wait 1 Day', description: 'Allow time for internal discussion', delay: '1 day' },
      { id: 'step-3', type: 'email', title: 'ROI Calculator', description: 'Send personalized ROI analysis' },
      { id: 'step-4', type: 'wait', title: 'Wait 2 Days', description: 'Check engagement', delay: '2 days' },
      { id: 'step-5', type: 'action', title: 'Assign to Sales Rep', description: 'Route to closer' }
    ]
  },
  {
    id: 'seq-003',
    name: 'Content Engagement Nurture',
    trigger: 'Downloaded Lead Magnet',
    status: 'draft',
    enrolledContacts: 0,
    completionRate: 0,
    steps: [
      { id: 'step-1', type: 'email', title: 'Deliver Lead Magnet', description: 'Send download link' },
      { id: 'step-2', type: 'wait', title: 'Wait 2 Days', description: 'Time to consume content', delay: '2 days' },
      { id: 'step-3', type: 'email', title: 'Related Content', description: 'Send complementary resources' }
    ]
  }
]

const stepTypeColors: Record<SequenceStep['type'], string> = {
  email: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
  wait: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-300 dark:border-amber-700',
  condition: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300 border-violet-300 dark:border-violet-700',
  action: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
}

const stepTypeIcons: Record<SequenceStep['type'], string> = {
  email: '📧',
  wait: '⏱️',
  condition: '🔀',
  action: '⚡'
}

const statusColors: Record<Sequence['status'], string> = {
  active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  draft: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  paused: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
}

export function NurtureSequenceBuilder({
  sequences = mockSequences,
  onCreateSequence,
  onUpdateSequence,
  onDeleteSequence
}: NurtureSequenceBuilderProps) {
  const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Nurture Sequences
            </h1>
            <button
              onClick={() => setIsCreating(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              + New Sequence
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Sequences</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {sequences.length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Sequences</div>
              <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {sequences.filter(s => s.status === 'active').length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Enrolled Contacts</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {sequences.reduce((sum, s) => sum + s.enrolledContacts, 0)}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Completion Rate</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.round((sequences.reduce((sum, s) => sum + s.completionRate, 0) / sequences.length) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedSequence ? (
          /* Sequence Builder View */
          <div>
            <button
              onClick={() => setSelectedSequence(null)}
              className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              ← Back to sequences
            </button>

            {/* Sequence Header */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                    {selectedSequence.name}
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    Trigger: {selectedSequence.trigger}
                  </p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedSequence.status]}`}>
                    {selectedSequence.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
                    Save Changes
                  </button>
                  <button className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
                    {selectedSequence.status === 'active' ? 'Pause' : 'Activate'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Enrolled Contacts</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {selectedSequence.enrolledContacts}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</div>
                  <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                    {Math.round(selectedSequence.completionRate * 100)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Workflow */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  Sequence Workflow
                </h3>
                <button className="px-3 py-1 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900 transition-colors text-sm font-medium">
                  + Add Step
                </button>
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                {/* Start Node */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold">
                      START
                    </div>
                    <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700" />
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        Trigger: {selectedSequence.trigger}
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Contact enters sequence when condition is met
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sequence Steps */}
                {selectedSequence.steps.map((step, index) => (
                  <div key={step.id} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl ${stepTypeColors[step.type]}`}>
                        {stepTypeIcons[step.type]}
                      </div>
                      {index < selectedSequence.steps.length - 1 && (
                        <div className="w-0.5 h-8 bg-slate-300 dark:bg-slate-700" />
                      )}
                    </div>
                    <div className="flex-1 pt-2">
                      <div className={`rounded-lg p-4 border-2 ${stepTypeColors[step.type]}`}>
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="font-semibold text-slate-900 dark:text-slate-50 mb-1">
                              {step.title}
                            </div>
                            <div className="text-sm text-slate-600 dark:text-slate-400">
                              {step.description}
                            </div>
                            {step.delay && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                ⏱️ Delay: {step.delay}
                              </div>
                            )}
                            {step.templateId && (
                              <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                                📝 Template: {step.templateId}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-1 ml-4">
                            <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50">
                              ✏️
                            </button>
                            <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400">
                              🗑️
                            </button>
                          </div>
                        </div>
                        {step.type === 'condition' && (
                          <div className="mt-3 pt-3 border-t border-slate-300 dark:border-slate-600 text-xs text-slate-600 dark:text-slate-400">
                            If {step.condition}: Continue → Otherwise: Exit sequence
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* End Node */}
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-slate-400 dark:bg-slate-600 flex items-center justify-center text-white font-bold text-xs">
                      END
                    </div>
                  </div>
                  <div className="flex-1 pt-2">
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <div className="font-medium text-slate-900 dark:text-slate-50">
                        Sequence Complete
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                        Contact exits sequence
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Sequence List View */
          <div className="space-y-6">
            {sequences.map((sequence) => (
              <div
                key={sequence.id}
                onClick={() => setSelectedSequence(sequence)}
                className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-2">
                      {sequence.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      Trigger: {sequence.trigger}
                    </p>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[sequence.status]}`}>
                      {sequence.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {sequence.enrolledContacts}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">enrolled</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Steps</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {sequence.steps.length}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Completion Rate</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                      {Math.round(sequence.completionRate * 100)}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Status</div>
                    <div className="text-lg font-semibold text-slate-900 dark:text-slate-50 capitalize">
                      {sequence.status}
                    </div>
                  </div>
                </div>

                {/* Mini workflow preview */}
                <div className="flex items-center gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
                  {sequence.steps.slice(0, 5).map((step) => (
                    <div
                      key={step.id}
                      className={`w-8 h-8 rounded flex items-center justify-center text-sm ${stepTypeColors[step.type]}`}
                      title={step.title}
                    >
                      {stepTypeIcons[step.type]}
                    </div>
                  ))}
                  {sequence.steps.length > 5 && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      +{sequence.steps.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
