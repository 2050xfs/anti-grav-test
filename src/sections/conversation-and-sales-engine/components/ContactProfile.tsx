'use client'

import { useState } from 'react'
import type { Contact, Conversation, Message } from '../../../../product/sections/conversation-and-sales-engine/types'

export interface ContactProfileProps {
  contact: Contact
  conversations: Conversation[]
  messages: Message[]
  onBack?: () => void
  onEditContact?: (contact: Partial<Contact>) => void
  onAddNote?: (note: string) => void
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

function formatDate(timestamp: string): string {
  const date = new Date(timestamp)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

export function ContactProfile({
  contact,
  conversations,
  messages,
  onBack,
  onEditContact,
  onAddNote
}: ContactProfileProps) {
  const [activeTab, setActiveTab] = useState<'timeline' | 'conversations' | 'notes'>('timeline')
  const [newNote, setNewNote] = useState('')

  // Calculate engagement metrics
  const avgPmauScore = conversations.length > 0
    ? conversations.reduce((sum, c) => sum + c.pmauScore.total, 0) / conversations.length
    : 0

  const totalMessages = messages.filter(m =>
    conversations.some(c => c.id === m.conversationId)
  ).length

  // Create timeline events
  const timelineEvents = [
    ...conversations.map(conv => ({
      id: conv.id,
      type: 'conversation' as const,
      timestamp: conv.createdAt,
      title: `Started conversation: ${conv.subject}`,
      channel: conv.channel,
      status: conv.status,
      pmauScore: conv.pmauScore.total
    })),
    ...messages.map(msg => ({
      id: msg.id,
      type: 'message' as const,
      timestamp: msg.timestamp,
      title: `${msg.sender === 'contact' ? 'Sent' : 'Received'} message`,
      sender: msg.senderName,
      preview: msg.content
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {onBack && (
            <button
              onClick={onBack}
              className="mb-4 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              ← Back
            </button>
          )}

          <div className="flex items-start gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-3xl font-bold text-indigo-700 dark:text-indigo-300">
              {contact.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50 mb-1">
                {contact.name}
              </h1>
              {contact.title && contact.company && (
                <p className="text-slate-600 dark:text-slate-400 mb-2">
                  {contact.title} at {contact.company}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                <span>{contact.email}</span>
                {contact.phone && <span>•</span>}
                {contact.phone && <span>{contact.phone}</span>}
              </div>
            </div>
            <button
              onClick={() => onEditContact?.(contact)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Edit Contact
            </button>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Lifecycle Stage</div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-50 capitalize">
                {contact.lifecycleStage.replace('-', ' ')}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Conversations</div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {contact.totalConversations}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Avg PMAU Score</div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.round(avgPmauScore)}
              </div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Messages</div>
              <div className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                {totalMessages}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Timeline/Conversations/Notes */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 mb-6">
              <div className="border-b border-slate-200 dark:border-slate-800 flex">
                {[
                  { key: 'timeline', label: 'Timeline' },
                  { key: 'conversations', label: 'Conversations' },
                  { key: 'notes', label: 'Notes' }
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key as typeof activeTab)}
                    className={`px-6 py-3 text-sm font-medium transition-colors ${
                      activeTab === key
                        ? 'border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'timeline' && (
                  <div className="space-y-4">
                    {timelineEvents.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No activity yet
                      </div>
                    ) : (
                      timelineEvents.map((event) => (
                        <div key={event.id} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-700 dark:text-indigo-300">
                              {event.type === 'conversation' ? '💬' : '📝'}
                            </div>
                            <div className="w-0.5 flex-1 bg-slate-200 dark:bg-slate-800 mt-2" />
                          </div>
                          <div className="flex-1 pb-6">
                            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                              <div className="flex items-start justify-between mb-2">
                                <h4 className="font-medium text-slate-900 dark:text-slate-50">
                                  {event.title}
                                </h4>
                                <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap ml-2">
                                  {formatDate(event.timestamp)}
                                </span>
                              </div>
                              {event.type === 'conversation' && (
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xl">{channelIcons[event.channel]}</span>
                                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[event.status]}`}>
                                    {event.status}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-400">
                                    PMAU: {event.pmauScore}
                                  </span>
                                </div>
                              )}
                              {event.type === 'message' && (
                                <div className="mt-2">
                                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {event.preview}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'conversations' && (
                  <div className="space-y-4">
                    {conversations.length === 0 ? (
                      <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                        No conversations yet
                      </div>
                    ) : (
                      conversations.map((conv) => (
                        <div
                          key={conv.id}
                          className="border border-slate-200 dark:border-slate-800 rounded-lg p-4 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors cursor-pointer"
                        >
                          <div className="flex items-start gap-3 mb-3">
                            <span className="text-2xl">{channelIcons[conv.channel]}</span>
                            <div className="flex-1">
                              <h4 className="font-medium text-slate-900 dark:text-slate-50 mb-1">
                                {conv.subject}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                                {conv.preview}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusColors[conv.status]}`}>
                              {conv.status}
                            </span>
                            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                              PMAU: {conv.pmauScore.total}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {conv.messageCount} messages
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              {formatDate(conv.lastMessageAt)}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-4">
                    {/* Add Note Form */}
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <textarea
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Add a note about this contact..."
                        rows={3}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none mb-2"
                      />
                      <button
                        onClick={() => {
                          onAddNote?.(newNote)
                          setNewNote('')
                        }}
                        disabled={!newNote.trim()}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        Add Note
                      </button>
                    </div>

                    {/* Notes List (Mock data) */}
                    <div className="space-y-3">
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            Sarah Chen
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            2 days ago
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Strong qualification call. Clear pain point around scaling outbound. Budget confirmed at $50K+.
                          Following up with proposal next week.
                        </p>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                            Marcus Johnson
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            1 week ago
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">
                          Initial contact via LinkedIn. Warm referral from Jessica Thompson. Very engaged in conversation.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Details & PMAU History */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Contact Details */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Contact Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">First Contacted</div>
                    <div className="text-slate-900 dark:text-slate-50">
                      {formatDate(contact.firstContactedAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Last Activity</div>
                    <div className="text-slate-900 dark:text-slate-50">
                      {formatDate(contact.lastActivityAt)}
                    </div>
                  </div>
                  {contact.company && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Company</div>
                      <div className="text-slate-900 dark:text-slate-50">{contact.company}</div>
                    </div>
                  )}
                  {contact.title && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Title</div>
                      <div className="text-slate-900 dark:text-slate-50">{contact.title}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* PMAU Score History */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  PMAU Score History
                </h3>
                <div className="space-y-4">
                  {conversations.map((conv) => (
                    <div key={conv.id} className="border-l-2 border-indigo-500 pl-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                          {conv.subject}
                        </span>
                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                          {conv.pmauScore.total}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2 mb-2">
                        {[
                          { label: 'P', value: conv.pmauScore.pain },
                          { label: 'M', value: conv.pmauScore.money },
                          { label: 'A', value: conv.pmauScore.authority },
                          { label: 'U', value: conv.pmauScore.urgency }
                        ].map(({ label, value }) => (
                          <div key={label} className="text-center">
                            <div className="text-xs text-slate-600 dark:text-slate-400">{label}</div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                              {value}
                            </div>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {conv.pmauScore.reasoning}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(conversations.flatMap(c => c.tags))).map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
