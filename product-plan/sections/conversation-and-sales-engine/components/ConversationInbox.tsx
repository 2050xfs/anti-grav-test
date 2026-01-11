'use client'

import { useState } from 'react'
import type {
  Conversation,
  Contact,
  Analytics,
  ConversationFilters
} from '../../../../product/sections/conversation-and-sales-engine/types'

export interface ConversationInboxProps {
  conversations: Conversation[]
  contacts: Contact[]
  analytics: Analytics
  onViewConversation?: (conversationId: string) => void
  onFilterChange?: (filters: ConversationFilters) => void
}

const channelIcons: Record<string, string> = {
  email: '📧',
  chat: '💬',
  form: '📝',
  'social-dm': '📱',
  phone: '📞'
}

const statusColors: Record<string, string> = {
  new: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300',
  'in-progress': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  qualified: 'bg-lime-100 text-lime-700 dark:bg-lime-950 dark:text-lime-300',
  nurture: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  'closed-won': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
  'closed-lost': 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  spam: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
}

function getPmauBadgeColor(score: number): string {
  if (score >= 30) return 'bg-emerald-500 text-white'
  if (score >= 20) return 'bg-indigo-500 text-white'
  if (score >= 10) return 'bg-slate-400 text-white dark:bg-slate-600'
  return 'bg-slate-300 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date()
  const then = new Date(timestamp)
  const diffMs = now.getTime() - then.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export function ConversationInbox({
  conversations,
  contacts,
  analytics,
  onViewConversation,
  onFilterChange
}: ConversationInboxProps) {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [pmauMin, setPmauMin] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    if (selectedChannel && conv.channel !== selectedChannel) return false
    if (selectedStatus && conv.status !== selectedStatus) return false
    if (conv.pmauScore.total < pmauMin) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        conv.subject.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query)
      )
    }
    return true
  })

  // Get contact name
  const getContactName = (contactId: string): string => {
    const contact = contacts.find(c => c.id === contactId)
    return contact?.name || 'Unknown'
  }

  const handleFilterChange = () => {
    if (onFilterChange) {
      onFilterChange({
        channels: selectedChannel ? [selectedChannel] : undefined,
        statuses: selectedStatus ? [selectedStatus] : undefined,
        pmauMin: pmauMin || undefined,
        searchQuery: searchQuery || undefined
      })
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header with Analytics */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-6">
            Conversation Inbox
          </h1>

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Conversations</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {analytics.totalConversations}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {analytics.activeConversations}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Qualification Rate</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.round(analytics.qualificationRate * 100)}%
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {analytics.avgResponseTime}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">Filters</h2>

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    handleFilterChange()
                  }}
                  placeholder="Search conversations..."
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                />
              </div>

              {/* Channel Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Channel
                </label>
                <select
                  value={selectedChannel || ''}
                  onChange={(e) => {
                    setSelectedChannel(e.target.value || null)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  <option value="">All Channels</option>
                  <option value="email">📧 Email</option>
                  <option value="chat">💬 Chat</option>
                  <option value="form">📝 Form</option>
                  <option value="social-dm">📱 Social DM</option>
                  <option value="phone">📞 Phone</option>
                </select>
              </div>

              {/* Status Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus || ''}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value || null)
                    handleFilterChange()
                  }}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="in-progress">In Progress</option>
                  <option value="qualified">Qualified</option>
                  <option value="nurture">Nurture</option>
                  <option value="closed-won">Closed Won</option>
                  <option value="closed-lost">Closed Lost</option>
                  <option value="spam">Spam</option>
                </select>
              </div>

              {/* PMAU Score Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  Min PMAU Score: {pmauMin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={pmauMin}
                  onChange={(e) => {
                    setPmauMin(Number(e.target.value))
                    handleFilterChange()
                  }}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>0</span>
                  <span>20</span>
                  <span>40</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Conversation List */}
          <div className="lg:col-span-9">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                  {filteredConversations.length} Conversations
                </h2>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  {filteredConversations.filter(c => c.isUnread).length} unread
                </div>
              </div>

              <div className="divide-y divide-slate-200 dark:divide-slate-800">
                {filteredConversations.length === 0 ? (
                  <div className="px-6 py-12 text-center">
                    <div className="text-slate-400 dark:text-slate-500 mb-2">No conversations found</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      Try adjusting your filters
                    </div>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => onViewConversation?.(conv.id)}
                      className={`px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${
                        conv.isUnread ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Channel Icon */}
                        <div className="text-2xl flex-shrink-0 mt-1">
                          {channelIcons[conv.channel]}
                        </div>

                        {/* Conversation Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-base font-medium truncate ${
                                  conv.isUnread
                                    ? 'text-slate-900 dark:text-slate-50 font-semibold'
                                    : 'text-slate-700 dark:text-slate-300'
                                }`}>
                                  {getContactName(conv.contactId)}
                                </h3>
                                <span className="text-sm text-slate-500 dark:text-slate-400 flex-shrink-0">
                                  {formatTimeAgo(conv.lastMessageAt)}
                                </span>
                              </div>
                              <div className={`text-sm mb-2 ${
                                conv.isUnread
                                  ? 'text-slate-900 dark:text-slate-50 font-medium'
                                  : 'text-slate-600 dark:text-slate-400'
                              }`}>
                                {conv.subject}
                              </div>
                              <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                                {conv.preview}
                              </p>
                            </div>

                            {/* PMAU Badge */}
                            <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${getPmauBadgeColor(conv.pmauScore.total)}`}>
                              {conv.pmauScore.total}
                            </div>
                          </div>

                          {/* Tags and Status */}
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[conv.status]}`}>
                              {conv.status.replace('-', ' ')}
                            </span>
                            {conv.assignedTo && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                                👤 {conv.assignedTo}
                              </span>
                            )}
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {conv.messageCount} messages
                            </span>
                            {conv.tags.slice(0, 2).map(tag => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
