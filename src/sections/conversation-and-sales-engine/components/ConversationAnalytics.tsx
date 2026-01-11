'use client'

import { useState } from 'react'
import type { Analytics, ChannelAnalytics } from '../../../../product/sections/conversation-and-sales-engine/types'

export interface ConversationAnalyticsProps {
  analytics: Analytics
}

const channelIcons: Record<string, string> = {
  email: '📧',
  chat: '💬',
  form: '📝',
  'social-dm': '📱',
  phone: '📞'
}

export function ConversationAnalytics({ analytics }: ConversationAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')
  const [selectedMetric, setSelectedMetric] = useState<'qualification' | 'conversion' | 'response'>('qualification')

  // Calculate trend data (mock trend for visualization)
  const trendData = Array.from({ length: 12 }, (_, i) => ({
    label: `Week ${i + 1}`,
    value: Math.floor(Math.random() * 40) + 60
  }))

  const getChannelColor = (channel: string): string => {
    const colors: Record<string, string> = {
      email: 'indigo',
      chat: 'emerald',
      form: 'lime',
      'social-dm': 'violet',
      phone: 'amber'
    }
    return colors[channel] || 'slate'
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
              Conversation Analytics
            </h1>

            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              {(['7d', '30d', '90d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    timeRange === range
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {range === 'all' ? 'All Time' : range.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Top-level Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Conversations</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {analytics.totalConversations}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">↑ 12% from last period</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Conversations</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {analytics.activeConversations}
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">↑ 8% from last period</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Qualification Rate</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.round(analytics.qualificationRate * 100)}%
              </div>
              <div className="text-xs text-red-600 dark:text-red-400 mt-1">↓ 3% from last period</div>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Conversion Rate</div>
              <div className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
                {Math.round(analytics.conversionRate * 100)}%
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">↑ 5% from last period</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trend Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
              Performance Trends
            </h2>
            <div className="flex items-center gap-2">
              {(['qualification', 'conversion', 'response'] as const).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors capitalize ${
                    selectedMetric === metric
                      ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {metric} Rate
                </button>
              ))}
            </div>
          </div>

          {/* Simple Bar Chart */}
          <div className="space-y-2">
            {trendData.map((data, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-16 text-xs text-slate-600 dark:text-slate-400">{data.label}</div>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-8 relative overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 bg-indigo-500 rounded-full flex items-center justify-end pr-2 transition-all"
                    style={{ width: `${data.value}%` }}
                  >
                    <span className="text-xs font-medium text-white">{data.value}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Channel Performance */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">
              Channel Performance
            </h2>
            <div className="space-y-4">
              {analytics.byChannel.map((channel) => (
                <div key={channel.channel} className="border border-slate-200 dark:border-slate-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{channelIcons[channel.channel]}</span>
                      <span className="font-medium text-slate-900 dark:text-slate-50 capitalize">
                        {channel.channel.replace('-', ' ')}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                      {channel.count} conversations
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Qualification Rate</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {Math.round(channel.qualificationRate * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Avg Response Time</div>
                      <div className="text-lg font-semibold text-slate-900 dark:text-slate-50">
                        {channel.avgResponseTime}
                      </div>
                    </div>
                  </div>

                  {/* Visual bar for qualification rate */}
                  <div className="mt-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full bg-${getChannelColor(channel.channel)}-500`}
                      style={{ width: `${channel.qualificationRate * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">
              Status Breakdown
            </h2>

            {/* Donut Chart Representation */}
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto mb-4">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {analytics.byStatus.map((status, index) => {
                    const total = analytics.byStatus.reduce((sum, s) => sum + s.count, 0)
                    const percentage = (status.count / total) * 100
                    const offset = analytics.byStatus.slice(0, index).reduce((sum, s) => sum + (s.count / total) * 100, 0)

                    return (
                      <circle
                        key={status.status}
                        cx="50"
                        cy="50"
                        r="40"
                        fill="none"
                        stroke={`hsl(${(index * 360) / analytics.byStatus.length}, 70%, 50%)`}
                        strokeWidth="20"
                        strokeDasharray={`${percentage * 2.51} ${251 - percentage * 2.51}`}
                        strokeDashoffset={-offset * 2.51}
                        className="transition-all"
                      />
                    )
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                      {analytics.totalConversations}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Total</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Legend and Details */}
            <div className="space-y-3">
              {analytics.byStatus.map((status, index) => {
                const total = analytics.byStatus.reduce((sum, s) => sum + s.count, 0)
                const percentage = Math.round((status.count / total) * 100)

                return (
                  <div key={status.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: `hsl(${(index * 360) / analytics.byStatus.length}, 70%, 50%)` }}
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-300 capitalize">
                        {status.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-slate-50">
                        {status.count}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 w-12 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Response Time Analysis */}
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-6 mt-8">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-6">
            Response Time Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-slate-900 dark:text-slate-50 mb-1">
                {analytics.avgResponseTime}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Average Response Time</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                85%
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Within 1 Hour</div>
            </div>
            <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                23 min
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">Fastest Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
