'use client'

import { useState } from 'react'
import type { TeamMember, Conversation } from '../../../../product/sections/conversation-and-sales-engine/types'

export interface TeamPerformanceProps {
  teamMembers: TeamMember[]
  conversations: Conversation[]
}

const statusColors: Record<string, string> = {
  available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  busy: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300',
  offline: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
}

export function TeamPerformance({ teamMembers, conversations }: TeamPerformanceProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'conversations' | 'response' | 'qualification'>('conversations')

  // Calculate member stats
  const getMemberStats = (member: TeamMember) => {
    const memberConversations = conversations.filter(c => c.assignedTo === member.name)
    const qualified = memberConversations.filter(c => c.status === 'qualified' || c.status === 'closed-won').length
    const qualificationRate = memberConversations.length > 0 ? (qualified / memberConversations.length) * 100 : 0

    return {
      totalConversations: memberConversations.length,
      activeConversations: memberConversations.filter(c => c.status === 'in-progress' || c.status === 'qualified').length,
      qualificationRate,
      avgPmauScore: memberConversations.length > 0
        ? memberConversations.reduce((sum, c) => sum + c.pmauScore.total, 0) / memberConversations.length
        : 0
    }
  }

  // Sort members
  const sortedMembers = [...teamMembers].sort((a, b) => {
    const statsA = getMemberStats(a)
    const statsB = getMemberStats(b)

    switch (sortBy) {
      case 'conversations':
        return statsB.totalConversations - statsA.totalConversations
      case 'response':
        return a.avgResponseTime.localeCompare(b.avgResponseTime)
      case 'qualification':
        return statsB.qualificationRate - statsA.qualificationRate
      default:
        return a.name.localeCompare(b.name)
    }
  })

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
            Team Performance
          </h1>

          {/* Team Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Team Members</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {teamMembers.length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Currently Available</div>
              <div className="text-2xl font-semibold text-emerald-600 dark:text-emerald-400">
                {teamMembers.filter(m => m.status === 'available').length}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Active Conversations</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {teamMembers.reduce((sum, m) => sum + m.activeConversations, 0)}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                52 min
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedMember ? (
          /* Member Detail View */
          <div>
            <button
              onClick={() => setSelectedMember(null)}
              className="mb-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              ← Back to team
            </button>

            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                  {selectedMember.avatar}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
                    {selectedMember.name}
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-2">{selectedMember.role}</p>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedMember.status]}`}>
                      {selectedMember.status}
                    </span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {selectedMember.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(() => {
              const stats = getMemberStats(selectedMember)
              const memberConversations = conversations.filter(c => c.assignedTo === selectedMember.name)

              return (
                <>
                  {/* Member Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Conversations</div>
                      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                        {stats.totalConversations}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active</div>
                      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                        {stats.activeConversations}
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Qualification Rate</div>
                      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                        {Math.round(stats.qualificationRate)}%
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4">
                      <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg PMAU Score</div>
                      <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                        {Math.round(stats.avgPmauScore)}
                      </div>
                    </div>
                  </div>

                  {/* Member Conversations */}
                  <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800">
                    <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800">
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        Assigned Conversations ({memberConversations.length})
                      </h3>
                    </div>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800">
                      {memberConversations.length === 0 ? (
                        <div className="px-6 py-12 text-center text-slate-500 dark:text-slate-400">
                          No conversations assigned
                        </div>
                      ) : (
                        memberConversations.map((conv) => (
                          <div key={conv.id} className="px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-1">
                                  {conv.subject}
                                </h4>
                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">
                                  {conv.preview}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                                    {conv.status}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    PMAU: {conv.pmauScore.total}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )
            })()}
          </div>
        ) : (
          /* Team List View */
          <div>
            {/* Sort Controls */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-slate-600 dark:text-slate-400">Sort by:</div>
                <div className="flex items-center gap-2">
                  {[
                    { key: 'name', label: 'Name' },
                    { key: 'conversations', label: 'Conversations' },
                    { key: 'response', label: 'Response Time' },
                    { key: 'qualification', label: 'Qualification Rate' }
                  ].map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => setSortBy(key as typeof sortBy)}
                      className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                        sortBy === key
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Team Members Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {sortedMembers.map((member) => {
                const stats = getMemberStats(member)

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedMember(member)}
                    className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-lg font-bold text-indigo-700 dark:text-indigo-300">
                        {member.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-1">
                          {member.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{member.role}</p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[member.status]}`}>
                          {member.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Active Conversations</div>
                        <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                          {member.activeConversations}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</div>
                        <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                          {member.avgResponseTime}
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-600 dark:text-slate-400">Qualification Rate</span>
                        <span className="font-semibold text-slate-900 dark:text-slate-50">
                          {Math.round(stats.qualificationRate)}%
                        </span>
                      </div>
                      <div className="mt-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-emerald-500"
                          style={{ width: `${stats.qualificationRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Specialization</div>
                      <div className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {member.specialization}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
