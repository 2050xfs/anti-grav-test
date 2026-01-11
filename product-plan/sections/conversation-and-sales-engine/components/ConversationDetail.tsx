'use client'

import { useState } from 'react'
import type {
  Conversation,
  Contact,
  Message,
  Template,
  TeamMember,
  PmauScore,
  ConversationDetailProps
} from '../../../../product/sections/conversation-and-sales-engine/types'

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

function getPmauColor(score: number): string {
  if (score >= 8) return 'bg-emerald-500'
  if (score >= 5) return 'bg-indigo-500'
  return 'bg-slate-400 dark:bg-slate-600'
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
}

export function ConversationDetail({
  conversation,
  contact,
  messages,
  templates,
  teamMembers,
  onBack,
  onSendMessage,
  onAdjustPmau,
  onRouteToMember,
  onQualify,
  onDisqualify,
  onMarkAsSpam
}: ConversationDetailProps) {
  const [messageContent, setMessageContent] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showTemplates, setShowTemplates] = useState(false)

  const handleSendMessage = () => {
    if (messageContent.trim() && onSendMessage) {
      onSendMessage(messageContent, selectedTemplate || undefined)
      setMessageContent('')
      setSelectedTemplate('')
    }
  }

  const handleTemplateSelect = (template: Template) => {
    setMessageContent(template.content)
    setSelectedTemplate(template.id)
    setShowTemplates(false)
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 transition-colors"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3 flex-1">
              <div className="text-2xl">{channelIcons[conversation.channel]}</div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">
                  {contact.name}
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {contact.company || contact.email}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[conversation.status]}`}>
              {conversation.status.replace('-', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Message Thread */}
          <div className="lg:col-span-8 mb-8 lg:mb-0">
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col h-[calc(100vh-280px)]">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((message) => {
                  const isFromContact = message.sender === 'contact'
                  const isFromAI = message.sender === 'ai'

                  return (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${isFromContact ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                        isFromContact
                          ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          : isFromAI
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}>
                        {isFromContact ? '👤' : isFromAI ? '🤖' : '👥'}
                      </div>

                      {/* Message Content */}
                      <div className={`flex-1 ${isFromContact ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-sm font-medium text-slate-900 dark:text-slate-50 ${isFromContact ? 'order-2' : ''}`}>
                            {message.senderName}
                          </span>
                          <span className={`text-xs text-slate-500 dark:text-slate-400 ${isFromContact ? 'order-1' : ''}`}>
                            {formatTimestamp(message.timestamp)}
                          </span>
                        </div>
                        <div className={`inline-block max-w-2xl px-4 py-3 rounded-lg ${
                          isFromContact
                            ? 'bg-indigo-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-50'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Message Composer */}
              <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                {showTemplates && (
                  <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        Response Templates
                      </h3>
                      <button
                        onClick={() => setShowTemplates(false)}
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-2">
                      {templates.map(template => (
                        <button
                          key={template.id}
                          onClick={() => handleTemplateSelect(template)}
                          className="w-full text-left p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-colors"
                        >
                          <div className="font-medium text-sm text-slate-900 dark:text-slate-50 mb-1">
                            {template.name}
                          </div>
                          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {template.content}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowTemplates(!showTemplates)}
                    className="px-3 py-2 text-sm text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    Templates
                  </button>
                  <textarea
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    placeholder="Type your message..."
                    rows={3}
                    className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageContent.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Lead Profile & PMAU */}
          <div className="lg:col-span-4">
            <div className="space-y-6">
              {/* Lead Profile */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Name</div>
                    <div className="text-sm text-slate-900 dark:text-slate-50">{contact.name}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Email</div>
                    <div className="text-sm text-slate-900 dark:text-slate-50">{contact.email}</div>
                  </div>
                  {contact.company && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Company</div>
                      <div className="text-sm text-slate-900 dark:text-slate-50">{contact.company}</div>
                    </div>
                  )}
                  {contact.title && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Title</div>
                      <div className="text-sm text-slate-900 dark:text-slate-50">{contact.title}</div>
                    </div>
                  )}
                  {contact.phone && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Phone</div>
                      <div className="text-sm text-slate-900 dark:text-slate-50">{contact.phone}</div>
                    </div>
                  )}
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Lifecycle Stage</div>
                    <div className="text-sm text-slate-900 dark:text-slate-50 capitalize">
                      {contact.lifecycleStage.replace('-', ' ')}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Total Conversations</div>
                    <div className="text-sm text-slate-900 dark:text-slate-50">{contact.totalConversations}</div>
                  </div>
                </div>
              </div>

              {/* PMAU Score */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  PMAU Score
                </h2>

                {/* Total Score */}
                <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-center">
                  <div className="text-3xl font-bold text-slate-900 dark:text-slate-50">
                    {conversation.pmauScore.total}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Total Score</div>
                </div>

                {/* Individual Metrics */}
                <div className="space-y-4 mb-6">
                  {[
                    { key: 'pain', label: 'Pain', value: conversation.pmauScore.pain },
                    { key: 'money', label: 'Money', value: conversation.pmauScore.money },
                    { key: 'authority', label: 'Authority', value: conversation.pmauScore.authority },
                    { key: 'urgency', label: 'Urgency', value: conversation.pmauScore.urgency }
                  ].map(metric => (
                    <div key={metric.key}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {metric.label}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                          {metric.value}/10
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getPmauColor(metric.value)}`}
                          style={{ width: `${(metric.value / 10) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Reasoning */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">AI Assessment</div>
                  <p className="text-sm text-slate-900 dark:text-slate-50">
                    {conversation.pmauScore.reasoning}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button
                    onClick={onQualify}
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                  >
                    ✓ Mark as Qualified
                  </button>
                  <button
                    onClick={onDisqualify}
                    className="w-full px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-slate-50 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-sm font-medium"
                  >
                    Send to Nurture
                  </button>
                  <button
                    onClick={onMarkAsSpam}
                    className="w-full px-4 py-2 bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors text-sm font-medium"
                  >
                    Mark as Spam
                  </button>
                </div>

                {/* Route to Team Member */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Assign to Team Member
                  </label>
                  <select
                    onChange={(e) => onRouteToMember?.(e.target.value)}
                    value={conversation.assignedTo || ''}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(member => (
                      <option key={member.id} value={member.name}>
                        {member.name} ({member.activeConversations} active)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conversation Meta */}
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
                  Conversation Details
                </h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Source</div>
                    <div className="text-slate-900 dark:text-slate-50">{conversation.source}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Created</div>
                    <div className="text-slate-900 dark:text-slate-50">
                      {new Date(conversation.createdAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  {conversation.tags.length > 0 && (
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">Tags</div>
                      <div className="flex flex-wrap gap-2">
                        {conversation.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
